// ============ Ortak yapı: gezinme, ilerleme takibi (localStorage) ============

const NAV_ITEMS = [
  { href: "index.html", label: "Pasaport" },
  { href: "study.html", label: "Kelime Çalış" },
  { href: "vocab.html", label: "Kelime Testi" },
  { href: "grammar.html", label: "Gramer" },
  { href: "quiz.html", label: "Quiz" }
];

function currentPage() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  return path;
}

function renderHeader() {
  const host = document.getElementById("site-header");
  if (!host) return;
  const page = currentPage();
  const navHtml = NAV_ITEMS.map(item => {
    const active = item.href === page ? " active" : "";
    return `<a href="${item.href}" class="${active.trim()}">${item.label}</a>`;
  }).join("");
  host.innerHTML = `
    <div class="header-inner">
      <a class="brand" href="index.html">
        <span class="brand-mark">DE</span>
        <span class="brand-text">Almanca Pasaportu<small>A1 → A2 hazırlık</small></span>
      </a>
      <nav class="main-nav">${navHtml}</nav>
    </div>
  `;
}

function renderFooter() {
  const host = document.getElementById("site-footer");
  if (!host) return;
  host.innerHTML = `Almanca Pasaportu — kendi hazırladığınız pratik materyalidir, resmi Goethe/telc sınav içeriği değildir.`;
}

// ---------- Progress storage ----------
const STORAGE_KEY = "gl_progress_v1";

function defaultProgress() {
  return {
    vocab: {
      a1: { correct: 0, total: 0, seen: [] },
      a2: { correct: 0, total: 0, seen: [] }
    },
    study: {
      a1: { studiedIds: [] },
      a2: { studiedIds: [] }
    },
    grammar: {
      a1: { read: [] },
      a2: { read: [] }
    },
    quiz: {
      a1: { bestScore: 0, attempts: 0, lastScore: 0 },
      a2: { bestScore: 0, attempts: 0, lastScore: 0 }
    }
  };
}

function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    // shallow-merge with defaults in case of schema growth
    const def = defaultProgress();
    return {
      vocab: { a1: { ...def.vocab.a1, ...parsed.vocab?.a1 }, a2: { ...def.vocab.a2, ...parsed.vocab?.a2 } },
      study: { a1: { ...def.study.a1, ...parsed.study?.a1 }, a2: { ...def.study.a2, ...parsed.study?.a2 } },
      grammar: { a1: { ...def.grammar.a1, ...parsed.grammar?.a1 }, a2: { ...def.grammar.a2, ...parsed.grammar?.a2 } },
      quiz: { a1: { ...def.quiz.a1, ...parsed.quiz?.a1 }, a2: { ...def.quiz.a2, ...parsed.quiz?.a2 } }
    };
  } catch (e) {
    return defaultProgress();
  }
}

function setProgress(p) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch (e) {
    console.error("İlerleme kaydedilemedi:", e);
  }
}

function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

// Basit fetch-json yardımcı fonksiyonu
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Veri yüklenemedi: " + path);
  return res.json();
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
