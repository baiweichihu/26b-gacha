class InventorySystem {
    constructor() {
        this.inventory = {};
    }

    add(item) {
        const key = item.name;

        if (!this.inventory[key]) {
            this.inventory[key] = {
                name: item.name,
                icon: item.icon,
                type: item.type,
                rarity: item.rarity,
                count: 0
            };
        }

        this.inventory[key].count++;
        this.saveToStorage();
        this.render();
    }

    addBatch(items) {
        items.forEach(item => this.add(item));
    }

    remove(itemName, amount = 1) {
        const key = itemName;

        if (!this.inventory[key]) return false;

        this.inventory[key].count -= amount;

        if (this.inventory[key].count <= 0) {
            delete this.inventory[key];
        }

        this.saveToStorage();
        this.render();
        return true;
    }

    getItem(name) {
        return this.inventory[name] || null;
    }

    getAll() {
        return Object.values(this.inventory);
    }

    getByRarity(rarity) {
        return Object.values(this.inventory).filter(item => item.rarity === rarity);
    }

    getByType(type) {
        return Object.values(this.inventory).filter(item => item.type === type);
    }

    getTotalCount() {
        return Object.values(this.inventory).reduce((sum, item) => sum + item.count, 0);
    }

    getUniqueCount() {
        return Object.keys(this.inventory).length;
    }

    getRarityCount(rarity) {
        return Object.values(this.inventory)
            .filter(item => item.rarity === rarity)
            .reduce((sum, item) => sum + item.count, 0);
    }

    clear() {
        this.inventory = {};
        this.saveToStorage();
        this.render();
    }

    saveToStorage() {
        try {
            localStorage.setItem('gachaInventory', JSON.stringify(this.inventory));
        } catch (e) {
            console.warn('无法保存背包到本地存储');
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('gachaInventory');
            if (saved) {
                this.inventory = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('无法从本地存储加载背包');
            this.inventory = {};
        }
    }

    render(containerId = 'inventoryList') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        const items = this.getAll();

        if (items.length === 0) {
            container.innerHTML = '<div class="empty-inventory">背包空空如也~</div>';
            return;
        }

        items.sort((a, b) => {
            const rarityOrder = { fiveStar: 0, fourStar: 1, threeStar: 2 };
            return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        });

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = `inventory-item ${item.rarity}`;

            const starText = item.rarity === 'fiveStar' ? '★★★★★' :
                            item.rarity === 'fourStar' ? '★★★★' : '★★★';

            itemElement.innerHTML = `
                <div class="inventory-item-icon">${item.icon}</div>
                <div class="inventory-item-info">
                    <div class="inventory-item-name">${item.name}</div>
                    <div class="inventory-item-rarity">${starText}</div>
                </div>
                <div class="inventory-item-count">×${item.count}</div>
            `;

            container.appendChild(itemElement);
        });
    }

    renderSummary(containerId = 'inventorySummary') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="summary-item five-star">
                <span class="summary-count">${this.getRarityCount('fiveStar')}</span>
                <span class="summary-label">五星</span>
            </div>
            <div class="summary-item four-star">
                <span class="summary-count">${this.getRarityCount('fourStar')}</span>
                <span class="summary-label">四星</span>
            </div>
            <div class="summary-item three-star">
                <span class="summary-count">${this.getRarityCount('threeStar')}</span>
                <span class="summary-label">三星</span>
            </div>
            <div class="summary-item total">
                <span class="summary-count">${this.getTotalCount()}</span>
                <span class="summary-label">总物品</span>
            </div>
        `;
    }

    exportData() {
        return JSON.stringify(this.inventory);
    }

    importData(data) {
        try {
            this.inventory = JSON.parse(data);
            this.saveToStorage();
            this.render();
            return true;
        } catch (e) {
            console.error('导入数据失败:', e);
            return false;
        }
    }
}

window.inventorySystem = new InventorySystem();
window.inventorySystem.loadFromStorage();
