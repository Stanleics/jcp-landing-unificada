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

Ao alterar CSS, JavaScript ou imagem, suba o `?v=` da referência
correspondente, para furar o cache de quem já visitou. **No ar**, o CSS e o
JavaScript estão em `v=16`, a foto da equipe em `v=15`, a foto da sala em
`v=14`; os arquivos que não mudaram seguem em `v=12`, de propósito, para
não forçar download repetido em quem usa dado pré-pago.

A `politica-de-privacidade.html` foge da regra por um motivo: o estilo só
dela mora num `<style>` dentro do próprio arquivo. São ~1,2 KB que não
valem subir o `?v=` do `style.css` e obrigar todo mundo que já visitou a
baixar o CSS inteiro de novo.

## Há trabalho pronto que não está no ar

O ramo **`medicao-ref-e-caso`** traz o código de referência no texto do
WhatsApp, os campos `caso`, `wa_ref` e `wa_gclid` no evento de clique, o
evento `selecao_triador` e a Política de Privacidade reescrita em seis
lugares. Ali o `main.js` está em `v=18`.

**Não publique esse ramo ainda.** O item 3 da política descreve o estado
final e afirma três coisas que ainda não existem na página: GA4 ligado no
GTM, tags de anúncio com gatilho preso ao consentimento, e **o aviso de
cookies com escolha, que não existe**. Enquanto os três não existirem,
publicar faz a política afirmar rastreamento que não acontece. Há um
comentário HTML logo acima do item 3 avisando. O caso inteiro está em
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
