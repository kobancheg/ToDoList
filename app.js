(function () {
	let objOfTasks;
	if (localStorage.getItem("item")) {
		objOfTasks = JSON.parse(localStorage.getItem("item"));
	} else {
		objOfTasks = {};
	}

	console.log(objOfTasks)

	const themes = {
		default: {
			"--base-text-color": "#212529",
			"--header-bg": "#007bff",
			"--header-text-color": "#fff",
			"--default-btn-bg": "#007bff",
			"--default-btn-text-color": "#fff",
			"--default-btn-hover-bg": "#0069d9",
			"--default-btn-border-color": "#0069d9",
			"--danger-btn-bg": "#dc3545",
			"--danger-btn-text-color": "#fff",
			"--danger-btn-hover-bg": "#bd2130",
			"--danger-btn-border-color": "#dc3545",
			"--input-border-color": "#ced4da",
			"--input-bg-color": "#fff",
			"--input-text-color": "#495057",
			"--input-focus-bg-color": "#fff",
			"--input-focus-text-color": "#495057",
			"--input-focus-border-color": "#80bdff",
			"--input-focus-box-shadow": "0 0 0 0.2rem rgba(0, 123, 255, 0.25)"
		},
		dark: {
			"--base-text-color": "#212529",
			"--header-bg": "#343a40",
			"--header-text-color": "#fff",
			"--default-btn-bg": "#58616b",
			"--default-btn-text-color": "#fff",
			"--default-btn-hover-bg": "#292d31",
			"--default-btn-border-color": "#343a40",
			"--default-btn-focus-box-shadow":
				"0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
			"--danger-btn-bg": "#b52d3a",
			"--danger-btn-text-color": "#fff",
			"--danger-btn-hover-bg": "#88222c",
			"--danger-btn-border-color": "#88222c",
			"--input-border-color": "#ced4da",
			"--input-bg-color": "#fff",
			"--input-text-color": "#495057",
			"--input-focus-bg-color": "#fff",
			"--input-focus-text-color": "#495057",
			"--input-focus-border-color": "#78818a",
			"--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)"
		},
		light: {
			"--base-text-color": "#212529",
			"--header-bg": "#fff",
			"--header-text-color": "#212529",
			"--default-btn-bg": "#fff",
			"--default-btn-text-color": "#212529",
			"--default-btn-hover-bg": "#e8e7e7",
			"--default-btn-border-color": "#343a40",
			"--default-btn-focus-box-shadow":
				"0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
			"--danger-btn-bg": "#f1b5bb",
			"--danger-btn-text-color": "#212529",
			"--danger-btn-hover-bg": "#ef808a",
			"--danger-btn-border-color": "#e2818a",
			"--input-border-color": "#ced4da",
			"--input-bg-color": "#fff",
			"--input-text-color": "#495057",
			"--input-focus-bg-color": "#fff",
			"--input-focus-text-color": "#495057",
			"--input-focus-border-color": "#78818a",
			"--input-focus-box-shadow": "0 0 0 0.2rem rgba(141, 143, 146, 0.25)"
		}
	};

	let lastSelectedTheme = localStorage.getItem("app_theme") || "default";

	//Elements UI
	const container = document.querySelector('.tasks-list-section .container');
	const listContainer = document.querySelector(
		".tasks-list-section .list-group"
	);
	const form = document.forms["addTask"];
	const inputTitle = form.elements["title"];
	const inputBody = form.elements["body"];
	const themeSelect = document.getElementById("themeSelect");

	//Events
	setTheme(lastSelectedTheme);
	renderAllTasks(objOfTasks);
	msgEmptyList(objOfTasks);

	form.addEventListener("submit", onFormSubmitHandler);
	listContainer.addEventListener('click', onSuccess);
	listContainer.addEventListener("click", onDeleteHandler);
	themeSelect.addEventListener("change", onThemeSelectHandler);

	function msgEmptyList(list) {
		if (Object.keys(list).length === 0) {
			const msg = document.createElement("div");
			msg.classList.add('alert', 'alert-primary');
			msg.textContent = 'Список задач пуст, создайте первую задачу!';
			container.appendChild(msg);
		}
	}

	function removeMsg() {
		const msg = document.querySelector('.alert');
		if (msg) { msg.remove() }
	}

	function renderAllTasks(tasksList) {
		if (!tasksList) {
			console.error("Передайте список задач!");
			return;
		}

		const fragment = document.createDocumentFragment();
		Object.values(tasksList).forEach(task => {
			const li = listItemTemplate(task);
			fragment.appendChild(li);
		});
		listContainer.appendChild(fragment);
	}

	function listItemTemplate({ _id, title, body, completed } = {}) {
		const li = document.createElement("li");
		li.classList.add(
			"list-group-item",
			"d-flex",
			"align-items-center",
			"flex-wrap",
			"mt-2"
		);
		li.setAttribute("data-task-id", _id);

		if (completed === true) li.classList.add('bg-light', 'text-dark');
		
		const span = document.createElement("span");
		span.textContent = title;
		span.style.fontWeight = "bold";

		const successBtn = document.createElement("button");
		successBtn.classList.add("btn", "btn-success", "ml-auto", "success-btn");
		const deleteBtn = document.createElement("button");
		deleteBtn.classList.add("btn", "btn-danger", "ml-1", "delete-btn");

		const article = document.createElement("p");
		article.textContent = body;
		article.classList.add("mt-2", "w-100");

		li.appendChild(span);
		li.appendChild(successBtn);
		li.appendChild(deleteBtn);
		li.appendChild(article);

		return li;
	}

	function onFormSubmitHandler(e) {
		e.preventDefault();
		const titleValue = inputTitle.value;
		const bodyValue = inputBody.value;

		if (!titleValue || !bodyValue) {
			alert("Пожалуйста введите название и содержание задачи");
			return;
		}
		const task = createNewTask(titleValue, bodyValue);
		const listItem = listItemTemplate(task);
		listContainer.insertAdjacentElement("afterbegin", listItem);
		form.reset();
	}

	function createNewTask(title, body) {
		const newTask = {
			title,
			body,
			completed: false,
			_id: `task-${Math.random()}`
		};

		objOfTasks[newTask._id] = newTask;

		localStorage.setItem("item", JSON.stringify(objOfTasks));

		removeMsg();

		return { ...newTask };
	}

	function deleteTask(id) {
		const { title } = objOfTasks[id];
		const isConfirm = confirm(
			`Вы действительно хотите удалить задачу: ${title}?`
		);
		if (!isConfirm) return isConfirm;
		delete objOfTasks[id];
		localStorage.setItem("item", JSON.stringify(objOfTasks));
		return isConfirm;
	}

	function deleteTaskFromHtml(confirmed, el) {
		if (!confirmed) return;
		el.remove();
	}

	function onDeleteHandler({ target }) {
		if (target.classList.contains("delete-btn")) {
			const parent = target.closest("[data-task-id]");
			const id = parent.dataset.taskId;
			const confirmed = deleteTask(id);
			deleteTaskFromHtml(confirmed, parent);
			msgEmptyList(objOfTasks);
		}
	}

	function currentTask(id, parent) {
		const { title } = objOfTasks[id];
		const isConfirm = confirm(`Отметить задачу: ${title} как выполненную?`)
		if (!isConfirm) return;
		objOfTasks[id]['completed'] = true;
		localStorage.setItem("item", JSON.stringify(objOfTasks));
		parent.classList.add('bg-light', 'text-dark');
	}

	function onSuccess({ target }) {
		if (target.classList.contains('success-btn')) {
			const parent = target.closest("[data-task-id]");
			const id = parent.dataset.taskId;
			currentTask(id, parent);
		}
	}

	function onThemeSelectHandler(e) {
		const selectedTheme = themeSelect.value;
		const isConfirmed = confirm(
			`Вы действительно хотите изменить тему: ${selectedTheme}`
		);
		if (!isConfirmed) {
			themeSelect.value = lastSelectedTheme;
			return;
		}
		setTheme(selectedTheme);
		lastSelectedTheme = selectedTheme;
		localStorage.setItem("app_theme", selectedTheme);
	}

	function setTheme(name) {
		const selectedThemeOdj = themes[name];
		Object.entries(selectedThemeOdj).forEach(([key, value]) => {
			document.documentElement.style.setProperty(key, value);
		});
	}
})();
