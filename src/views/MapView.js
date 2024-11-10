import { View } from "dhx-optimus";

export class MapView extends View {
    init() {
        this.layout = new dhx.Layout(null, {
            rows: [
                { id: "mapContainer", height: "100%" }
            ]
        });

        this.capitalCoordinates = {
            "London": [51.5074, -0.1278],
            "Stockholm": [59.3293, 18.0686],
            "Rome": [41.9028, 12.4964],
            "Berlin": [52.52, 13.405],
            "Minsk": [53.9, 27.5667],
            "Paris": [48.8566, 2.3522]
        };

        return this.layout;
    }


    ready(_) {
        const cell = document.querySelectorAll('[data-cell-id="mapContainer"]');

        this.map = L.map(cell[0]).setView([0, 0], 2);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.observe(
            () => this.params.capital,
            (capital) => this.updateMapView(capital)
        );
    }

    updateMapView(capital) {
        const coordinates = this.capitalCoordinates[capital];
        if (coordinates) {
            this.map.setView(coordinates, 10);
        }
    }
}
