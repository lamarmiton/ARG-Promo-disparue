const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');

function checkAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send("Non autorisé");
  }
}

const app = express();
const port = 3000;

const db = new sqlite3.Database('./dblite.db', (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données', err.message);
  } else {
    console.log('Connecté à la base de données SQLite.');
  }
});

app.use(session({
  secret: 'EC779F39-F57E-4AB9-A8A4-E8027F367418',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Mettez à true si vous êtes derrière un proxy HTTPS
}));

db.serialize(() => {
  // Créer une nouvelle table
  db.run("CREATE TABLE IF NOT EXISTS account (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT NOT NULL, password TEXT NOT NULL)");
  // Insérer des données
  db.run("INSERT INTO account (user, password) VALUES ('admin', 'F9A68BCF-E0F4-40C1-A4CD-6CF0009483AD')");
});

app.use(express.json()); // Pour parser les requêtes JSON
app.use(express.static('public')); // Ajout pour servir les fichiers statiques

app.get('/', (req, res) => {
  res.send('La promotion disparue');
});

app.post('/login', (req, res) => {
  const { user, password } = req.body;
  db.get("SELECT * FROM account WHERE user = ?", [user], (err, row) => {
    if (err) {
      res.status(500).send("Erreur lors de la recherche de l'utilisateur");
    } else if (row && password == row.password) {
      req.session.userId = row.id; // Stocker l'ID utilisateur dans la session
      res.send("Connexion réussie");
    } else {
      res.send("Nom d'utilisateur ou mot de passe incorrect");
    }
  });
});

app.get('/page-secrete', checkAuth, (req, res) => {
  res.send("Vous êtes connecté et pouvez voir cette page.");
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

// Fermer la base de données
db.close((err) => {
  if (err) {
    console.error('Erreur lors de la fermeture de la base de données', err.message);
  } else {
    console.log('Connexion à la base de données fermée.');
  }
});