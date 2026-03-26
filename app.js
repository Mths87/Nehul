/* ============================================
   NEHUL – Museu Digital
   app.js — lógica da aplicação
   ============================================ */

// ── Estado global ─────────────────────────────────────────────────────────────

let allProjects   = [];
let currentFilter = 'all';
let isAdmin       = false;

// ── Admin auth ────────────────────────────────────────────────────────────────

function initApp() {
  isAdmin = localStorage.getItem('nehulAdminAuth') === 'true';
  updateAdminVisibility();
}

function updateAdminVisibility() {
  if (!isAdmin) return;

  const desktopNav = document.getElementById('desktop-nav');
  const mobileMenu = document.getElementById('mobile-menu');

  desktopNav.innerHTML += `
    <span class="nav-link" onclick="showSection('admin')" id="nav-admin" style="background:rgba(82,183,136,0.2);">
      <i data-lucide="lock" style="width:13px;height:13px;display:inline;vertical-align:middle;margin-right:3px;"></i>Admin
    </span>`;

  mobileMenu.innerHTML += `
    <span class="mobile-nav-link" onclick="showSection('admin');toggleMobileMenu()">✓ Admin</span>`;

  lucide.createIcons();
}

function promptAdminAuth() {
  if (isAdmin) {
    isAdmin = false;
    localStorage.removeItem('nehulAdminAuth');
    location.reload();
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h2 style="color:#fff;font-family:'Source Serif 4',serif;margin:0;">
          <i data-lucide="lock" style="display:inline;width:18px;height:18px;margin-right:8px;vertical-align:middle;"></i>
          Acesso Administrativo
        </h2>
      </div>
      <div style="padding:1.75rem;">
        <label style="display:block;font-size:0.82rem;font-weight:600;color:var(--green-dark);margin-bottom:0.5rem;">Digite a senha de admin:</label>
        <input id="admin-password" type="password" class="form-input" placeholder="Senha" onkeypress="if(event.key==='Enter')checkAdminPassword()">
        <div style="display:flex;gap:0.75rem;margin-top:1.25rem;">
          <button onclick="checkAdminPassword()" class="btn-primary">
            <i data-lucide="unlock" style="width:15px;height:15px;"></i> Acessar
          </button>
          <button onclick="this.closest('.modal-overlay').remove()" class="btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>`;

  document.body.appendChild(modal);
  document.getElementById('admin-password').focus();
  modal.addEventListener('click', function (e) { if (e.target === this) this.remove(); });
  lucide.createIcons();
}

function checkAdminPassword() {
  const pwd = document.getElementById('admin-password').value;
  if (pwd === ADMIN_PASSWORD) {
    isAdmin = true;
    localStorage.setItem('nehulAdminAuth', 'true');
    document.querySelector('.modal-overlay').remove();
    location.reload();
  } else {
    showToast('Senha incorreta!', true);
  }
}

// ── Navegação (SPA) ───────────────────────────────────────────────────────────

function showSection(name) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('active');
  const navEl = document.getElementById('nav-' + name);
  if (navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn  = document.getElementById('hamburger-btn');
  const isOpen = menu.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen);
}

// ── Filtros de projetos ───────────────────────────────────────────────────────

function setProjectFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  const tab = document.getElementById('tab-' + filter);
  if (tab) tab.classList.add('active');
  renderProjectsGrid();
}

function filterProjects() {
  renderProjectsGrid();
}

// ── Helpers de badge/cor ──────────────────────────────────────────────────────

function getBadge(status) {
  const map = {
    memorial:  { cls: 'badge-memorial',  label: '📚 Memorial' },
    andamento: { cls: 'badge-ongoing',   label: '🔬 Em Andamento' },
    realizado: { cls: 'badge-completed', label: '✅ Realizado' },
    futuro:    { cls: 'badge-future',    label: '🚀 Futuro' }
  };
  return map[status] || { cls: 'badge-ongoing', label: status };
}

function getCardAccent(status) {
  const map = { memorial: '#c0272d', andamento: '#004831', realizado: '#1e3a5f', futuro: '#78350f' };
  return map[status] || '#004831';
}

function escHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Criação de card de projeto ────────────────────────────────────────────────

function createProjectCard(p, showEdit) {
  const badge  = getBadge(p.status);
  const accent = getCardAccent(p.status);
  const card   = document.createElement('div');
  card.className = 'project-card';
  card.setAttribute('role', 'listitem');
  card.dataset.projectId = p.__backendId;

  card.innerHTML = `
    <div style="height:6px;background:${accent};"></div>
    <div style="padding:1.25rem;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;margin-bottom:0.75rem;">
        <span class="status-badge ${badge.cls}">${badge.label}</span>
        ${p.year ? `<span style="font-size:0.75rem;color:#9ca3af;font-weight:600;">${p.year}</span>` : ''}
      </div>
      <h3 style="font-family:'Source Serif 4',serif;font-size:1.05rem;font-weight:600;color:var(--green-dark);margin-bottom:0.5rem;line-height:1.35;">${escHtml(p.title)}</h3>
      ${p.author ? `<div style="font-size:0.78rem;color:var(--green-main);font-weight:600;margin-bottom:0.6rem;">✍ ${escHtml(p.author)}</div>` : ''}
      <p style="font-size:0.82rem;color:var(--gray);line-height:1.65;margin-bottom:1rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">${escHtml(p.description)}</p>
      ${p.tags ? `<div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:0.85rem;">${p.tags.split(',').map(t => `<span style="background:#f0faf4;color:var(--green-dark);font-size:0.68rem;font-weight:600;padding:0.2rem 0.55rem;border-radius:99px;border:1px solid #c8e6c9;">${escHtml(t.trim())}</span>`).join('')}</div>` : ''}
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <button onclick='openModal(${JSON.stringify(p.__backendId)})' class="btn-primary" style="font-size:0.78rem;padding:0.4rem 0.9rem;">
          <i data-lucide="eye" style="width:13px;height:13px;"></i> Ver mais
        </button>
        ${showEdit ? `
          <button onclick='editProjectStatus(${JSON.stringify(p.__backendId)})' class="btn-secondary" style="font-size:0.78rem;padding:0.4rem 0.9rem;">
            <i data-lucide="edit-2" style="width:13px;height:13px;"></i> Editar Status
          </button>` : ''}
      </div>
    </div>`;

  return card;
}

// ── Render: grid de projetos ──────────────────────────────────────────────────

function renderProjectsGrid() {
  const grid  = document.getElementById('projects-grid');
  const query = (document.getElementById('search-input').value || '').toLowerCase().trim();

  const filtered = allProjects.filter(p => {
    const matchCat = currentFilter === 'all' || p.status === currentFilter;
    const matchQ   = !query ||
      p.title.toLowerCase().includes(query) ||
      (p.description || '').toLowerCase().includes(query) ||
      (p.author      || '').toLowerCase().includes(query) ||
      (p.tags        || '').toLowerCase().includes(query);
    return matchCat && matchQ;
  });

  const existingMap = new Map([...grid.children].map(el => [el.dataset.projectId, el]));

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i data-lucide="search-x" style="width:48px;height:48px;"></i><p>Nenhum projeto encontrado.</p></div>`;
    lucide.createIcons();
    return;
  }

  existingMap.forEach((el, id) => {
    if (!filtered.find(p => p.__backendId === id)) el.remove();
  });

  filtered.forEach(p => {
    const newCard = createProjectCard(p, false);
    if (existingMap.has(p.__backendId)) {
      const old = existingMap.get(p.__backendId);
      grid.insertBefore(newCard, old);
      old.remove();
    } else {
      grid.appendChild(newCard);
    }
  });

  lucide.createIcons();
}

// ── Render: lista admin ───────────────────────────────────────────────────────

function renderAdminList() {
  const list     = document.getElementById('admin-projects-list');
  const existing = new Map(
    [...list.children].filter(el => el.dataset.projectId).map(el => [el.dataset.projectId, el])
  );

  if (allProjects.length === 0) {
    list.innerHTML = `<div class="empty-state"><i data-lucide="inbox" style="width:40px;height:40px;"></i><p style="font-size:0.88rem;">Nenhum projeto cadastrado ainda.</p></div>`;
    lucide.createIcons();
    return;
  }

  existing.forEach((el, id) => {
    if (!allProjects.find(p => p.__backendId === id)) el.remove();
  });

  allProjects.forEach(p => {
    const newCard = createProjectCard(p, true);
    if (existing.has(p.__backendId)) {
      const old = existing.get(p.__backendId);
      list.insertBefore(newCard, old);
      old.remove();
    } else {
      list.appendChild(newCard);
    }
  });

  lucide.createIcons();
}

// ── Render: home (3 recentes) ─────────────────────────────────────────────────

function renderHomeProjects() {
  const grid   = document.getElementById('home-projects-grid');
  const recent = allProjects.slice(-3).reverse();

  if (recent.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i data-lucide="folder-open" style="width:48px;height:48px;"></i><p>Nenhum projeto cadastrado ainda.<br><span style="font-size:0.8rem;">Use o painel Admin para adicionar projetos.</span></p></div>`;
    lucide.createIcons();
    return;
  }

  grid.innerHTML = '';
  recent.forEach(p => grid.appendChild(createProjectCard(p, false)));
  lucide.createIcons();
}

function updateStats() {
  const el = document.getElementById('stat-projects');
  if (el) el.textContent = allProjects.length;
}

// ── Modal de detalhes ─────────────────────────────────────────────────────────

function openModal(id) {
  const p = allProjects.find(x => x.__backendId === id);
  if (!p) return;

  const badge = getBadge(p.status);
  document.getElementById('modal-badge').innerHTML       = `<span class="status-badge ${badge.cls}" style="font-size:0.75rem;">${badge.label}</span>`;
  document.getElementById('modal-project-title').textContent = p.title;
  document.getElementById('modal-description').textContent   = p.description;
  document.getElementById('modal-meta').innerHTML = `
    ${p.author ? `<span>✍ ${escHtml(p.author)}</span>` : ''}
    ${p.year   ? `<span>📅 ${escHtml(p.year)}</span>`   : ''}`;

  const tagsEl = document.getElementById('modal-tags');
  tagsEl.innerHTML = p.tags
    ? p.tags.split(',').map(t => `<span style="background:#f0faf4;color:var(--green-dark);font-size:0.72rem;font-weight:600;padding:0.25rem 0.7rem;border-radius:99px;border:1px solid #c8e6c9;">${escHtml(t.trim())}</span>`).join('')
    : '';

  document.getElementById('project-modal').style.display = 'flex';
  lucide.createIcons();
}

function closeModal() {
  document.getElementById('project-modal').style.display = 'none';
}

document.getElementById('project-modal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ── Admin: salvar projeto ─────────────────────────────────────────────────────

function saveProject(e) {
  e.preventDefault();

  const title       = document.getElementById('p-title').value.trim();
  const author      = document.getElementById('p-author').value.trim();
  const status      = document.getElementById('p-status').value;
  const year        = document.getElementById('p-year').value.trim();
  const tags        = document.getElementById('p-tags').value.trim();
  const description = document.getElementById('p-desc').value.trim();

  if (!title || !status || !description) return;

  if (allProjects.length >= 999) {
    document.getElementById('limit-warning').style.display = 'flex';
    return;
  }

  const saveBtn = document.getElementById('save-btn');
  const saveLbl = document.getElementById('save-btn-label');
  saveBtn.disabled = true;
  saveLbl.innerHTML = '<span class="spinner"></span>';

  const data = { title, author, status, year, tags, description, createdAt: new Date().toISOString() };

  window.dataSdk.create(data).then(result => {
    saveBtn.disabled = false;
    saveLbl.textContent = 'Salvar Projeto';
    if (result.isOk) {
      showToast('Projeto adicionado!');
      document.getElementById('project-form').reset();
    } else {
      showToast('Erro ao salvar projeto.', true);
    }
  });
}

// ── Admin: editar status ──────────────────────────────────────────────────────

function editProjectStatus(id) {
  const p = allProjects.find(x => x.__backendId === id);
  if (!p) return;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-header" style="position:relative;">
        <h2 style="color:#fff;font-family:'Source Serif 4',serif;margin:0;">Editar Status do Projeto</h2>
        <button onclick="this.closest('.modal-overlay').remove()" style="background:rgba(255,255,255,0.15);border:none;border-radius:8px;padding:0.6rem;cursor:pointer;color:#fff;position:absolute;right:1.5rem;top:1.5rem;">
          <i data-lucide="x" style="width:18px;height:18px;"></i>
        </button>
      </div>
      <div style="padding:1.75rem;">
        <p style="font-size:0.88rem;color:var(--gray);margin-bottom:1.25rem;"><strong>${escHtml(p.title)}</strong></p>
        <label class="form-label">Novo Status:</label>
        <select id="status-select" class="form-input" style="margin-bottom:1.25rem;">
          <option value="memorial"  ${p.status === 'memorial'  ? 'selected' : ''}>📚 Memorial</option>
          <option value="andamento" ${p.status === 'andamento' ? 'selected' : ''}>🔬 Em Andamento</option>
          <option value="realizado" ${p.status === 'realizado' ? 'selected' : ''}>✅ Realizado</option>
          <option value="futuro"    ${p.status === 'futuro'    ? 'selected' : ''}>🚀 Futuro</option>
        </select>
        <div style="display:flex;gap:0.75rem;">
          <button onclick="confirmStatusUpdate('${id}')" class="btn-primary" style="font-size:0.85rem;">
            <i data-lucide="check" style="width:15px;height:15px;"></i> Atualizar
          </button>
          <button onclick="this.closest('.modal-overlay').remove()" class="btn-secondary" style="font-size:0.85rem;">Cancelar</button>
        </div>
      </div>
    </div>`;

  document.body.appendChild(modal);
  modal.addEventListener('click', function (e) { if (e.target === this) this.remove(); });
  lucide.createIcons();
}

// ── Formulário de contato ─────────────────────────────────────────────────────

function submitContact(e) {
  e.preventDefault();
  document.getElementById('contact-success').style.display = 'block';
  document.getElementById('contact-form').reset();
  setTimeout(() => document.getElementById('contact-success').style.display = 'none', 5000);
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.toggle('error', isError);
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Data SDK handler ──────────────────────────────────────────────────────────

const dataHandler = {
  onDataChanged(data) {
    allProjects = data;
    renderProjectsGrid();
    renderAdminList();
    renderHomeProjects();
    updateStats();
    const lw = document.getElementById('limit-warning');
    if (lw) lw.style.display = data.length >= 999 ? 'flex' : 'none';
  }
};

// ── Element SDK ───────────────────────────────────────────────────────────────

window.elementSdk && window.elementSdk.init({
  defaultConfig,
  onConfigChange: (config) => {
    const set = (id, key) => {
      const el = document.getElementById(id);
      if (el) el.textContent = config[key] || defaultConfig[key];
    };
    set('hero-title',           'site_title');
    set('nav-title',            'site_title');
    set('hero-subtitle',        'site_subtitle');
    set('hero-desc',            'hero_description');
    set('about-text',           'about_text');
    set('contact-email-display','contact_email');

    document.body.style.color = config.text_color || defaultConfig.text_color;
  },
  mapToCapabilities: (config) => ({
    recolorables: [
      { get: () => config.background_color || defaultConfig.background_color, set: v => window.elementSdk.setConfig({ background_color: v }) },
      { get: () => config.surface_color    || defaultConfig.surface_color,    set: v => window.elementSdk.setConfig({ surface_color: v }) },
      { get: () => config.text_color       || defaultConfig.text_color,       set: v => window.elementSdk.setConfig({ text_color: v }) },
      { get: () => config.primary_color    || defaultConfig.primary_color,    set: v => window.elementSdk.setConfig({ primary_color: v }) },
      { get: () => config.accent_color     || defaultConfig.accent_color,     set: v => window.elementSdk.setConfig({ accent_color: v }) }
    ],
    borderables:   [],
    fontEditable:  undefined,
    fontSizeable:  undefined
  }),
  mapToEditPanelValues: (config) => new Map([
    ['site_title',       config.site_title       || defaultConfig.site_title],
    ['site_subtitle',    config.site_subtitle    || defaultConfig.site_subtitle],
    ['hero_description', config.hero_description || defaultConfig.hero_description],
    ['about_text',       config.about_text       || defaultConfig.about_text],
    ['contact_email',    config.contact_email    || defaultConfig.contact_email]
  ])
});

// ── Init ──────────────────────────────────────────────────────────────────────

async function init() {
  lucide.createIcons();
  initApp();
  const result = await window.dataSdk.init(dataHandler);
  if (!result.isOk) showToast('Erro ao conectar ao banco de dados.', true);
}

init();
