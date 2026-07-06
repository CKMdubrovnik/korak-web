(function () {
  const SIGURNOST_LOGO_SVG = `
    <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <circle cx="38" cy="27" r="17" fill="#29235C"/>
      <circle cx="30" cy="29" r="15" fill="#eef1fb"/>
      <circle cx="26" cy="30" r="16" fill="#36A9E1"/>
    </svg>`;

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function renderHero(hero) {
    document.getElementById('heroBadge').textContent = hero.badge;
    const title = document.getElementById('heroTitle');
    title.innerHTML = `${hero.title_line1}<br>${hero.title_line2}<br><span>${hero.title_line3}</span>`;
    document.getElementById('heroLead').textContent = hero.lead;
    document.getElementById('heroCtaPrimary').textContent = hero.cta_primary;
    document.getElementById('heroCtaSecondary').textContent = hero.cta_secondary;

    const cards = document.getElementById('heroCards');
    cards.innerHTML = '';
    (hero.cards || []).forEach(c => {
      cards.appendChild(el('div', 'hero-card', `<div class="icon-circle">${c.icon}</div> ${c.label}`));
    });
  }

  function renderStats(stats) {
    const grid = document.getElementById('statsGrid');
    grid.innerHTML = '';
    (stats || []).forEach(s => {
      grid.appendChild(el('div', 'stat-card', `<div class="num">${s.num}</div><div class="label">${s.label}</div>`));
    });
  }

  function renderAbout(about) {
    document.getElementById('aboutIntro').textContent = about.intro;
    document.getElementById('aboutMission').textContent = about.mission;
    document.getElementById('aboutVision').textContent = about.vision;
    const list = document.getElementById('audienceList');
    list.innerHTML = '';
    (about.audience || []).forEach(item => {
      list.appendChild(el('li', null, item));
    });
  }

  function renderPrograms(programs) {
    const grid = document.getElementById('programsGrid');
    grid.innerHTML = '';
    (programs || []).forEach(p => {
      grid.appendChild(el('div', 'prog-card', `
        <div class="icon-circle">${p.icon}</div>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      `));
    });
  }

  function renderProjects(projects) {
    const wrap = document.getElementById('projectsWrap');
    wrap.innerHTML = '';
    (projects || []).forEach(p => {
      const isSigurnost = p.brand === 'sigurnost';
      const card = el('div', 'project-card' + (isSigurnost ? ' brand-sigurnost' : ''));
      let html = '';
      if (isSigurnost) {
        html += `<div class="proj-logo">${SIGURNOST_LOGO_SVG}<span>${p.badge || ''}</span></div>`;
      }
      html += `<span class="tag">${p.tag}</span><h3>${p.title}</h3><p>${p.desc}</p>`;
      card.innerHTML = html;
      wrap.appendChild(card);
    });
  }

  function renderPartners(partners) {
    const grid = document.getElementById('partnerGrid');
    grid.innerHTML = '';
    (partners || []).forEach(name => {
      grid.appendChild(el('div', 'partner-card', name));
    });
  }

  function renderContact(contact) {
    const card = document.getElementById('contactInfoCard');
    card.innerHTML = `
      <div class="contact-row">
        <span class="icon-circle" style="width:36px;height:36px;font-size:16px;">📍</span>
        <div><strong>Adresa</strong><span>${contact.address_line1}, ${contact.address_line2}</span></div>
      </div>
      <div class="contact-row">
        <span class="icon-circle" style="width:36px;height:36px;font-size:16px;">✉️</span>
        <div><strong>E-mail</strong><span><a href="mailto:${contact.email}">${contact.email}</a></span></div>
      </div>
      <div class="contact-row">
        <span class="icon-circle" style="width:36px;height:36px;font-size:16px;">📞</span>
        <div><strong>Telefon</strong><span><a href="tel:${contact.phone.replace(/\s+/g, '')}">${contact.phone}</a></span></div>
      </div>
      <div class="contact-row">
        <span class="icon-circle" style="width:36px;height:36px;font-size:16px;">🧑‍💼</span>
        <div><strong>Predsjednik udruge</strong><span>${contact.president}</span></div>
      </div>
    `;

    const mapAddress = `${contact.address_line1}, ${contact.address_line2}`;
    document.getElementById('mapAddress').textContent = mapAddress;
    document.getElementById('mapLink').href =
      'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(mapAddress);

    const footerList = document.querySelector('#footerContact ul');
    footerList.innerHTML = `
      <li>${contact.address_line1}</li>
      <li>${contact.address_line2}</li>
      <li><a href="mailto:${contact.email}">${contact.email}</a></li>
      <li><a href="tel:${contact.phone.replace(/\s+/g, '')}">${contact.phone}</a></li>
    `;

    document.querySelector('a[href^="mailto:"].btn-primary') &&
      (document.querySelector('a[href^="mailto:"].btn-primary').href = `mailto:${contact.email}`);
  }

  fetch('content/site.json', { cache: 'no-store' })
    .then(r => r.json())
    .then(data => {
      renderHero(data.hero);
      renderStats(data.stats);
      renderAbout(data.about);
      renderPrograms(data.programs);
      renderProjects(data.projects);
      renderPartners(data.partners);
      renderContact(data.contact);
    })
    .catch(err => console.error('Greška pri učitavanju sadržaja (content/site.json):', err));
})();
