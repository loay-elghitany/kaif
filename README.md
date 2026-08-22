# Kaif Catalog

Simple Next.js + Tailwind product catalog for the Kaif (كيف) perfume brand.

Setup

1. Install dependencies:

```bash
npm install
```

2. Important: Move your existing `images/` folder into the Next.js `public/` folder so the images are served statically. From the project root run:

```bash
mkdir -p public
mv images public/images
```

On Windows PowerShell you can move the folder with:

```powershell
mkdir public
Move-Item .\images .\public\images
```

3. Set your WhatsApp phone number in `[data/config.js](data/config.js)` (international format, no plus sign):

```js
export const phoneNumber = "966512345678";
```

4. Run dev server:

```bash
npm run dev
```

Open http://localhost:3000
