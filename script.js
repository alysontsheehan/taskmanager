document.addEventListener('DOMContentLoaded', function() {
  // Helper function to format date (e.g., "April 10")
  function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Get today's date and the next 5 days
  const today = new Date();
  const days = [0, 1, 2, 3, 4, 5].map(offset => {
    const day = new Date(today);
    day.setDate(today.getDate() + offset);
    return day;
  });

  // Update the buttons with the correct dates
  document.getElementById('today-btn').querySelector('.date').textContent = formatDate(days[0]);
  document.getElementById('tomorrow-btn').querySelector('.date').textContent = formatDate(days[1]);
  document.getElementById('day-3-btn').querySelector('.date').textContent = formatDate(days[2]);
  document.getElementById('day-4-btn').querySelector('.date').textContent = formatDate(days[3]);
  document.getElementById('day-5-btn').querySelector('.date').textContent = formatDate(days[4]);
  document.getElementById('day-6-btn').querySelector('.date').textContent = formatDate(days[5]);

  // Toggle between schedule view and brain dump
  document.getElementById('toggle-schedule').addEventListener('click', function() {
    document.getElementById('schedule-view').style.display = 'block';
    document.getElementById('brain-dump-view').style.display = 'none';
  });

  document.getElementById('toggle-brain-dump').addEventListener('click', function() {
    document.getElementById('brain-dump-view').style.display = 'block';
    document.getElementById('schedule-view').style.display = 'none';
  });

  // Add task to brain dump modules
  document.querySelectorAll('.add-task').forEach(button => {
    button.addEventListener('click', function() {
      const category = this.closest('.module').dataset.category;
      const taskName = prompt('Enter task name:');
      const dueDate = prompt('Enter due date (optional):');
      const details = prompt('Enter task details:');

      if (taskName) {
        const task = document.createElement('li');
        task.classList.add('task');
        task.innerHTML = `<strong>${taskName}</strong><br>Due: ${dueDate || 'No due date'}<br>Details: ${details || 'None'}`;
        this.closest('.module').querySelector('.task-list').appendChild(task);
      }
    });
  });

  // Switch between hourly and list view
  document.getElementById('view-toggle').addEventListener('change', function() {
    const viewType = this.value;
    if (viewType === 'hourly') {
      document.querySelector('.schedule').style.display = 'grid';
      // Add functionality to generate the hourly blocks here
    } else if (viewType === 'list') {
      document.querySelector('.schedule').style.display = 'block';
      // Add functionality to show tasks as a list here
    }
  });

  // Filter tasks by category (home, work, personal, other)
  document.getElementById('category-filter').addEventListener('change', function() {
    const filterValue = this.value;
    const allTasks = document.querySelectorAll('.task');

    allTasks.forEach(task => {
      if (filterValue === 'all' || task.classList.contains(filterValue)) {
        task.style.display = 'block';
      } else {
        task.style.display = 'none';
      }
    });
  });
});