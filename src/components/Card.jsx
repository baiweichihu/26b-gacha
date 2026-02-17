export default function Card({ item, showRarity = true, showType = true }) {
    const starText = item.rarity === 'fiveStar' ? '★★★★★' :
                    item.rarity === 'fourStar' ? '★★★★' : '★★★';
    
    return (
        <div className={`card ${item.rarity}`}>
            <div className="card-icon">{item.icon}</div>
            {showRarity && <div className="card-rarity">{starText}</div>}
            <div className="card-name">{item.name}</div>
            {showType && <div className="card-type">{item.type}</div>}
        </div>
    );
}
