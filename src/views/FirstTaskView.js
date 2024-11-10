import { View } from "dhx-optimus";
import { dataset, columns } from "../assets/auros_FE_test_task_dhx";
import { MapView } from "./MapView";

export class FirstTaskView extends View {
    getGridWidth() {
        return columns.reduce((acc, el) => acc + el.width, 4) + 'px';
    }
    init() {
        this.layout = new dhx.Layout(null, {
            css: "dhx_layout-container",
            type: "space",
            cols: [
                {
                    id: "gridContainer",
                    width: this.getGridWidth(),
                    init: cell => {
                        this.grid = new dhx.Grid(cell, {
                            tooltip: false,
                            columns: columns,
                            data: dataset,
                            autoWidth: true,
                            rowHeight: 50
                        })
                    }
                },
                {
                    id: "infoCardContainer"
                }
            ]
        });

        this.subscribe();

        return this.layout;
    }

    subscribe() {
        this.grid.events.on("cellClick", (row, column, event) => {
            const cell = event.target.closest(".myCustomCell");
            if (cell) {
                this.show(this.layout.getCell('infoCardContainer'), MapView, { capital: row.capital });

                if (this.infoCard) {
                    document.body.removeChild(this.infoCard);
                }

                this.infoCard = document.createElement('div');
                this.infoCard.classList.add('info-card');
                this.infoCard.id = 'ftv-info-card';
                this.infoCard.innerHTML = `
                <div class="info-card-line info-card-title">${row.country}</div>
                <div class="info-card-line"><strong>Capital:</strong> ${row.capital}</div>
                <div class="info-card-line"><strong>Population:</strong> ${row.population}</div>
                `;

                document.body.appendChild(this.infoCard);
            }
        });
    }

    destroy() {
        if (this.infoCard) {
            document.body.removeChild(this.infoCard);
        }
    }
}