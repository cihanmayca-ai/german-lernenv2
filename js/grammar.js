let grammarState = { level: "a1", lessons: [] };

async function loadGrammarLevel(level) {
  grammarState.level = level;
  grammarState.lessons = await loadJSON(`data/grammar_${level}.json`);
  renderGrammar();
  updateGrammarTabs();
}

function renderGrammar() {
  const host = document.getElementById("grammar-list");
  const p = getProgress();
  const readSet = new Set(p.grammar[grammarState.level].read);

  host.innerHTML = grammarState.lessons.map((lesson, idx) => {
    const tableRows = (lesson.tablo || [])
      .map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`)
      .join("");
    const notes = (lesson.notlar || [])
      .map(n => `<li>${n}</li>`)
      .join("");
    const examples = (lesson.ornekler || [])
      .map(ex => `<div class="example-line"><span class="de">${ex.de}</span><span class="tr">${ex.tr}</span></div>`)
      .join("");
    const isRead = readSet.has(idx);

    return `
      <details class="grammar-item" data-idx="${idx}">
        <summary>${lesson.baslik} ${isRead ? '<span class="stamp-sm" style="margin-left:auto;">✓</span>' : ""}</summary>
        <div class="grammar-body">
          <p>${lesson.aciklama}</p>
          ${tableRows ? `<table class="grammar-table"><tbody>${tableRows}</tbody></table>` : ""}
          ${notes ? `<ul class="grammar-notes">${notes}</ul>` : ""}
          ${examples ? `<div class="grammar-examples">${examples}</div>` : ""}
        </div>
      </details>
    `;
  }).join("");

  host.querySelectorAll(".grammar-item").forEach(item => {
    item.addEventListener("toggle", () => {
      if (item.open) markLessonRead(parseInt(item.dataset.idx, 10));
    });
  });
}

function markLessonRead(idx) {
  const p = getProgress();
  const list = p.grammar[grammarState.level].read;
  if (!list.includes(idx)) {
    list.push(idx);
    setProgress(p);
    renderGrammar();
  }
}

function updateGrammarTabs() {
  document.querySelectorAll(".level-tabs button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.level === grammarState.level);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".level-tabs button").forEach(btn => {
    btn.addEventListener("click", () => loadGrammarLevel(btn.dataset.level));
  });
  loadGrammarLevel("a1");
});
