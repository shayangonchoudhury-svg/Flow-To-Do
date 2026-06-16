const STORAGE_KEY = 'flow-notebook-tasks-v2';
let tasks = [];
let currentFilter = 'all';
let currentSort   = 'manual';
let searchQuery   = '';
let draggedId     = null;
let deferredPrompt;

/* ============================================================
   DOM REFS
   ============================================================ */
const heroPg      = document.getElementById('hero-page');
const mainApp     = document.getElementById('main-app');
const enterBtn    = document.getElementById('enterBtn');
const backBtn     = document.getElementById('backToHeroBtn');
const taskList    = document.getElementById('taskList');
const addForm     = document.getElementById('addForm');
const taskInput   = document.getElementById('taskInput');
const priSelect   = document.getElementById('prioritySelect');
const dueDateInp  = document.getElementById('dueDate');
const emptyState  = document.getElementById('emptyState');
const searchToggl = document.getElementById('searchToggle');
const searchBarW  = document.getElementById('searchBarWrap');
const searchInp   = document.getElementById('searchInput');
const sortSelect  = document.getElementById('sortSelect');
const toast       = document.getElementById('toast');
const totalEl     = document.getElementById('totalCount');
const activeEl    = document.getElementById('activeCount');
const doneEl      = document.getElementById('doneCount');
const ringFg      = document.getElementById('ringFg');
const ringPct     = document.getElementById('ringPct');
const CIRC        = 2 * Math.PI * 26;

/* ============================================================
   HERO TRANSITIONS
   ============================================================ */
enterBtn.addEventListener('click', () => {
  heroPg.classList.add('exit');
  mainApp.classList.add('visible');
  setTimeout(() => { heroPg.style.display = 'none'; }, 720);
});

backBtn.addEventListener('click', () => {
  mainApp.classList.remove('visible');

  heroPg.style.display = 'flex';
  heroPg.style.opacity = '0';
  heroPg.style.transform = 'scale(1.04)';
  heroPg.classList.remove('exit');

  requestAnimationFrame(() => {
    heroPg.style.transition = 'opacity 0.6s, transform 0.6s';
    heroPg.style.opacity = '1';
    heroPg.style.transform = 'scale(1)';
  });
});

/* ============================================================
   PERSISTENCE
   ============================================================ */
function loadTasks() {
  try { tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { tasks = []; }
}
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* ============================================================
   UTILITIES
   ============================================================ */
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

function showToast(msg, icon='fa-circle-check') {
  toast.innerHTML = `<i class="fa-solid ${icon}"></i>${msg}`;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2400);
}

function fmtDate(ds) {
  if (!ds) return null;
  const d = new Date(ds + 'T00:00:00');
  const t = new Date(); t.setHours(0,0,0,0);
  const diff = Math.round((d-t)/86400000);
  const isOld = diff < 0;
  let label = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : diff === -1 ? 'Yesterday'
    : d.toLocaleDateString(undefined,{month:'short',day:'numeric'});
  return { label, isOld };
}

function priWeight(p) { return p==='high'?0:p==='medium'?1:2; }

function priIcon(p) { return p==='high'?'fa-fire':p==='medium'?'fa-bolt':'fa-leaf'; }

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

/* ============================================================
   CONFETTI
   ============================================================ */
function confetti() {
  const cols = ['#c89828','#c0392b','#1e6b3c','#1a4d8a','#8a4a90','#d4860a'];
  for (let i=0;i<28;i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `left:${Math.random()*100}vw;background:${cols[Math.floor(Math.random()*cols.length)]};width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;border-radius:${Math.random()>.5?'50%':'2px'};animation-duration:${1.3+Math.random()*1.4}s`;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),2800);
  }
}

/* ============================================================
   RENDER
   ============================================================ */
function render() {
  let list = tasks.filter(t => {
    if (currentFilter==='active') return !t.completed;
    if (currentFilter==='completed') return t.completed;
    return true;
  });

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    list = list.filter(t => t.text.toLowerCase().includes(q));
  }

  if (currentSort==='priority')   list = [...list].sort((a,b)=>priWeight(a.priority)-priWeight(b.priority));
  else if (currentSort==='dueDate') list = [...list].sort((a,b)=>{ if(!a.dueDate&&!b.dueDate)return 0; if(!a.dueDate)return 1; if(!b.dueDate)return -1; return a.dueDate.localeCompare(b.dueDate); });
  else if (currentSort==='alpha') list = [...list].sort((a,b)=>a.text.localeCompare(b.text));

  taskList.innerHTML = '';

  // empty state
  const isEmpty = list.length === 0;
  emptyState.classList.toggle('show', isEmpty);
  if (isEmpty) {
    if (searchQuery.trim() && tasks.length > 0) {
      emptyState.querySelector('h3').textContent = 'Nothing found';
      emptyState.querySelector('p').textContent = 'Try a different search word';
      emptyState.querySelector('.empty-icon i').className = 'fa-solid fa-magnifying-glass';
    } else {
      emptyState.querySelector('h3').textContent = 'The page is blank';
      emptyState.querySelector('p').textContent = 'Write your first task above and start your flow';
      emptyState.querySelector('.empty-icon i').className = 'fa-solid fa-feather-pointed';
    }
  }

  list.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item priority-${task.priority}${task.completed?' completed':''}`;
    li.draggable = currentSort==='manual';
    li.dataset.id = task.id;

    const due = fmtDate(task.dueDate);

    li.innerHTML = `
      <span class="drag-handle" style="${currentSort!=='manual'?'visibility:hidden':''}"><i class="fa-solid fa-grip-vertical"></i></span>
      <button class="task-check" aria-label="Toggle"><i class="fa-solid fa-check" style="opacity:${task.completed?1:0}"></i></button>
      <div class="task-content">
        <div class="task-text" contenteditable="false" spellcheck="false">${escHtml(task.text)}</div>
        <div class="task-meta">
          <span class="task-tag tag-priority-${task.priority}"><i class="fa-solid ${priIcon(task.priority)}"></i> ${task.priority}</span>
          ${due?`<span class="task-tag tag-due${due.isOld&&!task.completed?' overdue':''}"><i class="fa-regular fa-calendar"></i> ${due.label}</span>`:''}
        </div>
      </div>
      <div class="task-actions">
        <button class="icon-btn edit" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="icon-btn delete" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    taskList.appendChild(li);
  });

  updateStats();
}

function setStat(el, val) {
  if (el.textContent !== String(val)) {
    el.textContent = val;
    el.classList.remove('bump');
    requestAnimationFrame(()=>el.classList.add('bump'));
  }
}

function updateStats() {
  const total = tasks.length;
  const done  = tasks.filter(t=>t.completed).length;
  const pct   = total===0?0:Math.round((done/total)*100);
  setStat(totalEl, total);
  setStat(activeEl, total-done);
  setStat(doneEl, done);
  ringPct.textContent = pct+'%';
  ringFg.style.strokeDashoffset = CIRC - (pct/100)*CIRC;
  ringFg.style.stroke = pct===100&&total>0?'#1e6b3c':'#7a5020';
}

/* ============================================================
   CRUD
   ============================================================ */
function addTask(text, priority, dueDate) {
  tasks.unshift({ id:uid(), text:text.trim(), completed:false, priority, dueDate:dueDate||null, createdAt:Date.now() });
  saveTasks(); render();
}
function toggleTask(id) {
  const t = tasks.find(t=>t.id===id); if(!t) return;
  t.completed = !t.completed;
  saveTasks(); render();
  if (t.completed) { confetti(); showToast('Task complete! ✓','fa-circle-check'); }
}
function deleteTask(id) {
  const li = taskList.querySelector(`[data-id="${id}"]`);
  if (li) { li.classList.add('removing'); setTimeout(()=>{ tasks=tasks.filter(t=>t.id!==id); saveTasks(); render(); },290); }
  else { tasks=tasks.filter(t=>t.id!==id); saveTasks(); render(); }
}
function editTask(id, text) {
  const t = tasks.find(t=>t.id===id); if(!t) return;
  if (text.trim()) t.text = text.trim();
  saveTasks(); render();
}
function clearCompleted() {
  const ids = tasks.filter(t=>t.completed).map(t=>t.id);
  if (!ids.length) { showToast('Nothing to clear','fa-info-circle'); return; }
  ids.forEach(id=>{ const li=taskList.querySelector(`[data-id="${id}"]`); if(li)li.classList.add('removing'); });
  setTimeout(()=>{ tasks=tasks.filter(t=>!t.completed); saveTasks(); render(); showToast('Cleared!','fa-broom'); },290);
}

function selectText(element) {
  const range = document.createRange();
  range.selectNodeContents(element);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

/* ============================================================
   EVENT DELEGATION — task list
   ============================================================ */
taskList.addEventListener('click', e => {
  const li = e.target.closest('.task-item'); if(!li) return;
  const id = li.dataset.id;
  if (e.target.closest('.task-check')) toggleTask(id);
  else if (e.target.closest('.delete')) deleteTask(id);
  else if (e.target.closest('.edit')) {
    const tx = li.querySelector('.task-text');
    tx.contentEditable='true'; tx.focus();
    selectText(tx);
  }
});
taskList.addEventListener('dblclick', e => {
  const tx = e.target.closest('.task-text'); if(!tx) return;
  tx.contentEditable='true'; tx.focus();
  selectText(tx);
});
taskList.addEventListener('focusout', e => {
  const tx = e.target.closest('.task-text'); if(!tx||tx.contentEditable!=='true') return;
  const li = tx.closest('.task-item');
  tx.contentEditable='false';
  editTask(li.dataset.id, tx.textContent);
});
taskList.addEventListener('keydown', e => {
  const tx = e.target.closest('.task-text'); if(!tx||tx.contentEditable!=='true') return;
  if (e.key==='Enter') { e.preventDefault(); tx.blur(); }
  else if (e.key==='Escape') { tx.contentEditable='false'; render(); }
});

/* ============================================================
   DRAG & DROP
   ============================================================ */
taskList.addEventListener('dragstart', e => {
  if (currentSort!=='manual') { e.preventDefault(); return; }
  const li=e.target.closest('.task-item'); if(!li) return;
  draggedId=li.dataset.id; li.classList.add('dragging');
});
taskList.addEventListener('dragend', e => {
  const li=e.target.closest('.task-item'); if(li)li.classList.remove('dragging');
  taskList.querySelectorAll('.drag-over').forEach(el=>el.classList.remove('drag-over'));
});
taskList.addEventListener('dragover', e => {
  e.preventDefault();
  const li=e.target.closest('.task-item'); if(!li||li.dataset.id===draggedId) return;
  taskList.querySelectorAll('.drag-over').forEach(el=>el.classList.remove('drag-over'));
  li.classList.add('drag-over');
});
taskList.addEventListener('drop', e => {
  e.preventDefault();
  const li=e.target.closest('.task-item'); if(!li||!draggedId) return;
  const tid=li.dataset.id; if(tid===draggedId) return;
  const di=tasks.findIndex(t=>t.id===draggedId);
  const ti=tasks.findIndex(t=>t.id===tid);
  const [dt]=tasks.splice(di,1);
  tasks.splice(ti,0,dt);
  saveTasks(); render();
});

/* ============================================================
   FORM
   ============================================================ */
addForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) { taskInput.focus(); return; }
  addTask(text, priSelect.value, dueDateInp.value);
  taskInput.value=''; dueDateInp.value=''; priSelect.value='medium';
  taskInput.focus();
  const btn=addForm.querySelector('.add-submit-btn');
  btn.classList.remove('pulse');
  requestAnimationFrame(()=>btn.classList.add('pulse'));
  showToast('Note added','fa-plus');
});

/* ============================================================
   FILTERS & SORT
   ============================================================ */
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    render();
  });
});
document.getElementById('clearCompleted').addEventListener('click', clearCompleted);
sortSelect.addEventListener('change', ()=>{ currentSort=sortSelect.value; render(); });

/* ============================================================
   SEARCH
   ============================================================ */
searchToggl.addEventListener('click', ()=>{
  const open = searchBarW.classList.toggle('open');
  if (open) searchInp.focus();
  else { searchInp.value=''; searchQuery=''; render(); }
});
searchInp.addEventListener('input', ()=>{ searchQuery=searchInp.value; render(); });
searchInp.addEventListener('keydown', e=>{
  if (e.key==='Escape') {
    searchInp.value=''; searchQuery='';
    searchBarW.classList.remove('open');
    render();
  }
});

/* ============================================================
   INIT
   ============================================================ */
function init() {
  loadTasks();
  render();
}

init();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => console.log("Service Worker Registered"))
      .catch(err => console.error(err));
  });
}

const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();

  deferredPrompt = e;

  installBtn.style.display = "flex";
});

installBtn?.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  await deferredPrompt.userChoice;

  deferredPrompt = null;

  installBtn.style.display = "none";
});
