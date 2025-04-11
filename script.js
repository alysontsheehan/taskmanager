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
    
    if (category === 'all') {
      // Show all tasks if the 'All' category is selected
      tasks.forEach(taskList => {
        taskList.style.display = 'block';
      });
    } else {
      // Filter tasks by category
      tasks.forEach(taskList => {
        if (taskList.dataset.category === category) {
          taskList.style.display = 'block';
        } else {
          taskList.style.display = 'none';
        }
      });
    }
  });
});

// Initialize category to show 'All' tasks by default
document.querySelector('.category-filter button[data-category="all"]').click();

// Show Task Form in Schedule page
document.getElementById('add-task-btn').addEventListener('click', () => {
  document.getElementById('task-form-container').style.display = 'block';
});
