/* JCP Advocacia — interacoes da landing (copy v2) */
(function () {
  'use strict';

  var FONE = '5561996275602';

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

    var alvo = byId(caso);
    if (alvo && alvo.tagName === 'DETAILS') alvo.open = true;

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

    form.addEventListener('change', function (ev) {
      atualizar();
      /* marcou um cartao: ja abre o assunto certo la embaixo */
      var alvo = ev.target.getAttribute('data-area');
      if (ev.target.checked && alvo) {
        var det = byId(alvo);
        if (det && det.tagName === 'DETAILS') det.open = true;
      }
    });
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
     4. FAQ: so uma resposta aberta por vez
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

  /* ------------------------------------------------------------------
     5. Link direto para uma area (#acidente) abre o acordeao
     ------------------------------------------------------------------ */
  var abrirPeloHash = function () {
    var h = window.location.hash;
    if (!h || h.length < 2) return;
    var el;
    try { el = document.querySelector(h); } catch (e) { return; }
    if (el && el.tagName === 'DETAILS') el.open = true;
  };
  window.addEventListener('hashchange', abrirPeloHash);
  abrirPeloHash();
})();
