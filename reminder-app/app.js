const STORAGE_KEY = 'reminder_app_v2';

const COLORS = [
  '#4f7ef7', '#ef4444', '#22c55e', '#f59e0b',
  '#a855f7', '#ec4899', '#14b8a6', '#f97316',
];

const ICONS = [
  '📝','📋','🏠','🛒','💼','⭐','🎯','💡',
  '📚','🏋️','🎮','🍕','✈️','💊','💰','🎵',
  '🌱','🔧','📦','🎨','🔔','❤️',
];

const DEFAULT_LISTS = [
  { name: 'משימות',      color: '#4f7ef7', icon: '📝' },
  { name: 'תזכורות',    color: '#f59e0b', icon: '🔔' },
  { name: 'פרוייקטים', color: '#a855f7', icon: '💼' },
  { name: 'משימות בית', color: '#22c55e', icon: '🏠' },
];

// ── State ────────────────────────────────────
let state = { lists: [], activeListId: null };
let dragSrcIndex = -1;
let selectedColor = COLORS[0];
let selectedIcon = ICONS[0];

// ── Persistence ──────────────────────────────
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { state = JSON.parse(raw); return; }
  } catch (_) {}
  state.lists = DEFAULT_LISTS.map(d => ({
    id: genId(), name: d.name, color: d.color, icon: d.icon, tasks: []
  }));
  state.activeListId = null;
  saveState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getActiveList() {
  return state.lists.find(l => l.id === state.activeListId) || null;
}

function getList(id) {
  return state.lists.find(l => l.id === id) || null;
}

// ── Screen navigation ────────────────────────
function showListsScreen() {
  state.activeListId = null;
  document.getElementById('screen-lists').hidden = false;
  document.getElementById('screen-tasks').hidden = true;
  renderListsScreen();
}

function showTasksScreen(listId) {
  state.activeListId = listId;
  document.getElementById('screen-lists').hidden = true;
  document.getElementById('screen-tasks').hidden = false;
  renderTasksScreen();
}

// ── List operations ──────────────────────────
function createList(name, color, icon) {
  const list = { id: genId(), name: name.trim(), color, icon, tasks: [] };
  state.lists.push(list);
  saveState();
  renderListsScreen();
}

function deleteList(id) {
  state.lists = state.lists.filter(l => l.id !== id);
  saveState();
  renderListsScreen();
}

function selectList(id) {
  showTasksScreen(id);
}

function promptDeleteList(id) {
  const list = getList(id);
  if (!list) return;
  if (list.tasks.length === 0) { deleteList(id); return; }
  if (window.confirm(`למחוק את הרשימה "${list.name}" (${list.tasks.length} משימות)?`)) {
    deleteList(id);
  }
}

// ── Task operations ──────────────────────────
function addTask(text) {
  const list = getActiveList();
  if (!list || !text.trim()) return;
  list.tasks.unshift({ id: genId(), text: text.trim() });
  saveState();
  renderTasksScreen();
}

function completeTask(listId, taskId) {
  const taskEl = document.querySelector(`.task-item[data-id="${taskId}"]`);
  if (taskEl) taskEl.classList.add('completing');
  setTimeout(() => {
    const list = getList(listId);
    if (list) {
      list.tasks = list.tasks.filter(t => t.id !== taskId);
      saveState();
      renderTasksScreen();
    }
  }, 450);
}

function deleteTask(listId, taskId) {
  const list = getList(listId);
  if (list) {
    list.tasks = list.tasks.filter(t => t.id !== taskId);
    saveState();
    renderTasksScreen();
  }
}

function moveTask(listId, fromIdx, toIdx) {
  const list = getList(listId);
  if (!list || fromIdx === toIdx) return;
  const [item] = list.tasks.splice(fromIdx, 1);
  list.tasks.splice(toIdx, 0, item);
  saveState();
  renderTasksScreen();
}

// ── Rendering ────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderListsScreen() {
  const grid = document.getElementById('lists-grid');
  if (state.lists.length === 0) {
    grid.innerHTML = `<div class="lists-empty">אין רשימות עדיין<br/>לחץ + כדי ליצור</div>`;
    return;
  }
  grid.innerHTML = state.lists.map(l => {
    const count = l.tasks.length;
    const countText = count === 0 ? 'ריק' : count === 1 ? 'משימה אחת' : `${count} משימות`;
    return `
      <div class="list-card" onclick="selectList('${escHtml(l.id)}')" style="--list-color:${l.color}">
        <button class="btn-delete-list" onclick="event.stopPropagation();promptDeleteList('${escHtml(l.id)}')" title="מחק">&times;</button>
        <div class="list-card-icon">${l.icon}</div>
        <div class="list-card-name">${escHtml(l.name)}</div>
        <div class="list-card-count">${countText}</div>
      </div>`;
  }).join('');
}

function renderTasksScreen() {
  const list = getActiveList();
  if (!list) { showListsScreen(); return; }

  document.getElementById('screen-tasks').style.setProperty('--list-color', list.color);
  document.getElementById('tasks-list-icon').textContent = list.icon;
  document.getElementById('tasks-list-name').textContent = list.name;

  const taskList = document.getElementById('task-list');
  if (list.tasks.length === 0) {
    taskList.innerHTML = `<li class="tasks-empty">אין משימות 🎉</li>`;
    document.getElementById('tasks-done-bar').textContent = '';
    return;
  }

  taskList.innerHTML = list.tasks.map((t, i) => `
    <li class="task-item" draggable="true" data-index="${i}" data-id="${escHtml(t.id)}">
      <span class="drag-handle">⠿</span>
      <input type="checkbox" class="task-checkbox"
             onchange="completeTask('${escHtml(list.id)}', '${escHtml(t.id)}')" />
      <span class="task-text">${escHtml(t.text)}</span>
      <button class="btn-delete-task" onclick="deleteTask('${escHtml(list.id)}', '${escHtml(t.id)}')" title="מחק">&times;</button>
    </li>`
  ).join('');

  bindDragDrop(list.id);

  const count = list.tasks.length;
  document.getElementById('tasks-done-bar').textContent =
    count === 1 ? 'משימה אחת' : `${count} משימות`;
}

// ── Drag & Drop ──────────────────────────────
function bindDragDrop(listId) {
  const items = document.querySelectorAll('.task-item');
  items.forEach(item => {
    item.addEventListener('dragstart', e => {
      dragSrcIndex = parseInt(item.dataset.index, 10);
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      document.querySelectorAll('.task-item').forEach(i => i.classList.remove('drag-over'));
    });
    item.addEventListener('dragover', e => {
      e.preventDefault();
      document.querySelectorAll('.task-item').forEach(i => i.classList.remove('drag-over'));
      item.classList.add('drag-over');
    });
    item.addEventListener('dragleave', () => item.classList.remove('drag-over'));
    item.addEventListener('drop', e => {
      e.preventDefault();
      item.classList.remove('drag-over');
      moveTask(listId, dragSrcIndex, parseInt(item.dataset.index, 10));
    });
  });
}

// ── Modal: New list ──────────────────────────
function openNewListModal() {
  selectedColor = COLORS[0];
  selectedIcon = ICONS[0];
  document.getElementById('modal-name-input').value = '';
  renderColorPicker();
  renderIconPicker();
  document.getElementById('modal-overlay').classList.remove('hidden');
  setTimeout(() => document.getElementById('modal-name-input').focus(), 50);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function confirmModal() {
  const name = document.getElementById('modal-name-input').value.trim();
  if (!name) return;
  createList(name, selectedColor, selectedIcon);
  closeModal();
}

function renderColorPicker() {
  const container = document.getElementById('color-picker');
  container.innerHTML = COLORS.map((c, i) => `
    <button class="color-swatch${c === selectedColor ? ' selected' : ''}"
            style="background:${c}" data-color-idx="${i}"></button>
  `).join('');
  container.querySelectorAll('.color-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedColor = COLORS[parseInt(btn.dataset.colorIdx, 10)];
      container.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
}

function renderIconPicker() {
  const container = document.getElementById('icon-picker');
  container.innerHTML = ICONS.map((ic, i) => `
    <button class="icon-btn${ic === selectedIcon ? ' selected' : ''}"
            data-icon-idx="${i}">${ic}</button>
  `).join('');
  container.querySelectorAll('.icon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedIcon = ICONS[parseInt(btn.dataset.iconIdx, 10)];
      container.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
}

// ── Boot ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  showListsScreen();

  document.getElementById('btn-new-list').addEventListener('click', openNewListModal);
  document.getElementById('btn-back').addEventListener('click', showListsScreen);

  const taskInput = document.getElementById('task-input');
  document.getElementById('btn-add-task').addEventListener('click', () => {
    addTask(taskInput.value);
    taskInput.value = '';
    taskInput.focus();
  });
  taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { addTask(taskInput.value); taskInput.value = ''; }
  });

  document.getElementById('modal-confirm').addEventListener('click', confirmModal);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') confirmModal();
    if (e.key === 'Escape') closeModal();
  });
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });
});
