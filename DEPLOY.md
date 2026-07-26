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

## Before you go live — swap the placeholders

I drafted the copy from your brand; these bits are placeholders to replace in
`index.html` (search for them):

- **WhatsApp / phone number:** every `26600000000` → your real number in full
  international form, no `+`, spaces or dashes (e.g. Lesotho `266` + your number).
  Appears in the `wa.me/…` links, the `tel:` link, and the visible `+266 0000 0000`.
- **Email:** `hello@mkgeggs.com` → whatever address you'll actually check (you can
  set this up as email forwarding in Cloudflare → Email Routing, free).
- **Copy:** the story, product and farm text is well-crafted placeholder — tweak
  any details (altitude, delivery area, flock size, etc.) to match reality.

That's it. Push, connect, point the domains — you're live.
