# Flipbook Reader

A single-page PDF flipbook (like AnyFlip) with realistic page-curl animations, flip sound,
keyboard/swipe navigation, page slider, fullscreen and download. No build step, no server code.

Built on [PDF.js](https://mozilla.github.io/pdf.js/) (renders pages) and
[StPageFlip](https://github.com/Nodlik/StPageFlip) (page-turn animation), both loaded from jsDelivr.

## Use
- Open the site and drag & drop any PDF (it stays on your device, nothing is uploaded).
- To share a book: put the file in `pdfs/`, push, and link to
  `https://flip.vaoprod.com/?pdf=pdfs/your-file.pdf`

## Host free on Cloudflare Pages (subdomain of vaoprod)
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**, pick this repo.
2. Build settings: framework **None**, build command empty, output directory `/`.
3. Deploy → you get `https://<project>.pages.dev`.
4. Project → **Custom domains → Set up a custom domain** → `flip.vaoprod.com`.
   Since vaoprod is on Cloudflare DNS, the CNAME is created automatically; HTTPS in a few minutes.

Every push to the branch redeploys automatically. Free tier: unlimited bandwidth, 25 MB per file.

---

# VAO Shotbook (`storyboard/`)

Reference and storyboard app for architecture and real estate films: feelings turned into camera
recipes, 169 techniques with their effect on the viewer, 11 story arcs, a live 3D previs villa,
a sun planner and a light-ordered shoot plan. Open `storyboard/index.html` through any static
server, or see [storyboard/README.md](storyboard/README.md) for hosting and details.
