const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Pour parser les requêtes JSON
app.use(express.static('public')); // Ajout pour servir les fichiers statiques

app.get('/', (req, res) => {
  res.send('La promotion disparue');
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});