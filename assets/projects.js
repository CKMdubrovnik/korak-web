(function () {
  const FOOT_SVG = `
    <svg width="26" height="26" viewBox="0 0 34 34" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <circle cx="17" cy="21" r="8" fill="none" stroke="#32C25B" stroke-width="3.5"/>
      <circle cx="8" cy="12" r="2.6" fill="#32C25B"/>
      <circle cx="13.5" cy="8.5" r="3" fill="#32C25B"/>
      <circle cx="20" cy="8" r="3" fill="#32C25B"/>
      <circle cx="26" cy="11" r="2.6" fill="#32C25B"/>
    </svg>`;

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function renderIntro(intro) {
    document.getElementById('pageEyebrow').textContent = intro.eyebrow;
    document.getElementById('pageTitle').innerHTML =
      `${intro.title_line1}<br><span>${intro.title_line2}</span>`;
    document.getElementById('pageLead').textContent = intro.lead;
  }

  function renderFlagship(f) {
    const card = document.getElementById('flagshipCard');
    card.innerHTML = `
      <div>
        <span class="tag">${f.tag}</span>
        <h2>${f.title}</h2>
        <p class="flagship-lead">${f.lead}</p>
        <p>${f.desc}</p>
        <div class="flagship-meta">
          <b>Partneri:</b> ${f.partners}<br>
          <b>Vrijednost:</b> ${f.value}
        </div>
      </div>
      <div class="flagship-results">
        <h3>${f.results_title}</h3>
        <ul>${(f.results || []).map(r => `<li>${r}</li>`).join('')}</ul>
      </div>
    `;
  }

  function renderTimeline(data) {
    document.getElementById('timelineTitle').textContent = data.timeline_title;
    document.getElementById('timelineSub').textContent = data.timeline_sub;
    document.getElementById('timelineDisclaimer').textContent = data.disclaimer;

    const wrap = document.getElementById('timelineWrap');
    wrap.innerHTML = '';
    (data.timeline || []).forEach(t => {
      const statusPill = t.status
        ? `<span class="t-pill active">${t.status}</span>` : '';
      const item = el('div', 't-item', `
        <div class="t-foot">${FOOT_SVG}</div>
        <div class="t-card">
          <div class="t-top">
            <span class="t-year">${t.year}</span>
            <span class="t-pill">${t.program}</span>
            ${statusPill}
          </div>
          <h3>${t.title}</h3>
          <p class="t-desc">${t.desc}</p>
          <div class="t-meta">
            <span><b>${t.amount}</b> vrijednost granta</span>
            <span>Uloga: <b>${t.role}</b></span>
          </div>
        </div>
      `);
      wrap.appendChild(item);
    });
  }

  function renderPipeline(data) {
    document.getElementById('pipelineTitle').textContent = data.pipeline_title;
    document.getElementById('pipelineSub').textContent = data.pipeline_sub;
    const grid = document.getElementById('pipelineGrid');
    grid.innerHTML = '';
    (data.pipeline || []).forEach(p => {
      grid.appendChild(el('div', 'pipeline-card', `
        <span class="tag">U pripremi</span>
        <h3>${p.title}</h3>
        <p class="prog">${p.program}</p>
        <p>${p.desc}</p>
      `));
    });
  }

  fetch('content/projects.json', { cache: 'no-store' })
    .then(r => r.json())
    .then(data => {
      renderIntro(data.intro);
      renderFlagship(data.flagship);
      renderTimeline(data);
      renderPipeline(data);
    })
    .catch(err => console.error('Greška pri učitavanju sadržaja (content/projects.json):', err));
})();
