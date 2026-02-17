export default function NavIcons({ onOpenPage }) {
    return (
        <div className="nav-icons">
            <button className="nav-icon" onClick={() => onOpenPage('history')} title="历史记录">
                <span className="icon">📜</span>
                <span className="tooltip">历史记录</span>
            </button>
            <button className="nav-icon" onClick={() => onOpenPage('inventory')} title="背包">
                <span className="icon">🎒</span>
                <span className="tooltip">背包</span>
            </button>
            <button className="nav-icon" onClick={() => onOpenPage('rules')} title="规则说明">
                <span className="icon">📋</span>
                <span className="tooltip">规则说明</span>
            </button>
        </div>
    );
}
