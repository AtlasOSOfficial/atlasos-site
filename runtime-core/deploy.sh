#!/bin/bash
node upgrade.js
git add index.html
git commit -m "🛠 Auto-refreshed from config.json"
git push origin gh-pages
vercel --prod

