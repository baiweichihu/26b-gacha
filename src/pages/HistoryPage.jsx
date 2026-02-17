export default function HistoryPage({ history }) {
    return (
        <>
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
            <div className="history-note">
                只保留最近100条拾忆记录
            </div>
        </>
    );
}
