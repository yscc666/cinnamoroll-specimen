# Cinnamoroll Specimen 001

A small archival website for a Cinnamoroll plush reconstructed as an editable triangle mesh.

**Live site:** https://yscc666.github.io/cinnamoroll-specimen/

![Specimen 001](assets/hero.jpg)

## What is here

- Interactive 3D viewer (`model-viewer`, vendored locally — no CDN dependency)
- Front / 3-4 / side / back camera presets, auto-rotate, fullscreen
- Specimen record and triangle-topology plates
- Downloadable single-mesh GLB and editable BLEND
- Mobile layout and a native-dialog lightbox

## Model

| | |
|---|---|
| Source | 49 photographs from `E:\doll` |
| Reconstruction | silhouette-measured parametric cage |
| Dimensions | 222.8 × 191.7 × 122.8 mm |
| Mesh | 37,840 vertices / **75,488 triangles** |
| Materials | 16 PBR base materials · 1 embedded 512² texture |
| GLB | single object, all triangles, Y-up, feet at Y = 0 after import |
| BLEND | 51 named parts, editable cages, Triangulate modifier at the end |

## Local preview

The viewer loads the GLB with `fetch`, so open it over HTTP rather than `file://`:

```bash
python -m http.server 8000
# http://127.0.0.1:8000/
```

Any static server works. GitHub Pages serves the repository root directly.

## Structure

```
index.html
styles.css
app.js
assets/
  model-viewer.min.js
  cinnamoroll_specimen.glb
  hero.jpg
  turnaround.jpg
  topology.jpg
  face.jpg
  reference.jpg
  favicon.svg
downloads/
  cinnamoroll_specimen.blend
model_info.json
```

## Deploy

This repository is published with **GitHub Pages → Deploy from a branch → main / (root)**.
No build step is required. `.nojekyll` prevents Jekyll from touching the static assets.

## Credits / notice

Fan-made, non-commercial reconstruction. Not affiliated with or endorsed by Sanrio.
Cinnamoroll © Sanrio. See [NOTICE.md](NOTICE.md).

The site itself was built as a static page; the 3D model was generated with Blender 5.2.
