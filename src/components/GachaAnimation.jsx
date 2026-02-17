import { useEffect, useRef, useState, useCallback } from 'react';

let audioContext = null;
let audioInitialized = false;

function initAudio() {
    if (audioInitialized) return;
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioInitialized = true;
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playSound(type) {
    initAudio();
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'fiveStar') {
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1760, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.type = 'sine';
    } else if (type === 'fourStar') {
        oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1320, audioContext.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.type = 'triangle';
    } else {
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.type = 'square';
    }
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function GachaAnimation({ isOpen, item, items, onClose }) {
    const [phase, setPhase] = useState('hidden');
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef(null);
    const cardRefs = useRef([]);
    const animationFrameRef = useRef(null);
    const startTimeRef = useRef(null);
    
    const isSingle = item !== null;
    const cardItems = isSingle ? [item] : (items || []);
    
    const flipCard = useCallback(async (element, scale = 4, x = 0, y = 0) => {
        element.style.transition = 'transform 0.8s ease-in-out';
        element.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(0) scale(${scale}) rotateY(90deg)`;
        
        await sleep(800);
        
        const img = element.querySelector('img');
        if (img) {
            img.src = 'public/assets/images/card-face-template.png';
        }
        
        element.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(0) scale(${scale}) rotateY(180deg)`;
        
        await sleep(800);
    }, []);
    
    const showResultOverlay = useCallback((element, cardItem) => {
        const overlay = document.createElement('div');
        overlay.className = 'result-overlay';
        
        const resultCard = document.createElement('div');
        const starText = cardItem.rarity === 'fiveStar' ? '★★★★★' :
                        cardItem.rarity === 'fourStar' ? '★★★★' : '★★★';
        
        resultCard.className = `card ${cardItem.rarity}`;
        resultCard.style.background = 'transparent';
        resultCard.innerHTML = `
            <div class="card-icon">${cardItem.icon}</div>
            <div class="card-rarity">${starText}</div>
            <div class="card-name">${cardItem.name}</div>
            <div class="card-type">${cardItem.type}</div>
        `;
        resultCard.style.color = '#000';
        
        overlay.appendChild(resultCard);
        element.appendChild(overlay);
    }, []);
    
    const performSingleFlip = useCallback(async () => {
        if (!cardRefs.current[0]) return;
        
        await sleep(800);
        await flipCard(cardRefs.current[0], 4, 0, 0);
        
        setShowResults(true);
        showResultOverlay(cardRefs.current[0], item);
        playSound(item.rarity);
    }, [item, flipCard, showResultOverlay]);
    
    const performTenFlip = useCallback(async () => {
        if (cardRefs.current.length === 0) return;
        
        await sleep(800);
        
        const flipPromises = cardRefs.current.map((card, index) => {
            const row = Math.floor(index / 5);
            const col = index % 5;
            const x = (col - 2) * 90;
            const y = (row - 0.5) * 120;
            return flipCard(card, 2.5, x, y);
        });
        
        await Promise.all(flipPromises);
        
        setShowResults(true);
        
        cardRefs.current.forEach((card, index) => {
            if (items && items[index]) {
                showResultOverlay(card, items[index]);
            }
        });
        
        const rarities = items.map(i => i.rarity);
        if (rarities.includes('fiveStar')) {
            playSound('fiveStar');
        } else if (rarities.includes('fourStar')) {
            playSound('fourStar');
        } else {
            playSound('threeStar');
        }
    }, [items, flipCard, showResultOverlay]);
    
    useEffect(() => {
        if (!isOpen) {
            setPhase('hidden');
            setShowResults(false);
            return;
        }
        
        setPhase('entering');
        
        const enterTimer = setTimeout(() => {
            setPhase('animating');
            startTimeRef.current = performance.now();
            
            if (isSingle) {
                performSingleFlip();
            } else {
                performTenFlip();
            }
        }, 100);
        
        return () => clearTimeout(enterTimer);
    }, [isOpen, isSingle, performSingleFlip, performTenFlip]);
    
    useEffect(() => {
        if (phase !== 'animating' || !containerRef.current || showResults) return;
        
        const animate = (timestamp) => {
            const elapsed = timestamp - startTimeRef.current;
            const t = elapsed / 1000;
            
            cardRefs.current.forEach((card, i) => {
                if (!card) return;
                
                let angle, radius;
                if (isSingle) {
                    angle = t * 120 + (i * 0);
                    radius = 0;
                } else {
                    angle = t * 120 + (i * 36);
                    radius = 120 + Math.sin(t * 2) * 10;
                }
                
                const x = Math.cos(angle * Math.PI / 180) * radius;
                const y = Math.sin(angle * Math.PI / 180) * radius * 0.5;
                const rotateZ = angle;
                const rotateY = angle * 2;
                
                card.style.transform = `translateX(${x}px) translateY(${y}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
            });
            
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        animationFrameRef.current = requestAnimationFrame(animate);
        
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [phase, isSingle, showResults]);
    
    const getContainerClass = () => {
        let cls = 'card-circle-animation';
        if (phase === 'entering' || phase === 'animating') {
            cls += ' active';
        }
        return cls;
    };
    
    return (
        <>
            <div 
                className={getContainerClass()}
                ref={containerRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(92, 64, 51, 0.95)',
                    display: 'none',
                    zIndex: 1000,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: phase === 'entering' ? 0 : 1,
                    transition: 'opacity 0.3s ease'
                }}
            >
                <div 
                    className="circle-container"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 0,
                        height: 0,
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {cardItems.map((cardItem, index) => (
                        <div 
                            key={index}
                            ref={(el) => cardRefs.current[index] = el}
                            className={`circle-card ${isSingle ? 'single' : 'multiple'}`}
                            style={{
                                position: 'absolute',
                                width: '60px',
                                height: '82.5px',
                                left: '50%',
                                top: '50%',
                                marginLeft: '-30px',
                                marginTop: '-41.25px',
                                transformOrigin: 'center center',
                                backfaceVisibility: 'visible',
                                border: 'none',
                                boxShadow: 'none'
                            }}
                        >
                            <img 
                                src="public/assets/images/card-back.png" 
                                alt="card"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    border: 'none',
                                    boxShadow: 'none'
                                }}
                            />
                        </div>
                    ))}
                </div>
                
                <button 
                    className="close-button"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        bottom: '50px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '12px 40px',
                        fontSize: '1.1rem',
                        border: '2px solid #f5e6d3',
                        background: 'transparent',
                        color: '#f5e6d3',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = '#f5e6d3';
                        e.target.style.color = '#5c4033';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#f5e6d3';
                    }}
                >
                    返回
                </button>
            </div>
        </>
    );
}

export default GachaAnimation;
