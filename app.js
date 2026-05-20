/* =========================================================
   SIMPLIFY APP — app.js
   SPA completo: auth, agendamentos, mapa, classificador,
   impacto e recompensas. Dados persistidos em localStorage.
========================================================= */

// ─── Constants ───────────────────────────────────────────
const POINTS_PER_KG = { Papel: 2, Plástico: 3, Metal: 4, Vidro: 3, Orgânico: 2, Eletrônicos: 10 };
const GOAL_KG = 20; // meta mensal em kg

const COLLECTION_POINTS = [
  { id: 1, name: 'Ecoponto Pinheiros', lat: -23.5613, lng: -46.6869, address: 'R. Cardeal Arcoverde, 2415 – Pinheiros', hours: 'Seg–Sex 8h–18h · Sáb 8h–14h', materials: ['Papel','Plástico','Metal','Vidro','Eletrônicos'], rating: 4.8 },
  { id: 2, name: 'Ecoponto Consolação', lat: -23.5547, lng: -46.6630, address: 'Av. Paulista, 1578 – Consolação', hours: 'Seg–Dom 8h–20h', materials: ['Papel','Plástico','Metal','Vidro'], rating: 4.6 },
  { id: 3, name: 'Cooperativa Verde SP', lat: -23.5450, lng: -46.6388, address: 'R. Vergueiro, 3100 – Vila Mariana', hours: 'Seg–Sex 7h–17h', materials: ['Papel','Plástico','Metal'], rating: 4.5 },
  { id: 4, name: 'Ecoponto Vila Madalena', lat: -23.5557, lng: -46.6952, address: 'R. Harmonia, 95 – Vila Madalena', hours: 'Ter–Dom 9h–18h', materials: ['Papel','Plástico','Vidro','Eletrônicos'], rating: 4.9 },
  { id: 5, name: 'Ecoponto Lapa', lat: -23.5213, lng: -46.7068, address: 'R. Guaicurus, 1000 – Lapa', hours: 'Seg–Sáb 8h–17h', materials: ['Papel','Plástico','Metal','Vidro'], rating: 4.4 },
  { id: 6, name: 'Descarte de Eletrônicos ABREE', lat: -23.5678, lng: -46.6540, address: 'R. da Consolação, 2000 – Cerqueira César', hours: 'Seg–Sex 9h–18h', materials: ['Eletrônicos'], rating: 4.7 },
  { id: 7, name: 'Ecoponto Santana', lat: -23.5012, lng: -46.6289, address: 'Av. Cruzeiro do Sul, 500 – Santana', hours: 'Seg–Dom 7h–19h', materials: ['Papel','Plástico','Metal','Vidro','Orgânico'], rating: 4.6 },
  { id: 8, name: 'Cooperativa Recicla SP', lat: -23.5834, lng: -46.6334, address: 'R. dos Ingleses, 200 – Bela Vista', hours: 'Seg–Sex 8h–16h', materials: ['Papel','Plástico','Metal'], rating: 4.3 },
  { id: 9, name: 'Ecoponto Moema', lat: -23.5986, lng: -46.6656, address: 'Av. Ibirapuera, 3103 – Moema', hours: 'Ter–Dom 9h–17h', materials: ['Papel','Plástico','Vidro','Metal'], rating: 4.7 },
];

const WASTE_TYPES = [
  { id: 'papel', name: 'Papel', emoji: '📄', color: '#3b82f6', bg: '#dbeafe',
    dispose: 'Coleta seletiva azul ou Ecoponto',
    recyclable: true, points: 2,
    examples: 'Jornal, revista, caderno, papelão, embalagem de papel',
    tips: ['Seque antes de descartar — papel molhado perde valor', 'Retire grampos, clipes e fitas adesivas', 'Papel higiênico e guardanapo usados NÃO são recicláveis', 'Caixinha Tetra Pak tem coleta específica em supermercados'] },
  { id: 'plastico', name: 'Plástico', emoji: '🧴', color: '#ef4444', bg: '#fee2e2',
    dispose: 'Coleta seletiva vermelha ou Ecoponto',
    recyclable: true, points: 3,
    examples: 'Garrafa PET, pote, embalagem, sacola, copo descartável',
    tips: ['Enxague as embalagens antes de descartar', 'Sacolas plásticas têm ponto de coleta nos supermercados', 'Esponjas e isopor NÃO vão para o plástico comum', 'Amasse as garrafas para economizar espaço'] },
  { id: 'metal', name: 'Metal', emoji: '🥫', color: '#f59e0b', bg: '#fef3c7',
    dispose: 'Coleta seletiva amarela ou Ecoponto',
    recyclable: true, points: 4,
    examples: 'Lata de alumínio, lata de aço, tampinha, panela',
    tips: ['Alumínio é 100% reciclável e pode ser reciclado infinitas vezes', 'Amasse as latas para economizar espaço', 'Pilhas e baterias têm descarte específico — nunca no lixo comum', 'Lave as latas de alimentos antes de descartar'] },
  { id: 'vidro', name: 'Vidro', emoji: '🍾', color: '#10b981', bg: '#d1fae5',
    dispose: 'Coleta seletiva verde ou Ecoponto',
    recyclable: true, points: 3,
    examples: 'Garrafa, pote de conserva, frasco de perfume',
    tips: ['Enxague antes de descartar', 'Não misture com espelhos, louças ou vidro temperado', 'Embrulhe vidros quebrados em jornal para segurança', 'Não é necessário retirar rótulos'] },
  { id: 'organico', name: 'Orgânico', emoji: '🥬', color: '#84cc16', bg: '#ecfccb',
    dispose: 'Compostagem doméstica ou coleta marrom',
    recyclable: true, points: 2,
    examples: 'Casca de fruta, sobra de comida, borra de café, folhas',
    tips: ['Ideal para compostagem doméstica — gera adubo natural', 'Cascas de ovo também são compostáveis', 'Carne e laticínios podem atrair animais na composteira', 'Alguns municípios têm coleta específica de orgânicos'] },
  { id: 'eletronicos', name: 'Eletrônicos', emoji: '📱', color: '#8b5cf6', bg: '#ede9fe',
    dispose: 'Ecoponto especializado ou fabricante',
    recyclable: true, points: 10,
    examples: 'Celular, computador, TV, carregador, pilha, bateria',
    tips: ['NUNCA descarte no lixo comum — contém metais pesados tóxicos', 'Apague todos os dados antes de descartar', 'Muitos fabricantes têm programas de devolução gratuita', 'Lojas e operadoras têm pontos de coleta específicos'] },
  { id: 'perigoso', name: 'Perigosos', emoji: '⚠️', color: '#dc2626', bg: '#fee2e2',
    dispose: 'Descarte especializado — nunca no lixo comum',
    recyclable: false, points: 5,
    examples: 'Medicamento, tinta, solvente, agrotóxico, lâmpada fluorescente',
    tips: ['Medicamentos: devolver à farmácia (Programa Descarte Correto)', 'Agrotóxicos: entregar ao revendedor', 'Tintas e solventes: Ecoponto com descarte especial', 'Lâmpadas fluorescentes: pontos de coleta de redes de supermercados'] },
  { id: 'rejeito', name: 'Rejeito', emoji: '🗑️', color: '#6b7280', bg: '#f3f4f6',
    dispose: 'Lixo comum (aterro sanitário)',
    recyclable: false, points: 0,
    examples: 'Papel higiênico, fralda, absorvente, esponja usada, copo sujo',
    tips: ['Tente minimizar o rejeito separando recicláveis corretamente', 'Use produtos reutilizáveis para reduzir o volume', 'Embale bem para evitar cheiro e atração de insetos', 'Nunca descarte eletrônicos ou materiais perigosos aqui'] },
];

const REWARDS = [
  { id: 1, emoji: '🛵', title: '10% OFF Rappi', points: 50, desc: 'Desconto em qualquer pedido', partner: 'Rappi' },
  { id: 2, emoji: '🎬', title: 'Ingresso de Cinema', points: 120, desc: '1 ingresso Cinemark (qualquer sessão)', partner: 'Cinemark' },
  { id: 3, emoji: '🌱', title: 'Muda de Planta', points: 80, desc: 'Planta nativa entregue em casa', partner: 'Viveiro Verde SP' },
  { id: 4, emoji: '🛒', title: 'Vale-compras R$20', points: 150, desc: 'Crédito em supermercado parceiro', partner: 'Pão de Açúcar' },
  { id: 5, emoji: '☕', title: 'Café grátis', points: 30, desc: 'Um café em qualquer unidade parceira', partner: 'Starbucks' },
  { id: 6, emoji: '⭐', title: 'Premium 1 mês', points: 200, desc: 'Funcionalidades premium liberadas', partner: 'Simplify' },
];

// ─── DB (localStorage) ───────────────────────────────────
const DB = {
  get:  key => JSON.parse(localStorage.getItem('sp_' + key) || 'null'),
  set:  (key, v) => localStorage.setItem('sp_' + key, JSON.stringify(v)),
  del:  key => localStorage.removeItem('sp_' + key),
};
// Session: persiste apenas enquanto a aba está aberta
const Session = {
  get:  key => JSON.parse(sessionStorage.getItem('sp_' + key) || 'null'),
  set:  (key, v) => sessionStorage.setItem('sp_' + key, JSON.stringify(v)),
  del:  key => sessionStorage.removeItem('sp_' + key),
};

// ─── App state ───────────────────────────────────────────
let STATE = {
  user: null,
  pickups: [],
  pointsHistory: [],
  currentView: 'dashboard',
  mapInstance: null,
  mapMarkers: [],
  filterActive: 'all',
  deleteTarget: null,
};

// ─── Utils ───────────────────────────────────────────────
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
}

function fmtDateShort(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function calcImpact(pickups) {
  let kg = 0, points = 0, co2 = 0;
  pickups.forEach(p => {
    const w = parseFloat(p.weight) || 0;
    kg += w;
    co2 += w * 1.5;
    p.materials.forEach(m => { points += Math.round(w / p.materials.length * (POINTS_PER_KG[m] || 2)); });
  });
  return { kg: Math.round(kg * 10) / 10, co2: Math.round(co2 * 10) / 10, trees: Math.round(kg * 0.3 * 10) / 10, points };
}

// ─── Toast ───────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

// ─── Auth ────────────────────────────────────────────────
// Salva dados do usuário atual de forma per-user
function saveUserData() {
  if (!STATE.user) return;
  const id = STATE.user.id;
  DB.set('u_' + id, STATE.user);
  DB.set('pickups_' + id, STATE.pickups);
  DB.set('pts_' + id, STATE.pointsHistory);
}

// Carrega dados do usuário a partir do ID salvo na sessão
function loadUserFromSession() {
  const id = Session.get('uid');
  if (!id) return false;
  const user = DB.get('u_' + id);
  if (!user) return false;
  STATE.user = user;
  STATE.pickups = DB.get('pickups_' + id) || [];
  STATE.pointsHistory = DB.get('pts_' + id) || [];
  return true;
}

function register(name, email, password, city, role) {
  const users = DB.get('users') || [];
  if (users.find(u => u.email === email)) return false;
  const user = { id: uid(), name, email, password, city, role: role || 'user', joinDate: today(), points: 0 };
  users.push(user);
  DB.set('users', users);
  STATE.user = user;
  STATE.pickups = [];
  STATE.pointsHistory = [];
  saveUserData();
  Session.set('uid', user.id);
  return true;
}

function login(email, password) {
  const users = DB.get('users') || [];
  const found = users.find(u => u.email === email && u.password === password);
  if (!found) return false;
  // Carrega perfil salvo (pode ter pontos atualizados)
  STATE.user = DB.get('u_' + found.id) || found;
  STATE.pickups = DB.get('pickups_' + found.id) || [];
  STATE.pointsHistory = DB.get('pts_' + found.id) || [];
  Session.set('uid', found.id);
  return true;
}

function logout() {
  saveUserData();
  Session.del('uid');
  STATE.user = null; STATE.pickups = []; STATE.pointsHistory = [];
  showAuth();
}

// Demo account
function loginDemo() {
  const users = DB.get('users') || [];
  let demo = users.find(u => u.email === 'demo@simplify.eco');
  if (!demo) {
    demo = { id: 'demo', name: 'Demo (Bernardo)', email: 'demo@simplify.eco', password: 'demo123', city: 'São Paulo', joinDate: '2026-01-10', points: 35 };
    users.push(demo);
    DB.set('users', users);
  }
  STATE.user = DB.get('u_demo') || demo;
  if (!(DB.get('pickups_demo') || []).length) {
    STATE.pickups = [
      { id: 'p1', date: '2026-05-10', time: '10:00–12:00', materials: ['Papel','Plástico'], weight: 4, obs: '', status: 'completed' },
      { id: 'p2', date: '2026-05-18', time: '08:00–10:00', materials: ['Metal','Vidro'], weight: 3, obs: 'Caixas na garagem', status: 'completed' },
      { id: 'p3', date: '2026-06-05', time: '13:00–15:00', materials: ['Eletrônicos'], weight: 2, obs: '', status: 'confirmed' },
    ];
    STATE.pointsHistory = [
      { id: 'h1', label: 'Coleta de Papel e Plástico', pts: 14, date: '2026-05-10', type: 'earn' },
      { id: 'h2', label: 'Coleta de Metal e Vidro', pts: 21, date: '2026-05-18', type: 'earn' },
    ];
    STATE.user.points = 35;
  } else {
    STATE.pickups = DB.get('pickups_demo') || [];
    STATE.pointsHistory = DB.get('pts_demo') || [];
    STATE.user.points = STATE.pointsHistory.reduce((s, h) => s + (h.type === 'earn' ? h.pts : -h.pts), 0);
  }
  saveUserData();
  Session.set('uid', 'demo');
  showApp();
}

// ─── UI switching ─────────────────────────────────────────
function showAuth() {
  document.getElementById('authScreen').hidden = false;
  document.getElementById('appShell').hidden = true;
}

function showApp() {
  document.getElementById('authScreen').hidden = true;
  document.getElementById('appShell').hidden = false;
  updateSidebarUser();
  const isCollector = STATE.user.role === 'collector';
  document.querySelectorAll('.user-only').forEach(el => { el.hidden = isCollector; });
  document.querySelectorAll('.collector-only').forEach(el => { el.hidden = !isCollector; });
  navigate(isCollector ? 'coletas' : 'dashboard');
}

function updateSidebarUser() {
  const u = STATE.user;
  document.getElementById('sidebarUser').innerHTML = `
    <div style="width:34px;height:34px;border-radius:50%;background:var(--green-100);display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--green-700);font-size:.9rem;flex-shrink:0">
      ${u.name.charAt(0).toUpperCase()}
    </div>
    <div><strong>${u.name.split(' ')[0]}</strong>${u.city ? '<small style="display:block;font-size:.72rem;color:var(--gray-400)">' + u.city + '</small>' : ''}</div>
  `;
  document.getElementById('topbarPoints').textContent = `⭐ ${u.points} pts`;
}

// ─── Navigation ──────────────────────────────────────────
const VIEW_TITLES = {
  dashboard:   'Dashboard',
  agendar:     'Agendar Coleta',
  mapa:        'Mapa de Pontos',
  classificar: 'Classificar Resíduo',
  impacto:     'Meu Impacto',
  recompensas: 'Recompensas',
  coletas:     'Coletas Disponíveis',
};

function navigate(view) {
  // hide all
  document.querySelectorAll('.view').forEach(v => { v.hidden = true; v.classList.remove('active'); });
  const target = document.getElementById('view-' + view);
  if (!target) return;
  target.hidden = false;
  target.classList.add('active');

  // nav highlight
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.querySelector(`.nav-item[data-view="${view}"]`);
  if (navEl) navEl.classList.add('active');

  STATE.currentView = view;
  document.getElementById('topbarTitle').textContent = VIEW_TITLES[view] || '';

  // close mobile sidebar
  closeSidebar();

  // render
  const renders = {
    dashboard:   renderDashboard,
    agendar:     renderPickupList,
    mapa:        renderMap,
    classificar: renderClassifier,
    impacto:     renderImpact,
    recompensas: renderRewards,
    coletas:     renderCollector,
  };
  if (renders[view]) renders[view]();
}

// ─── Dashboard ────────────────────────────────────────────
function renderDashboard() {
  const u = STATE.user;
  const completed = STATE.pickups.filter(p => p.status === 'completed');
  const imp = calcImpact(completed);

  document.getElementById('dashGreeting').textContent =
    `Olá, ${u.name.split(' ')[0]}! 👋`;

  // Stat cards
  document.getElementById('dashStats').innerHTML = [
    { icon: '♻️', val: imp.kg + ' kg', label: 'Total reciclado', cls: 'stat-card--green' },
    { icon: '📅', val: STATE.pickups.length, label: 'Coletas realizadas' },
    { icon: '⭐', val: u.points + ' pts', label: 'Pontos acumulados' },
    { icon: '🌳', val: imp.trees, label: 'Árvores preservadas' },
  ].map(s => `
    <div class="stat-card ${s.cls || ''}">
      <div class="stat-card__icon">${s.icon}</div>
      <div class="stat-card__val">${s.val}</div>
      <div class="stat-card__label">${s.label}</div>
    </div>
  `).join('');

  // Next pickup
  const upcoming = STATE.pickups
    .filter(p => p.status === 'confirmed' && p.date >= today())
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextEl = document.getElementById('nextPickup');
  if (upcoming.length) {
    const p = upcoming[0];
    const poolItem = getPoolItem(p.id);
    const collectorAccepted = poolItem && poolItem.status === 'aceito';
    const collectorDone     = poolItem && poolItem.status === 'concluido';

    let statusBadge, collectorLine;
    if (collectorDone) {
      statusBadge  = `<div class="pickup-preview__badge" style="background:#16a34a">✅ Concluído</div>`;
      collectorLine = `<div class="pickup-preview__collector pickup-preview__collector--done">✅ Coletado por ${poolItem.collectorName}</div>`;
    } else if (collectorAccepted) {
      statusBadge  = `<div class="pickup-preview__badge" style="background:#f59e0b">🚛 A caminho</div>`;
      collectorLine = `<div class="pickup-preview__collector pickup-preview__collector--aceito">🚛 ${poolItem.collectorName} está a caminho!</div>`;
    } else if (poolItem) {
      statusBadge  = `<div class="pickup-preview__badge">Aguardando coletor</div>`;
      collectorLine = `<div class="pickup-preview__collector">⏳ Nenhum coletor aceitou ainda</div>`;
    } else {
      statusBadge  = `<div class="pickup-preview__badge">Confirmado</div>`;
      collectorLine = '';
    }

    nextEl.innerHTML = `
      <div class="pickup-preview">
        <div class="pickup-preview__icon">📦</div>
        <div style="flex:1">
          <div class="pickup-preview__date">${fmtDate(p.date)}</div>
          <div class="pickup-preview__meta">⏰ ${p.time} · ${p.materials.join(', ')} · ${p.weight || '?'} kg</div>
          ${collectorLine}
        </div>
        ${statusBadge}
      </div>`;
  } else {
    nextEl.innerHTML = `
      <div class="empty-state">
        <span>📅</span>
        <p>Nenhuma coleta agendada</p>
        <button class="btn btn--primary btn--sm" onclick="navigate('agendar')">Agendar agora</button>
      </div>`;
  }

  // Recent activity
  const recentEl = document.getElementById('recentActivity');
  const recent = [...STATE.pointsHistory].reverse().slice(0, 5);
  if (recent.length) {
    recentEl.innerHTML = `<div class="activity-list">` + recent.map(h => `
      <div class="activity-item">
        <span class="activity-item__icon">${h.type === 'earn' ? '🌱' : '🎁'}</span>
        <span class="activity-item__text">${h.label}</span>
        <span class="activity-item__date">${fmtDateShort(h.date)}</span>
        <span class="activity-item__pts">${h.type === 'earn' ? '+' : '-'}${h.pts} pts</span>
      </div>`).join('') + `</div>`;
  } else {
    recentEl.innerHTML = `<div class="empty-state"><span>🕐</span><p>Nenhuma atividade ainda. Agende sua primeira coleta!</p></div>`;
  }
}

// ─── Pickup scheduling ────────────────────────────────────
function renderPickupList() {
  const el = document.getElementById('pickupList');
  const sorted = [...STATE.pickups].sort((a, b) => b.date.localeCompare(a.date));
  if (!sorted.length) {
    el.innerHTML = `<div class="empty-state"><span>📋</span><p>Nenhuma coleta agendada ainda.</p></div>`;
    return;
  }
  el.innerHTML = sorted.map(p => {
    const statusLabel = { confirmed: 'Agendado', completed: 'Concluído', cancelled: 'Cancelado' }[p.status] || p.status;
    const canCancel = p.status === 'confirmed' && p.date >= today();

    // Verifica situação no pool global
    const poolItem = getPoolItem(p.id);
    const collectorAccepted = poolItem && poolItem.status === 'aceito';
    const collectorDone     = poolItem && poolItem.status === 'concluido';
    // Só mostra botão manual se não há coletor envolvido
    const canComplete = p.status === 'confirmed' && p.date <= today() && !collectorAccepted && !collectorDone;

    let collectorBadge = '';
    if (p.status === 'confirmed') {
      if (collectorDone) {
        collectorBadge = `<div class="collector-badge collector-badge--done">✅ Coletado por ${poolItem.collectorName}</div>`;
      } else if (collectorAccepted) {
        collectorBadge = `<div class="collector-badge collector-badge--aceito">🚛 ${poolItem.collectorName} aceitou — a caminho!</div>`;
      } else if (poolItem) {
        collectorBadge = `<div class="collector-badge collector-badge--waiting">⏳ Aguardando um coletor aceitar</div>`;
      }
    }

    return `
    <div class="pickup-card" id="pc-${p.id}">
      <div class="pickup-card__header">
        <span class="pickup-card__date">📅 ${fmtDate(p.date)}</span>
        <span class="pickup-card__status status--${p.status}">${statusLabel}</span>
      </div>
      <div class="pickup-card__meta">⏰ ${p.time}${p.weight ? ' · ' + p.weight + ' kg est.' : ''}${p.obs ? ' · ' + p.obs : ''}</div>
      <div class="pickup-card__materials">
        ${p.materials.map(m => `<span class="mat-chip">${m}</span>`).join('')}
      </div>
      ${collectorBadge}
      <div class="pickup-card__actions">
        ${canComplete ? `<button class="btn btn--primary btn--sm" onclick="completePickup('${p.id}')">✅ Marcar como concluída</button>` : ''}
        ${canCancel ? `<button class="btn btn--ghost btn--sm" onclick="openConfirm('${p.id}')">Cancelar</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

function completePickup(id) {
  const p = STATE.pickups.find(x => x.id === id);
  if (!p) return;
  p.status = 'completed';
  // award points
  let pts = 0;
  const w = parseFloat(p.weight) || 1;
  p.materials.forEach(m => { pts += Math.round(w / p.materials.length * (POINTS_PER_KG[m] || 2)); });
  pts = Math.max(pts, 1);
  STATE.user.points += pts;
  STATE.pointsHistory.push({ id: uid(), label: `Coleta de ${p.materials.join(' e ')}`, pts, date: today(), type: 'earn' });
  saveUserPoints();
  saveUserData();
  showToast(`🌱 +${pts} pontos ganhos! Boa reciclagem!`, 'success');
  renderPickupList();
  updateSidebarUser();
}

function saveUserPoints() {
  // Atualiza pontos na lista global de usuários e no perfil per-user
  const users = DB.get('users') || [];
  const idx = users.findIndex(u => u.id === STATE.user.id);
  if (idx >= 0) { users[idx].points = STATE.user.points; DB.set('users', users); }
  DB.set('u_' + STATE.user.id, STATE.user);
}

// Delete confirm modal
function openConfirm(id) {
  STATE.deleteTarget = id;
  const overlay = document.getElementById('confirmOverlay');
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
}

function closeConfirm() {
  STATE.deleteTarget = null;
  document.getElementById('confirmOverlay').classList.remove('open');
}

function deletePickup(id) {
  STATE.pickups = STATE.pickups.filter(p => p.id !== id);
  saveUserData();
  closeConfirm();
  showToast('Coleta cancelada.', 'error');
  renderPickupList();
}

// ─── Map ──────────────────────────────────────────────────
function renderMap() {
  if (!STATE.mapInstance) {
    STATE.mapInstance = L.map('map').setView([-23.555, -46.668], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(STATE.mapInstance);
  }
  // Necessário ao mostrar o mapa após estar oculto (hidden)
  setTimeout(() => STATE.mapInstance.invalidateSize(), 50);
  filterMapPoints(STATE.filterActive);
}

function filterMapPoints(filter) {
  STATE.filterActive = filter;
  if (!STATE.mapInstance) return;

  // clear markers
  STATE.mapMarkers.forEach(m => STATE.mapInstance.removeLayer(m));
  STATE.mapMarkers = [];

  const filtered = filter === 'all'
    ? COLLECTION_POINTS
    : COLLECTION_POINTS.filter(p => p.materials.includes(filter));

  const greenIcon = L.divIcon({
    html: '<div style="background:#16a34a;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;box-shadow:0 2px 6px rgba(0,0,0,.3);border:2px solid #fff">♻</div>',
    className: '', iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -16],
  });

  filtered.forEach(pt => {
    const marker = L.marker([pt.lat, pt.lng], { icon: greenIcon })
      .addTo(STATE.mapInstance)
      .bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:200px">
          <strong style="font-size:.95rem;color:#111">${pt.name}</strong>
          <p style="font-size:.78rem;color:#6b7280;margin:4px 0">${pt.address}</p>
          <p style="font-size:.75rem;color:#6b7280">🕐 ${pt.hours}</p>
          <p style="font-size:.75rem;font-weight:700;color:#16a34a;margin-top:6px">⭐ ${pt.rating}</p>
          <p style="font-size:.72rem;color:#6b7280;margin-top:4px">${pt.materials.join(' · ')}</p>
        </div>`, { maxWidth: 260 });
    STATE.mapMarkers.push(marker);
  });

  // Re-render list
  renderPointsList(filtered);

  // Zoom to fit
  if (filtered.length) {
    const bounds = L.latLngBounds(filtered.map(p => [p.lat, p.lng]));
    STATE.mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    setTimeout(() => STATE.mapInstance.invalidateSize(), 100);
  }
}

function renderPointsList(pts) {
  const el = document.getElementById('pointsList');
  if (!pts.length) {
    el.innerHTML = `<p style="color:var(--gray-400);font-size:.85rem;text-align:center;padding:20px">Nenhum ponto encontrado para este material.</p>`;
    return;
  }
  el.innerHTML = pts.map(p => `
    <div class="point-item">
      <div class="point-item__icon">📍</div>
      <div>
        <div class="point-item__name">${p.name}</div>
        <div class="point-item__address">${p.address}</div>
        <div class="point-item__hours">🕐 ${p.hours}</div>
        <div class="point-item__materials">
          ${p.materials.map(m => `<span class="mat-chip">${m}</span>`).join('')}
        </div>
      </div>
      <div class="point-item__rating">⭐ ${p.rating}</div>
    </div>`).join('');
}

// ─── Classifier ───────────────────────────────────────────
function renderClassifier() {
  const grid = document.getElementById('wasteGrid');
  grid.innerHTML = WASTE_TYPES.map(w => `
    <button class="waste-btn" data-waste="${w.id}" style="border-color:${w.bg}" onclick="showWasteInfo('${w.id}')">
      <span>${w.emoji}</span>
      <strong>${w.name}</strong>
    </button>`).join('');
}

function showWasteInfo(id) {
  const w = WASTE_TYPES.find(x => x.id === id);
  if (!w) return;

  // highlight selected
  document.querySelectorAll('.waste-btn').forEach(b => {
    b.style.borderColor = WASTE_TYPES.find(x => x.id === b.dataset.waste)?.bg || '';
    b.style.background = '';
    b.classList.remove('selected');
  });
  const sel = document.querySelector(`.waste-btn[data-waste="${id}"]`);
  if (sel) { sel.style.borderColor = w.color; sel.style.background = w.bg; sel.classList.add('selected'); }

  document.getElementById('wasteResult').innerHTML = `
    <div class="waste-result__header" style="background:${w.bg}">
      <span class="waste-result__emoji">${w.emoji}</span>
      <div>
        <div class="waste-result__name">${w.name}</div>
        <div class="waste-result__rec" style="color:${w.color}">${w.recyclable ? '✅ Reciclável' : '⛔ Não reciclável (rejeito ou descarte especial)'}</div>
      </div>
    </div>

    <div class="waste-info-row">
      <div>
        <div class="waste-info-label">Como descartar</div>
        <div class="waste-info-val" style="font-weight:700;color:${w.color}">${w.dispose}</div>
      </div>
    </div>

    <div class="waste-info-row">
      <div>
        <div class="waste-info-label">Exemplos</div>
        <div class="waste-info-val">${w.examples}</div>
      </div>
    </div>

    <div>
      <div class="waste-info-label" style="margin-bottom:10px">Dicas importantes</div>
      <ul class="tips-list">
        ${w.tips.map(t => `<li>${t}</li>`).join('')}
      </ul>
    </div>

    ${w.points > 0 ? `<div class="pts-badge">⭐ +${w.points} pontos por kg ao reciclar via Simplify</div>` : ''}
  `;
}

// ─── Impact ───────────────────────────────────────────────
function renderImpact() {
  const completed = STATE.pickups.filter(p => p.status === 'completed');
  const imp = calcImpact(completed);
  const monthKg = completed
    .filter(p => p.date.startsWith(new Date().toISOString().slice(0,7)))
    .reduce((s, p) => s + (parseFloat(p.weight) || 0), 0);

  document.getElementById('impactStats').innerHTML = [
    { icon: '♻️', val: imp.kg + ' kg', label: 'Total reciclado', cls: 'stat-card--green' },
    { icon: '🌫️', val: imp.co2 + ' kg', label: 'CO₂ evitado' },
    { icon: '🌳', val: imp.trees, label: 'Árvores preservadas' },
    { icon: '💧', val: Math.round(imp.kg * 100) + ' L', label: 'Água economizada' },
  ].map(s => `
    <div class="stat-card ${s.cls || ''}">
      <div class="stat-card__icon">${s.icon}</div>
      <div class="stat-card__val">${s.val}</div>
      <div class="stat-card__label">${s.label}</div>
    </div>`).join('');

  const pct = Math.min(Math.round((monthKg / GOAL_KG) * 100), 100);
  document.getElementById('impactGoal').innerHTML = `
    <div class="goal-bar-wrap">
      <div class="goal-bar-info">
        <span>${monthKg} kg reciclados este mês</span>
        <span>Meta: ${GOAL_KG} kg (${pct}%)</span>
      </div>
      <div class="goal-bar-track">
        <div class="goal-bar-fill" style="width:${pct}%"></div>
      </div>
      <p style="font-size:.78rem;color:var(--gray-400);margin-top:8px">
        ${pct >= 100 ? '🎉 Meta batida! Parabéns!' : `Faltam ${(GOAL_KG - monthKg).toFixed(1)} kg para atingir a meta do mês.`}
      </p>
    </div>`;

  const hist = document.getElementById('pickupHistory');
  const sorted = [...STATE.pickups].sort((a, b) => b.date.localeCompare(a.date));
  if (!sorted.length) {
    hist.innerHTML = `<div class="empty-state"><span>📋</span><p>Nenhuma coleta ainda.</p></div>`;
    return;
  }
  const statusIcon = { confirmed: '📅', completed: '✅', cancelled: '❌' };
  hist.innerHTML = sorted.map(p => `
    <div class="history-item">
      <span class="history-item__icon">${statusIcon[p.status] || '📦'}</span>
      <div class="history-item__info">
        <div class="history-item__title">${p.materials.join(', ')}</div>
        <div class="history-item__date">${fmtDate(p.date)} · ${p.time}</div>
      </div>
      <span class="history-item__kg">${p.status === 'completed' ? (p.weight || '?') + ' kg' : p.status === 'confirmed' ? 'Agendado' : 'Cancelado'}</span>
    </div>`).join('');
}

// ─── Rewards ──────────────────────────────────────────────
function renderRewards() {
  const pts = STATE.user.points;

  document.getElementById('pointsHero').innerHTML = `
    <div style="display:flex;gap:24px;flex-wrap:wrap">
      <div>
        <div class="points-hero__num">${pts}</div>
        <div class="points-hero__label">pontos disponíveis</div>
        <div class="points-hero__desc">Ganhe mais reciclando!</div>
      </div>
      <div class="points-hero__divider"></div>
      <div style="color:rgba(255,255,255,.7)">
        <div style="font-size:.82rem;margin-bottom:4px">Equivale a</div>
        <div style="font-weight:800;font-size:1.1rem;color:var(--green-400)">R$ ${(pts * 0.1).toFixed(2)}</div>
        <div style="font-size:.75rem;color:rgba(255,255,255,.4)">em recompensas</div>
      </div>
    </div>`;

  document.getElementById('rewardsGrid').innerHTML = REWARDS.map(r => {
    const enough = pts >= r.points;
    return `
    <div class="reward-card ${enough ? '' : 'insufficient'}">
      <div class="reward-card__emoji">${r.emoji}</div>
      <div class="reward-card__title">${r.title}</div>
      <div class="reward-card__desc">${r.desc}</div>
      <div class="reward-card__footer">
        <span class="reward-card__pts">⭐ ${r.points} pts</span>
        <span class="reward-card__partner">${r.partner}</span>
      </div>
      <button class="btn btn--primary btn--sm btn--full" style="margin-top:12px"
        onclick="redeemReward(${r.id})" ${enough ? '' : 'disabled'}>
        ${enough ? 'Resgatar' : 'Pontos insuficientes'}
      </button>
    </div>`;
  }).join('');

  const histEl = document.getElementById('pointsHistory');
  const all = [...STATE.pointsHistory].reverse();
  if (!all.length) {
    histEl.innerHTML = `<div class="empty-state"><span>⭐</span><p>Nenhuma movimentação ainda.</p></div>`;
    return;
  }
  histEl.innerHTML = all.map(h => `
    <div class="pts-row">
      <span class="pts-row__icon">${h.type === 'earn' ? '🌱' : '🎁'}</span>
      <span class="pts-row__label">${h.label}</span>
      <span class="pts-row__date">${fmtDateShort(h.date)}</span>
      <span class="pts-row__val ${h.type}">${h.type === 'earn' ? '+' : '-'}${h.pts}</span>
    </div>`).join('');
}

function redeemReward(id) {
  const r = REWARDS.find(x => x.id === id);
  if (!r || STATE.user.points < r.points) return;
  STATE.user.points -= r.points;
  STATE.pointsHistory.push({ id: uid(), label: `Resgatou: ${r.title}`, pts: r.points, date: today(), type: 'spend' });
  saveUserPoints();
  saveUserData();
  showToast(`🎉 ${r.title} resgatado! Confira seu e-mail.`, 'success');
  updateSidebarUser();
  renderRewards();
}

// ─── Event listeners ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Auth tabs
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const which = tab.dataset.tab;
      document.getElementById('loginForm').hidden = which !== 'login';
      document.getElementById('registerForm').hidden = which !== 'register';
    });
  });

  // Switch links inside forms
  document.querySelectorAll('[data-switch]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const which = a.dataset.switch;
      document.querySelectorAll('.auth-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === which);
      });
      document.getElementById('loginForm').hidden = which !== 'login';
      document.getElementById('registerForm').hidden = which !== 'register';
    });
  });

  // Demo login
  document.getElementById('demoBtn').addEventListener('click', e => {
    e.preventDefault();
    loginDemo();
  });

  // Esqueceu a senha
  document.getElementById('forgotBtn').addEventListener('click', e => {
    e.preventDefault();
    openForgot();
  });

  document.getElementById('forgotEmailForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();
    const users = DB.get('users') || [];
    const found = users.find(u => u.email === email);
    if (!found) {
      showToast('E-mail não encontrado.', 'error');
      return;
    }
    // Guarda o email encontrado para usar no passo 2
    document.getElementById('forgotEmailForm').dataset.email = email;
    document.getElementById('forgotStep1').hidden = true;
    document.getElementById('forgotStep2').hidden = false;
  });

  document.getElementById('forgotResetForm').addEventListener('submit', e => {
    e.preventDefault();
    const newPwd  = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (newPwd !== confirm) {
      showToast('As senhas não coincidem.', 'error');
      return;
    }
    const email = document.getElementById('forgotEmailForm').dataset.email;
    const users = DB.get('users') || [];
    const idx = users.findIndex(u => u.email === email);
    if (idx < 0) return;
    users[idx].password = newPwd;
    DB.set('users', users);
    // Atualiza também o perfil salvo per-user
    const profile = DB.get('u_' + users[idx].id);
    if (profile) { profile.password = newPwd; DB.set('u_' + users[idx].id, profile); }
    document.getElementById('forgotStep2').hidden = true;
    document.getElementById('forgotStep3').hidden = false;
  });

  document.getElementById('forgotOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('forgotOverlay')) closeForgot();
  });

  // Login form
  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass  = document.getElementById('loginPassword').value;
    if (login(email, pass)) { showApp(); }
    else { showToast('E-mail ou senha incorretos.', 'error'); }
  });

  // Register form
  document.getElementById('registerForm').addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass  = document.getElementById('regPassword').value;
    const city  = document.getElementById('regCity').value;
    const role  = document.getElementById('regRole').value;
    if (!name || !email || !pass) { showToast('Preencha todos os campos.', 'error'); return; }
    if (register(name, email, pass, city, role)) {
      showApp();
      const msg = role === 'collector' ? 'Conta de coletor criada! 🚛' : 'Conta criada! Bem-vindo(a) 🎉';
      showToast(msg, 'success');
    } else { showToast('E-mail já cadastrado.', 'error'); }
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Sidebar nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.view));
  });

  // Mobile sidebar toggle
  document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

  // Pickup form
  document.getElementById('pickupForm').addEventListener('submit', e => {
    e.preventDefault();
    const date = document.getElementById('pickupDate').value;
    const time = document.getElementById('pickupTime').value;
    const mats = [...document.querySelectorAll('#materialChips input:checked')].map(x => x.value);
    const weight = document.getElementById('pickupWeight').value;
    const obs  = document.getElementById('pickupObs').value.trim();

    if (!date) { showToast('Selecione uma data.', 'error'); return; }
    if (!time) { showToast('Selecione um horário.', 'error'); return; }
    if (!mats.length) { showToast('Selecione ao menos um material.', 'error'); return; }

    const pickup = { id: uid(), date, time, materials: mats, weight: parseFloat(weight) || 0, obs, status: 'confirmed' };
    STATE.pickups.push(pickup);
    addToPool(pickup);
    saveUserData();
    e.target.reset();
    showToast('✅ Coleta agendada com sucesso!', 'success');
    renderPickupList();
  });

  // Min date = amanhã em horário local (evita bug de timezone)
  const dateInput = document.getElementById('pickupDate');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const pad = n => String(n).padStart(2, '0');
  dateInput.min = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth()+1)}-${pad(tomorrow.getDate())}`;

  // Map filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterMapPoints(btn.dataset.filter);
    });
  });

  // Confirm modal buttons
  document.getElementById('confirmNo').addEventListener('click', closeConfirm);
  document.getElementById('confirmYes').addEventListener('click', () => {
    if (STATE.deleteTarget) deletePickup(STATE.deleteTarget);
  });
  document.getElementById('confirmOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('confirmOverlay')) closeConfirm();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeConfirm(); });

  // Pool tabs (coletas disponíveis para coletor)
  document.querySelectorAll('.pool-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pool-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const which = tab.dataset.poolTab;
      document.getElementById('poolDisponiveis').hidden = which !== 'disponiveis';
      document.getElementById('poolMinhas').hidden = which !== 'minhas';
    });
  });

  // Restaura sessão apenas se a aba ainda está aberta (sessionStorage)
  // Isso evita que o app pule a tela de login ao reabrir o navegador
  if (loadUserFromSession()) { showApp(); } else { showAuth(); }
});

// ─── Pool de coletas (compartilhado entre usuários/coletores) ────────────────
function getPoolItem(pickupId) {
  const pool = DB.get('pool') || [];
  return pool.find(p => p.pickupId === pickupId) || null;
}
function addToPool(pickup) {
  const pool = DB.get('pool') || [];
  pool.push({
    id: 'pool_' + pickup.id,
    pickupId: pickup.id,
    userId: STATE.user.id,
    userName: STATE.user.name.split(' ')[0],
    city: STATE.user.city || 'São Paulo',
    date: pickup.date,
    time: pickup.time,
    materials: pickup.materials,
    weight: pickup.weight,
    obs: pickup.obs,
    status: 'disponivel',
    collectorId: null,
    collectorName: null,
    postedAt: today(),
  });
  DB.set('pool', pool);
}

function renderCollector() {
  // Reseta tabs para "Disponíveis"
  document.querySelectorAll('.pool-tab').forEach(t => t.classList.remove('active'));
  const firstTab = document.querySelector('.pool-tab[data-pool-tab="disponiveis"]');
  if (firstTab) firstTab.classList.add('active');
  document.getElementById('poolDisponiveis').hidden = false;
  document.getElementById('poolMinhas').hidden = true;

  const pool = DB.get('pool') || [];
  const myId = STATE.user.id;

  renderPoolDisponiveis(pool.filter(p => p.status === 'disponivel'));
  renderPoolMinhas(pool.filter(p => p.collectorId === myId));
}

function renderPoolDisponiveis(items) {
  const el = document.getElementById('poolDisponiveis');
  if (!items.length) {
    el.innerHTML = `
      <div class="empty-state">
        <span>📋</span>
        <p>Nenhuma coleta disponível no momento.<br>Aguarde novos agendamentos.</p>
      </div>`;
    return;
  }
  el.innerHTML = items.map(p => `
    <div class="pool-card">
      <div class="pool-card__header">
        <div>
          <div class="pool-card__user">👤 ${p.userName} · ${p.city}</div>
          <div class="pool-card__date">📅 ${fmtDate(p.date)} &nbsp;⏰ ${p.time}</div>
        </div>
        <div class="pool-card__weight">${p.weight || '?'} kg</div>
      </div>
      <div class="pickup-card__materials" style="margin:8px 0">
        ${p.materials.map(m => `<span class="mat-chip">${m}</span>`).join('')}
      </div>
      ${p.obs ? `<div class="pool-card__obs">💬 ${p.obs}</div>` : ''}
      <button class="btn btn--primary btn--full" style="margin-top:12px"
        onclick="acceptPickup('${p.id}')">✅ Aceitar esta coleta</button>
    </div>`).join('');
}

function renderPoolMinhas(items) {
  const el = document.getElementById('poolMinhas');
  if (!items.length) {
    el.innerHTML = `
      <div class="empty-state">
        <span>🚛</span>
        <p>Você não aceitou nenhuma coleta ainda.</p>
      </div>`;
    return;
  }
  el.innerHTML = items.map(p => {
    const isDone = p.status === 'concluido';
    return `
    <div class="pool-card">
      <div class="pool-card__header">
        <div>
          <div class="pool-card__user">👤 ${p.userName} · ${p.city}</div>
          <div class="pool-card__date">📅 ${fmtDate(p.date)} &nbsp;⏰ ${p.time}</div>
        </div>
        <span class="pickup-card__status ${isDone ? 'status--completed' : 'status--confirmed'}">
          ${isDone ? '✅ Concluída' : '🚛 A caminho'}
        </span>
      </div>
      <div class="pickup-card__materials" style="margin:8px 0">
        ${p.materials.map(m => `<span class="mat-chip">${m}</span>`).join('')}
      </div>
      ${p.obs ? `<div class="pool-card__obs">💬 ${p.obs}</div>` : ''}
      ${!isDone ? `
        <button class="btn btn--primary btn--full" style="margin-top:12px"
          onclick="completePoolPickup('${p.id}')">✅ Marcar como coletada</button>` : ''}
    </div>`;
  }).join('');
}

function acceptPickup(poolId) {
  const pool = DB.get('pool') || [];
  const item = pool.find(p => p.id === poolId);
  if (!item || item.status !== 'disponivel') {
    showToast('Esta coleta já foi aceita por outro coletor.', 'error');
    renderCollector();
    return;
  }
  item.status = 'aceito';
  item.collectorId = STATE.user.id;
  item.collectorName = STATE.user.name.split(' ')[0];
  DB.set('pool', pool);
  showToast('🚛 Coleta aceita! Vá até o endereço no dia marcado.', 'success');
  renderCollector();
}

function completePoolPickup(poolId) {
  const pool = DB.get('pool') || [];
  const item = pool.find(p => p.id === poolId);
  if (!item || item.status !== 'aceito') return;
  item.status = 'concluido';
  DB.set('pool', pool);

  // Atualiza o pickup no perfil do usuário original e dá pontos a ele
  const userPickups = DB.get('pickups_' + item.userId) || [];
  const pickup = userPickups.find(p => p.id === item.pickupId);
  if (pickup && pickup.status === 'confirmed') {
    pickup.status = 'completed';
    DB.set('pickups_' + item.userId, userPickups);

    let pts = 0;
    const w = parseFloat(pickup.weight) || 1;
    pickup.materials.forEach(m => {
      pts += Math.round(w / pickup.materials.length * (POINTS_PER_KG[m] || 2));
    });
    pts = Math.max(pts, 1);

    const userProfile = DB.get('u_' + item.userId);
    if (userProfile) {
      userProfile.points = (userProfile.points || 0) + pts;
      DB.set('u_' + item.userId, userProfile);
    }
    const userPts = DB.get('pts_' + item.userId) || [];
    userPts.push({
      id: uid(), label: `Coleta concluída por ${item.collectorName}`,
      pts, date: today(), type: 'earn',
    });
    DB.set('pts_' + item.userId, userPts);
  }

  showToast('🌱 Coleta concluída! O usuário recebeu os pontos.', 'success');
  renderCollector();
}

// ─── Recuperação de senha ────────────────────────────────
function openForgot() {
  // Reseta para o passo 1
  document.getElementById('forgotStep1').hidden = false;
  document.getElementById('forgotStep2').hidden = true;
  document.getElementById('forgotStep3').hidden = true;
  document.getElementById('forgotEmail').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
  const overlay = document.getElementById('forgotOverlay');
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => document.getElementById('forgotEmail').focus(), 100);
}

function closeForgot() {
  const overlay = document.getElementById('forgotOverlay');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  // Se chegou no passo 3 (sucesso), pré-preenche o email no login
  const step3 = document.getElementById('forgotStep3');
  if (!step3.hidden) {
    const email = document.getElementById('forgotEmailForm').dataset.email;
    if (email) document.getElementById('loginEmail').value = email;
  }
}

// ─── Sidebar (mobile) ────────────────────────────────────
function toggleSidebar() {
  const s = document.getElementById('sidebar');
  const o = document.getElementById('sidebarOverlay');
  const open = s.classList.toggle('open');
  o.classList.toggle('open', open);
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

// Expose to HTML onclick
window.navigate            = navigate;
window.completePickup      = completePickup;
window.openConfirm         = openConfirm;
window.redeemReward        = redeemReward;
window.showWasteInfo       = showWasteInfo;
window.renderCollector     = renderCollector;
window.acceptPickup        = acceptPickup;
window.completePoolPickup  = completePoolPickup;
window.closeForgot         = closeForgot;
