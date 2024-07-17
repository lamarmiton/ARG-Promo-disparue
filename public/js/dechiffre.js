function toggleMenu() {
    var navLinks = document.getElementById("navLinks");
    if (navLinks.style.display === "block") {
        navLinks.style.display = "none";
    } else {
        navLinks.style.display = "block";
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Vérifie si la réponse a déjà été donnée correctement
    if (localStorage.getItem('enigmeResolue') === 'true') {
        let elementsChiffres = document.querySelectorAll('.chiffre');
        elementsChiffres.forEach(function(element) {
            let contenuChiffre = element.innerText;
            let contenuDechiffre = dechiffreTexte(contenuChiffre, 13);
            element.innerText = contenuDechiffre;
        });
        var formulaire = document.getElementById('formulaire-dechiffrement');
        formulaire.parentNode.removeChild(formulaire);
        var navLinks = document.getElementById('navLinks');
        var listItem = document.createElement('li');
        var link = document.createElement('a');
        link.href = 'login.html';
        link.textContent = 'Connexion'; 
        listItem.appendChild(link);
        navLinks.appendChild(listItem);
    }
});

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
        if (cle == 13) {
            var video = document.getElementById('vhsVideo');
            video.style.display = 'block';
            video.play();
        
            video.onended = function() {
                video.style.display = 'none';
            };

            let elementsChiffres = document.querySelectorAll('.chiffre');
            elementsChiffres.forEach(function(element) {
                let contenuChiffre = element.innerText;
                let contenuDechiffre = dechiffreTexte(contenuChiffre, cle);
                element.innerText = contenuDechiffre;
            });

            localStorage.setItem('enigmeResolue', 'true');
            var formulaire = document.getElementById('formulaire-dechiffrement');
            formulaire.parentNode.removeChild(formulaire);
            localStorage.setItem('enigmeResolue', 'true');
            if (localStorage.getItem('enigmeResolue') === 'true') {
                var navLinks = document.getElementById('navLinks');
                var listItem = document.createElement('li');
                var link = document.createElement('a');
                link.href = 'login.html';
                link.textContent = 'Connexion'; 
                listItem.appendChild(link);
                navLinks.appendChild(listItem);
            }
        }
        else {
            document.body.classList.add('errorAnimation');
            setTimeout(function() {
                document.body.classList.remove('errorAnimation');
            }, 250);
        }
    } else {
        alert("Clé invalide. Veuillez entrer un nombre.");
    }
}

document.getElementById('formulaire-dechiffrement').addEventListener('submit', function(e) {
    e.preventDefault(); // Empêche la soumission réelle du formulaire
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-dechiffrement').addEventListener('submit', function(e) {
        e.preventDefault();
        demanderCleEtDechiffrer();
    });
});