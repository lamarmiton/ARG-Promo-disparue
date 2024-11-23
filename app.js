const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const db = require('./dbSetup');

const app = express();
const port = 3000;

app.use(session({
  secret: 'EC779F39-F57E-4AB9-A8A4-E8027F367418',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.json()); 
app.use(express.static('public'));

function checkAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send("Non autorisé");
  }
}

function checkSecondAuth(req, res, next) {
  if (req.session.secondAuth) {
    next();
  } else {
    res.redirect('/wali/authentification');
  }
}

app.get('/', (req, res) => {
  if (req.session.userId) {
    res.send('Bienvenue, utilisateur connecté !');
  } else {
    res.send('Bienvenue, visiteur ! Veuillez vous connecter.');
  }
});

app.post('/second-auth', (req, res) => {
  const { username, password } = req.body;
  if (username === 'e.henriot' && password === 'anthophila') {
    req.session.secondAuth = true;
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' });
  }
});

app.post('/login', (req, res) => {
  const { user, password } = req.body;
  db.get("SELECT * FROM account WHERE user = ?", [user], (err, row) => {
    if (err) {
      res.status(500).send('Erreur de serveur');
    } else if (!row) {
      // Nom d'utilisateur incorrect
      db.get("SELECT message FROM error_message WHERE id = 1", (err, errorRow) => {
        if (err) {
          res.status(500).send('Erreur de serveur');
        } else {
          const errorMessage = errorRow ? errorRow.message : 'Nom d\'utilisateur incorrect';
          res.send({ "success" : false, "message" : errorMessage });
        }
      });
    } else if (row.password !== password) {
      //Nombre de lettres en commun avec le mot de passe
      const lettersInCommon = row.password.split('').filter((letter, index) => letter === password[index]).length;
      // Mot de passe incorrect
      req.session.loginAttempts = (req.session.loginAttempts || 0) + 1;
      if (password.length <  row.password.length - 1) {
        // Message d'erreur pour mot de passe trop court
        db.get("SELECT message FROM error_message WHERE id = 3", (err, errorRow) => {
          if (err) {
            res.status(500).send('Erreur de serveur : ' + err);
          } else {
            const errorMessage = errorRow.message
            res.send({ "success" : false, "message" : errorMessage, "letters" : lettersInCommon });
          }
        });
      }
      else if (req.session.loginAttempts >= 3) {
        // Selectionne un message d'erreur aléatoire toutes les 3 tentatives
        db.get("SELECT message FROM error_message WHERE id NOT IN (?, ?, ?) ORDER BY RANDOM() LIMIT 1", [1, 2, 3], (err, errorRow) => {
          if (err) {
            res.status(500).send('Erreur de serveur : ' + err);
          } else {
            const errorMessage = errorRow.message
            res.send({ "success" : false, "message" : errorMessage, "letters" : lettersInCommon });
          }
        });
      } else {
        // Message d'erreur pour mot de passe incorrect
        db.get("SELECT message FROM error_message WHERE id = 2", (err, errorRow) => {
          if (err) {
            res.status(500).send('Erreur de serveur : ' + err);
          } else {
            const errorMessage = errorRow.message
            res.send({ "success" : false, "message" : errorMessage, "letters" : lettersInCommon});
          }
        });
      }
    } else {
      req.session.loginAttempts = 0;
      req.session.userId = row.id;
      res.send({ "success" : true, "message" : 'Connexion réussie' });
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
    const exactMatch = files.find(file => file.toLowerCase().replace('.html', '') === query);

    console.log(exactMatch);
    if (exactMatch) {
      const filePath = path.join('profils', exactMatch).replace('.html', '');
      res.json({ results: [ { name: exactMatch, path: filePath } ] });
    } else {
      res.status(404).send('Profil non trouvé');
    }
  });
});

app.get('/wali-m.isae.fr/SOGo', checkSecondAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'wali', 'users', 'neurologue.html'));
});

app.get('/wali/authentification', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'wali', 'authentication.html'));
});

app.get('/photos', checkAuth, (req, res) => {
  res.sendFile(__dirname + '/public/photos/photos.html');
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});