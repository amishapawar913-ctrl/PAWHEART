const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Create DB (file will be created automatically)
const db = new sqlite3.Database("./pawheart.db", (err) => {
  if (err) console.error(err.message);
  else console.log("✅ Connected to SQLite database");
});

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    breed TEXT,
    age INTEGER
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS grooming (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    service TEXT,
    date TEXT,
    notes TEXT
  )
`);

// Test route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// Get pets
app.get("/pets", (req, res) => {
  db.all("SELECT * FROM pets", [], (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(rows);
    }
  });
});

// Add pet
app.post("/pets", (req, res) => {
  const { name, type, breed, age } = req.body;

  db.run(
    "INSERT INTO pets (name, type, breed, age) VALUES (?, ?, ?, ?)",
    [name, type, breed, age],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send("Pet added");
      }
    }
  );
});

// Add grooming
app.post("/grooming", (req, res) => {
  const { pet_id, service, date, notes } = req.body;

  db.run(
    "INSERT INTO grooming (pet_id, service, date, notes) VALUES (?, ?, ?, ?)",
    [pet_id, service, date, notes],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send("Grooming added");
      }
    }
  );
});

// Get grooming by pet
app.get("/grooming/:petId", (req, res) => {
  db.all(
    "SELECT * FROM grooming WHERE pet_id=?",
    [req.params.petId],
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(rows);
      }
    }
  );
});

db.run(`
  CREATE TABLE IF NOT EXISTS vaccinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    vaccine TEXT,
    date TEXT,
    notes TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    medicine TEXT,
    date TEXT,
    notes TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS vet_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    doctor TEXT,
    date TEXT,
    notes TEXT
  )
`);

// Add vaccination
app.post("/vaccinations", (req, res) => {
  const { pet_id, vaccine, date, notes } = req.body;

  db.run(
    "INSERT INTO vaccinations (pet_id, vaccine, date, notes) VALUES (?, ?, ?, ?)",
    [pet_id, vaccine, date, notes],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send("Vaccination added");
      }
    }
  );
});

// Get vaccinations by pet
app.get("/vaccinations/:petId", (req, res) => {
  db.all(
    "SELECT * FROM vaccinations WHERE pet_id=?",
    [req.params.petId],
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(rows);
      }
    }
  );
});

// Add medication
app.post("/medications", (req, res) => {
  const { pet_id, medicine, date, notes } = req.body;

  db.run(
    "INSERT INTO medications (pet_id, medicine, date, notes) VALUES (?, ?, ?, ?)",
    [pet_id, medicine, date, notes],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send("Medication added");
      }
    }
  );
});

// Get medications
app.get("/medications/:petId", (req, res) => {
  db.all(
    "SELECT * FROM medications WHERE pet_id=?",
    [req.params.petId],
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(rows);
      }
    }
  );
});

app.post("/vet", (req, res) => {
  const { pet_id, doctor, date, notes } = req.body;

  db.run(
    "INSERT INTO vet_visits (pet_id, doctor, date, notes) VALUES (?, ?, ?, ?)",
    [pet_id, doctor, date, notes],
    function (err) {
      if (err) res.status(500).send(err);
      else res.send("Vet visit added");
    }
  );
});
app.get("/vet/:petId", (req, res) => {
  db.all(
    "SELECT * FROM vet_visits WHERE pet_id=?",
    [req.params.petId],
    (err, rows) => {
      if (err) res.status(500).send(err);
      else res.json(rows);
    }
  );
});

// Delete pet
app.delete("/pets/:id", (req, res) => {
  db.run("DELETE FROM pets WHERE id=?", [req.params.id], function (err) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("Deleted");
    }
  });
});

app.delete("/grooming/:id", (req, res) => {
  db.run("DELETE FROM grooming WHERE id=?", [req.params.id], function (err) {
    if (err) res.status(500).send(err);
    else res.send("Deleted");
  });
});

app.delete("/vaccinations/:id", (req, res) => {
  db.run("DELETE FROM vaccinations WHERE id=?", [req.params.id], function (err) {
    if (err) res.status(500).send(err);
    else res.send("Deleted");
  });
});

app.delete("/medications/:id", (req, res) => {
  db.run("DELETE FROM medications WHERE id=?", [req.params.id], function (err) {
    if (err) res.status(500).send(err);
    else res.send("Deleted");
  });
});

app.delete("/vet/:id", (req, res) => {
  db.run("DELETE FROM vet_visits WHERE id=?", [req.params.id], function (err) {
    if (err) res.status(500).send(err);
    else res.send("Deleted");
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🚀 Server running on http://localhost:5000");
});