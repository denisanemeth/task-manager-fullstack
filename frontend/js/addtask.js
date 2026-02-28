// always use a relative URL so we never accidentally talk to localhost
const API_URLS = '/api/tasks';

function getAuthHeaders() {
	const token = localStorage.getItem('token');
	return {
		'Content-Type': 'application/json',
		Authorization: token ? `Bearer ${token}` : ''
	};
}

async function createTask(data) {
	const res = await fetch(API_URLS, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify(data)
	});
	return res.json();
}

async function fetchTasks() {
	try {
		const res = await fetch(`${API_URLS}/my`, { headers: getAuthHeaders() });
		const data = await res.json();
		return data && data.data ? data.data : [];
	} catch (err) {
		console.error('Unable to fetch tasks:', err);
		return [];
	}
}

async function deleteTask(id) {
	const res = await fetch(`${API_URLS}/${id}`, {
		method: 'DELETE',
		headers: getAuthHeaders()
	});
	return res.json();
}

async function toggleTaskComplete(id, completed) {
	const status = completed ? 'done' : 'todo';
	const res = await fetch(`${API_URLS}/${id}`, {
		method: 'PUT',
		headers: getAuthHeaders(),
		body: JSON.stringify({ status })
	});
	return res.json();
}

function createTaskElement(task) {//creare element pt fiecare task,nu putem scrie static in html ptc task urile sunt dinamice
	const el = document.createElement('div');
	el.className = 'task-item';

	const left = document.createElement('div');
	left.className = 'task-left';
	const chk = document.createElement('input');
	chk.type = 'checkbox';
	chk.checked = task.status === 'done';
	chk.addEventListener('change', async () => {//cand user bifeaza sau debifeaza checkbox
		await toggleTaskComplete(task._id, chk.checked);
		initTasksPage();
	});
	left.appendChild(chk);
	const titleContainer = document.createElement('div');
	titleContainer.style.marginLeft = '12px';
	const title = document.createElement('span');
	title.textContent = task.title;
	title.style.fontWeight = '600';
	titleContainer.appendChild(title);
	if (task.description) {
		const desc = document.createElement('div');
		desc.textContent = task.description;
		desc.style.fontSize = '0.9em';
		desc.style.color = '#555';
		titleContainer.appendChild(desc);
	}
	left.appendChild(titleContainer);

	const right = document.createElement('div');
	right.className = 'task-right';
	const status = document.createElement('span');
	status.className = 'priority';
	status.textContent = task.status;
	status.style.padding = '6px 10px';
	status.style.borderRadius = '999px';
	status.style.fontSize = '12px';
	status.style.background = '#f0f6ff';
	status.style.color = '#2c3e50';
	right.appendChild(status);

	const del = document.createElement('button');
	del.textContent = '🗑';
	del.style.marginLeft = '8px';
	del.addEventListener('click', async () => {
		await deleteTask(task._id);
		initTasksPage();
	});
	right.appendChild(del);

	el.appendChild(left);
	el.appendChild(right);
	return el;
}

function renderTasks(tasks) {
	const container = document.getElementById('tasksContainer');
	if (!container) return;
	container.innerHTML = '';
	if (!tasks || tasks.length === 0) {
		const empty = document.createElement('p');
		empty.textContent = 'Nu ai nicio sarcină încă.';
		container.appendChild(empty);
		return;
	}
	tasks.forEach(t => container.appendChild(createTaskElement(t)));
}

async function handleAddTask(event) {
	if (event) event.preventDefault();
	const title = document.getElementById('title').value.trim();
	const description = document.getElementById('description').value.trim();
	const status = document.getElementById('status') ? document.getElementById('status').value : 'todo';
	const dueDate = document.getElementById('dueDate').value || null;
	if (!title) return alert('Adauga un titlu');
	await createTask({ title, description, status, dueDate });
	document.getElementById('taskForm').reset();
	initTasksPage();
}

async function initTasksPage() {
	const tasks = await fetchTasks();//fetch tasks din backend
	renderTasks(tasks);//afisare fiecare task in frontend
	const form = document.getElementById('taskForm');
	if (form) {
		form.removeEventListener('submit', handleAddTask);//evitare dublare event listener daca init este apelat de mai multe ori
		form.addEventListener('submit', handleAddTask);
	}
}
//face functiile disponibile global

window.initTasksPage = initTasksPage;
window.handleAddTask = handleAddTask;

