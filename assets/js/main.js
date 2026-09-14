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

  var link = function (texto) {
    return 'https://wa.me/' + FONE + '?text=' + encodeURIComponent(texto);
  };

  var byId = function (id) { return document.getElementById(id); };

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

    var atualizar = function () {
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
    };

    form.addEventListener('change', atualizar);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    atualizar();
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

        Nenhum dado de quem visita e enviado aqui: so de onde foi o clique.
     ------------------------------------------------------------------ */
  window.dataLayer = window.dataLayer || [];

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
    return { area: area, bloco: blocoId };
  };

  document.addEventListener('click', function (e) {
    var alvo = maisProximo(e.target, 'a[href*="wa.me"]');
    if (!alvo) return;

    var lugar = ondeEstou(alvo);
    var evento = {
      event: 'clique_whatsapp',
      wa_area: lugar.area,
      wa_bloco: lugar.bloco,
      wa_rotulo: (alvo.textContent || '').replace(/\s+/g, ' ').trim()
    };

    /* no triador, o que importa e a combinacao que a pessoa marcou */
    if (marcados.length) evento.wa_marcados = marcados.join(',');

    window.dataLayer.push(evento);
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
