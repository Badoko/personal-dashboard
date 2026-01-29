const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const API_URL = "https://personal-dashboard-backend-rmha.onrender.com/tasks";

// Fetch tasks from backend
async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
}

// Render tasks to the page
function renderTasks(tasks) {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.text;

    // Apply completed style
    if (task.completed) {
      li.classList.add("completed");
    }

    // TOGGLE completed (use task.id)
    li.addEventListener("click", async () => {
      await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
      });
      fetchTasks();
    });

    // DELETE task (use task.id)
    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = " ❌";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await fetch(`${API_URL}/${task.id}`, {
        method: "DELETE",
      });
      fetchTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Add a new task
addTaskBtn.addEventListener("click", async () => {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: taskText }),
  });

  taskInput.value = "";
  fetchTasks();
});

// Initial fetch
fetchTasks();