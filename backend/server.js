const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"]
}));
app.use(express.json());

// GET all tasks
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const formattedTasks = rows.map(task => ({
      id: task.id,
      text: task.text,
      completed: task.completed === 1
    }));

    res.json(formattedTasks);
  });
});

// POST a new task
app.post("/tasks", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Task text is required" });
  }

  const sql = "INSERT INTO tasks (text, completed) VALUES (?, ?)";
  db.run(sql, [text, 0], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      text,
      completed: false
    });
  });
});

// PUT /tasks/:index toggle completed
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE tasks
    SET completed = CASE completed
      WHEN 0 THEN 1
      ELSE 0
    END
    WHERE id = ?
  `;

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ success: true });
  });
});

// DELETE /tasks/:index
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});