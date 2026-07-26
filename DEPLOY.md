# MKG Egg Farm — website deploy guide

A single-page static site built on your existing brand assets. No build step —
Cloudflare Pages serves the files as-is.

## Files added
```
index.html        the site (all sections)
styles.css        site styling (uses brand/mkg-tokens.css)
favicon.svg       browser tab icon (SVG, from the mark-only logo)
favicon.png       fallback icon for older browsers
_headers          Cloudflare caching + basic security headers
robots.txt        search-engine directives
sitemap.xml       sitemap for search engines
.gitignore
```
Your `brand/` folder is used as-is (logos + `mkg-tokens.css`).

---

## Step 1 — Push these files to GitHub

From your local clone of `EhsanRiz/MKG`, copy in the files from this package
(everything except `DEPLOY.md`, `brand/` is already there), then:

```bash
git add index.html styles.css favicon.svg favicon.png _headers robots.txt sitemap.xml .gitignore
git commit -m "Add MKG Egg Farm brochure website"
git push origin main
```

---

## Step 2 — Connect Cloudflare Pages

1. Log in at **dash.cloudflare.com** → in the sidebar choose **Workers & Pages**.
2. Click **Create** → **Pages** tab → **Connect to Git**.
3. Authorize GitHub and select the **EhsanRiz/MKG** repository.
4. Configure the build:
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`  (the site lives at the repo root)
5. Click **Save and Deploy**. In ~1 minute you'll get a live URL like
   `mkg-xxxx.pages.dev`. Every future `git push` to `main` auto-deploys.

---

## Step 3 — Point your domains at it

You own **mkgeggs.com** and **mkgeggfarm.com**.

**A. Move DNS to Cloudflare (recommended, if not already there)**
1. Cloudflare dashboard → **Add a site** → enter `mkgeggs.com` → pick the Free plan.
2. Cloudflare shows two nameservers. At your domain registrar, replace the
   existing nameservers with those two. (Repeat the add-site step for
   `mkgeggfarm.com`.) DNS propagation can take a few hours.

**B. Attach the domains to your Pages project**
1. Open your Pages project → **Custom domains** → **Set up a custom domain**.
2. Add `mkgeggs.com` and `www.mkgeggs.com`. Cloudflare creates the DNS records
   and issues SSL automatically.
3. Repeat for `mkgeggfarm.com` / `www.mkgeggfarm.com`, or set the second domain
   to **redirect** to the first (see below) so you have one canonical site.

**Optional — redirect mkgeggfarm.com → mkgeggs.com**
In Cloudflare: **Rules → Redirect Rules → Create rule**, match hostname
`mkgeggfarm.com`, redirect (301) to `https://mkgeggs.com/$1`. Keeps one primary
address and avoids duplicate-content confusion.

---

## Before you go live

Contact details are live in `index.html`: Thabiso Phakisi, WhatsApp/phone
`+266 6288 9999` (`wa.me/26662889999`), email `phakisi@mkgeggs.com`.

- **Email (Zoho Mail):** `phakisi@mkgeggs.com` is to be hosted on Zoho. Once the
  `mkgeggs.com` zone is active in Cloudflare, add Zoho's MX records (`mx.zoho.com`,
  `mx2.zoho.com`, `mx3.zoho.com` — priorities 10/20/50, DNS-only, not proxied) plus
  Zoho's SPF/DKIM TXT records, then verify the domain in the Zoho Mail admin console.
- **Copy check:** the altitude (2 300 m) and flock size (5 500) figures should match
  reality before launch.
- **Online orders:** the order form opens a pre-written WhatsApp message to
  `+266 6288 9999` (email fallback to `phakisi@mkgeggs.com`) — no backend needed.

That's it. Push, connect, point the domains — you're live.

---

## Order emails (Resend)

The order form POSTs to `/api/order` (a Pages Function in `functions/api/order.js`),
which emails the order to **ehsan@mkgeggs.com** and **phakisi@mkgeggs.com** via
[Resend](https://resend.com). One-time setup:

1. **API key** — Pages project → **Settings → Environment variables** →
   Add variable for **Production** (and Preview if you like):
   name `RESEND_API_KEY`, value = your Resend API key, type **Secret**.
   Then **redeploy** (Deployments → ⋯ → Retry deployment) so the function picks it up.
2. **Verify the sending domain** — Resend dashboard → **Domains → Add domain** →
   `mkgeggs.com`. Resend shows DKIM/SPF DNS records; add them in Cloudflare →
   `mkgeggs.com` zone → DNS (DNS-only, not proxied). Until the domain is verified,
   Resend rejects mail from `orders@mkgeggs.com`.
3. The recipient inboxes must exist — set up `ehsan@` and `phakisi@` in Zoho Mail
   (see the MX records above).

Never commit the API key to the repo — it lives only in the Pages environment
variable.
