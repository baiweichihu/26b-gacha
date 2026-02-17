export default function HistoryPage({ history, stats }) {
    return (
        <>
            <div className="history-summary" id="historySummary">
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
                    <span className="summary-label">总抽数</span>
                </div>
            </div>
            <div className="history-list" id="historyList">
                {history.length === 0 ? (
                    <div className="empty-history">暂无抽卡记录</div>
                ) : (
                    history.map(item => {
                        const starText = item.rarity === 'fiveStar' ? '★★★★★' :
                                        item.rarity === 'fourStar' ? '★★★★' : '★★★';
                        const date = new Date(item.timestamp);
                        const timeStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
                        
                        return (
                            <div className="history-item" key={item.id}>
                                <div className="history-item-icon">{item.icon}</div>
                                <div className="history-item-info">
                                    <div className="history-item-name">{item.name}</div>
                                    <div className={`history-item-rarity ${item.rarity}`}>
                                        {starText} {item.type}
                                    </div>
                                </div>
                                <div className="history-item-time">{timeStr}</div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}
