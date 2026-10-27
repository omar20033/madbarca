/* "Where to watch the next match" for Real Madrid and Barcelona.
   Used by watch.html, es/watch.html, fr/watch.html and ar/watch.html (one data file for all four languages).

   TO UPDATE after each match, only edit NEXT_MATCHES below:
     - kickoff : ISO time WITH the Spain offset (+01:00 in winter, +02:00 in summer)
     - opp     : key from OPPONENTS  (add a new opponent there, in the four languages)
     - comp    : key from COMPS
     - venue   : key from VENUES
     - matchday: league matchday number (use null for cups and the Champions League)
     - home    : true if the team plays at home
   Then change `checked` to today's date. Nothing else needs touching. */
(function () {
  var NEXT_MATCHES = {
    checked: '2026-10-27',
    teams: [
      { team: 'madrid', opp: 'racing', comp: 'laliga', matchday: 11, home: false, venue: 'sardinero', kickoff: '2026-11-01T16:15:00+01:00' },
      { team: 'barca',  opp: 'alaves', comp: 'laliga', matchday: 11, home: true,  venue: 'campnou',   kickoff: '2026-10-31T21:00:00+01:00' }
    ]
  };

  var TEAMS = {
    madrid: { en: 'Real Madrid', es: 'Real Madrid', fr: 'Real Madrid', ar: 'ريال مدريد' },
    barca:  { en: 'Barcelona',   es: 'Barcelona',   fr: 'Barcelone',   ar: 'برشلونة' }
  };
  var OPPONENTS = {
    racing: { en: 'Racing Santander',   es: 'Racing de Santander', fr: 'Racing Santander', ar: 'راسينغ سانتاندير' },
    alaves: { en: 'Deportivo Alavés',   es: 'Deportivo Alavés',    fr: 'Alavés',           ar: 'ألافيس' }
  };
  var COMPS = {
    laliga: { en: 'La Liga', es: 'LaLiga', fr: 'Liga', ar: 'الدوري الإسباني' }
  };
  var VENUES = {
    sardinero: { en: 'El Sardinero, Santander',     es: 'El Sardinero, Santander',     fr: 'El Sardinero, Santander',     ar: 'إل ساردينيرو، سانتاندير' },
    campnou:   { en: 'Spotify Camp Nou, Barcelona', es: 'Spotify Camp Nou, Barcelona', fr: 'Spotify Camp Nou, Barcelone', ar: 'سبوتيفاي كامب نو، برشلونة' }
  };

  // [label per language, IANA time zone]
  var ZONES = [
    [{ en: 'Tunisia', es: 'Túnez', fr: 'Tunisie', ar: 'تونس' }, 'Africa/Tunis'],
    [{ en: 'Algeria', es: 'Argelia', fr: 'Algérie', ar: 'الجزائر' }, 'Africa/Algiers'],
    [{ en: 'Morocco', es: 'Marruecos', fr: 'Maroc', ar: 'المغرب' }, 'Africa/Casablanca'],
    [{ en: 'Libya', es: 'Libia', fr: 'Libye', ar: 'ليبيا' }, 'Africa/Tripoli'],
    [{ en: 'Egypt', es: 'Egipto', fr: 'Égypte', ar: 'مصر' }, 'Africa/Cairo'],
    [{ en: 'Saudi Arabia', es: 'Arabia Saudí', fr: 'Arabie saoudite', ar: 'السعودية' }, 'Asia/Riyadh'],
    [{ en: 'UAE', es: 'Emiratos Árabes', fr: 'Émirats arabes unis', ar: 'الإمارات' }, 'Asia/Dubai'],
    [{ en: 'Spain', es: 'España', fr: 'Espagne', ar: 'إسبانيا' }, 'Europe/Madrid'],
    [{ en: 'France', es: 'Francia', fr: 'France', ar: 'فرنسا' }, 'Europe/Paris'],
    [{ en: 'United Kingdom', es: 'Reino Unido', fr: 'Royaume-Uni', ar: 'المملكة المتحدة' }, 'Europe/London'],
    [{ en: 'New York (ET)', es: 'Nueva York (ET)', fr: 'New York (ET)', ar: 'نيويورك (ET)' }, 'America/New_York'],
    [{ en: 'Los Angeles (PT)', es: 'Los Ángeles (PT)', fr: 'Los Angeles (PT)', ar: 'لوس أنجلوس (PT)' }, 'America/Los_Angeles'],
    [{ en: 'Mexico City', es: 'Ciudad de México', fr: 'Mexico', ar: 'مكسيكو سيتي' }, 'America/Mexico_City']
  ];

  var I18N = {
    en: {
      locale: 'en-GB', vs: 'vs', next: 'Next match', spainTime: 'Spain time', matchday: 'Matchday',
      lComp: 'Competition', lDate: 'Date', lKick: 'Kick-off', lVenue: 'Venue', home: 'Home', away: 'Away',
      local: 'In your local time:', d: 'Days', h: 'Hours', m: 'Mins', s: 'Secs',
      live: 'Kick-off has passed — check the broadcaster for live coverage.',
      done: 'This match has been played. The next fixture will be added soon.',
      h2: 'Where to watch the next match',
      sub: 'Kick-off time, TV channels and live streams for the next game of Real Madrid and Barcelona.',
      tableTitle: 'Kick-off time in your country', country: 'Country / city', dayShift: ' (+1 day)', dayShiftNeg: ' (−1 day)',
      tableNote: 'Times are worked out from the Spain kick-off using each place’s clocks on the match day (Europe’s clocks went back on 25 October; the US clocks go back on 1 November). Always double-check on the broadcaster’s page.',
      chTitle: 'TV channels and live streams by country',
      chSub: 'Both matches are La Liga games, so the same rights holders show them. LaLiga rights are sold country by country.',
      regions: [
        { tag: 'Middle East & North Africa', name: 'beIN Sports', text: 'beIN Sports holds the La Liga rights across the MENA region. The channel number (beIN Sports 1, 2, 3…) changes from match to match, so check beIN’s schedule on match day.', items: ['Needs a beIN subscription', 'Stream on beIN SPORTS CONNECT if your package includes it'] },
        { tag: 'France', name: 'Disney+ (ESPN section)', text: 'Disney+ shows all 380 La Liga matches in France in its ESPN section, with French commentary and no separate sports add-on.', items: ['Smart TV, internet box or mobile app'] },
        { tag: 'United States', name: 'ESPN+ · ESPN Deportes', text: 'La Liga is on ESPN+ in the US, and some matches are also on ESPN Deportes. The exact listing is on ESPN’s schedule.', items: ['English and Spanish commentary on ESPN+'] },
        { tag: 'United Kingdom', name: 'Premier Sports', text: 'Premier Sports shows La Liga in the UK. Stream it on Premier Sports Player.', items: ['Ireland: check your TV provider'] },
        { tag: 'Spain', name: 'DAZN · Movistar Plus+', text: 'In Spain each matchday is split between DAZN and Movistar Plus+ (Movistar LaLiga). The channel for each match is announced a few days before. Orange TV carries both.', items: ['Not on free-to-air TV'] },
        { tag: 'Everywhere else', name: 'Check your local rights holder', text: 'Use LaLiga’s official website or your TV provider’s guide to find the channel in your country.', items: ['Official broadcasters only — unofficial streams are often unreliable and illegal'] }
      ],
      note: 'Last checked {date}. Kick-off times and channels can change — confirm on the official broadcaster’s schedule before kick-off. We do not stream matches.'
    },
    es: {
      locale: 'es-ES', vs: 'vs', next: 'Próximo partido', spainTime: 'hora de España', matchday: 'Jornada',
      lComp: 'Competición', lDate: 'Fecha', lKick: 'Hora', lVenue: 'Estadio', home: 'Local', away: 'Visitante',
      local: 'En tu hora local:', d: 'Días', h: 'Horas', m: 'Min', s: 'Seg',
      live: 'El partido ya ha empezado — consulta la emisora para verlo en directo.',
      done: 'Este partido ya se ha jugado. Añadiremos el siguiente enseguida.',
      h2: 'Dónde ver el próximo partido',
      sub: 'Hora, canales de TV y streaming del próximo partido del Real Madrid y del Barcelona.',
      tableTitle: 'Hora del partido en tu país', country: 'País / ciudad', dayShift: ' (+1 día)', dayShiftNeg: ' (−1 día)',
      tableNote: 'Las horas se calculan a partir de la hora de España con los relojes de cada lugar el día del partido (Europa atrasó el reloj el 25 de octubre; EE. UU. lo atrasa el 1 de noviembre). Confírmalo siempre en la web de la emisora.',
      chTitle: 'Canales de TV y streaming por país',
      chSub: 'Los dos partidos son de LaLiga, así que los emiten los mismos titulares de derechos. LaLiga vende sus derechos país por país.',
      regions: [
        { tag: 'Oriente Medio y norte de África', name: 'beIN Sports', text: 'beIN Sports tiene los derechos de LaLiga en toda la región MENA. El número del canal (beIN Sports 1, 2, 3…) cambia según el partido: consulta la parrilla de beIN el día del encuentro.', items: ['Necesitas una suscripción a beIN', 'Streaming en beIN SPORTS CONNECT si tu paquete lo incluye'] },
        { tag: 'Francia', name: 'Disney+ (sección ESPN)', text: 'Disney+ emite los 380 partidos de LaLiga en Francia en su sección ESPN, con comentarios en francés y sin paquete deportivo aparte.', items: ['Smart TV, router de operador o app móvil'] },
        { tag: 'Estados Unidos', name: 'ESPN+ · ESPN Deportes', text: 'LaLiga está en ESPN+ en EE. UU., y algunos partidos también salen en ESPN Deportes. El listado exacto está en la programación de ESPN.', items: ['Comentarios en inglés y en español en ESPN+'] },
        { tag: 'Reino Unido', name: 'Premier Sports', text: 'Premier Sports emite LaLiga en el Reino Unido. Puedes verlo en Premier Sports Player.', items: ['Irlanda: consulta a tu operador de TV'] },
        { tag: 'España', name: 'DAZN · Movistar Plus+', text: 'En España cada jornada se reparte entre DAZN y Movistar Plus+ (Movistar LaLiga). El canal de cada partido se anuncia unos días antes. Orange TV incluye ambos.', items: ['No se emite en abierto'] },
        { tag: 'Resto del mundo', name: 'Consulta al titular de derechos local', text: 'Usa la web oficial de LaLiga o la guía de tu operador de TV para encontrar el canal en tu país.', items: ['Solo emisoras oficiales: los streams no oficiales suelen ser poco fiables e ilegales'] }
      ],
      note: 'Última comprobación: {date}. Las horas y los canales pueden cambiar — confírmalos en la programación de la emisora oficial antes del inicio. No emitimos partidos.'
    },
    fr: {
      locale: 'fr-FR', vs: '–', next: 'Prochain match', spainTime: 'heure d’Espagne', matchday: 'Journée',
      lComp: 'Compétition', lDate: 'Date', lKick: 'Coup d’envoi', lVenue: 'Stade', home: 'Domicile', away: 'Extérieur',
      local: 'À votre heure locale :', d: 'Jours', h: 'Heures', m: 'Min', s: 'Sec',
      live: 'Le match a commencé — consultez le diffuseur pour le suivre en direct.',
      done: 'Ce match a été joué. Le prochain sera ajouté très bientôt.',
      h2: 'Où regarder le prochain match',
      sub: 'Heure du coup d’envoi, chaînes TV et streaming du prochain match du Real Madrid et de Barcelone.',
      tableTitle: 'L’heure du coup d’envoi dans votre pays', country: 'Pays / ville', dayShift: ' (+1 jour)', dayShiftNeg: ' (−1 jour)',
      tableNote: 'Les horaires sont calculés à partir de l’heure espagnole avec les horloges de chaque lieu le jour du match (l’Europe a reculé l’heure le 25 octobre ; les États-Unis la reculent le 1er novembre). Vérifiez toujours sur le site du diffuseur.',
      chTitle: 'Chaînes TV et streaming par pays',
      chSub: 'Les deux matchs sont des matchs de Liga : ce sont donc les mêmes diffuseurs. LaLiga vend ses droits pays par pays.',
      regions: [
        { tag: 'Moyen-Orient et Afrique du Nord', name: 'beIN Sports', text: 'beIN Sports détient les droits de la Liga dans toute la région MENA. Le numéro de la chaîne (beIN Sports 1, 2, 3…) change selon le match : consultez la grille de beIN le jour du match.', items: ['Abonnement beIN nécessaire', 'Streaming sur beIN SPORTS CONNECT si votre abonnement l’inclut'] },
        { tag: 'France', name: 'Disney+ (rubrique ESPN)', text: 'Disney+ diffuse les 380 matchs de Liga en France dans sa rubrique ESPN, avec commentaires en français et sans option sport supplémentaire.', items: ['Smart TV, box internet ou application mobile'] },
        { tag: 'États-Unis', name: 'ESPN+ · ESPN Deportes', text: 'La Liga est sur ESPN+ aux États-Unis, et certains matchs passent aussi sur ESPN Deportes. Le programme exact figure sur le site d’ESPN.', items: ['Commentaires en anglais et en espagnol sur ESPN+'] },
        { tag: 'Royaume-Uni', name: 'Premier Sports', text: 'Premier Sports diffuse la Liga au Royaume-Uni. Streaming sur Premier Sports Player.', items: ['Irlande : vérifiez auprès de votre opérateur TV'] },
        { tag: 'Espagne', name: 'DAZN · Movistar Plus+', text: 'En Espagne, chaque journée est partagée entre DAZN et Movistar Plus+ (Movistar LaLiga). La chaîne de chaque match est annoncée quelques jours avant. Orange TV propose les deux.', items: ['Pas en clair'] },
        { tag: 'Partout ailleurs', name: 'Vérifiez le diffuseur local', text: 'Consultez le site officiel de LaLiga ou le guide de votre opérateur pour trouver la chaîne dans votre pays.', items: ['Diffuseurs officiels uniquement — les streams non officiels sont souvent peu fiables et illégaux'] }
      ],
      note: 'Dernière vérification le {date}. Les horaires et les chaînes peuvent changer — confirmez sur la grille du diffuseur officiel avant le coup d’envoi. Nous ne diffusons pas les matchs.'
    },
    ar: {
      locale: 'ar-u-nu-latn', vs: 'ضد', next: 'المباراة القادمة', spainTime: 'بتوقيت إسبانيا', matchday: 'الجولة',
      lComp: 'المسابقة', lDate: 'التاريخ', lKick: 'موعد المباراة', lVenue: 'الملعب', home: 'على أرضه', away: 'خارج أرضه',
      local: 'بتوقيتك المحلي:', d: 'أيام', h: 'ساعات', m: 'دقائق', s: 'ثوانٍ',
      live: 'انطلقت المباراة — راجع القناة الناقلة للمتابعة المباشرة.',
      done: 'انتهت هذه المباراة. سنضيف المباراة التالية قريبًا.',
      h2: 'أين تشاهد المباراة القادمة',
      sub: 'موعد صافرة البداية والقنوات الناقلة والبث المباشر للمباراة القادمة لريال مدريد وبرشلونة.',
      tableTitle: 'موعد المباراة في بلدك', country: 'البلد / المدينة', dayShift: ' (+1 يوم)', dayShiftNeg: ' (−1 يوم)',
      tableNote: 'تُحسب المواعيد انطلاقًا من توقيت إسبانيا وبحسب ساعة كل بلد يوم المباراة (عادت أوروبا إلى التوقيت الشتوي يوم 25 أكتوبر، وتعود الولايات المتحدة يوم 1 نوفمبر). تأكد دائمًا من موقع القناة الناقلة.',
      chTitle: 'القنوات الناقلة والبث المباشر حسب البلد',
      chSub: 'المباراتان من الدوري الإسباني، لذلك تنقلهما الجهات نفسها. تُباع حقوق الدوري الإسباني لكل بلد على حدة.',
      regions: [
        { tag: 'الشرق الأوسط وشمال إفريقيا', name: 'beIN Sports', text: 'تملك beIN Sports حقوق بث الدوري الإسباني في منطقة الشرق الأوسط وشمال إفريقيا. رقم القناة (beIN Sports 1 أو 2 أو 3…) يختلف من مباراة إلى أخرى، فراجع جدول beIN يوم اللقاء.', items: ['يلزم اشتراك في beIN', 'البث عبر beIN SPORTS CONNECT إن كانت باقتك تتضمنه'] },
        { tag: 'فرنسا', name: 'Disney+', text: 'تبث Disney+ جميع مباريات الدوري الإسباني الـ380 في فرنسا ضمن قسم ESPN، بتعليق فرنسي ودون اشتراك رياضي إضافي.', items: ['تلفاز ذكي أو جهاز الإنترنت أو تطبيق الجوال'] },
        { tag: 'الولايات المتحدة', name: 'ESPN+ · ESPN Deportes', text: 'يُبث الدوري الإسباني على ESPN+ في الولايات المتحدة، وتُعرض بعض المباريات أيضًا على ESPN Deportes. التفاصيل الدقيقة في جدول ESPN.', items: ['تعليق بالإنجليزية والإسبانية على ESPN+'] },
        { tag: 'المملكة المتحدة', name: 'Premier Sports', text: 'تبث Premier Sports الدوري الإسباني في بريطانيا، ويمكن المتابعة عبر Premier Sports Player.', items: ['أيرلندا: راجع مزوّد التلفزيون لديك'] },
        { tag: 'إسبانيا', name: 'DAZN · Movistar Plus+', text: 'في إسبانيا تتوزع مباريات كل جولة بين DAZN وMovistar Plus+ (Movistar LaLiga)، ويُعلن عن قناة كل مباراة قبل أيام من موعدها. وتتيح Orange TV القناتين.', items: ['غير متاحة على القنوات المفتوحة'] },
        { tag: 'بقية العالم', name: 'راجع صاحب الحقوق في بلدك', text: 'استخدم الموقع الرسمي للدوري الإسباني أو دليل مزوّد التلفزيون لديك لمعرفة القناة الناقلة في بلدك.', items: ['القنوات الرسمية فقط — البث غير الرسمي كثيرًا ما يكون غير مستقر وغير قانوني'] }
      ],
      note: 'آخر تحقق: {date}. قد تتغير المواعيد والقنوات — تأكد من جدول القناة الرسمية قبل صافرة البداية. نحن لا ننقل المباريات.'
    }
  };

  var root = document.getElementById('next-matches');
  if (!root || !window.Intl) return;
  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  var T = I18N[lang] || I18N.en;
  var L = I18N[lang] ? lang : 'en';

  function fmt(opts, date, tz) {
    var o = {}; for (var k in opts) o[k] = opts[k];
    if (tz) o.timeZone = tz;
    return new Intl.DateTimeFormat(T.locale, o).format(date);
  }
  var TIME = { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' };
  function dayKey(date, tz) {
    var p = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
    return Date.UTC(+p.slice(0, 4), +p.slice(5, 7) - 1, +p.slice(8, 10));
  }

  var matches = NEXT_MATCHES.teams.map(function (t) {
    var home = TEAMS[t.team][L], opp = OPPONENTS[t.opp][L];
    return {
      t: t, date: new Date(t.kickoff),
      home: t.home ? home : opp, away: t.home ? opp : home,
      team: TEAMS[t.team][L]
    };
  });

  function card(m) {
    var t = m.t, d = m.date;
    var comp = COMPS[t.comp][L] + (t.matchday ? ' · ' + T.matchday + ' ' + t.matchday : '');
    var local = '';
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      local = fmt({ weekday: 'long', day: 'numeric', month: 'long' }, d) + (lang === 'ar' ? '، ' : ', ') + fmt(TIME, d) + (tz ? ' (' + tz + ')' : '');
    } catch (e) {}
    return '<article class="nm-card ' + t.team + '" data-kickoff="' + t.kickoff + '">' +
      '<div class="nm-eyebrow">' + m.team + ' · ' + T.next + '</div>' +
      '<h3 class="nm-title">' + m.home + ' ' + T.vs + ' ' + m.away + '</h3>' +
      '<dl class="nm-meta">' +
        '<dt>' + T.lComp + '</dt><dd>' + comp + '</dd>' +
        '<dt>' + T.lDate + '</dt><dd>' + fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, d, 'Europe/Madrid') + '</dd>' +
        '<dt>' + T.lKick + '</dt><dd><span class="nm-time">' + fmt(TIME, d, 'Europe/Madrid') + '</span> (' + T.spainTime + ')</dd>' +
        '<dt>' + T.lVenue + '</dt><dd>' + VENUES[t.venue][L] + '</dd>' +
      '</dl>' +
      (local ? '<p class="nm-local">' + T.local + ' <strong>' + local + '</strong></p>' : '') +
      '<div class="nm-cd" aria-live="off">' +
        '<div><b class="nm-d">00</b><span>' + T.d + '</span></div><div><b class="nm-h">00</b><span>' + T.h + '</span></div>' +
        '<div><b class="nm-m">00</b><span>' + T.m + '</span></div><div><b class="nm-s">00</b><span>' + T.s + '</span></div>' +
      '</div><p class="nm-status" hidden></p>' +
    '</article>';
  }

  function table() {
    var head = '<tr><th scope="col">' + T.country + '</th>' + matches.map(function (m) {
      return '<th scope="col">' + m.team + '<br><span class="nm-sub">' + fmt({ weekday: 'short', day: 'numeric', month: 'short' }, m.date, 'Europe/Madrid') + '</span></th>';
    }).join('') + '</tr>';
    var rows = ZONES.map(function (z) {
      return '<tr><th scope="row">' + z[0][L] + '</th>' + matches.map(function (m) {
        var s = '';
        try {
          s = fmt(TIME, m.date, z[1]);
          var diff = Math.round((dayKey(m.date, z[1]) - dayKey(m.date, 'Europe/Madrid')) / 864e5);
          if (diff > 0) s += T.dayShift; else if (diff < 0) s += T.dayShiftNeg;
        } catch (e) { s = '—'; }
        return '<td class="t">' + s + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return '<div class="nm-table-wrap"><table class="kick-table"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>';
  }

  function channels() {
    return '<div class="card-grid">' + T.regions.map(function (r) {
      return '<div class="card w-card"><div class="tag">' + r.tag + '</div><h3><bdi>' + r.name + '</bdi></h3><p class="cap">' + r.text + '</p>' +
        '<ul>' + r.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul></div>';
    }).join('') + '</div>';
  }

  var checked = '';
  try { checked = fmt({ day: 'numeric', month: 'long', year: 'numeric' }, new Date(NEXT_MATCHES.checked + 'T12:00:00Z'), 'UTC'); } catch (e) { checked = NEXT_MATCHES.checked; }

  root.innerHTML =
    '<section class="nm-section"><div class="wrap">' +
      '<div class="section-head"><h2>' + T.h2 + '</h2><p>' + T.sub + '</p></div>' +
      '<div class="nm-grid">' + matches.map(card).join('') + '</div>' +
      '<h3 class="nm-h3">' + T.tableTitle + '</h3>' + table() +
      '<p class="note">' + T.tableNote + '</p>' +
    '</div></section>' +
    '<section class="on-paper"><div class="wrap">' +
      '<div class="section-head"><h2>' + T.chTitle + '</h2><p>' + T.chSub + '</p></div>' +
      channels() +
      '<p class="note">' + T.note.replace('{date}', checked) + '</p>' +
    '</div></section>';

  // live countdowns (own timer; does not touch the page's Clásico countdown)
  var cards = [].slice.call(root.querySelectorAll('.nm-card'));
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var now = Date.now();
    cards.forEach(function (c) {
      var k = new Date(c.getAttribute('data-kickoff')).getTime(), diff = k - now;
      var cd = c.querySelector('.nm-cd'), st = c.querySelector('.nm-status');
      if (diff > 0) {
        c.querySelector('.nm-d').textContent = pad(Math.floor(diff / 864e5));
        c.querySelector('.nm-h').textContent = pad(Math.floor(diff % 864e5 / 36e5));
        c.querySelector('.nm-m').textContent = pad(Math.floor(diff % 36e5 / 6e4));
        c.querySelector('.nm-s').textContent = pad(Math.floor(diff % 6e4 / 1e3));
        cd.hidden = false; st.hidden = true;
      } else {
        cd.hidden = true; st.hidden = false;
        st.textContent = (now - k < 3 * 36e5) ? T.live : T.done;
      }
    });
  }
  tick();
  setInterval(tick, 1000);
})();
