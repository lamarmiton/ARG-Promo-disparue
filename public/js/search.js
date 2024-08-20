document.querySelector('.search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.querySelector('.search-input').value;
    
    fetch(`/search?query=${query}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('search-results');
            resultsContainer.innerHTML = '';
            
            if (data.results && data.results.length > 0) {
                data.results.forEach(result => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    
                    const link = document.createElement('a');
                    if (result.path) { 
                        link.href = `${result.path}.html`; 
                        link.textContent = result.name.replace('.html', '') || result.path.replace('.html', ''); 
                        link.target = '_blank'; 
                    } else {
                        link.textContent = 'Aucun sujet avec ce matricule';
                    }
                    
                    resultItem.appendChild(link);
                    resultsContainer.appendChild(resultItem);
                });
            } else {
                resultsContainer.textContent = 'Aucun sujet avec ce matricule.';
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            const resultsContainer = document.getElementById('search-results');
            resultsContainer.textContent = 'Une erreur est survenue lors de la recherche.';
        });
});