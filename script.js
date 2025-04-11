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

// Toggle between Schedule and Brain Dump pages
const showScheduleBtn = document.getElementById("show-schedule");
const showBrainDumpBtn = document.getElementById("show-brain-dump");
const schedulePage = document.getElementById("schedule-page");
const brainDumpPage = document.getElementById("brain-dump-page");

// Toggle buttons to switch between pages
showScheduleBtn.addEventListener("click", () => {
  schedulePage.classList.add("active");
  brainDumpPage.classList.remove("active");
  showScheduleBtn.classList.add("active");
  showBrainDumpBtn.classList.remove("active");
});

showBrainDumpBtn.addEventListener("click", () => {
  brainDumpPage.classList.add("active");
  schedulePage.classList.remove("active");
  showBrainDumpBtn.classList.add("active");
  showScheduleBtn.classList.remove("active");
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

// Handle form submission (including date, time, and category)
taskForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page refresh

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
    overlay.style.display = "none";
    taskFormContainer.style.opacity = "0";
    renderSchedule();
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

let editingTask = null; // Store the task being edited

const addTaskButton = document.getElementById('add-task-btn');
const taskFormContainer = document.getElementById('task-form-container');
const cancelButton = document.getElementById('cancel-task');
const taskForm = document.getElementById('task-form');
const overlay = document.getElementById('overlay');
const taskList = document.getElementById('task-list');

// Show the form when 'Add Task' button is clicked
addTaskButton.addEventListener('click', () => {
    editingTask = null; // Reset the editing task
    taskForm.reset(); // Clear the form
    taskFormContainer.style.display = 'block';
    overlay.style.display = 'block';
    setTimeout(() => taskFormContainer.style.opacity = '1', 10); // Fade-in effect
});

// Hide the form when 'Cancel' button is clicked
cancelButton.addEventListener('click', () => {
    taskFormContainer.style.display = 'none';
    overlay.style.display = 'none';
    taskFormContainer.style.opacity = '0';
});

// Hide the form if the overlay is clicked
overlay.addEventListener('click', () => {
    taskFormContainer.style.display = 'none';
    overlay.style.display = 'none';
    taskFormContainer.style.opacity = '0';
});


// Handle form submission (including date, time, and category)
taskForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page refresh
    
    const taskName = document.getElementById('task-name').value;
    const taskDescription = document.getElementById('task-description').value;
    const taskDate = document.getElementById('task-date').value;
    const taskTime = document.getElementById('task-time').value;
    const taskCategory = document.getElementById('task-category').value;

    if (editingTask) {
        // Edit existing task
        editingTask.name = taskName;
        editingTask.description = taskDescription;
        editingTask.date = taskDate;
        editingTask.time = taskTime;
        editingTask.category = taskCategory;
        updateTaskInList(editingTask);
    } else {
        // Add new task
        const newTask = {
            name: taskName,
            description: taskDescription,
            date: taskDate,
            time: taskTime,
            category: taskCategory
        };
        addTaskToList(newTask);
    }

    // Close the form after submission
    taskFormContainer.style.display = 'none';
    overlay.style.display = 'none';
    taskFormContainer.style.opacity = '0';
});

// Add new task to the task list
function addTaskToList(task) {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');
    taskItem.innerHTML = `
        <div><strong>${task.name}</strong> - ${task.category}</div>
        <div>${task.description}</div>
        <div>${task.date} at ${task.time}</div>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
    
    taskItem.querySelector('.edit-btn').addEventListener('click', () => {
        editTask(task);
    });
    
    taskItem.querySelector('.delete-btn').addEventListener('click', () => {
        deleteTask(taskItem);
    });

    taskList.appendChild(taskItem);
}

// Edit a task
function editTask(task) {
    editingTask = task;
    document.getElementById('task-name').value = task.name;
    document.getElementById('task-description').value = task.description;
    document.getElementById('task-date').value = task.date;
    document.getElementById('task-time').value = task.time;
    document.getElementById('task-category').value = task.category;

    taskFormContainer.style.display = 'block';
    overlay.style.display = 'block';
    setTimeout(() => taskFormContainer.style.opacity = '1', 10);
}

// Update task in the list
function updateTaskInList(task) {
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => {
        const taskName = item.querySelector('div strong').textContent;
        if (taskName === task.name) {
            item.querySelector('div strong').textContent = `${task.name} - ${task.category}`;
            item.querySelector('div:nth-of-type(2)').textContent = task.description;
            item.querySelector('div:nth-of-type(3)').textContent = `${task.date} at ${task.time}`;
        }
    });
}

// Delete task from the list
function deleteTask(taskItem) {
    taskItem.remove();
}



// ==== Brain Dump ====


// Open Brain Dump Task Form and assign category
function openBrainDumpForm(category) {
  const formContainer = document.getElementById('brain-dump-form-container');
  formContainer.style.display = 'block';
  document.getElementById('dump-category').value = category;
}

// Cancel Task Form for both Schedule and Brain Dump pages
document.getElementById('cancel-task').addEventListener('click', () => {
  document.getElementById('task-form-container').style.display = 'none';
});

document.getElementById('cancel-brain-dump-task').addEventListener('click', () => {
  document.getElementById('brain-dump-form-container').style.display = 'none';
});

// Handle Task Submission for Brain Dump and Schedule
document.getElementById('brain-dump-form').addEventListener('submit', function (event) {
  event.preventDefault();
  
  const taskTitle = document.getElementById('dump-title').value;
  const taskDescription = document.getElementById('dump-description').value;
  const taskCategory = document.getElementById('dump-category').value;
  const taskDueDate = document.getElementById('dump-due-date').value;
  const taskScheduleDate = document.getElementById('dump-schedule-date').value;
  const taskStartTime = document.getElementById('dump-schedule-time').value;
  const taskEndTime = document.getElementById('dump-schedule-end').value;

  // Validate if the task has a title or description
  if (taskTitle.trim() === "" && taskDescription.trim() === "") {
    alert("Please provide a task title or description.");
    return;
  }

  // Create Task Object for Brain Dump
  const task = {
    title: taskTitle,
    description: taskDescription,
    category: taskCategory,
    dueDate: taskDueDate,
    scheduleDate: taskScheduleDate,
    startTime: taskStartTime,
    endTime: taskEndTime
  };

  // Save task to the appropriate category in the Brain Dump page
  const taskList = document.querySelector(`#dump-${taskCategory} .dump-tasks`);
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.innerHTML = `
    <h4>${task.title}</h4>
    <p>${task.description}</p>
    <p><strong>Due Date:</strong> ${task.dueDate}</p>
    <p><strong>Schedule:</strong> ${task.scheduleDate} ${task.startTime ? `from ${task.startTime}` : ""} ${task.endTime ? `to ${task.endTime}` : ""}</p>
  `;
  taskList.appendChild(taskElement);

  // Clear form inputs after submission
  document.getElementById('brain-dump-form').reset();
  
  // Hide the form after task is saved
  document.getElementById('brain-dump-form-container').style.display = 'none';

  // Optionally, you can add functionality to automatically add this task to the Schedule page here.
  // For now, we're just adding it to the Brain Dump tasks.
  alert('Task saved to Brain Dump!');
});

// Handle Task Form Submission for the Schedule Page
document.getElementById('task-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const taskName = document.getElementById('task-name').value;
  const taskDescription = document.getElementById('task-description').value;
  const taskDate = document.getElementById('task-date').value;
  const taskTime = document.getElementById('task-time').value;
  const taskCategory = document.getElementById('task-category').value;

  // Validate if the task has a name
  if (taskName.trim() === "") {
    alert("Please provide a task name.");
    return;
  }

  // Create Task Object for Schedule
  const task = {
    name: taskName,
    description: taskDescription,
    date: taskDate,
    time: taskTime,
    category: taskCategory
  };

  // Add Task to the Schedule page
  const scheduleContainer = document.getElementById('schedule');
  const taskElement = document.createElement("div");
  taskElement.classList.add("schedule-task");
  taskElement.innerHTML = `
    <h4>${task.name}</h4>
    <p>${task.description}</p>
    <p><strong>Date:</strong> ${task.date}</p>
    <p><strong>Time:</strong> ${task.time}</p>
    <p><strong>Category:</strong> ${task.category}</p>
  `;
  scheduleContainer.appendChild(taskElement);

  // Clear form inputs after submission
  document.getElementById('task-form').reset();
  
  // Hide the form after task is saved
  document.getElementById('task-form-container').style.display = 'none';
  
  alert('Task saved to the Schedule!');
});

// Task Filter by Category (Brain Dump Page)
const categoryButtons = document.querySelectorAll('.category-filter button');
categoryButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    // Remove active class from all buttons
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to the clicked button
    event.target.classList.add('active');

    const category = event.target.dataset.category;
    const tasks = document.querySelectorAll('.dump-tasks');
    tasks.forEach(taskList => {
      if (taskList.dataset.category === category || category === 'all') {
        taskList.style.display = 'block';
      } else {
        taskList.style.display = 'none';
      }
    });
  });
});

// Initialize category to show all tasks by default
document.querySelector('.category-filter button[data-category="home"]').click();

// Show Task Form in Schedule page
document.getElementById('add-task-btn').addEventListener('click', () => {
  document.getElementById('task-form-container').style.display = 'block';
});
