/* JCP Advocacia — interacoes da landing (copy v2) */
(function () {
  'use strict';

  var FONE = '5561982533524';

  /* Mensagem pronta por assunto — bloco 1 da copy */
  var MSG = {
    generico:      'Oi! Vi o site e queria falar sobre o meu caso.',
    acerto:        'Oi! Fui mandado embora e acho que não pagaram tudo certo.',
    'sem-carteira':'Oi! Trabalhei sem carteira assinada e queria saber se tenho direito.',
    acidente:      'Oi! Me acidentei no trabalho e queria falar sobre o meu caso.',
    inss:          'Oi! O INSS negou meu pedido e queria saber o que dá pra fazer.',
    'hora-extra':  'Oi! Fiz hora extra e nunca me pagaram. Queria uma avaliação.',
    insalubre:     'Oi! Trabalho em lugar perigoso e não recebo nada a mais.',
    humilhacao:    'Oi! Passo humilhação no meu serviço e queria orientação.'
  };

  var byId = function (id) { return document.getElementById(id); };

  /* Os assuntos que a pagina reconhece, tirados do proprio MSG para nao
     virar uma segunda lista que alguem esquece de atualizar. Serve de
     peneira: sem ela, qualquer coisa colada em ?caso= entraria no
     relatorio, de erro de digitacao no anuncio a texto posto de
     proposito. O hasOwnProperty e por causa de ?caso=constructor, que
     passaria numa checagem ingenua. */
  var eAssunto = function (x) {
    return !!x && x !== 'generico' &&
           Object.prototype.hasOwnProperty.call(MSG, x);
  };

  /* o GTM ja cria a fila no <head>; a linha protege a pagina sem o GTM */
  window.dataLayer = window.dataLayer || [];

  /* ------------------------------------------------------------------
     0. Codigo de referencia — o [ref A1B2C3] que viaja no texto do
        WhatsApp e amarra a conversa no aparelho do escritorio ao clique
        que trouxe a pessoa. Quem gera o codigo e o script no fim do
        index.html, que roda antes deste arquivo.

        O carimbo mora aqui, dentro de link(), e nao num varredor de
        hrefs no carregamento, porque quatro botoes tem o href reescrito
        depois: o triador, o botao final, a barra fixa e o heroi quando
        vem ?caso= na URL. Carimbar so o HTML perderia a marca
        justamente no heroi de anuncio, que e o clique pago.
     ------------------------------------------------------------------ */
  var REF = (typeof window.jcpRef === 'string' && window.jcpRef) || '';

  var comRef = function (texto) {
    if (!REF || texto.indexOf('[ref ') !== -1) return texto;
    return texto + '  [ref ' + REF + ']';
  };

  var link = function (texto) {
    return 'https://wa.me/' + FONE + '?text=' + encodeURIComponent(comRef(texto));
  };

  /* Os botoes que ja nascem prontos no HTML nunca passam por link():
     carimba cada um relendo o texto que esta no proprio href. */
  if (REF) {
    var fixos = document.querySelectorAll('a[href*="wa.me"]');
    for (var g = 0; g < fixos.length; g++) {
      var partes = (fixos[g].getAttribute('href') || '').split('?text=');
      if (partes.length !== 2) continue;
      var texto;
      try {
        texto = decodeURIComponent(partes[1].replace(/\+/g, ' '));
      } catch (e) { continue; }
      if (texto.indexOf('[ref ') !== -1) continue;
      fixos[g].href = partes[0] + '?text=' + encodeURIComponent(comRef(texto));
    }
  }

  /* ------------------------------------------------------------------
     1. Variantes de heroi por parametro (?caso=...) — bloco 14
     ------------------------------------------------------------------ */
  var VARIANTES = {
    acidente: {
      titulo: 'Se machucou no serviço e ficaram te empurrando de canto em canto?',
      texto:  'Acidente no trajeto conta. Doença que veio do serviço também. A gente olha o seu caso.'
    },
    'sem-carteira': {
      titulo: 'Trabalhou anos naquela firma e nunca assinaram sua carteira?',
      texto:  'A Justiça olha como era o seu dia, não só o papel. Dá pra buscar tudo desde o começo.'
    },
    'hora-extra': {
      titulo: 'Ficava até mais tarde toda semana e nunca viu essa hora no contracheque?',
      texto:  'Hora extra tem 50% a mais. Domingo e feriado, o dobro. A conta de anos junta.'
    },
    acerto: {
      titulo: 'Te mandaram embora e o acerto veio bem menor do que devia?',
      texto:  'A firma tem 10 dias pra pagar. E a multa do FGTS é de 40%.'
    },
    inss: {
      titulo: 'O INSS negou e você não sabe o que fazer?',
      texto:  'Carta de negativa não é ponto final. Dá pra recorrer, e dá pra receber atrasado.'
    }
  };

  var caso = null;
  try {
    caso = new URLSearchParams(window.location.search).get('caso');
  } catch (e) { /* navegador antigo: segue com o heroi padrao */ }

  /* o assunto que o anuncio trouxe, quando e um assunto de verdade */
  var casoDaUrl = eAssunto(caso) ? caso : '';

  /* A ancora de entrada — qual bloco o link do anuncio pediu. Os sitelinks
     do Google apontam todos para a mesma pagina e se distinguem so pelo #,
     entao sem este campo o relatorio soma num unico destino o que foram
     varios anuncios diferentes, e nao da pra saber qual sitelink converte.

     Lido uma vez aqui, no carregamento, e nao na hora do clique: sete links
     internos da propria pagina trocam o hash (os que apontam para os
     cartoes de area), e ler no clique devolveria o ultimo pulo que a pessoa
     deu dentro da pagina, nao a porta por onde ela entrou.

     Vale a mesma peneira do ?caso=, e pelo mesmo motivo: entra so o que e
     alvo de rolagem de verdade — <section id> ou cartao de area. A lista
     sai da propria pagina, nao de um array escrito a mao, e e exatamente o
     conjunto que leva scroll-margin-top no CSS. Assim um bloco novo ja
     nasce valido, e hash inventado colado no fim da URL nao entra no
     relatorio. */
  var ENTRADA = (function () {
    var bruto = (window.location.hash || '').slice(1);
    try {
      bruto = decodeURIComponent(bruto);
    } catch (e) { /* hash mal formado: segue com o texto cru */ }
    if (!bruto) return '';
    var alvos = document.querySelectorAll('section[id],article.area[id]');
    for (var i = 0; i < alvos.length; i++) {
      if (alvos[i].id === bruto) return bruto;
    }
    return '';
  })();

  if (caso && VARIANTES[caso]) {
    var v = VARIANTES[caso];
    var hT = byId('hero-titulo');
    var hX = byId('hero-texto');
    if (hT) hT.textContent = v.titulo;
    if (hX) hX.textContent = v.texto;

    /* o botao do heroi ja sai com a mensagem do assunto do anuncio */
    var btnHeroi = document.querySelector('.hero .btn--wa');
    if (btnHeroi && MSG[caso]) btnHeroi.href = link(MSG[caso]);
  }

  /* ------------------------------------------------------------------
     2. Triador — bloco 5
     ------------------------------------------------------------------ */
  var form = byId('triador-form');
  var msgEl = byId('tri-msg');
  var btnEl = byId('tri-btn');
  var finalEl = byId('final-btn');
  var marcados = [];

  if (form && msgEl && btnEl) {
    var caixas = form.querySelectorAll('input[type="checkbox"]');

    var atualizar = function (avisar) {
      var rotulos = [];
      marcados = [];
      for (var i = 0; i < caixas.length; i++) {
        if (!caixas[i].checked) continue;
        rotulos.push(caixas[i].getAttribute('data-rotulo'));
        var area = caixas[i].getAttribute('data-area');
        if (area) marcados.push(area);
      }

      var n = rotulos.length;
      if (n === 0) {
        msgEl.textContent = 'Toque nos cartões que combinam com o que você viveu.';
      } else if (n === 1) {
        msgEl.innerHTML = '<strong>Já vale conversar.</strong> Um item só pode dar um caso inteiro.';
      } else {
        msgEl.innerHTML = '<strong>Você marcou ' + n + '.</strong> Quase sempre tem mais coisa junto do que a pessoa imagina.';
      }

      var href = n === 0
        ? link(MSG.generico)
        : link('Oi! Marquei no site: ' + rotulos.join(', ') + '. Queria uma avaliação.');

      btnEl.href = href;
      if (finalEl) finalEl.href = href;

      /* Conta a selecao, nao o clique: quem marca e nao fala aparece so
         aqui. So em mudanca de verdade e so com algo marcado — a chamada
         de partida roda com zero marcados e viraria ruido no relatorio.
         O nome do caso segue a grafia de wa_marcados, com hifen, para o
         GA4 nao receber duas escritas da mesma coisa. */
      if (avisar && marcados.length) {
        window.dataLayer.push({
          event: 'selecao_triador',
          caso: marcados.join(','),
          qtd_marcados: marcados.length,
          /* Vai aqui tambem, e nao so no clique, para dar de responder qual
             sitelink leva a pessoa a usar o triador — que e a conversao
             pequena do proprio #triador. Este campo nao corre o risco de
             valor velho que os outros correm: e lido uma vez na carga e
             nao muda enquanto a pagina estiver aberta. */
          wa_entrada: ENTRADA
        });
      }
    };

    form.addEventListener('change', function () { atualizar(true); });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    atualizar(false);
  }

  /* ------------------------------------------------------------------
     3. Barra fixa de WhatsApp que troca a mensagem conforme o bloco
        que esta na tela — bloco 1
     ------------------------------------------------------------------ */
  var barra = byId('wa-bar');
  var areas = document.querySelectorAll('.area[id]');

  if (barra && areas.length && 'IntersectionObserver' in window) {
    var visiveis = {};

    var trocarBarra = function () {
      /* se a pessoa marcou cartoes, a mensagem montada tem prioridade */
      if (marcados.length) return;

      var atual = null;
      for (var i = 0; i < areas.length; i++) {
        if (visiveis[areas[i].id]) { atual = areas[i].id; break; }
      }
      barra.href = link(MSG[atual] || MSG.generico);
    };

    var obs = new IntersectionObserver(function (entradas) {
      for (var i = 0; i < entradas.length; i++) {
        visiveis[entradas[i].target.id] = entradas[i].isIntersecting;
      }
      trocarBarra();
    }, { rootMargin: '-45% 0px -45% 0px' });

    for (var a = 0; a < areas.length; a++) obs.observe(areas[a]);
  }

  /* ------------------------------------------------------------------
     4. Medicao: avisa o GTM a cada clique de WhatsApp, dizendo de onde
        veio. Sem isso o GTM so enxerga "houve um clique" e nao da pra
        saber qual area converte, que e a pergunta que motivou medir.

        A area sai da propria estrutura da pagina, nao de um atributo
        escrito a mao em cada botao: assim um botao novo ja nasce medido e
        nada quebra se um bloco mudar de lugar.

        Ate 13/09 nada de quem visita era enviado aqui: so de onde foi o
        clique. Desde 14/09 nao e mais assim — vao junto o wa_ref, que e
        um identificador guardado no aparelho por seis meses, e o
        wa_gclid, que e o identificador do anuncio. Os dois existem para
        ligar a conversa no WhatsApp ao clique que a trouxe, e foi essa
        mudanca que obrigou a reescrever o item 3 da Politica de
        Privacidade.
     ------------------------------------------------------------------ */
  var maisProximo = function (el, seletor) {
    if (el.closest) return el.closest(seletor);
    while (el && el.nodeType === 1) {            /* navegador antigo */
      if (el.matches && el.matches(seletor)) return el;
      el = el.parentNode;
    }
    return null;
  };

  var ondeEstou = function (el) {
    var explicito = el.getAttribute('data-wa');
    var cartao = maisProximo(el, 'article.area');
    var secao = maisProximo(el, 'section');

    /* A barra fixa, o rodape e o cabecalho ficam fora de qualquer <section>,
       e o heroi e a unica <section> sem id. Sem estes quatro casos, tudo que
       nao esta numa secao com id cai no mesmo balde e a medicao mente. */
    var blocoId;
    if (el.id === 'wa-bar')                   blocoId = 'barra-fixa';
    else if (maisProximo(el, 'footer'))       blocoId = 'rodape';
    else if (maisProximo(el, 'header'))       blocoId = 'cabecalho';
    else if (secao && secao.id)               blocoId = secao.id;
    else if (maisProximo(el, 'section.hero')) blocoId = 'heroi';
    else                                      blocoId = 'outro';

    /* o cartao de area e mais especifico que a secao que o contem */
    var area = (cartao && cartao.id) || (explicito && explicito !== 'generico' ? explicito : '') || blocoId;

    /* O assunto que a estrutura revela, separado de wa_area de proposito:
       wa_area cai no nome do bloco quando o botao nao e de uma area, e
       'rodape' nao e assunto nenhum. Aqui, ou e assunto ou fica vazio. */
    var assunto = (cartao && eAssunto(cartao.id)) ? cartao.id
                : (eAssunto(explicito) ? explicito : '');

    return { area: area, bloco: blocoId, caso: assunto };
  };

  document.addEventListener('click', function (e) {
    var alvo = maisProximo(e.target, 'a[href*="wa.me"]');
    if (!alvo) return;

    var lugar = ondeEstou(alvo);

    /* O assunto do clique, na mesma grafia com hifen do selecao_triador,
       para o GA4 juntar os dois eventos pelo mesmo campo. Do mais
       especifico para o menos: o cartao em que a pessoa tocou, depois a
       combinacao que ela marcou, depois o assunto do anuncio que a
       trouxe. Este ultimo e o que faltava: o botao do heroi sai com
       data-wa="generico" dentro de uma <section> sem id, entao vinha como
       wa_area 'heroi' mesmo quando ?caso=acidente tinha reescrito a
       mensagem dele — o caso se perdia justamente no clique pago.

       Fica vazio quando nao ha assunto nenhum: 'rodape' e 'barra-fixa'
       sao nome de bloco, nao assunto, e mandar um no lugar do outro
       encheria o relatorio de assunto que nao e assunto. */
    var assunto = lugar.caso ||
                  (marcados.length ? marcados.join(',') : '') ||
                  casoDaUrl;

    /* Os campos vao todos, sempre, mesmo vazios. O dataLayer e um modelo
       que se acumula: campo que falta num push nao chega ao GTM como
       vazio — chega com o valor que o push anterior deixou. Antes disso,
       quem tocasse no cartao do INSS e depois na barra fixa mandava
       'inss' nas duas vezes, e a segunda era mentira.

       wa_ref sai da mesma variavel que o comRef() usa para carimbar o
       href, e nao de uma segunda leitura: e o par dos dois lados do mesmo
       clique. Sem ele aqui, o [ref] chega ao escritorio sem par; com um
       valor diferente do que foi na mensagem, o par mente, que e pior. */
    window.dataLayer.push({
      event: 'clique_whatsapp',
      wa_area: lugar.area,
      wa_bloco: lugar.bloco,
      wa_rotulo: (alvo.textContent || '').replace(/\s+/g, ' ').trim(),
      wa_ref: REF,
      wa_gclid: window.jcpGclid || '',
      wa_entrada: ENTRADA,
      caso: assunto,
      wa_marcados: marcados.join(','),
      qtd_marcados: marcados.length
    });
  }, true);

  /* ------------------------------------------------------------------
     5. FAQ: so uma resposta aberta por vez
     ------------------------------------------------------------------ */
  var faq = document.querySelectorAll('.faq details');
  for (var j = 0; j < faq.length; j++) {
    faq[j].addEventListener('toggle', function () {
      if (!this.open) return;
      for (var k = 0; k < faq.length; k++) {
        if (faq[k] !== this) faq[k].open = false;
      }
    });
  }
})();
