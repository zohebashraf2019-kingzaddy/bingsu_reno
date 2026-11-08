# Bingsu Reno — website

Korean dessert truck in Reno, NV · [@bingsu_reno](https://www.instagram.com/bingsu_reno/) · [TikTok](https://www.tiktok.com/@bingsu_reno)

Static site (HTML + CSS + vanilla JS). No build step — deploy on Vercel with the default "Other" framework preset.

## Update prices & menu
Everything on the menu lives in **`menu.js`**:
- change `price` (e.g. `13.95`) — use `null` to show "Ask at the truck"
- add / remove items, change the `tag` badge, or set `soldOut: true`
- bump `updated` to the new month

## Update hours
- Visible table + footer: `index.html` (search "Wednesday")
- Live "Open now" badge: `HOURS` in `main.js`
- Google listing data: the JSON-LD block in `index.html`

## Media
- `assets/img` — photos, flyers, logo (webp/png)
- `assets/video` — compressed reels (H.264, faststart) + poster frames

Built by [Nexora Digital](https://www.nexoradigital.live).
