# LP unificada JCP — cópia local com a pele nova

Cópia completa e funcional da landing page: HTML, CSS, JavaScript,
imagens e vídeo. É a versão com o visual refeito para o público da
Cidade Estrutural, em setembro de 2026.

A documentação do trabalho fica em [`../documentacao/`](../documentacao/).
Comece pelo README de lá.

## Rodar localmente

```
python3 -m http.server 8899
```

Depois abra `http://localhost:8899/index.html`. Serve qualquer servidor
estático; abrir o arquivo direto pelo `file://` quebra o vídeo e as
fontes.

## Publicar

A página no ar é servida pelo GitHub Pages em
`felipefc100.github.io/jcp-landing-unificada`, cuja publicação depende do
Felipe. Para atualizar, os arquivos alterados são:

- `index.html`
- `assets/css/style.css`
- `assets/js/main.js`
- `assets/img/equipe-time.jpg` e `assets/img/escritorio-sala.jpg`, que
  são novos

Os demais arquivos estão idênticos aos que já estão no ar. A pasta
`fotos/` guarda os originais em alta e **não** deve ir para o servidor.

Ao publicar, subir o `?v=` das referências que mudaram, para furar o
cache de quem já visitou. O CSS, o JavaScript e as duas fotos novas estão
em `v=14`; os arquivos que não mudaram seguem em `v=12`, de propósito,
para não forçar download repetido em quem usa dado pré-pago.

## Antes de subir

Três coisas continuam pendentes: a OAB da Dra. Jennifer Bianca, que
aparece como "Advogada" no cartão dela, a foto nova do Dr. João para o
herói e a ausência de GTM e Pixel, que deixa os botões de WhatsApp sem
medição. Ver
[`../documentacao/04-pendencias.md`](../documentacao/04-pendencias.md).
