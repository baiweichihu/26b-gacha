const GachaData = {
    fiveStar: [
        { name: '张明', icon: '👦', type: '同学' },
        { name: '李华', icon: '👧', type: '同学' },
        { name: '王强', icon: '🧑', type: '同学' },
        { name: '刘芳', icon: '👩', type: '同学' },
        { name: '陈伟', icon: '👨', type: '同学' },
        { name: '杨洋', icon: '🧒', type: '同学' },
        { name: '周婷', icon: '👱', type: '同学' },
        { name: '吴磊', icon: '🧑‍🦱', type: '同学' },
    ],
    fourStar: [
        { name: '运动会', icon: '🏃', type: '回忆' },
        { name: '毕业照', icon: '📸', type: '回忆' },
        { name: '联欢会', icon: '🎉', type: '回忆' },
        { name: '春游', icon: '🌳', type: '回忆' },
        { name: '考试周', icon: '📚', type: '回忆' },
        { name: '食堂', icon: '🍱', type: '回忆' },
        { name: '晚自习', icon: '🌙', type: '回忆' },
        { name: '体育课', icon: '⚽', type: '回忆' },
    ],
    threeStar: [
        { name: '铅笔', icon: '✏️', type: '物品' },
        { name: '橡皮', icon: '🧽', type: '物品' },
        { name: '笔记本', icon: '📓', type: '物品' },
        { name: '尺子', icon: '📏', type: '物品' },
        { name: '圆规', icon: '⭕', type: '物品' },
        { name: '书包', icon: '🎒', type: '物品' },
        { name: '水杯', icon: '🥤', type: '物品' },
        { name: '书签', icon: '🔖', type: '物品' },
        { name: '笔袋', icon: '👝', type: '物品' },
        { name: '计算器', icon: '🧮', type: '物品' },
    ]
};

const GachaConfig = {
    fiveStarBaseRate: 1.5,
    fourStarBaseRate: 8.5,
    fiveStarPity: 50,
    fourStarPity: 10
};

class GachaSystem {
    constructor() {
        this.fiveStarPityCounter = 0;
        this.fourStarPityCounter = 0;
        this.totalPulls = 0;
        this.isAnimating = false;
    }

    resetCounters() {
        this.fiveStarPityCounter = 0;
        this.fourStarPityCounter = 0;
        this.totalPulls = 0;
    }

    getRandomItem() {
        this.totalPulls++;
        this.fiveStarPityCounter++;
        this.fourStarPityCounter++;

        const fiveStarPityRate = this.calculatePityRate(this.fiveStarPityCounter, GachaConfig.fiveStarPity, GachaConfig.fiveStarBaseRate);
        const fourStarPityRate = this.calculatePityRate(this.fourStarPityCounter, GachaConfig.fourStarPity, GachaConfig.fourStarBaseRate);

        const rand = Math.random() * 100;
        let rarity;

        if (rand < fiveStarPityRate) {
            rarity = 'fiveStar';
            this.fiveStarPityCounter = 0;
            this.fourStarPityCounter = 0;
        } else if (rand < fiveStarPityRate + fourStarPityRate) {
            rarity = 'fourStar';
            this.fourStarPityCounter = 0;
        } else {
            rarity = 'threeStar';
        }

        const items = GachaData[rarity];
        const item = items[Math.floor(Math.random() * items.length)];

        return {
            ...item,
            rarity,
            pullNumber: this.totalPulls
        };
    }

    calculatePityRate(counter, pityThreshold, baseRate) {
        if (counter >= pityThreshold) {
            return 100;
        }
        const progress = counter / pityThreshold;
        return baseRate + (100 - baseRate) * Math.pow(progress, 3);
    }

    getSingle() {
        return this.getRandomItem();
    }

    getTen() {
        const items = [];
        let hasFourStar = false;
        let hasFiveStar = false;

        for (let i = 0; i < 10; i++) {
            const item = this.getRandomItem();
            items.push(item);

            if (item.rarity === 'fourStar') hasFourStar = true;
            if (item.rarity === 'fiveStar') hasFiveStar = true;
        }

        if (!hasFourStar && this.fourStarPityCounter >= GachaConfig.fourStarPity - 1) {
            const lastItem = items[9];
            const newItem = this.forceGetRarity('fourStar');
            newItem.pullNumber = lastItem.pullNumber;
            items[9] = newItem;
        }

        return items;
    }

    forceGetRarity(rarity) {
        const items = GachaData[rarity];
        const item = items[Math.floor(Math.random() * items.length)];
        return { ...item, rarity };
    }

    getPityStatus() {
        return {
            fiveStar: this.fiveStarPityCounter,
            fourStar: this.fourStarPityCounter,
            total: this.totalPulls
        };
    }
}

window.gachaSystem = new GachaSystem();
window.GachaData = GachaData;
window.GachaConfig = GachaConfig;
