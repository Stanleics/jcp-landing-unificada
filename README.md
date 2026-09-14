# LP unificada JCP — cópia local com a pele nova

Cópia completa e funcional da landing page: HTML, CSS, JavaScript,
imagens e vídeo. É a versão com o visual refeito para o público da
Cidade Estrutural, em setembro de 2026.

A documentação do trabalho fica em [`../documentacao/`](../documentacao/).
Retomando depois de um tempo, comece por
[`../documentacao/12-onde-paramos.md`](../documentacao/12-onde-paramos.md),
que traz o estado e o que falta. Para o resto, o README de lá.

## Rodar localmente

```
python3 -m http.server 8899
```

Depois abra `http://localhost:8899/index.html`. Serve qualquer servidor
estático; abrir o arquivo direto pelo `file://` quebra o vídeo e as
fontes.

## Publicar

```
./publicar.sh
```

O script monta a pasta `dist/` com `index.html`,
`politica-de-privacidade.html` e `assets/`, mostra o que vai subir e
publica no Cloudflare Pages, projeto `jcp-lp-trabalhista`, na conta
stanlei@empoderai.com.br. Leva cerca de 15 segundos e cai sempre em
https://jcp-lp-trabalhista.stanlei.workers.dev.

A pasta publicável está fixada no `wrangler.jsonc`, em
`assets.directory`. **Não** troque o comando por `wrangler pages deploy
<pasta>` nem rode o wrangler de outro diretório: foi assim que, na
primeira tentativa, o projeto inteiro subiu para uma URL pública,
inclusive a pasta `fotos/`, que guarda os originais em alta e não deve ir
para o servidor. O caso está em
[`../documentacao/09-publicacao-cloudflare.md`](../documentacao/09-publicacao-cloudflare.md).

O GitHub Pages em `felipefc100.github.io/jcp-landing-unificada` deixou de
ser o caminho de publicação. O endereço final da página é
**`https://jcp.adv.br/`**, decidido pelo cliente em 13/09: a LP vai para
o endereço principal, sem www, no lugar do site atual.
Depende da migração de DNS e de uma confirmação do escritório sobre o
site que sai. Ver
[`../documentacao/09-publicacao-cloudflare.md`](../documentacao/09-publicacao-cloudflare.md).

Ao alterar CSS, JavaScript ou imagem, suba o `?v=` da referência
correspondente, para furar o cache de quem já visitou. O CSS e o
JavaScript estão em `v=16`, a foto da equipe em `v=15`, a foto da sala em
`v=14`; os arquivos que não mudaram seguem em `v=12`, de propósito, para
não forçar download repetido em quem usa dado pré-pago.

A `politica-de-privacidade.html` foge da regra por um motivo: o estilo só
dela mora num `<style>` dentro do próprio arquivo. São ~1,2 KB que não
valem subir o `?v=` do `style.css` e obrigar todo mundo que já visitou a
baixar o CSS inteiro de novo.

## Antes de subir

Faltam a foto nova do Dr. João para o herói e as tags de GA4 e Pixel
dentro do GTM, que está instalado. Ver
[`../documentacao/04-pendencias.md`](../documentacao/04-pendencias.md).

A Política de Privacidade existe desde 13/09, em
`politica-de-privacidade.html`. **Ela afirma, com data, que não há GA4 nem
Pixel ligados**: quem instalar as tags reescreve o item 3 dela na mesma
leva e cria o aviso de cookies, que ela promete. Ver
[`../documentacao/13-politica-de-privacidade.md`](../documentacao/13-politica-de-privacidade.md).

O e-mail `contato@jcp.adv.br`, que as duas páginas publicam, **ainda não
existe como caixa**. Não é DNS: o MX já entrega no servidor certo, falta
criar a conta ou um encaminhador no cPanel. Criar antes de apontar o
domínio para a LP.

O bloco 4, do vídeo, está **fora do ar desde 13 de setembro**, a pedido
do cliente, até existir uma gravação em formato wide e boa resolução. Ele
segue no `index.html`, comentado, com a instrução de retomada no próprio
comentário. Ver
[`../documentacao/10-video-fora-do-ar.md`](../documentacao/10-video-fora-do-ar.md).
