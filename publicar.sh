#!/bin/sh
# Publica a LP no Cloudflare Pages (projeto jcp-lp-trabalhista).
#
# Monta a pasta dist/ com o que vai para o ar e sobe SO ela. A pasta que
# o wrangler publica esta fixada no wrangler.jsonc ("assets.directory"),
# entao nao rode "wrangler deploy" de dentro de outra pasta nem troque o
# comando por "pages deploy <pasta>": na primeira tentativa isso subiu o
# projeto inteiro, incluindo fotos/ e README, para uma URL publica.
set -e
cd "$(dirname "$0")"

rm -rf dist
mkdir dist
cp index.html politica-de-privacidade.html dist/
rsync -a --exclude='.DS_Store' assets dist/

echo "Vai para o ar:"
find dist -type f | sort | sed 's/^/  /'

npx --yes wrangler@latest deploy
