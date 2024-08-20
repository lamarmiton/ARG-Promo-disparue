const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

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
  cookie: { secure: false }
}));

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS account (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT NOT NULL, password TEXT NOT NULL)");
  db.run("INSERT INTO account (user, password) VALUES ('admin', 'promotion')");
});

app.use(express.json()); 
app.use(express.static('public'));

function checkAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send("Non autorisé");
  }
}

app.get('/', (req, res) => {
  if (req.session.userId) {
    res.send('Bienvenue, utilisateur connecté !');
  } else {
    res.send('Bienvenue, visiteur ! Veuillez vous connecter.');
  }
});

app.post('/login', (req, res) => {
  const { user, password } = req.body;
  db.get("SELECT * FROM account WHERE user = ?", [user], (err, row) => {
    console.log(row);
    if (err) {
      res.status(500).send('Erreur de serveur');
    } else if (row && row.password === password) {
      req.session.userId = row.id;
      res.send({ "success" : true, "message" : 'Connexion réussie' });
    } else {
      res.status(401).send({ "success" : false, "message" : 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
  });
});

app.get('/status', (req, res) => {
  console.log(req.session);
  if (req.session.userId) {
    res.json({ loggedIn: true, user: req.session.userId });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get('/cuisine', checkAuth, (req, res) => {
  res.sendFile(__dirname + '/public/cuisine.html');
});

app.get('/profil', checkAuth, (req, res) => {
  res.sendFile(__dirname + '/public/profil.html');
});

app.get('/search', checkAuth, (req, res) => {
  const query = req.query.query.toLowerCase();
  const profilesDir = path.join(__dirname, 'public', 'profils');

  fs.readdir(profilesDir, (err, files) => {
    if (err) {
      return res.status(500).send('Erreur de serveur');
    }
    
    console.log(files);
    console.log(profilesDir);
    console.log(req.query);
    const closestMatch = files.find(file => file.toLowerCase().includes(query));

    console.log(closestMatch);
    if (closestMatch) {
      const filePath = path.join('profils', closestMatch).replace('.html', '');
      res.json({ results: [ { name: closestMatch, path: filePath } ] });
    } else {
      res.status(404).send('Profil non trouvé');
    }
  });
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});