const STORAGE_KEY = 'reminder_app_v1';

const DEFAULT_LISTS = [
  'משימות',
  'תזכורות',
  'פרוייקטים',
  'משימות בית',
];

// ── State ────────────────────────────────────
let state = { lists: [], activeListId: null };
let dragSrcIndex = -1;

// ── Persistence ──────────────────────────────
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = JSON.parse(raw);
      return;
    }
  } catch (_) {}
  state.lists = DEFAULT_LISTS.map(name => ({ id: genId(), name, tasks: [] }));
  state.activeListId = state.lists[0].id;
  saveState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── Selectors ────────────────────────────────
function getActiveList() {
  return state.lists.find(l => l.id === state.activeListId) || null;
}

function getList(id) {
  return state.lists.find(l => l.id === id) || null;
}

// ── List operations ──────────────────────────
function createList(name) {
  const list = { id: genId(), name: name.trim(), tasks: [] };
  state.lists.push(list);
  state.activeListId = list.id;
  saveState();
  render();
}

function deleteList(id) {
  state.lists = state.lists.filter(l => l.id !== id);
  if (state.activeListId === id) {
    state.activeListId = state.lists[0]?.id || null;
  }
  saveState();
  render();
}

function selectList(id) {
  state.activeListId = id;
  saveState();
  render();
}

// ── Task operations ──────────────────────────
function addTask(text) {
  const list = getActiveList();
  if (!list || !text.trim()) return;
  list.tasks.push({ id: genId(), text: text.trim(), done: false });
  saveState();
  renderTasks();
  renderSidebar(); // update count badge
}

function toggleTask(listId, taskId) {
  const task = getList(listId)?.tasks.find(t => t.id === taskId);
  if (task) {
    task.done = !task.done;
    saveState();
    renderTasks();
  }
}

function deleteTask(listId, taskId) {
  const list = getList(listId);
  if (list) {
    list.tasks = list.tasks.filter(t => t.id !== taskId);
    saveState();
    renderTasks();
    renderSidebar();
  }
}

function moveTask(listId, fromIdx, toIdx) {
  const list = getList(listId);
  if (!list || fromIdx === toIdx) return;
  const [item] = list.tasks.splice(fromIdx, 1);
  list.tasks.splice(toIdx, 0, item);
  saveState();
  renderTasks();
}

// ── Rendering ────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSidebar() {
  const nav = document.getElementById('list-nav');
  nav.innerHTML = state.lists.map(l => {
    const remaining = l.tasks.filter(t => !t.done).length;
    const isActive = l.id === state.activeListId;
    return `
      <li class="list-item${isActive ? ' active' : ''}" data-id="${l.id}">
        <span class="list-name" onclick="selectList('${l.id}')">${escHtml(l.name)}</span>
        ${remaining > 0 ? `<span class="list-count">${remaining}</span>` : ''}
        <button class="btn-delete-list" onclick="promptDeleteList('${l.id}')" title="מחק רשימה">&times;</button>
      </li>`;
  }).join('');
}

function renderTasks() {
  const list = getActiveList();
  const view = document.getElementById('task-view');
  const emptyState = document.getElementById('empty-state');

  if (!list) {
    view.hidden = true;
    emptyState.hidden = false;
    return;
  }

  view.hidden = false;
  emptyState.hidden = true;
  document.getElementById('list-title').textContent = list.name;

  const taskList = document.getElementById('task-list');
  taskList.innerHTML = list.tasks.map((t, i) => `
    <li class="task-item${t.done ? ' done' : ''}" draggable="true" data-index="${i}">
      <span class="drag-handle">⠿</span>
      <input type="checkbox" class="task-checkbox" ${t.done ? 'checked' : ''}
             onchange="toggleTask('${list.id}', '${t.id}')" />
      <span class="task-text">${escHtml(t.text)}</span>
      <button class="btn-delete-task" onclick="deleteTask('${list.id}', '${t.id}')" title="מחק">&times;</button>
    </li>`
  ).join('');

  bindDragDrop(list.id);
  renderDoneBar(list);
}

function renderDoneBar(list) {
  const total = list.tasks.length;
  const done = list.tasks.filter(t => t.done).length;
  const bar = document.getElementById('tasks-done-bar');
  if (total === 0) {
    bar.textContent = '';
    return;
  }
  bar.textContent = done === total
    ? `כל ${total} המשימות הושלמו`
    : `${done} מתוך ${total} הושלמו`;
}

function render() {
  renderSidebar();
  renderTasks();
}

// ── Drag & Drop ──────────────────────────────
function bindDragDrop(listId) {
  const items = document.querySelectorAll('.task-item');

  items.forEach(item => {
    item.addEventListener('dragstart', e => {
      dragSrcIndex = parseInt(item.dataset.index, 10);
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', dragSrcIndex);
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      document.querySelectorAll('.task-item').forEach(i => i.classList.remove('drag-over'));
    });

    item.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      document.querySelectorAll('.task-item').forEach(i => i.classList.remove('drag-over'));
      item.classList.add('drag-over');
    });

    item.addEventListener('dragleave', () => {
      item.classList.remove('drag-over');
    });

    item.addEventListener('drop', e => {
      e.preventDefault();
      item.classList.remove('drag-over');
      const toIdx = parseInt(item.dataset.index, 10);
      moveTask(listId, dragSrcIndex, toIdx);
    });
  });
}

// ── Modal ────────────────────────────────────
let modalCallback = null;

function openModal(title, defaultValue, callback) {
  document.getElementById('modal-title').textContent = title;
  const input = document.getElementById('modal-input');
  input.value = defaultValue || '';
  modalCallback = callback;
  document.getElementById('modal-overlay').classList.remove('hidden');
  setTimeout(() => { input.focus(); input.select(); }, 50);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  modalCallback = null;
}

function confirmModal() {
  const val = document.getElementById('modal-input').value.trim();
  if (val && modalCallback) {
    modalCallback(val);
  }
  closeModal();
}

// ── Actions exposed to inline handlers ───────
function promptDeleteList(id) {
  const list = getList(id);
  if (!list) return;
  // No tasks — delete without confirm
  if (list.tasks.length === 0) {
    deleteList(id);
    return;
  }
  if (window.confirm(`למחוק את הרשימה "${list.name}" (${list.tasks.length} משימות)?`)) {
    deleteList(id);
  }
}

// ── Boot ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  render();

  // New list button
  document.getElementById('btn-new-list').addEventListener('click', () => {
    openModal('שם הרשימה החדשה', '', name => createList(name));
  });

  // Add task
  const taskInput = document.getElementById('task-input');

  document.getElementById('btn-add-task').addEventListener('click', () => {
    addTask(taskInput.value);
    taskInput.value = '';
    taskInput.focus();
  });

  taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      addTask(taskInput.value);
      taskInput.value = '';
    }
  });

  // Modal buttons
  document.getElementById('modal-confirm').addEventListener('click', confirmModal);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);

  document.getElementById('modal-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') confirmModal();
    if (e.key === 'Escape') closeModal();
  });

  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });
});
