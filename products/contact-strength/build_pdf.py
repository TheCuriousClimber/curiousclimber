#!/usr/bin/env python3
"""
Build a print-ready PDF (and intermediate HTML) from PROGRAM.md.

Dependency-free: converts the program Markdown to styled, print-optimized HTML
using only the Python standard library, then renders it to PDF with a headless
Chromium/Chrome if one can be found. No pip install, no pandoc required.

Usage:
    python3 build_pdf.py                 # -> PROGRAM.html and PROGRAM.pdf
    python3 build_pdf.py --html-only     # just the HTML (open it and Ctrl/Cmd-P to PDF)
    python3 build_pdf.py --chrome /path/to/chrome   # force a browser binary

Design:
    * Consistent A4 margins via @page.
    * A running branded header + footer repeated on every page (position:fixed,
      which Chromium repeats per printed page).
    * A page break before every numbered section (h2) and before every training
      PHASE, so phases start clean.
    * Tables, blockquotes and list items avoid breaking across pages.
"""

import html
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / "PROGRAM.md"
OUT_HTML = HERE / "PROGRAM.html"
OUT_PDF = HERE / "PROGRAM.pdf"

BRAND = "The Kinesiology of Climbing"
DOC_TITLE = "Contact Strength &amp; Finger Power"
FOOTER_NOTE = ("Educational strength-and-conditioning programming — you train at your own "
               "risk. See legal/disclaimer.html &amp; legal/par-q.html.")


# --------------------------------------------------------------------------- #
# Inline formatting
# --------------------------------------------------------------------------- #
def inline(text):
    """Escape HTML then apply inline Markdown: code, bold, italic, links."""
    codes = []

    def stash(m):
        codes.append(m.group(1))
        return f"\x00{len(codes) - 1}\x00"

    # protect `code` spans (their contents are not further formatted)
    text = re.sub(r"`([^`]+)`", stash, text)
    text = html.escape(text, quote=False)
    # links [text](url)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', text)
    # bold, then italic
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*(?!\*)([^*]+?)\*(?!\*)", r"<em>\1</em>", text)
    # restore code spans (escaped)
    text = re.sub(r"\x00(\d+)\x00",
                  lambda m: f"<code>{html.escape(codes[int(m.group(1))], quote=False)}</code>",
                  text)
    return text


def is_table_sep(line):
    s = line.strip()
    return bool(re.match(r"^\|?[\s:|-]+\|?$", s)) and "-" in s and "|" in s


def split_row(line):
    s = line.strip()
    if s.startswith("|"):
        s = s[1:]
    if s.endswith("|"):
        s = s[:-1]
    return [c.strip() for c in s.split("|")]


# --------------------------------------------------------------------------- #
# Block conversion
# --------------------------------------------------------------------------- #
def convert(md):
    lines = md.splitlines()
    out = []
    i = 0
    n = len(lines)

    # list nesting stack: each entry (indent, tag)
    list_stack = []

    def close_lists(to_indent=-1):
        while list_stack and list_stack[-1][0] > to_indent:
            out.append(f"</{list_stack[-1][1]}>")
            list_stack.pop()

    while i < n:
        raw = lines[i]
        line = raw.rstrip("\n")
        stripped = line.strip()

        # drop the source page-break divs — CSS controls pagination here
        if stripped.startswith('<div style="page-break'):
            i += 1
            continue

        # blank line ends any open lists
        if stripped == "":
            close_lists()
            i += 1
            continue

        # horizontal rule
        if stripped == "---":
            close_lists()
            out.append("<hr>")
            i += 1
            continue

        # headings
        m = re.match(r"^(#{1,6})\s+(.*)$", stripped)
        if m:
            close_lists()
            level = len(m.group(1))
            content = inline(m.group(2))
            cls = ""
            if level == 3 and re.match(r"^(PHASE|<strong>PHASE)", content):
                cls = ' class="phase"'
            out.append(f"<h{level}{cls}>{content}</h{level}>")
            i += 1
            continue

        # blockquote (consecutive > lines)
        if stripped.startswith(">"):
            close_lists()
            buf = []
            while i < n and lines[i].strip().startswith(">"):
                buf.append(re.sub(r"^\s*>\s?", "", lines[i]))
                i += 1
            inner = " ".join(x.strip() for x in buf if x.strip())
            out.append(f"<blockquote><p>{inline(inner)}</p></blockquote>")
            continue

        # table (header row followed by a separator row)
        if "|" in line and i + 1 < n and is_table_sep(lines[i + 1]):
            close_lists()
            headers = split_row(line)
            i += 2  # skip header + separator
            rows = []
            while i < n and "|" in lines[i] and lines[i].strip():
                rows.append(split_row(lines[i]))
                i += 1
            thead = "".join(f"<th>{inline(h)}</th>" for h in headers)
            body = []
            for r in rows:
                cells = "".join(f"<td>{inline(c)}</td>" for c in r)
                body.append(f"<tr>{cells}</tr>")
            out.append("<table><thead><tr>" + thead + "</tr></thead><tbody>"
                       + "".join(body) + "</tbody></table>")
            continue

        # list item (ordered or unordered), with indent-based nesting
        m = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)$", line)
        if m:
            indent = len(m.group(1))
            marker = m.group(2)
            tag = "ol" if marker[0].isdigit() else "ul"
            # open/adjust nesting to this indent level
            if not list_stack or indent > list_stack[-1][0]:
                out.append(f"<{tag}>")
                list_stack.append((indent, tag))
            else:
                close_lists(indent)
                if not list_stack or list_stack[-1][0] < indent:
                    out.append(f"<{tag}>")
                    list_stack.append((indent, tag))
            # gather lazy continuation lines (soft-wrapped text belonging to this
            # item) so inline spans like **bold** that wrap across a line stay intact
            item_txt = m.group(3)
            i += 1
            while i < n:
                nxt_raw = lines[i]
                nxt = nxt_raw.strip()
                if (nxt == "" or nxt == "---" or nxt.startswith("#")
                        or nxt.startswith(">") or nxt.startswith("<div")
                        or re.match(r"^(\s*)([-*]|\d+\.)\s+", nxt_raw)
                        or ("|" in nxt_raw and i + 1 < n and is_table_sep(lines[i + 1]))):
                    break
                item_txt += " " + nxt
                i += 1
            out.append(f"<li>{inline(item_txt)}</li>")
            continue

        # plain paragraph (gather continuation lines until blank/structural)
        close_lists()
        buf = [stripped]
        i += 1
        while i < n:
            nxt = lines[i].strip()
            if (nxt == "" or nxt == "---" or nxt.startswith("#")
                    or nxt.startswith(">") or nxt.startswith("<div")
                    or re.match(r"^(\s*)([-*]|\d+\.)\s+", lines[i])
                    or ("|" in lines[i] and i + 1 < n and is_table_sep(lines[i + 1]))):
                break
            buf.append(nxt)
            i += 1
        out.append(f"<p>{inline(' '.join(buf))}</p>")

    close_lists()
    return "\n".join(out)


# --------------------------------------------------------------------------- #
# Template
# --------------------------------------------------------------------------- #
CSS = """
:root { --ink:#1a1a1a; --muted:#666; --accent:#1f5c4a; --line:#d8d8d8; --band:#f4f6f5; }
* { box-sizing: border-box; }
/* Outer paper margins. The running header/footer live INSIDE the flow via a
   table header/footer group (below), which reserves real space on every page —
   so body content can never collide with them the way position:fixed did. */
@page { size: A4; margin: 16mm 18mm 16mm 18mm; }
html, body { margin: 0; padding: 0; }
body {
  font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  color: var(--ink); font-size: 10.6pt; line-height: 1.5;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}

/* ---- Running header/footer via table header/footer groups ----
   Chromium repeats thead on the top and tfoot on the bottom of every printed
   page and reserves their height in the layout, so nothing overlaps. Scope the
   layout rules to the OUTER table only (direct-child combinators) so the
   document's own data tables are unaffected. */
table.page { width: 100%; border-collapse: collapse; }
table.page > thead { display: table-header-group; }
table.page > tfoot { display: table-footer-group; }
table.page > thead > tr > td,
table.page > tfoot > tr > td,
table.page > tbody > tr > td { border: 0; padding: 0; }
.rh, .rf {
  display: flex; justify-content: space-between; gap: 8mm; color: var(--muted);
  font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 7.6pt; letter-spacing: .02em;
}
.rh { text-transform: uppercase; border-bottom: .5pt solid var(--line);
  padding-bottom: 2.5mm; margin-bottom: 8mm; }
.rh .brand { color: var(--accent); font-weight: 700; }
.rf { border-top: .5pt solid var(--line); padding-top: 2.5mm; margin-top: 8mm; }

/* ---- Content typography ---- */
h1 { font-size: 26pt; line-height: 1.15; margin: 0 0 .2em; color: var(--accent);
  break-before: avoid; break-after: avoid; }
h2 { font-size: 15pt; color: var(--accent); margin: 0 0 .6em;
  padding-bottom: .18em; border-bottom: 1.5pt solid var(--accent);
  break-before: page; break-after: avoid; }
h3 { font-size: 12pt; margin: 1.2em 0 .4em; color: #143f33; break-after: avoid; }
h3.phase { break-before: page; margin-top: 0;
  background: var(--band); border-left: 3pt solid var(--accent);
  padding: .35em .6em; }
p { margin: .5em 0; orphans: 2; widows: 2; }
a { color: var(--accent); text-decoration: none; }
strong { font-weight: 700; }
code { font-family: "SF Mono", Menlo, Consolas, monospace; font-size: .86em;
  background: var(--band); padding: .05em .3em; border-radius: 3px; }
hr { border: 0; border-top: .5pt solid var(--line); margin: 1.2em 0; }
ul, ol { margin: .5em 0 .5em 0; padding-left: 1.4em; }
li { margin: .28em 0; break-inside: avoid; }
/* callouts / disclaimer blocks */
blockquote { margin: 1em 0; padding: .6em 1em; background: var(--band);
  border-left: 3pt solid var(--accent); break-inside: avoid; }
blockquote p { margin: 0; }
/* document data tables (not the outer layout table) */
.rbody table { width: 100%; border-collapse: collapse; margin: .8em 0;
  font-size: 9pt; break-inside: avoid; }
.rbody th, .rbody td { border: .5pt solid var(--line); padding: 5px 7px;
  text-align: left; vertical-align: top; }
.rbody thead th { background: var(--accent); color: #fff;
  font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 8.4pt; text-transform: uppercase; letter-spacing: .02em; }
.rbody tbody tr:nth-child(even) { background: #fafbfb; }
"""

TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — {brand}</title>
<style>{css}</style>
</head>
<body>
  <table class="page">
    <thead>
      <tr><td>
        <div class="rh"><span class="brand">{brand}</span><span>{title}</span></div>
      </td></tr>
    </thead>
    <tfoot>
      <tr><td>
        <div class="rf"><span>© {brand}</span><span class="note">{footer}</span></div>
      </td></tr>
    </tfoot>
    <tbody class="rbody">
      <tr><td>
{body}
      </td></tr>
    </tbody>
  </table>
</body>
</html>
"""


def find_chrome(explicit=None):
    if explicit:
        return explicit
    env = os.environ.get("PLAYWRIGHT_BROWSERS_PATH")
    candidates = []
    if env:
        candidates.append(str(Path(env) / "chromium"))
    candidates += [
        "/opt/pw-browsers/chromium",
        "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    ]
    for name in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "chrome"):
        p = shutil.which(name)
        if p:
            candidates.append(p)
    for c in candidates:
        if c and Path(c).exists():
            return c
    return None


def main():
    args = sys.argv[1:]
    html_only = "--html-only" in args
    explicit = None
    if "--chrome" in args:
        explicit = args[args.index("--chrome") + 1]

    md = SRC.read_text(encoding="utf-8")
    body = convert(md)
    page = TEMPLATE.format(title=DOC_TITLE, brand=BRAND, css=CSS, footer=FOOTER_NOTE, body=body)
    OUT_HTML.write_text(page, encoding="utf-8")
    print(f"Wrote {OUT_HTML.relative_to(HERE.parent.parent)}")

    if html_only:
        print("HTML only. Open it in a browser and print to PDF (A4).")
        return

    chrome = find_chrome(explicit)
    if not chrome:
        print("No Chrome/Chromium found — wrote HTML only.")
        print("  Open PROGRAM.html and Ctrl/Cmd-P → Save as PDF, or pass --chrome <path>.")
        return

    cmd = [
        chrome, "--headless", "--no-sandbox", "--disable-gpu",
        "--no-pdf-header-footer",                       # we supply our own
        f"--print-to-pdf={OUT_PDF}",
        OUT_HTML.as_uri(),
    ]
    print(f"Rendering PDF with: {Path(chrome).name}")
    res = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    if OUT_PDF.exists() and OUT_PDF.stat().st_size > 0:
        kb = OUT_PDF.stat().st_size / 1024
        print(f"Wrote {OUT_PDF.relative_to(HERE.parent.parent)} ({kb:.0f} KB)")
    else:
        print("PDF render failed. stderr tail:")
        print("\n".join(res.stderr.splitlines()[-8:]))
        print("Fallback: open PROGRAM.html and print to PDF manually.")


if __name__ == "__main__":
    main()
