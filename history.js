class HistorySystem {
    constructor(maxSize = 100) {
        this.history = [];
        this.maxSize = maxSize;
    }

    add(item) {
        const record = {
            ...item,
            timestamp: Date.now(),
            id: this.generateId()
        };

        this.history.unshift(record);

        if (this.history.length > this.maxSize) {
            this.history.pop();
        }

        this.saveToStorage();
        this.render();
    }

    addBatch(items) {
        items.forEach(item => {
            const record = {
                ...item,
                timestamp: Date.now(),
                id: this.generateId()
            };
            this.history.unshift(record);
        });

        if (this.history.length > this.maxSize) {
            this.history = this.history.slice(0, this.maxSize);
        }

        this.saveToStorage();
        this.render();
    }

    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    getAll() {
        return this.history;
    }

    getByRarity(rarity) {
        return this.history.filter(item => item.rarity === rarity);
    }

    getFiveStarCount() {
        return this.history.filter(item => item.rarity === 'fiveStar').length;
    }

    getFourStarCount() {
        return this.history.filter(item => item.rarity === 'fourStar').length;
    }

    getThreeStarCount() {
        return this.history.filter(item => item.rarity === 'threeStar').length;
    }

    getTotalPulls() {
        return this.history.length;
    }

    clear() {
        this.history = [];
        this.saveToStorage();
        this.render();
    }

    saveToStorage() {
        try {
            localStorage.setItem('gachaHistory', JSON.stringify(this.history));
        } catch (e) {
            console.warn('无法保存历史记录到本地存储');
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('gachaHistory');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('无法从本地存储加载历史记录');
            this.history = [];
        }
    }

    render(containerId = 'historyList') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        if (this.history.length === 0) {
            container.innerHTML = '<div class="empty-history">暂无抽卡记录</div>';
            return;
        }

        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';

            const starText = item.rarity === 'fiveStar' ? '★★★★★' :
                            item.rarity === 'fourStar' ? '★★★★' : '★★★';

            const date = new Date(item.timestamp);
            const timeStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

            historyItem.innerHTML = `
                <div class="history-item-icon">${item.icon}</div>
                <div class="history-item-info">
                    <div class="history-item-name">${item.name}</div>
                    <div class="history-item-rarity ${item.rarity}">${starText} ${item.type}</div>
                </div>
                <div class="history-item-time">${timeStr}</div>
            `;

            container.appendChild(historyItem);
        });
    }

    renderSummary(containerId = 'historySummary') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="summary-item five-star">
                <span class="summary-count">${this.getFiveStarCount()}</span>
                <span class="summary-label">五星</span>
            </div>
            <div class="summary-item four-star">
                <span class="summary-count">${this.getFourStarCount()}</span>
                <span class="summary-label">四星</span>
            </div>
            <div class="summary-item three-star">
                <span class="summary-count">${this.getThreeStarCount()}</span>
                <span class="summary-label">三星</span>
            </div>
            <div class="summary-item total">
                <span class="summary-count">${this.getTotalPulls()}</span>
                <span class="summary-label">总抽数</span>
            </div>
        `;
    }
}

window.historySystem = new HistorySystem();
window.historySystem.loadFromStorage();
