const tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
const statusContainers = document.querySelectorAll('.status-container');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');
const taskForm = document.getElementById('task-form');
const deleteTaskBtn = document.getElementById('delete-task');
const addTaskBtns = document.querySelectorAll('.add-task');

// Function to update task counts
function updateTaskCounts() {
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  statusContainers.forEach(container => {
    const countEls = container.querySelectorAll('span.count');
    countEls.forEach(countEl => {
      countEl.textContent = statusCounts[container.dataset.status] || 0;
    });
  });
}

// Function to render tasks
function renderTasks() {
  statusContainers.forEach(container => {
    const status = container.dataset.status;
    const taskList = container.querySelector('ul');
    taskList.innerHTML = '';
    tasks.filter(task => task.status === status).forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.textContent = task.title;
      taskItem.draggable = true;
      taskItem.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/json', JSON.stringify(task));
      });
      taskItem.addEventListener('click', () => {
        openModal(task);
      });
      taskList.appendChild(taskItem);
    });
  });
  updateTaskCounts();
}

// Function to open modal
function openModal(task) {
  taskForm.elements.title.value = task.title || '';
  taskForm.elements.description.value = task.description || '';
  taskForm.elements.status.value = task.status || 'not-started';
  deleteTaskBtn.dataset.taskId = task.id;
  modal.classList.add('active');
}

// Function to close modal
function closeModalFn() {
  modal.classList.remove('active');
  taskForm.reset();
  deleteTaskBtn.dataset.taskId = null;
}

// Event listeners
closeModalBtn.addEventListener('click', closeModalFn);
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModalFn();
  }
});

// Event listener for adding new tasks
addTaskBtns.forEach(addTaskBtn => {
  addTaskBtn.addEventListener('click', () => {
    const status = addTaskBtn.parentElement.dataset.status;
    openModal({ status });
  });
});

// Event listener for drag and drop functionality
statusContainers.forEach(container => {
  container.addEventListener('dragover', (event) => {
    event.preventDefault();
    container.classList.add('drag-enter');
  });

  container.addEventListener('dragleave', (event) => {
    container.classList.remove('drag-enter');
  });

  container.addEventListener('drop', (event) => {
    event.preventDefault();
    container.classList.remove('drag-enter');
    const droppedTask = JSON.parse(event.dataTransfer.getData('text/json'));
  })
  }
  );
