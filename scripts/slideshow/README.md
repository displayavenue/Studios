# DisplayAvenue animated slideshow

Luxury black/gold promotional slideshow for **DisplayAvenue Studios**.

## Files

- `index.html` — 7-slide animated showreel (Ken Burns, text rise, crossfades, progress bars)
- `assets/` — local fonts + photography used by the slides
- Output: `public/videos/displayavenue-slideshow.mp4`

## Re-render

```bash
# Clean 1920×1080 virtual display (once)
Xvfb :99 -screen 0 1920x1080x24 -ac -nolisten tcp &

DISPLAY=:99 npm run render:slideshow
```

Requires Chrome + ffmpeg + Xvfb.
