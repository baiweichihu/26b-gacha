export default function RulesPage({ pityStatus }) {
    return (
        <div className="rules-content">
            <h2>拾忆规则说明</h2>
            <div className="pity-display">
                <div className="pity-item">
                    <span className="pity-label">五星保底</span>
                    <span className="pity-value"><strong>{pityStatus.fiveStar}</strong>/50</span>
                </div>
                <div className="pity-item">
                    <span className="pity-label">四星保底</span>
                    <span className="pity-value"><strong>{pityStatus.fourStar}</strong>/10</span>
                </div>
            </div>
            <div className="rule-item five-star">
                <h3>★★★★★ 同学</h3>
                <p>概率：0.6%</p>
                <p>保底：50抽必出</p>
            </div>
            <div className="rule-item four-star">
                <h3>★★★★ 回忆</h3>
                <p>概率：5.1%</p>
                <p>保底：10抽必出</p>
            </div>
            <div className="rule-item three-star">
                <h3>★★★ 物品</h3>
                <p>概率：94.3%</p>
            </div>
        </div>
    );
}
