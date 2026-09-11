#!/usr/bin/env python3
"""
Generate the "Finger Loading Readiness Self-Screen" lead-magnet PDF.

A clean, print-ready 2-page A-standard document built with reportlab. This is
free, educational content (the $0 lead magnet) — it is NOT paywalled product,
so it lives in downloads/ and is safe to serve publicly.

Usage:
    python3 scripts/generate_readiness_pdf.py

Output:
    downloads/finger-loading-readiness-screen.pdf   (2 pages, US Letter)

Dependency:
    reportlab   (pip install reportlab)
"""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "downloads"
OUT_PATH = OUT_DIR / "finger-loading-readiness-screen.pdf"

# ---- Brand palette (mirrors assets/css/styles.css) ------------------------- #
FOREST = colors.HexColor("#0f3d2e")
MOSS = colors.HexColor("#155e45")
MOSS_LT = colors.HexColor("#2f8f6b")
GOLD = colors.HexColor("#d99a2b")
SAND = colors.HexColor("#f7f3ea")
SLATE = colors.HexColor("#3a4a42")
LINE = colors.HexColor("#d9e2dc")
RED_BG = colors.HexColor("#fdecea")
RED_TX = colors.HexColor("#8a1f14")
AMBER_BG = colors.HexColor("#fef7e6")
AMBER_TX = colors.HexColor("#7a5a10")
GREEN_BG = colors.HexColor("#e8f5ee")
GREEN_TX = colors.HexColor("#155e45")

CONTACT = "The Kinesiology of Climbing · thecuriousclimber.github.io/curiousclimber"


# ---- Styles ---------------------------------------------------------------- #
def build_styles():
    ss = getSampleStyleSheet()
    s = {}
    s["h1"] = ParagraphStyle(
        "h1", parent=ss["Title"], fontName="Helvetica-Bold", fontSize=20,
        textColor=FOREST, spaceAfter=2, leading=23, alignment=TA_LEFT,
    )
    s["eyebrow"] = ParagraphStyle(
        "eyebrow", parent=ss["Normal"], fontName="Helvetica-Bold", fontSize=8,
        textColor=GOLD, spaceAfter=1, leading=10, alignment=TA_LEFT,
    )
    s["byline"] = ParagraphStyle(
        "byline", parent=ss["Normal"], fontName="Helvetica", fontSize=8.5,
        textColor=SLATE, spaceAfter=8, leading=11,
    )
    s["h2"] = ParagraphStyle(
        "h2", parent=ss["Heading2"], fontName="Helvetica-Bold", fontSize=12,
        textColor=MOSS, spaceBefore=10, spaceAfter=4, leading=14,
    )
    s["body"] = ParagraphStyle(
        "body", parent=ss["Normal"], fontName="Helvetica", fontSize=9.3,
        textColor=SLATE, leading=12.4, spaceAfter=4,
    )
    s["small"] = ParagraphStyle(
        "small", parent=ss["Normal"], fontName="Helvetica", fontSize=8,
        textColor=SLATE, leading=10.5,
    )
    s["cell"] = ParagraphStyle(
        "cell", parent=ss["Normal"], fontName="Helvetica", fontSize=8.6,
        textColor=SLATE, leading=11,
    )
    s["cellb"] = ParagraphStyle(
        "cellb", parent=ss["Normal"], fontName="Helvetica-Bold", fontSize=8.6,
        textColor=FOREST, leading=11,
    )
    s["cellh"] = ParagraphStyle(
        "cellh", parent=ss["Normal"], fontName="Helvetica-Bold", fontSize=8.6,
        textColor=colors.white, leading=11,
    )
    s["disc"] = ParagraphStyle(
        "disc", parent=ss["Normal"], fontName="Helvetica", fontSize=8.2,
        textColor=SLATE, leading=11,
    )
    s["disch"] = ParagraphStyle(
        "disch", parent=ss["Normal"], fontName="Helvetica-Bold", fontSize=8.6,
        textColor=FOREST, leading=11, spaceAfter=2,
    )
    return s


# ---- Header / footer painter ---------------------------------------------- #
def _decorate(canvas, doc):
    canvas.saveState()
    w, h = letter
    # top rule
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(2)
    canvas.line(0.75 * inch, h - 0.55 * inch, w - 0.75 * inch, h - 0.55 * inch)
    # footer
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(colors.HexColor("#8ea298"))
    canvas.drawString(0.75 * inch, 0.5 * inch, CONTACT)
    canvas.drawRightString(w - 0.75 * inch, 0.5 * inch, "Page %d of 2" % doc.page)
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(0.75 * inch, 0.68 * inch, w - 0.75 * inch, 0.68 * inch)
    canvas.restoreState()


def _boxed(flowables, bg, border):
    """Wrap flowables in a single-cell shaded, bordered table (a callout box)."""
    t = Table([[flowables]], colWidths=[6.5 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.75, border),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


def build_story(s):
    story = []

    # ---------------- PAGE 1 ---------------- #
    story.append(Paragraph("EVIDENCE-BASED FINGER TRAINING", s["eyebrow"]))
    story.append(Paragraph("Finger Loading Readiness Self-Screen", s["h1"]))
    story.append(Paragraph(
        "A 4-gate pre-training screen · Written by David McWeeny, MSc Kinesiology, CSEP-CPT",
        s["byline"],
    ))

    # Clinical scope & disclaimer
    disc = [
        Paragraph("Clinical scope &amp; disclaimer", s["disch"]),
        Paragraph(
            "This is an educational self-screen, not a diagnosis or a substitute for "
            "individual medical advice. It is designed for adult climbers considering "
            "structured hangboard loading. It is <b>not</b> designed for climbers under "
            "about 16, for anyone with under roughly a year of consistent climbing, or "
            "for a finger that is currently painful, swollen, or recently injured. "
            "<b>Any pop, swelling, bowstringing, or pain that persists beyond 48 hours "
            "means stop and see a physiotherapist or sports physician before loading.</b> "
            "You train at your own risk.",
            s["disc"],
        ),
    ]
    story.append(_boxed(disc, SAND, LINE))
    story.append(Spacer(1, 8))

    story.append(Paragraph("The 4 core readiness gates", s["h2"]))
    story.append(Paragraph(
        "Work through each gate honestly. Note whether your answer is a "
        "<b>flag</b> (left column below) before you total your result on page 2.",
        s["body"],
    ))

    header = [
        Paragraph("Gate", s["cellh"]),
        Paragraph("What to self-check", s["cellh"]),
        Paragraph("Flag if…", s["cellh"]),
    ]
    rows = [
        [
            Paragraph("1. Active joint pathology / capsular tenderness", s["cellb"]),
            Paragraph(
                "Press gently around each finger joint and the base of each finger. "
                "Compare left to right. Note any joint that is swollen, warm, stiff on "
                "waking, or tender to press.",
                s["cell"],
            ),
            Paragraph(
                "Any joint swelling, warmth, morning stiffness, or focal tenderness — "
                "or a known unresolved pulley/joint injury.",
                s["cell"],
            ),
        ],
        [
            Paragraph("2. Climbing age / tissue history", s["cellb"]),
            Paragraph(
                "How long have you climbed consistently? Tendon and pulley tissue "
                "adapts slowly and lags behind muscle and nervous system.",
                s["cell"],
            ),
            Paragraph(
                "Under ~1 year of consistent climbing, under age ~16, or a finger "
                "injury in the last 3 months.",
                s["cell"],
            ),
        ],
        [
            Paragraph("3. Unweighted 10s passive &amp; half-crimp tolerances", s["cellb"]),
            Paragraph(
                "On a 20&nbsp;mm edge at bodyweight, hold a 10-second open-hand (passive) "
                "hang, rest, then a 10-second half-crimp. Rate discomfort 0–10 during "
                "and for 24&nbsp;h after.",
                s["cell"],
            ),
            Paragraph(
                "Cannot hold 10&nbsp;s at bodyweight, discomfort above ~3/10, or soreness "
                "that climbs over the next 24&nbsp;h.",
                s["cell"],
            ),
        ],
        [
            Paragraph("4. Acute:chronic workload ratio (ACWR)", s["cellb"]),
            Paragraph(
                "Compare this week's climbing + finger load (acute) with your rolling "
                "4-week average (chronic). A ratio near 0.8–1.3 is a steadier zone; "
                "spikes raise risk.",
                s["cell"],
            ),
            Paragraph(
                "This week is a sharp spike over your 4-week average (ratio well above "
                "~1.3), or you are returning from a long layoff.",
                s["cell"],
            ),
        ],
    ]
    tbl = Table([header] + rows, colWidths=[1.7 * inch, 2.7 * inch, 2.1 * inch])
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), FOREST),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, SAND]),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(tbl)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "The pain-monitoring rule used throughout: loading is acceptable at up to about "
        "<b>3/10 discomfort that settles within 24&nbsp;hours</b> and does not trend upward "
        "week to week. Never train through sharp pain.",
        s["small"],
    ))

    # ---------------- PAGE 2 ---------------- #
    story.append(PageBreak())
    story.append(Paragraph("Scoring: decision matrix &amp; routing", s["h2"]))
    story.append(Paragraph(
        "Take your <b>most cautious</b> result — one red flag routes you to red, "
        "regardless of the other gates.",
        s["body"],
    ))

    mheader = [
        Paragraph("Result", s["cellh"]),
        Paragraph("What it means", s["cellh"]),
        Paragraph("Route to", s["cellh"]),
    ]
    mrows = [
        ("RED", RED_BG, RED_TX,
         "Any Gate&nbsp;1 flag, an unresolved injury, or pain above ~3/10 that does not "
         "settle in 24&nbsp;h.",
         "<b>Clinical referral.</b> See a physiotherapist or sports physician before "
         "any loading. This screen stops here."),
        ("AMBER", AMBER_BG, AMBER_TX,
         "No red flags, but limited climbing age, a recent (resolved) niggle, or "
         "borderline tolerances.",
         "<b>Connective-tissue capacity.</b> Build with submaximal <b>repeaters</b> / "
         "density work first; re-screen in 4–6 weeks before adding high force."),
        ("GREEN", GREEN_BG, GREEN_TX,
         "No flags, ~2+ years climbing, pain-free tolerances, steady workload.",
         "<b>High-force neural recruitment.</b> You are a reasonable candidate for "
         "<b>max hangs</b>, progressed conservatively with the gates in place."),
    ]
    mtable_rows = [mheader]
    for label, bg, tx, meaning, route in mrows:
        mtable_rows.append([
            Paragraph(label, ParagraphStyle("lab", fontName="Helvetica-Bold",
                                            fontSize=9.5, textColor=tx, leading=12)),
            Paragraph(meaning, s["cell"]),
            Paragraph(route, s["cell"]),
        ])
    mtbl = Table(mtable_rows, colWidths=[0.95 * inch, 2.75 * inch, 2.8 * inch])
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), FOREST),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    for i, (_, bg, _, _, _) in enumerate(mrows, start=1):
        style.append(("BACKGROUND", (0, i), (-1, i), bg))
    mtbl.setStyle(TableStyle(style))
    story.append(mtbl)

    story.append(Paragraph("Session warm-up protocol", s["h2"]))
    warm = ListFlowable(
        [
            ListItem(Paragraph("<b>Raise (3–5 min):</b> easy cardio or brisk movement until hands are warm.", s["body"])),
            ListItem(Paragraph("<b>Mobilise:</b> wrist circles, finger flexion/extension, light band work for wrist extensors.", s["body"])),
            ListItem(Paragraph("<b>Pulse-raise on rock/board:</b> 5–10 min of easy climbing on big holds, no crimping.", s["body"])),
            ListItem(Paragraph("<b>Ramp hangs:</b> 3–4 progressively firmer sub-maximal hangs on a large edge, resting fully, until the grip you will train feels ready — never straight into a max effort cold.", s["body"])),
        ],
        bulletType="1", leftIndent=16,
    )
    story.append(warm)

    story.append(Paragraph("Next steps", s["h2"]))
    nxt = ListFlowable(
        [
            ListItem(Paragraph("<b>Amber?</b> Start with the free guide on the difference between the two tools: <i>Max Hangs vs. Repeaters</i>.", s["body"])),
            ListItem(Paragraph("<b>Green?</b> Follow the free <i>8-Week Finger Strength Block</i>, and load it with <i>How Much Weight to Add to Hangboard Hangs</i>.", s["body"])),
            ListItem(Paragraph("Re-run this screen before each new training block, and any time you return from a layoff.", s["body"])),
            ListItem(Paragraph("Read the free articles at thecuriousclimber.github.io/curiousclimber — or, when you want the block written out session by session, see the <i>Contact Strength &amp; Finger Power</i> guide.", s["body"])),
        ],
        bulletType="bullet", leftIndent=16,
    )
    story.append(nxt)

    story.append(Spacer(1, 8))
    story.append(_boxed([Paragraph(
        "Educational content, not medical advice. When in doubt, get assessed. "
        "© The Kinesiology of Climbing.", s["disc"])], SAND, LINE))

    return story


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    s = build_styles()
    doc = BaseDocTemplate(
        str(OUT_PATH), pagesize=letter,
        leftMargin=0.75 * inch, rightMargin=0.75 * inch,
        topMargin=0.75 * inch, bottomMargin=0.8 * inch,
        title="Finger Loading Readiness Self-Screen",
        author="David McWeeny, MSc Kinesiology, CSEP-CPT",
        subject="Pre-training readiness self-screen for climbers",
    )
    frame = Frame(
        doc.leftMargin, doc.bottomMargin,
        doc.width, doc.height, id="body",
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )
    from reportlab.platypus import PageTemplate
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=_decorate)])
    doc.build(build_story(s))
    print(f"Wrote {OUT_PATH.relative_to(ROOT)} ({OUT_PATH.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
