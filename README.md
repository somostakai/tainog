# TAINOG — site de portfólio

Site estático de portfólio de fotografia e vídeo de evento da Tainara (`@tainog`),
feito a partir do arquivo HTML único original e reorganizado para ser hospedado no
GitHub Pages.

## Estrutura

```
.
├── index.html                  # página única do site
├── 404.html                    # página de erro
├── assets/
│   ├── css/style.css           # estilos
│   ├── js/main.js              # carrossel, lightbox, menu mobile
│   ├── img/favicon.svg
│   └── img/portfolio/          # 35 fotos (foto-01.jpg … foto-35.jpg)
│   └── video/                  # 3 vídeos (video-01.mp4 … video-03.mp4)
├── .github/workflows/deploy.yml # publicação automática no GitHub Pages
├── robots.txt
└── sitemap.xml
```

As imagens e vídeos que antes estavam embutidos em base64 dentro do HTML (13 MB em
um arquivo só) agora são arquivos separados: a página em si tem ~25 KB e a mídia
carrega sob demanda.

## Publicar no GitHub Pages

1. No repositório, abra **Settings → Pages**.
2. Em **Source**, escolha **GitHub Actions**.
3. Faça merge deste branch em `main`. O workflow `deploy.yml` publica o site a cada push.

O site fica em `https://somostakai.github.io/tainog/`.

### Domínio próprio

Para usar um domínio (ex.: `tainog.com.br`):

1. Crie um arquivo `CNAME` na raiz com o domínio, uma linha só.
2. Aponte o DNS do domínio para o GitHub Pages.
3. Atualize as URLs em `sitemap.xml`, `robots.txt` e nas tags `canonical`/`og:url`
   do `index.html`.

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## O que ainda precisa ser preenchido

No rodapé do `index.html` o e-mail (`seuemail@exemplo.com`) e o WhatsApp
(`wa.me/5500000000000`) ainda são os valores de exemplo do arquivo original —
precisam ser trocados pelos dados reais antes de divulgar o site.

## Adicionar ou trocar fotos

Coloque o arquivo em `assets/img/portfolio/` e adicione um `<li>` na lista
`#gallery` do `index.html`, seguindo o padrão dos existentes. Para incluir a foto
no carrossel de destaques, adicione também um `.carousel-slide` dentro de
`.carousel-viewport`.

## Vídeos

Três vídeos ficam hospedados no próprio repositório (`assets/video/`) e dois vêm
por iframe do Google Drive. Se o Drive for desativado ou os arquivos mudarem de
permissão, esses dois quadros ficam vazios — vale migrar tudo para o repositório
ou para YouTube/Vimeo.
