export default function InventoryPage({ items, stats }) {
    const sortedItems = [...items].sort((a, b) => {
        const rarityOrder = { fiveStar: 0, fourStar: 1, threeStar: 2 };
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });
    
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
                {sortedItems.length === 0 ? (
                    <div className="empty-inventory">背包空空如也~</div>
                ) : (
                    sortedItems.map((item, index) => {
                        const starText = item.rarity === 'fiveStar' ? '★★★★★' :
                                        item.rarity === 'fourStar' ? '★★★★' : '★★★';
                        
                        return (
                            <div className={`inventory-item ${item.rarity}`} key={index}>
                                <div className="inventory-item-icon">{item.icon}</div>
                                <div className="inventory-item-info">
                                    <div className="inventory-item-name">{item.name}</div>
                                    <div className="inventory-item-rarity">{starText}</div>
                                </div>
                                <div className="inventory-item-count">×{item.count}</div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}
