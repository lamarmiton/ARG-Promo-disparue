function dechiffreTexte(texteChiffre, decalage) {
    // Cette fonction déchiffre le texte en utilisant le décalage fourni
    return texteChiffre.split('').map(char => {
        let code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) { // Majuscules A-Z
            return String.fromCharCode(((code - 65 - decalage + 26) % 26) + 65);
        } else if (code >= 97 && code <= 122) { // Minuscules a-z
            return String.fromCharCode(((code - 97 - decalage + 26) % 26) + 97);
        }
        return char;
    }).join('');
}

function demanderCleEtDechiffrer() {
    let cle = parseInt(document.getElementById('cle-dechiffrement').value, 10);
    if (!isNaN(cle)) {
        // Sélectionne tous les éléments ayant la classe 'chiffre'
        let elementsChiffres = document.querySelectorAll('.chiffre');
        elementsChiffres.forEach(function(element) {
            let contenuChiffre = element.innerText;
            let contenuDechiffre = dechiffreTexte(contenuChiffre, cle);
            element.innerText = contenuDechiffre;
        });
    } else {
        alert("Clé invalide. Veuillez entrer un nombre.");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-dechiffrement').addEventListener('submit', function(e) {
        e.preventDefault(); // Empêche le rechargement de la page
        demanderCleEtDechiffrer();
    });
});