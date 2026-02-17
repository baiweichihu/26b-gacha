import { forwardRef } from 'react';

const CircleCard = forwardRef(({ isSingle, showResult, item }, ref) => {
    return (
        <div 
            ref={ref}
            className={`circle-card ${isSingle ? 'single' : 'multiple'} ${showResult ? 'show-result' : ''}`}
            style={{
                width: '60px',
                height: '82.5px',
                position: 'absolute',
                left: '50%',
                top: '50%',
                marginLeft: '-30px',
                marginTop: '-41.25px',
                transformOrigin: 'center center',
                backfaceVisibility: 'visible',
                border: 'none',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div 
                className="card-inner"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d'
                }}
            >
                <div 
                    className="card-face card-back"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}
                >
                    <img 
                        src="public/assets/images/card-back.png" 
                        alt="Card Back"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            border: 'none',
                            boxShadow: 'none'
                        }}
                    />
                </div>
                <div 
                    className="card-face card-front"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}
                >
                    <img 
                        src="public/assets/images/card-face-template.png" 
                        alt="Card Front"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            border: 'none',
                            boxShadow: 'none'
                        }}
                    />
                </div>
            </div>
            
            {item && (
                <div 
                    className="result-overlay"
                    style={{
                        position: 'absolute',
                        top: '-10%',
                        left: '-10%',
                        width: '120%',
                        height: '120%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        pointerEvents: 'none'
                    }}
                >
                    <ResultCard item={item} />
                </div>
            )}
        </div>
    );
});

function ResultCard({ item }) {
    const starText = item.rarity === 'fiveStar' ? '★★★★★' :
                    item.rarity === 'fourStar' ? '★★★★' : '★★★';
    
    return (
        <div 
            className={`card ${item.rarity}`}
            style={{
                width: '100%',
                height: '100%',
                transform: 'scale(0.48) rotateY(180deg)',
                boxShadow: 'none',
                margin: 0,
                border: 'none',
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000'
            }}
        >
            <div className="card-icon" style={{ fontSize: '2rem', marginBottom: '5px' }}>
                {item.icon}
            </div>
            <div className="card-rarity" style={{ fontSize: '0.9rem', color: item.rarity === 'fiveStar' ? '#d4af37' : item.rarity === 'fourStar' ? '#9370db' : '#6495ed', marginBottom: '3px' }}>
                {starText}
            </div>
            <div className="card-name" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#000', marginBottom: '3px', wordBreak: 'break-word', lineHeight: '1.2' }}>
                {item.name}
            </div>
            <div className="card-type" style={{ fontSize: '0.7rem', color: '#666' }}>
                {item.type}
            </div>
        </div>
    );
}

export default CircleCard;
