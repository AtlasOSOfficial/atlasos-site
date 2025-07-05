const fs = require('fs');
const config = require('./config.json');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#0d0d0d" />
  <meta name="description" content="${config.meta.description}" />
  <meta property="og:title" content="${config.meta.title}" />
  <meta property="og:description" content="${config.meta.description}" />
  <meta property="og:image" content="${config.meta.ogImage}" />
  <title>${config.meta.title}</title>
  <link rel="icon" href="assets/favicon.ico" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Fira+Code&display=swap" rel="stylesheet" />
  <style>
    body{background:#0d0d0d;color:#e5e5e5;font-family:'Inter',sans-serif;margin:0;padding:0;}
    .hero,.pricing,.terminal,.quickstart,.subscribe,footer{max-width:880px;margin:3rem auto;padding:1rem;}
    .btn{background:#fff;color:#000;padding:0.75rem 1.5rem;border:none;border-radius:0.5rem;font-weight:600;cursor:pointer;margin:0.5rem;}
    .plan{background:#1a1a1a;padding:1rem;border-radius:0.5rem;margin:1rem 0;}
    .terminal{background:#1e1e1e;font-family:'Fira Code';padding:1.5rem;border-radius:0.5rem;white-space:pre-wrap;}
  </style>
</head>
<body>
  <canvas id="starfield" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;"></canvas>

  <header class="hero">
    <h1>${config.hero.headline}</h1>
    <p>${config.hero.subline}</p>
    <div class="buttons">
      ${config.hero.buttons.map(btn => `<button class="btn" onclick="document.getElementById('${btn.scrollTo}').scrollIntoView({behavior:'smooth'})">${btn.label}</button>`).join('')}
    </div>
  </header>

  <section id="pricing" class="pricing">
    ${config.plans.map(p => `
      <div class="plan">
        <h3>${p.emoji} ${p.label} — ${p.price}</h3>
        <p>${p.desc}</p>
        <button class="btn" onclick="window.open('${p.link}','_blank')">Activate</button>
      </div>`).join('')}
  </section>

  <section id="terminal" class="terminal" contenteditable spellcheck="false">atlasos&gt;</section>

  <footer><p>${config.footer}</p></footer>

  <script>
    const shell = document.querySelector('#terminal');
    const commands = ${JSON.stringify(config.commands)};
    shell.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const input = shell.innerText.split('\\n').pop().replace('atlasos> ','').trim().toLowerCase();
        if (input === 'clear') { shell.innerText = 'atlasos> '; return; }
        const output = commands[input] || '[error] Unknown command: "' + input + '"';
        shell.innerText += "\\n" + output + "\\natlasos> ";
      }
    });
  </script>
</body>
</html>`;

fs.writeFileSync('index.html', html);
console.log('✅ index.html generated from config.json');

