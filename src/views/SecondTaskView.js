import { View } from "dhx-optimus";
import { dataset as rawData } from '../assets/auros_FE_test_task_dhx';

export class SecondTaskView extends View {

    _countryRe = new RegExp(/<span>(.+?)<\/span>/);
    _flagRe = new RegExp(/(<img .+?>)/);

    listItemTempl(item) {
        return (`
        <div class="list-item">
            <div class="list-item-data">
                <span>Country: ${item.country}</span>
                <span>Capital: ${item.capital}</span>
            </div>
            <div class="list-item-img">
                ${item.flag}
            </div>
        </div>
        `);
    }


    init() {

        this.dataset = rawData.map(el => {
            return {
                country: el.country.match(this._countryRe)[1],
                capital: el.capital,
                flag: el.country.match(this._flagRe)[1]
            }
        });

        this.filteredList = [...this.dataset];

        this.searchBoxHTML = `
        <div class="search-box">
            <input type="text" id="searchInput" class="search-input" placeholder="Search..." />
            <button class="clear-button" id="clearInput">
                <span class="material-icons">close</span>
            </button>
            <button id="searchButton" class="search-button">
                <span class="material-icons">search</span>
            </button>

            <div class="history-list" id="historyList"></div>
        </div>
        <div class="info-box">
            <span>The search bar above filter elements by contry name and capital in the "country list" on the right! Here some useful tips:</span>
            <ul>
                <li>To open history - focus on input element</li>
                <li>To see full "country list" - hit search button or ENTER with empty search bar</li>
                <li>ENTER - perform search</li>
                <li>ESCAPE - clear input, open history and show full "country list"</li>
            </ul>
        </div>
        `;

        this.layout = new dhx.Layout(null, {
            cols: [
                {
                    id: "stv-searchBox",
                    width: '50%'
                },
                {
                    id: "stv-list",
                    init: cell => {
                        this.list = new dhx.List(cell, {
                            css: "dhx_widget--bordered",
                            selection: false,
                            template: this.listItemTempl
                        })
                    }
                }
            ]
        });


        this.bindFunc = {
            focusInput: this.onInputFocus.bind(this),
            blurInput: this.onInputBlur.bind(this),
            clearInput: this.onClearInput.bind(this),
            performSearch: this.onPerformSearch.bind(this),
            inputKeyUp: this.onInputKeyUp.bind(this)
        };

        this.historyItems = new Set();

        return this.layout;
    }



    ready(_) {
        this.list.data.parse(this.filteredList);

        const cell = document.querySelectorAll('[data-cell-id="stv-searchBox"]')[0];
        cell.innerHTML = this.searchBoxHTML;


        this.clearInput = document.getElementById('clearInput');
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.historyList = document.getElementById('historyList');

        // Toggle dropdown visibility based on input focus
        this.searchInput.addEventListener('focus', this.bindFunc.focusInput);
        this.searchInput.addEventListener('blur', this.bindFunc.blurInput);
        this.searchInput.addEventListener('keyup', this.bindFunc.inputKeyUp);

        this.clearInput.addEventListener('click', this.bindFunc.clearInput);
        this.searchButton.addEventListener('click', this.bindFunc.performSearch);
    }

    destroy() {
        this.clearInput.removeEventListener("click", this.bindFunc.clearInput);
        this.searchButton.removeEventListener("click", this.bindFunc.performSearch);

        this.searchInput.removeEventListener('focus', this.bindFunc.focusInput);
        this.searchInput.removeEventListener('blur', this.bindFunc.blurInput);
        this.searchInput.removeEventListener('keyup', this.bindFunc.inputKeyUp);
    }

    onClearInput() {
        this.searchInput.value = '';
        this.searchInput.focus();
    }

    onInputFocus() {
        clearTimeout(this.blurTimeout);
        if (this.historyItems.size > 0) this.historyList.classList.add('open');
    }

    onInputBlur() {
        this.blurTimeout = setTimeout(() => this.historyList.classList.remove('open'), 150);
    }

    onPerformSearch() {
        const query = this.searchInput.value.trim();
        if (query) {
            if (!this.historyItems.has(query)) {
                setTimeout(() => {
                    // Prevent showing new element on closing animation.
                    this.historyItems.add(query);
                    this.onAddHistoryItem(query);

                }, 500);
            }

            let q = query.toLowerCase();
            this.list.data.filter((el) => {
                return el.capital.toLowerCase().includes(q) || el.country.toLocaleLowerCase().includes(q);
            });

        } else {
            this.list.data.filter();
        }
    }

    onAddHistoryItem(text) {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.onclick = () => this.onSelectHistoryItem(text);
        item.innerHTML = `<span class="material-icons">history</span>${text}`;
        this.historyList.prepend(item); // Add new item to the top
    }

    onSelectHistoryItem(text) {
        this.searchInput.value = text;
        this.historyList.classList.remove('open');
        this.onPerformSearch();
    }

    onInputKeyUp({ key }) {
        if (key === 'Enter') {
            this.searchButton.focus();
            this.onPerformSearch();
        }

        if (key === 'Escape') {
            this.searchInput.value = '';
            this.onPerformSearch();
            this.onInputFocus();
        }
    }



}
