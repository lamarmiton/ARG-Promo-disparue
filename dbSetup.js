const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./dblite.db', (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données', err.message);
  } else {
    console.log('Connecté à la base de données SQLite.');
  }
});

db.serialize(() => {
  // Supprime toutes les tables au démarrage
  db.run("DROP TABLE IF EXISTS account");
  db.run("DROP TABLE IF EXISTS error_message");

  db.run("CREATE TABLE IF NOT EXISTS account (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT NOT NULL, password TEXT NOT NULL)");
  db.run("INSERT INTO account (user, password) VALUES ('admin', 'promotion')");

  db.run("CREATE TABLE IF NOT EXISTS error_message (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT NOT NULL)");
  db.run("INSERT INTO error_message (message) VALUES ('Nom d`utilisateur incorrect')");
  db.run("INSERT INTO error_message (message) VALUES ('Mot de passe incorrect')");
  db.run("INSERT INTO error_message (message) VALUES ('Le mot de passe ne contient pas assez de caractères')");
  db.run("INSERT INTO error_message (message) VALUES ('Mot de passe oublié ?')");
  db.run("INSERT INTO error_message (message) VALUES ('Ça commence à faire beaucoup ...')");
  db.run("INSERT INTO error_message (message) VALUES ('Vous avez perdu votre mot de passe ?')");
  db.run("INSERT INTO error_message (message) VALUES ('Je commence à me lasser de vous ...')");
  db.run("INSERT INTO error_message (message) VALUES ('Je commence à penser que ce compte n`est pas le vôtre ...')");
  db.run("INSERT INTO error_message (message) VALUES ('Je vais devoir vous bloquer si vous continuez ...')");
  db.run("INSERT INTO error_message (message) VALUES ('La prochaine fois, je vous bloque ...')");
  db.run("INSERT INTO error_message (message) VALUES ('Non mais sérieusement, vous ne vous souvenez pas de votre mot de passe ?')");
  db.run("INSERT INTO error_message (message) VALUES ('Je commence à perdre patience ...')");
  db.run("INSERT INTO error_message (message) VALUES ('Le mot de passe est incorrect ... encore ...')");
  db.run("INSERT INTO error_message (message) VALUES ('Vous êtes sûr que c`est bien votre compte ?')");
  db.run("INSERT INTO error_message (message) VALUES ('On est d`accord que c`est votre compte ?')");
});

module.exports = db;