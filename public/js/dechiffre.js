function dechiffreTexte(texteChiffre, decalage) {
    return texteChiffre.split('').map(char => {
        let code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) { 
            return String.fromCharCode(((code - 65 - decalage + 26) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 - decalage + 26) % 26) + 97);
        }
        return char;
    }).join('');
}

function demanderCleEtDechiffrer() {
    let cle = parseInt(document.getElementById('cle-dechiffrement').value, 10);
    if (!isNaN(cle)) {
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

document.getElementById('formulaire-dechiffrement').addEventListener('submit', function(e) {
    e.preventDefault(); // Empêche la soumission réelle du formulaire

    var video = document.getElementById('vhsVideo');
    video.style.display = 'block'; // Affiche la vidéo
    video.play(); // Commence à jouer la vidéo

    video.onended = function() {
        video.style.display = 'none'; // Cache la vidéo une fois qu'elle est terminée
    };
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-dechiffrement').addEventListener('submit', function(e) {
        e.preventDefault();
        demanderCleEtDechiffrer();
    });
});