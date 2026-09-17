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
correspondente. **No ar**, o CSS está em `v=16`, o JavaScript em `v=19`;
no repositório, à espera de publicação, o CSS está em `v=17` e o
JavaScript em `v=20` (âncora dos cartões e campo `wa_entrada`, abaixo)
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
`main.js?v=16` enquanto o `index.html` estava em `v=18`. A medição que
motivou o arquivo, e as três armadilhas de conferir cache em Worker com
assets, estão em
[`../documentacao/16-oito-campos-publicacao-e-cache.md`](../documentacao/16-oito-campos-publicacao-e-cache.md).

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

**No repositório, ainda não publicado, esse evento tem um nono campo:**
`wa_entrada`, a âncora pela qual a pessoa chegou. Os sitelinks do Google
apontam todos para a mesma página e se distinguem só pelo `#`, então sem
ele o relatório soma num destino único o que foram vários anúncios. É
lido uma vez na carga, não no clique — os sete links internos que
apontam para os cartões trocam o hash, e ler no clique devolveria o
último pulo dentro da página, não a porta de entrada. Entra só o que é
alvo de rolagem de verdade (`section[id]` ou cartão de área), pela mesma
razão que o `?caso=` tem peneira. Vai também no `selecao_triador`, onde
não corre risco de valor velho porque não muda enquanto a página está
aberta.

**Ele só chega ao GA4 depois de duas configurações no GTM** que não são
código: uma Variável de camada de dados `wa_entrada` e o parâmetro
correspondente na tag `GA4 - clique_whatsapp` (e na do triador). Sem
isso o campo fica no `dataLayer` e o GTM o ignora. Para aparecer em
relatório, falta ainda registrá-lo como dimensão personalizada com
escopo de evento no GA4.

## A dívida do item 3 foi fechada pelo texto, não pelo código

Entre **14 e 17/09/2026** a política afirmava duas coisas que a página
não fazia. Publicado assim por decisão expressa do cliente: não era
engano de quem publicou, era dívida com prazo. As duas fecharam em
**17/09/2026**, cada uma por um caminho diferente:

1. *"dentro dele, o Google Analytics"* — **virou verdade sozinha.** O
   `GTM-PVKGSRZD` tem quatro tags publicadas (Tag do Google,
   `clique_whatsapp`, `selecao_triador` e Vinculador de conversões do
   Ads). Verificado na rede em 17/09: a propriedade `G-45ZDKWXB4B`
   recebe os eventos.
2. *"só carregam se você aceitar, no aviso que aparece quando a página
   abre"* — **a promessa foi retirada do texto**, por decisão do
   cliente, em vez de construída em código. Era a mais grave das duas,
   porque descrevia uma escolha que o site não oferecia.

O item 3 agora diz o que a página faz: a medição vale para todo mundo,
começa quando a página abre, roda no **legítimo interesse** (art. 7º,
IX) e não no consentimento, e a pessoa pode se opor e pedir exclusão
pelos canais do item 10 — que ganhou o direito de oposição, que faltava
na lista. Também caíram as menções à **Meta**: não existe Pixel no
contêiner, e o script de origem não guarda `fbclid`.

Três coisas que o texto novo assume em voz alta, porque esconder
qualquer uma delas recriaria a dívida:

- O GA4 e o Ads **gravam cookie** no aparelho. A frase antiga dizia que
  a medição funcionava "sem cookie de acompanhamento", e isso deixou de
  ser verdade no instante em que o GA4 entrou.
- Com a conta do GA4 ligada à do Ads, sai um ping para
  `ads/ga-audiences`, que **alimenta público de anúncio**. É a parte
  mais fraca do enquadramento em legítimo interesse. Desligar o vínculo
  de público no GA4 é configuração, não código, e deixaria a posição
  bem mais defensável.
- Não há aviso de cookies, e o texto diz isso com essas palavras.

**Regra para quem mexer depois, e ela está repetida no comentário HTML
acima do item 3:** texto e código mudam no mesmo commit. Enquanto não
houver aviso com escolha, não escreva na política que existe escolha. Se
o Consent Mode entrar um dia, o item 3 volta a falar de consentimento no
mesmo commit em que o aviso nascer.

**Cuidado que faltava e ainda falta:** o GTM carrega em `localhost`
também. Em 17/09, medir a página local mandou ~18 `clique_whatsapp`
reais para o `G-45ZDKWXB4B`, e bateu no endpoint de conversão do Ads.
Todos carregam `dl=http://localhost:8899/...` e dão para isolar pela
dimensão *Nome do host*. Falta um **acionador de exceção no GTM**
bloqueando as tags quando o host for `localhost` ou `127.0.0.1`.

A sessão que criou a dívida está em
[`../documentacao/16-oito-campos-publicacao-e-cache.md`](../documentacao/16-oito-campos-publicacao-e-cache.md);
a linha do consentimento, em
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
