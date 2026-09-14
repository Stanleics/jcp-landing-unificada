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

**A LP está no ar em `https://jcp.adv.br/` desde 14/09/2026.** Ela
substituiu o WordPress que servia o endereço. O `www` também responde, e
a URL `.workers.dev` continua servindo de conferência. O passo a passo da
virada e as armadilhas que encontramos estão em
[`../documentacao/14-lp-no-ar.md`](../documentacao/14-lp-no-ar.md).

Dois cuidados que moram no `wrangler.jsonc` e não devem ser removidos:

- `"workers_dev": true` — sem essa linha o deploy seguinte **desliga** a
  URL `.workers.dev` de conferência. Aconteceu em 14/09.
- `routes` com `custom_domain: true` — é o que liga o domínio ao Worker.
  Não trocar por Workers Route: rota exige um registro apontando para uma
  origem, e a origem era o servidor da agência anterior, que continuava
  servindo o site velho por trás do proxy.

O GitHub Pages em `stanleics.github.io/jcp-landing-unificada` foi
**desligado** em 14/09. Ele servia a raiz do repositório público e, se
tivesse continuado ligado, publicaria uma cópia paralela da LP com o GTM
disparando eventos reais no contêiner do cliente.

## Cache: subir o `?v=` deixou de ser boa prática

Ao alterar CSS, JavaScript ou imagem, suba o `?v=` da referência
correspondente. **No ar**, o CSS está em `v=16`, o JavaScript em `v=19`
(nas duas páginas), a foto da equipe em `v=15`, a foto da sala em `v=14`;
os arquivos que não mudaram seguem em `v=12`, de propósito, para não
forçar download repetido em quem usa dado pré-pago.

**Desde 14/09/2026 existe um `_headers` na raiz**, copiado para `dist/`
pelo `publicar.sh`. Ele separa duas coisas que o Worker servia igual:

| | |
|---|---|
| HTML (`/`, a política, `*.html`) | `no-cache, must-revalidate` — revalida sempre |
| `/assets/*` | `public, max-age=31536000, immutable` — um ano, sem perguntar |

Antes dele o Worker servia **tudo**, inclusive CSS, JS, imagens e vídeo,
com `public, max-age=0, must-revalidate`: o HTML já estava certo por
padrão, e os assets é que revalidavam a cada carregamento. A disciplina
do `?v=` existia e o navegador perguntava de novo assim mesmo.

**O preço disso é que o descuido deixou de se corrigir sozinho.**
`immutable` manda o navegador nem perguntar. Alterar um arquivo em
`assets/` sem subir o `?v=` deixa quem já visitou com a versão velha por
um ano, e recarga normal não resolve. Antes, o mesmo erro se consertava
na visita seguinte. Foi exatamente esse descuido que deixou a política em
`main.js?v=16` enquanto o `index.html` estava em `v=18`.

A `politica-de-privacidade.html` foge da regra por um motivo: o estilo só
dela mora num `<style>` dentro do próprio arquivo. São ~1,2 KB que não
valem subir o `?v=` do `style.css` e obrigar todo mundo que já visitou a
baixar o CSS inteiro de novo.

## O que está no ar, e a dívida que veio junto

Desde **14/09/2026** está publicado o código de referência no texto do
WhatsApp, o evento `clique_whatsapp` com os oito campos (`caso`,
`wa_ref`, `wa_gclid` e `qtd_marcados` entre eles, sempre presentes,
mesmo vazios), o evento `selecao_triador` e a Política de Privacidade
reescrita. O `main.js` está em `v=19`, **nas duas páginas**.

**Foi publicado por decisão expressa do cliente, com o aviso de que duas
afirmações do item 3 da política ainda não são verdade na página.** Não
é engano de quem publicou; é dívida com prazo, e está registrada num
comentário HTML logo acima do item 3:

1. O item diz que o **Google Analytics** roda dentro do GTM. Ainda não
   roda — o `GTM-PVKGSRZD` está instalado e sem tag.
2. O item diz que as tags de anúncio **só carregam se a pessoa aceitar,
   no aviso que aparece quando a página abre**. Esse aviso **não
   existe**, e as tags também não. Esta é a mais grave das duas, porque
   descreve uma escolha da pessoa que o site não oferece.

O aviso de cookies com escolha é o único dos pendentes que é trabalho de
código. Enquanto ele não existir, a página promete um controle que não
entrega. Ver
[`../documentacao/15-ref-e-caso-na-medicao.md`](../documentacao/15-ref-e-caso-na-medicao.md).

## Antes de subir

Faltam a foto nova do Dr. João para o herói e as tags de GA4 e Pixel
dentro do GTM, que está instalado. Ver
[`../documentacao/04-pendencias.md`](../documentacao/04-pendencias.md).

O e-mail `contato@jcp.adv.br`, que as duas páginas publicam, **ainda não
recebe nada**. O plano de criar um encaminhador no cPanel morreu: a
agência anterior não repassou o acesso ao painel. Como o escritório
confirmou que nunca usou nenhum endereço `@jcp.adv.br`, o e-mail do
domínio migrou para o Cloudflare Email Routing — que está **ativado, mas
não terminado**. Faltam cadastrar o destino, clicar no link de
verificação que chega nele, e criar a regra. Ver
[`../documentacao/14-lp-no-ar.md`](../documentacao/14-lp-no-ar.md).

O bloco 4, do vídeo, está **fora do ar desde 13 de setembro**, a pedido
do cliente, até existir uma gravação em formato wide e boa resolução. Ele
segue no `index.html`, comentado, com a instrução de retomada no próprio
comentário. Ver
[`../documentacao/10-video-fora-do-ar.md`](../documentacao/10-video-fora-do-ar.md).
