// ==== Utility ====

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getHourLabel(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const hr = hour % 12 || 12;
  return `${hr}:00 ${suffix}`;
}

// ==== State ====
let tasks = [];
let selectedDate = formatDate(new Date());
let selectedCategory = "all";
let editingTaskId = null;

// ==== DOM Elements ====
const schedulePage = document.getElementById("schedule-page");
const brainDumpPage = document.getElementById("brain-dump-page");
const scheduleContainer = document.getElementById("schedule");
const taskFormContainer = document.getElementById("task-form-container");
const taskForm = document.getElementById("task-form");
const dateButtonsContainer = document.getElementById("date-buttons");
const categoryButtons = document.querySelectorAll(".category-filter button");
const brainDumpFormContainer = document.getElementById("brain-dump-form-container");
const brainDumpForm = document.getElementById("brain-dump-form");

// ==== Page Toggle ====
document.getElementById("show-schedule").addEventListener("click", () => {
  schedulePage.classList.add("active");
  brainDumpPage.classList.remove("active");
  document.getElementById("show-schedule").classList.add("active");
  document.getElementById("show-brain-dump").classList.remove("active");
  renderSchedule();
});

document.getElementById("show-brain-dump").addEventListener("click", () => {
  brainDumpPage.classList.add("active");
  schedulePage.classList.remove("active");
  document.getElementById("show-brain-dump").classList.add("active");
  document.getElementById("show-schedule").classList.remove("active");
  renderBrainDump();
});

// ==== Date Buttons ====
function setupDateButtons() {
  dateButtonsContainer.innerHTML = "";
  for (let offset = -1; offset <= 5; offset++) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const btn = document.createElement("button");
    btn.textContent = `${offset === -1 ? "Yesterday" : offset === 0 ? "Today" : date.toLocaleDateString()}`;
    btn.dataset.date = formatDate(date);
    if (formatDate(date) === selectedDate) btn.classList.add("active");

    btn.addEventListener("click", () => {
      selectedDate = formatDate(date);
      setupDateButtons();
      renderSchedule();
    });
    dateButtonsContainer.appendChild(btn);
  }
}
setupDateButtons();

// ==== Category Filter ====
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedCategory = btn.dataset.category;
    renderSchedule();
  });
});

// ==== Render Schedule ====
function renderSchedule() {
  scheduleContainer.innerHTML = "";

  for (let hour = 0; hour < 24; hour++) {
    const hourLabel = document.createElement("div");
    hourLabel.className = "schedule-hour";
    hourLabel.textContent = getHourLabel(hour);
    scheduleContainer.appendChild(hourLabel);

    const hourSlot = document.createElement("div");
    hourSlot.className = "schedule-slot";
    hourSlot.dataset.hour = hour;
    scheduleContainer.appendChild(hourSlot);
  }

  const tasksForDay = tasks.filter(
    (t) => t.date === selectedDate && (selectedCategory === "all" || t.category === selectedCategory)
  );

  tasksForDay.forEach((task) => {
    const start = parseInt(task.startTime.split(":")[0]);
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.dataset.category = task.category;
    taskDiv.innerHTML = `
      <span>${task.title}</span>
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <button class="edit-btn">✏️</button>
    `;

    const hourSlot = document.querySelector(`.schedule-slot[data-hour="${start}"]`);
    if (hourSlot) {
      hourSlot.appendChild(taskDiv);

      // Completion toggle
      taskDiv.querySelector("input").addEventListener("change", (e) => {
        task.completed = e.target.checked;
      });

      // Edit button
      taskDiv.querySelector(".edit-btn").addEventListener("click", () => {
        openTaskForm(task, true);
      });
    }
  });
}

// Handle form submission (including date and time)
taskForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page refresh
    
    const taskName = document.getElementById('task-name').value;
    const taskDescription = document.getElementById('task-description').value;
    const taskDate = document.getElementById('task-date').value;
    const taskTime = document.getElementById('task-time').value;
    
    // Example of handling the new task (can be added to a list or database)
    console.log(`New Task: ${taskName}`);
    console.log(`Description: ${taskDescription}`);
    console.log(`Date: ${taskDate}`);
    console.log(`Time: ${taskTime}`);
    
    // Hide the form after submission
    taskFormContainer.style.display = 'none';
});

// ==== Task Form ====
document.getElementById("add-task-btn").addEventListener("click", () => {
  openTaskForm();
});

function openTaskForm(task = null, editing = false) {
  taskFormContainer.style.display = "block";
  document.getElementById("form-title").textContent = editing ? "Edit Task" : "Add Task";

  if (editing && task) {
    editingTaskId = task.id;
    document.getElementById("task-id").value = task.id;
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-date").value = task.date;
    document.getElementById("start-time").value = task.startTime;
    document.getElementById("end-time").value = task.endTime;
    document.getElementById("task-category").value = task.category;
    document.getElementById("task-details").value = task.details;
  } else {
    editingTaskId = null;
    taskForm.reset();
    document.getElementById("task-date").value = selectedDate;
  }
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTask = {
    id: editingTaskId || Date.now(),
    title: document.getElementById("task-title").value,
    date: document.getElementById("task-date").value,
    startTime: document.getElementById("start-time").value,
    endTime: document.getElementById("end-time").value,
    category: document.getElementById("task-category").value,
    details: document.getElementById("task-details").value,
    completed: false,
  };

  if (editingTaskId) {
    tasks = tasks.map((t) => (t.id === editingTaskId ? newTask : t));
  } else {
    tasks.push(newTask);
  }

  taskFormContainer.style.display = "none";
  renderSchedule();
});

// ==== Brain Dump ====

function openBrainDumpForm(category) {
  brainDumpFormContainer.style.display = "block";
  document.getElementById("dump-category").value = category;
}

brainDumpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("dump-title").value;
  const description = document.getElementById("dump-description").value;
  const dueDate = document.getElementById("dump-due-date").value;
  const category = document.getElementById("dump-category").value;
  const scheduleDate = document.getElementById("dump-schedule-date").value;
  const scheduleStart = document.getElementById("dump-schedule-time").value;
  const scheduleEnd = document.getElementById("dump-schedule-end").value;

  if (scheduleDate && scheduleStart) {
    tasks.push({
      id: Date.now(),
      title,
      date: scheduleDate,
      startTime: scheduleStart,
      endTime: scheduleEnd || scheduleStart,
      category,
      details: description,
      completed: false,
    });
  }

  const dumpDiv = document.querySelector(`.dump-tasks[data-category="${category}"]`);
  const item = document.createElement("div");
  item.textContent = `${title} ${dueDate ? `(Due: ${dueDate})` : ""}`;
  dumpDiv.appendChild(item);

  brainDumpForm.reset();
  brainDumpFormContainer.style.display = "none";
  renderSchedule();
});

function renderBrainDump() {
  // Tasks already rendered on submission
}
