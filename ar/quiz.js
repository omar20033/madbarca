document.addEventListener('DOMContentLoaded', function () {
  var qEl = document.getElementById('quiz-questions');
  if (!qEl || typeof QUIZ_QUESTIONS === 'undefined') return;

  var qTextEl = document.getElementById('quiz-q-text');
  var optsEl = document.getElementById('quiz-opts');
  var explainEl = document.getElementById('quiz-explain');
  var nextBtn = document.getElementById('quiz-next-btn');
  var progressLabel = document.getElementById('quiz-progress-label');
  var scoreLabel = document.getElementById('quiz-score-label');
  var barFill = document.getElementById('quiz-bar-fill');
  var resultEl = document.getElementById('quiz-result');
  var finalScoreEl = document.getElementById('quiz-final-score');
  var verdictEl = document.getElementById('quiz-verdict');
  var retryBtn = document.getElementById('quiz-retry-btn');

  var order = [];
  var current = 0;
  var score = 0;
  var answered = false;
  var letters = ['أ', 'ب', 'ج', 'د'];

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function verdictFor(pct) {
    if (pct === 100) return 'نتيجة كاملة — خبير حقيقي.';
    if (pct >= 75) return 'معرفة قوية بالمنافسة.';
    if (pct >= 50) return 'جيد، لكن هناك مجال للتحسّن.';
    if (pct >= 25) return 'حان وقت مراجعة التاريخ.';
    return 'عُد إلى الأسئلة الشائعة.';
  }

  function renderQuestion() {
    answered = false;
    var total = QUIZ_QUESTIONS.length;
    var item = QUIZ_QUESTIONS[order[current]];

    progressLabel.textContent = 'السؤال ' + (current + 1) + ' من ' + total;
    scoreLabel.textContent = 'النقاط: ' + score;
    barFill.style.width = ((current) / total * 100) + '%';

    qTextEl.textContent = item.q;
    explainEl.classList.remove('show');
    explainEl.textContent = '';
    nextBtn.classList.remove('show');
    nextBtn.textContent = (current === total - 1) ? 'عرض النتيجة ←' : 'السؤال التالي ←';

    optsEl.innerHTML = '';
    item.opts.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-opt';
      btn.innerHTML = '<span class="k">' + letters[i] + '</span><span>' + opt + '</span>';
      btn.addEventListener('click', function () { handleAnswer(i, btn); });
      optsEl.appendChild(btn);
    });
  }

  function handleAnswer(i, btnEl) {
    if (answered) return;
    answered = true;
    var item = QUIZ_QUESTIONS[order[current]];
    var allBtns = optsEl.querySelectorAll('.quiz-opt');
    allBtns.forEach(function (b, idx) {
      b.disabled = true;
      if (idx === item.correct) b.classList.add('correct');
      else if (idx === i && i !== item.correct) b.classList.add('wrong');
    });
    if (i === item.correct) {
      score++;
      scoreLabel.textContent = 'النقاط: ' + score;
    }
    explainEl.innerHTML = '<strong>' + (i === item.correct ? 'صحيح. ' : 'ليس تمامًا. ') + '</strong>' + item.explain;
    explainEl.classList.add('show');
    nextBtn.classList.add('show');
  }

  function showResult() {
    qEl.classList.add('done');
    resultEl.classList.add('show');
    finalScoreEl.textContent = score;
    var pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    verdictEl.textContent = verdictFor(pct);
  }

  function start() {
    order = shuffle(QUIZ_QUESTIONS.map(function (_, i) { return i; }));
    current = 0;
    score = 0;
    qEl.classList.remove('done');
    resultEl.classList.remove('show');
    renderQuestion();
  }

  nextBtn.addEventListener('click', function () {
    current++;
    if (current >= order.length) {
      barFill.style.width = '100%';
      showResult();
    } else {
      renderQuestion();
    }
  });

  if (retryBtn) retryBtn.addEventListener('click', start);

  start();
});
