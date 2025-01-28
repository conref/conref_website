// Inicialitzar el mapa
const map = L.map('map').setView([45, 25], 3);

// Afegir capa base d'OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Crear la icona personalitzada
const customIcon = L.icon({
    iconUrl: './marker.png', // Ruta a la imatge del marcador
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

// Crear popup personalitzat
function createCustomPopup(content, latlng) {
    const popupContainer = document.createElement('div');
    popupContainer.className = 'custom-popup';

    // Afegir contingut i botó de tancar
    popupContainer.innerHTML = `
        <div class="custom-popup-content">
            ${content}
        </div>
        <button class="custom-popup-close" onclick="closePopup()">X</button>
    `;

    // Afegir el popup al cos del document
    document.body.appendChild(popupContainer);

    // Centrar el mapa al punt clicat
    map.setView(latlng, map.getZoom());
}

// Tancar popup personalitzat
function closePopup() {
    const popup = document.querySelector('.custom-popup');
    if (popup) {
        popup.remove();
    }
}

// Carregar dades GeoJSON
fetch('./locations_with_popup.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                return L.marker(latlng, { icon: customIcon })
                    .on('click', () => createCustomPopup(feature.properties.popups, latlng));
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error carregant GeoJSON:', error));
