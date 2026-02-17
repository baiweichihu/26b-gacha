import { GachaData } from '../data/gachaData';

export default function InventoryPage({ items, stats }) {
    const createInventoryMap = () => {
        const map = {};
        items.forEach(item => {
            const key = `${item.rarity}-${item.name}`;
            map[key] = item.count;
        });
        return map;
    };

    const inventoryMap = createInventoryMap();

    const renderRaritySection = (rarity, title, starText) => {
        const allItems = GachaData[rarity];
        
        return (
            <div className="rarity-section" key={rarity}>
                <div className="rarity-title">{title}</div>
                <div className="rarity-grid">
                    {allItems.map((item, index) => {
                        const key = `${rarity}-${item.name}`;
                        const count = inventoryMap[key] || 0;
                        const isObtained = count > 0;
                        
                        return (
                            <div className={`collection-item ${isObtained ? 'obtained' : 'not-obtained'}`} key={index}>
                                <div className="collection-item-icon">{isObtained ? item.icon : '❓'}</div>
                                <div className="collection-item-rarity">{starText}</div>
                                <div className="collection-item-name">{isObtained ? item.name : '???'}</div>
                                {isObtained && <div className="collection-item-count">×{count}</div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="inventory-summary" id="inventorySummary">
                <div className="summary-item five-star">
                    <span className="summary-count">{stats.fiveStar}</span>
                    <span className="summary-label">五星</span>
                </div>
                <div className="summary-item four-star">
                    <span className="summary-count">{stats.fourStar}</span>
                    <span className="summary-label">四星</span>
                </div>
                <div className="summary-item three-star">
                    <span className="summary-count">{stats.threeStar}</span>
                    <span className="summary-label">三星</span>
                </div>
                <div className="summary-item total">
                    <span className="summary-count">{stats.total}</span>
                    <span className="summary-label">总物品</span>
                </div>
            </div>
            <div className="inventory-list" id="inventoryList">
                {renderRaritySection('fiveStar', '五星图鉴', '★★★★★')}
                {renderRaritySection('fourStar', '四星图鉴', '★★★★')}
                {renderRaritySection('threeStar', '三星图鉴', '★★★')}
            </div>
        </>
    );
}
