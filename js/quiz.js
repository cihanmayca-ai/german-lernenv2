let quizState = {
  level: "a1",
  questions: [],
  order: [],
  index: 0,
  correctCount: 0,
  answered: false
};

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function loadQuizLevel(level) {
  quizState.level = level;
  quizState.questions = await loadJSON(`data/quiz_${level}.json`);
  updateQuizTabs();
  startQuiz();
}

function startQuiz() {
  quizState.order = shuffleArr(quizState.questions.map((_, i) => i));
  quizState.index = 0;
  quizState.correctCount = 0;
  quizState.answered = false;
  document.getElementById("quiz-result").style.display = "none";
  document.getElementById("quiz-question-wrap").style.display = "block";
  renderQuestion();
}

function currentQuestion() {
  return quizState.questions[quizState.order[quizState.index]];
}

function renderQuestion() {
  const q = currentQuestion();
  document.getElementById("quiz-progress").textContent =
    `Soru ${quizState.index + 1} / ${quizState.questions.length}`;
  document.getElementById("quiz-question").textContent = q.soru;

  const optsHost = document.getElementById("quiz-options");
  optsHost.innerHTML = q.secenekler.map((opt, i) =>
    `<button class="quiz-option" data-i="${i}">${opt}</button>`
  ).join("");

  optsHost.querySelectorAll(".quiz-option").forEach(btn => {
    btn.addEventListener("click", () => selectOption(parseInt(btn.dataset.i, 10)));
  });

  const explain = document.getElementById("quiz-explain");
  explain.className = "quiz-explain";
  explain.textContent = "";
  quizState.answered = false;
}

function selectOption(i) {
  if (quizState.answered) return;
  quizState.answered = true;
  const q = currentQuestion();
  const isCorrect = i === q.dogru;
  if (isCorrect) quizState.correctCount++;

  document.querySelectorAll(".quiz-option").forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.dogru) btn.classList.add("correct");
    else if (idx === i) btn.classList.add("wrong");
  });

  const explain = document.getElementById("quiz-explain");
  explain.className = "quiz-explain show";
  explain.textContent = q.aciklama;

  const nextBtn = document.getElementById("quiz-next-btn");
  nextBtn.style.display = "inline-flex";
  nextBtn.textContent = (quizState.index + 1 >= quizState.questions.length) ? "Sonuçları Gör →" : "Sonraki Soru →";
}

function nextQuestion() {
  document.getElementById("quiz-next-btn").style.display = "none";
  quizState.index++;
  if (quizState.index >= quizState.order.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

function showResult() {
  document.getElementById("quiz-question-wrap").style.display = "none";
  const total = quizState.questions.length;
  const score = Math.round((quizState.correctCount / total) * 100);

  const p = getProgress();
  const qp = p.quiz[quizState.level];
  qp.attempts++;
  qp.lastScore = score;
  qp.bestScore = Math.max(qp.bestScore, score);
  setProgress(p);

  const passed = score >= 80;
  const resHost = document.getElementById("quiz-result");
  resHost.style.display = "block";
  resHost.innerHTML = `
    <div class="stamp big-stamp ${passed ? "" : "locked"}">
      <span class="stamp-level">${score}%</span>
      <span class="stamp-label">${quizState.level.toUpperCase()}</span>
    </div>
    <h2>${quizState.correctCount} / ${total} doğru</h2>
    <p style="color:var(--ink-soft); margin-top:8px;">
      ${passed
        ? "Tebrikler, bu seviye için hedeflenen %80 barajını geçtiniz."
        : "%80 barajına henüz ulaşmadınız — tekrar deneyerek pratik yapabilirsiniz."}
    </p>
    <div class="btn-row">
      <button class="btn" id="retry-btn">Tekrar Dene</button>
      <a class="btn secondary" href="index.html">Pasaporta Dön</a>
    </div>
  `;
  document.getElementById("retry-btn").addEventListener("click", startQuiz);
}

function updateQuizTabs() {
  document.querySelectorAll(".level-tabs button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.level === quizState.level);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".level-tabs button").forEach(btn => {
    btn.addEventListener("click", () => loadQuizLevel(btn.dataset.level));
  });
  document.getElementById("quiz-next-btn").addEventListener("click", nextQuestion);
  loadQuizLevel("a1");
});
