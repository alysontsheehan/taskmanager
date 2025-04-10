// Task Storage for Brain Dump (Home, Work, Personal, Other)
let brainDumpTasks = {
    home: [],
    work: [],
    personal: [],
    other: []
};

// Store schedule tasks (in case you want to add storage capabilities in the future)
let scheduleTasks = [];

// Function to toggle between pages (Schedule and Brain Dump)
function togglePage(page) {
    document.getElementById('schedule-page').style.display = page === 'schedule' ? 'block' : 'none';
    document.getElementById('brain-dump-page').style.display = page === 'brain-dump' ? 'block' : 'none';
}

// Show tasks for specific date (Yesterday, Today, Tomorrow, Next 5 Days)
function showDate(dateType) {
    let dateDisplay = document.getElementById('date-display');
    let today = new Date();
    
    switch (dateType) {
        case 'yesterday':
            today.setDate(today.getDate() - 1);
            break;
        case 'today':
            break;
        case 'tomorrow':
            today.setDate(today.getDate() + 1);
            break;
        case 'next':
            today.setDate(today.getDate() + 5);
            break;
    }
    
    let dateString = today.toDateString();
    dateDisplay.innerHTML = `Tasks for: ${dateString}`;

    // Here you would ideally filter your tasks based on the date type and show them.
    console.log(`Showing tasks for: ${dateString}`);
}

// Show Brain Dump Form when "Add Task" button is clicked
function showBrainDumpForm(category) {
    document.getElementById('task-form-container').style.display = 'block';
    document.getElementById('brain-dump-category').value = category;
}

// Close Brain Dump Form
function closeTaskForm() {
    document.getElementById('task-form-container').style.display = 'none';
}

// Handle form submission to add a new task to Brain Dump
document.getElementById('brain-dump-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('brain-dump-title').value;
    const description = document.getElementById('brain-dump-description').value;
    const dueDate = document.getElementById('brain-dump-due-date').value;
    const scheduleTime = document.getElementById('brain-dump-schedule-time').value;
    const category = document.getElementById('brain-dump-category').value;

    const task = {
        title,
        description,
        dueDate,
        scheduleTime,
        category
    };

    brainDumpTasks[category].push(task);
    displayBrainDumpTasks(category);
    addTaskToSchedule(task);

    // Clear form fields
    document.getElementById('brain-dump-form').reset();
    closeTaskForm();
});

// Display tasks in the Brain Dump section
function displayBrainDumpTasks(category) {
    const taskList = document.getElementById(`${category}-list`);
    taskList.innerHTML = '';

    brainDumpTasks[category].forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.textContent = `${task.title} - ${task.dueDate} at ${task.scheduleTime}`;
        taskList.appendChild(taskElement);
    });
}

// Add task to the schedule (based on schedule time)
function addTaskToSchedule(task) {
    const scheduleTimeInMinutes = convertTimeToMinutes(task.scheduleTime);
    const taskElement = document.createElement('div');
    taskElement.classList.add('task', task.category);

    taskElement.innerHTML = `
        <strong>${task.title}</strong>
        <p>${task.description}</p>
        <small>Due: ${task.dueDate} at ${task.scheduleTime}</small>
        <input type="checkbox" onclick="markTaskComplete(this)">
        <button onclick="editTask('${task.title}')">✏️</button>
    `;

    // Place the task in the corresponding schedule time slot
    const taskSlot = document.querySelector(`#schedule-time-${scheduleTimeInMinutes}`);
    if (taskSlot) {
        taskSlot.appendChild(taskElement);
    }
}

// Convert time to minutes (helper function)
function convertTimeToMinutes(time) {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
}

// Mark task as completed (checkbox functionality)
function markTaskComplete(checkbox) {
    if (checkbox.checked) {
        checkbox.parentElement.style.textDecoration = 'line-through';
    } else {
        checkbox.parentElement.style.textDecoration = 'none';
    }
}

// Edit task (opens task form to edit existing task)
function editTask(taskTitle) {
    const task = findTaskByTitle(taskTitle);
    if (task) {
        document.getElementById('brain-dump-title').value = task.title;
        document.getElementById('brain-dump-description').value = task.description;
        document.getElementById('brain-dump-due-date').value = task.dueDate;
        document.getElementById('brain-dump-schedule-time').value = task.scheduleTime;
        document.getElementById('brain-dump-category').value = task.category;
        document.getElementById('task-form-container').style.display = 'block';
    }
}

// Find task by its title (for editing)
function findTaskByTitle(title) {
    for (const category in brainDumpTasks) {
        const task = brainDumpTasks[category].find(task => task.title === title);
        if (task) return task;
    }
    return null;
}

// Save changes to an edited task
document.getElementById('brain-dump-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('brain-dump-title').value;
    const description = document.getElementById('brain-dump-description').value;
    const dueDate = document.getElementById('brain-dump-due-date').value;
    const scheduleTime = document.getElementById('brain-dump-schedule-time').value;
    const category = document.getElementById('brain-dump-category').value;

    const task = {
        title,
        description,
        dueDate,
        scheduleTime,
        category
    };

    // Find and replace the existing task in the appropriate category
    const index = brainDumpTasks[category].findIndex(t => t.title === title);
    if (index !== -1) {
        brainDumpTasks[category][index] = task;
        displayBrainDumpTasks(category);
        addTaskToSchedule(task);
    }

    // Clear form fields
    document.getElementById('brain-dump-form').reset();
    closeTaskForm();
});
