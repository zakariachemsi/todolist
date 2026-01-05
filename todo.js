// Tasks Array
var tasks = [];

// DOM Elements
var taskInput = document.getElementById('taskInput');
var addBtn = document.getElementById('addBtn');
var tasksContainer = document.getElementById('tasksContainer');
var totalTasks = document.getElementById('totalTasks');
var completedTasks = document.getElementById('completedTasks');
var pendingTasks = document.getElementById('pendingTasks');

// Load Tasks from Local Storage
function loadTasks() {
    var storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    renderTasks();
    updateStats();
}

// Save Tasks to Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add Task
function addTask() {
    var taskText = taskInput.value.trim();
    
    if (taskText === '') {
        return;
    }

    var newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    saveTasks();
    renderTasks();
    updateStats();
}

// Delete Task
function deleteTask(taskId) {
    tasks = tasks.filter(function(task) {
        return task.id !== taskId;
    });
    saveTasks();
    renderTasks();
    updateStats();
}

// Toggle Task Complete
function toggleTask(taskId) {
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            tasks[i].completed = !tasks[i].completed;
            break;
        }
    }
    saveTasks();
    renderTasks();
    updateStats();
}

// Update Statistics
function updateStats() {
    var total = tasks.length;
    var completed = 0;
    var pending = 0;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            completed++;
        } else {
            pending++;
        }
    }

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}

// Render Tasks
function renderTasks() {
    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<div class="empty-message"><div class="empty-icon"></div><h2>No tasks yet</h2><p>Add a task to get started!</p></div>';
        return;
    }

    var html = '';
    
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        var completedClass = task.completed ? 'completed' : '';
        var checked = task.completed ? 'checked' : '';
        
        html += '<div class="task-item ' + completedClass + '">';
        html += '<input type="checkbox" class="task-checkbox" ' + checked + ' onclick="toggleTask(' + task.id + ')">';
        html += '<span class="task-text">' + escapeHtml(task.text) + '</span>';
        html += '<button class="task-delete" onclick="deleteTask(' + task.id + ')">Delete</button>';
        html += '</div>';
    }
    
    tasksContainer.innerHTML = html;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) {
        return map[m];
    });
}

// Event Listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialize - Load tasks from local storage
loadTasks();