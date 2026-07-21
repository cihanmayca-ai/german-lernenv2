let studyState = {
  level: "a1",
  allWords: [],
  deck: [],
  index: 0,
  flipped: false,
  category: "all"
};

async function loadStudyLevel(level) {
  studyState.level = level;
  studyState.allWords = await loadJSON(`data/vocab_${level}.json`);
  studyState.category = "all";
  populateCategoryFilter();
  buildDeck();
  updateStudyTabs();
}

function populateCategoryFilter() {
  const cats = Array.from(new Set(studyState.allWords.map(w => w.kategori))).sort((a, b) => a.localeCompare(b, "tr"));
  const select = document.getElementById("category-filter");
  select.innerHTML = `<option value="all">Tüm kategoriler (${studyState.allWords.length})</option>` +
    cats.map(c => {
      const count = studyState.allWords.filter(w => w.kategori === c).length;
      return `<option value="${c}">${c} (${count})</option>`;
    }).join("");
  select.value = "all";
}

function buildDeck() {
  studyState.deck = studyState.category === "all"
    ? [...studyState.allWords]
    : studyState.allWords.filter(w => w.kategori === studyState.category);
  studyState.index = 0;
  studyState.flipped = false;
  renderCard();
}

function currentCard() {
  return studyState.deck[studyState.index];
}

function studiedSet() {
  const p = getProgress();
  return new Set(p.study[studyState.level].studiedIds);
}

function renderCard() {
  if (studyState.deck.length === 0) {
    document.getElementById("flashcard").innerHTML = `<div class="flashcard-face front"><div class="flashcard-word">Bu kategoride kelime yok</div></div>`;
    return;
  }
  const word = currentCard();
  const learned = studiedSet().has(word.id);

  document.getElementById("flashcard").classList.toggle("flipped", studyState.flipped);
  document.getElementById("card-front-word").textContent = word.de;
  document.getElementById("card-front-cat").textContent = word.kategori;
  document.getElementById("card-back-word").textContent = word.tr;
  document.getElementById("card-back-cat").textContent = word.kategori;

  document.getElementById("study-counter").textContent =
    `Kart ${studyState.index + 1} / ${studyState.deck.length}`;

  const markBtn = document.getElementById("mark-learned-btn");
  markBtn.classList.toggle("active", learned);
  markBtn.textContent = learned ? "✓ Öğrendim" : "Öğrendim olarak işaretle";

  updateProgressLine();
}

function updateProgressLine() {
  const studied = studiedSet();
  const inDeck = studyState.deck.filter(w => studied.has(w.id)).length;
  const totalStudied = studied.size;
  document.getElementById("study-progress-line").textContent =
    `Bu listede: ${inDeck}/${studyState.deck.length} öğrenildi  ·  Toplam ${studyState.level.toUpperCase()}: ${totalStudied}/${studyState.allWords.length} öğrenildi`;
}

function flipCard() {
  if (studyState.deck.length === 0) return;
  studyState.flipped = !studyState.flipped;
  document.getElementById("flashcard").classList.toggle("flipped", studyState.flipped);
}

function goNext() {
  if (studyState.deck.length === 0) return;
  studyState.index = (studyState.index + 1) % studyState.deck.length;
  studyState.flipped = false;
  renderCard();
}

function goPrev() {
  if (studyState.deck.length === 0) return;
  studyState.index = (studyState.index - 1 + studyState.deck.length) % studyState.deck.length;
  studyState.flipped = false;
  renderCard();
}

function toggleLearned() {
  if (studyState.deck.length === 0) return;
  const word = currentCard();
  const p = getProgress();
  const list = p.study[studyState.level].studiedIds;
  const pos = list.indexOf(word.id);
  if (pos === -1) list.push(word.id);
  else list.splice(pos, 1);
  setProgress(p);
  renderCard();
}

function updateStudyTabs() {
  document.querySelectorAll(".level-tabs button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.level === studyState.level);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".level-tabs button").forEach(btn => {
    btn.addEventListener("click", () => loadStudyLevel(btn.dataset.level));
  });
  document.getElementById("category-filter").addEventListener("change", (e) => {
    studyState.category = e.target.value;
    buildDeck();
  });
  document.getElementById("flashcard").addEventListener("click", flipCard);
  document.getElementById("prev-btn").addEventListener("click", (e) => { e.stopPropagation(); goPrev(); });
  document.getElementById("next-btn").addEventListener("click", (e) => { e.stopPropagation(); goNext(); });
  document.getElementById("mark-learned-btn").addEventListener("click", (e) => { e.stopPropagation(); toggleLearned(); });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === " ") { e.preventDefault(); flipCard(); }
  });

  loadStudyLevel("a1");
});
