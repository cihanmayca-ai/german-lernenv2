let vocabState = {
  level: "a1",
  allWords: [],
  words: [],
  order: [],
  index: 0,
  sessionCorrect: 0,
  sessionTotal: 0,
  answered: false,
  studiedOnly: false
};

function normalize(str) {
  return str.toLowerCase().trim().replace(/\s+/g, " ");
}

function acceptableAnswers(trField) {
  const variants = new Set();
  trField.split(/[\/,]/).forEach(part => {
    const core = part.replace(/\(.*?\)/g, "").trim();
    if (core) variants.add(normalize(core));
  });
  variants.add(normalize(trField));
  return variants;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function loadVocabLevel(level) {
  vocabState.level = level;
  vocabState.allWords = await loadJSON(`data/vocab_${level}.json`);
  applyStudiedFilter();
  updateTabs();
  updateStudiedToggleLabel();
}

function applyStudiedFilter() {
  if (vocabState.studiedOnly) {
    const p = getProgress();
    const studiedIds = new Set(p.study[vocabState.level].studiedIds);
    vocabState.words = vocabState.allWords.filter(w => studiedIds.has(w.id));
  } else {
    vocabState.words = vocabState.allWords;
  }

  vocabState.order = shuffle(vocabState.words.map((_, i) => i));
  vocabState.index = 0;
  vocabState.sessionCorrect = 0;
  vocabState.sessionTotal = 0;
  vocabState.answered = false;

  if (vocabState.words.length === 0) {
    document.getElementById("vocab-counter").textContent = "Bu filtrede kelime yok";
    document.getElementById("vocab-category").textContent = "";
    document.getElementById("vocab-word").textContent = "Önce Kelime Çalış sayfasından birkaç kelime işaretleyin";
    document.getElementById("vocab-input").disabled = true;
    document.getElementById("check-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("vocab-feedback").className = "feedback";
    updateScoreStrip();
    return;
  }
  document.getElementById("vocab-input").disabled = false;
  renderVocabCard();
}

function updateStudiedToggleLabel() {
  const p = getProgress();
  const count = p.study[vocabState.level].studiedIds.length;
  document.getElementById("studied-only-count").textContent = `(${count} kelime işaretli)`;
}

function currentWord() {
  return vocabState.words[vocabState.order[vocabState.index]];
}

function renderVocabCard() {
  const word = currentWord();
  document.getElementById("vocab-counter").textContent =
    `Kelime ${vocabState.index + 1} / ${vocabState.words.length}`;
  document.getElementById("vocab-category").textContent = word.kategori;
  document.getElementById("vocab-word").textContent = word.de;
  const input = document.getElementById("vocab-input");
  input.value = "";
  input.disabled = false;
  input.focus();
  const fb = document.getElementById("vocab-feedback");
  fb.className = "feedback";
  fb.textContent = "";
  document.getElementById("check-btn").style.display = "inline-flex";
  document.getElementById("next-btn").style.display = "none";
  updateScoreStrip();
}

function updateScoreStrip() {
  document.getElementById("vocab-score").innerHTML =
    `Bu oturum: <strong>${vocabState.sessionCorrect}/${vocabState.sessionTotal}</strong>`;
}

function checkAnswer() {
  if (vocabState.answered) return;
  const word = currentWord();
  const input = document.getElementById("vocab-input");
  const userAnswer = normalize(input.value);
  const accepted = acceptableAnswers(word.tr);
  const isCorrect = accepted.has(userAnswer) && userAnswer.length > 0;

  vocabState.answered = true;
  vocabState.sessionTotal++;
  if (isCorrect) vocabState.sessionCorrect++;

  const p = getProgress();
  p.vocab[vocabState.level].total++;
  if (isCorrect) p.vocab[vocabState.level].correct++;
  setProgress(p);

  const fb = document.getElementById("vocab-feedback");
  fb.className = "feedback show " + (isCorrect ? "correct" : "wrong");
  fb.innerHTML = isCorrect
    ? `<span class="stamp-sm" style="margin-right:8px;">✓</span> Doğru! <strong>${word.de}</strong> = ${word.tr}`
    : `Doğrusu: <strong>${word.tr}</strong> (senin cevabın: "${input.value || "—"}")`;

  input.disabled = true;
  document.getElementById("check-btn").style.display = "none";
  document.getElementById("next-btn").style.display = "inline-flex";
  updateScoreStrip();
}

function nextWord() {
  vocabState.index++;
  vocabState.answered = false;
  if (vocabState.index >= vocabState.order.length) {
    vocabState.order = shuffle(vocabState.words.map((_, i) => i));
    vocabState.index = 0;
  }
  renderVocabCard();
}

function updateTabs() {
  document.querySelectorAll(".level-tabs button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.level === vocabState.level);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".level-tabs button").forEach(btn => {
    btn.addEventListener("click", () => loadVocabLevel(btn.dataset.level));
  });
  document.getElementById("studied-only-toggle").addEventListener("change", (e) => {
    vocabState.studiedOnly = e.target.checked;
    applyStudiedFilter();
  });
  document.getElementById("check-btn").addEventListener("click", checkAnswer);
  document.getElementById("next-btn").addEventListener("click", nextWord);
  document.getElementById("vocab-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (!vocabState.answered) checkAnswer();
      else nextWord();
    }
  });
  loadVocabLevel("a1");
});
