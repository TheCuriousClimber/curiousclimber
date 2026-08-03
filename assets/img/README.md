# Product & media images

Drop real photos here to replace the placeholder gradients — **no HTML editing
required**. The loader in `assets/js/media.js` looks for a file named after each
product's key and swaps it in automatically; if the file isn't here, the
existing gradient/emoji placeholder stays.

## How it works
A card placeholder has `data-img="<key>"`. The loader tries to load
`assets/img/<key>.jpg`. Add that file and the photo appears (cropped to fill,
with alt text taken from the product title).

## Filenames the site is already looking for (Promotion / merch)
Use `.jpg`, sized ~800×600 (4:3), under ~200 KB each:

```
send-it-tee.jpg      hoodie.jpg          technical-tee.jpg   beanie.jpg
chalk-bag.jpg        chalk-bucket.jpg    loose-chalk.jpg     liquid-chalk.jpg
bottle.jpg           salve.jpg           stickers.jpg        starter-kit.jpg
```

> **Heads-up:** until you add a product's photo, the browser's developer
> console logs a harmless `404 (Not Found)` for that filename — that's just the
> loader checking whether the photo exists. It's invisible to visitors and
> disappears for each product as soon as you add its image.

## Adding photos elsewhere
Any element can opt in — add `data-img="my-photo"` to it and drop
`assets/img/my-photo.jpg`. To use a different folder or format, put a full path
in the attribute, e.g. `data-img="assets/img/hero/home.png"`.

## Videos (Philosophy)
Videos use YouTube, not files here. In `philosophy.html`, set a video card's
`data-yt=""` to a YouTube ID (e.g. `data-yt="dQw4w9WgXcQ"`) and it becomes a
click-to-play embed. Empty `data-yt` stays a "coming soon" placeholder.
