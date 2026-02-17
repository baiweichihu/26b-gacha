import { useEffect, useRef, useState } from 'react';
import Card from './Card';

let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    initAudio();
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'pull') {
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } else if (type === 'fiveStar') {
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.6);
    } else if (type === 'fourStar') {
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
    } else if (type === 'threeStar') {
        oscillator.frequency.setValueAtTime(330, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(392, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function GachaAnimation({ 
    isOpen, 
    item, 
    items, 
    onClose 
}) {
    const [showBackButton, setShowBackButton] = useState(false);
    const circleContainerRef = useRef(null);
    const animationRef = useRef(null);
    const cardsRef = useRef([]);
    
    useEffect(() => {
        if (!isOpen) return;
        
        const isSingle = item !== null;
        const isTen = items !== null;
        
        if (!circleContainerRef.current) return;
        
        const container = circleContainerRef.current;
        container.innerHTML = '';
        setShowBackButton(false);
        
        const cardCount = 30;
        const radius = 800;
        const cards = [];
        
        for (let i = 0; i < cardCount; i++) {
            const angle = (i / cardCount) * Math.PI * 2;
            
            const card = document.createElement('div');
            card.className = 'circle-card';
            card.innerHTML = `<img src="/assets/images/card-back.png" alt="card-back">`;
            
            container.appendChild(card);
            cards.push({ element: card, baseAngle: angle });
        }
        
        cardsRef.current = cards;
        
        const startTime = Date.now();
        let totalRotation = 0;
        let lastTime = startTime;
        let rotationSum = 0;
        const speedScale = 8;
        const duration = 4400;
        
        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const deltaTime = now - lastTime;
            lastTime = now;
            
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                processReveal();
                return;
            }
            
            const speed = speedScale * Math.sin(progress * Math.PI) * Math.sin(progress * Math.PI / 2) * Math.sin(progress * Math.PI / 2);
            
            rotationSum += speed * (deltaTime / 1000);
            totalRotation = rotationSum;
            
            cards.forEach(card => {
                const currentAngle = card.baseAngle - totalRotation;
                const x = Math.cos(currentAngle) * radius;
                const z = Math.sin(currentAngle) * radius;
                const scale = 0.7 + 0.7 * (Math.sin(currentAngle) + 1) / 2;
                const opacity = 0.3 + 0.7 * (Math.sin(currentAngle) + 1) / 2;
                const zIndex = Math.floor((Math.sin(currentAngle) + 1) * 100);
                
                card.element.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
                card.element.style.opacity = opacity;
                card.element.style.zIndex = zIndex;
            });
            
            animationRef.current = requestAnimationFrame(animate);
        };
        
        const processReveal = async () => {
            await sleep(1000);
            
            if (isSingle) {
                let minAngleDiff = Infinity;
                let centerCard = null;
                let centerCardIndex = -1;
                
                cards.forEach((card, index) => {
                    const currentAngle = card.baseAngle - totalRotation;
                    const normalizedAngle = ((currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
                    const angleDiff = Math.abs(normalizedAngle - Math.PI / 2);
                    
                    if (angleDiff < minAngleDiff) {
                        minAngleDiff = angleDiff;
                        centerCard = card;
                        centerCardIndex = index;
                    }
                });
                
                if (centerCard) {
                    cards.forEach((card, index) => {
                        if (index !== centerCardIndex) {
                            card.element.style.opacity = '0';
                        }
                    });
                    
                    centerCard.element.style.transform = `translateX(0) translateZ(0) scale(1)`;
                    centerCard.element.style.opacity = '1';
                    centerCard.element.style.zIndex = '200';
                    centerCard.element.style.transition = 'transform 0.8s ease-in-out';
                    
                    await sleep(300);
                    
                    if (item.rarity === 'fiveStar') {
                        playSound('fiveStar');
                    } else if (item.rarity === 'fourStar') {
                        playSound('fourStar');
                    } else {
                        playSound('threeStar');
                    }
                    
                    await flipCard(centerCard.element, 4, 0, 0);
                    showResultOverlay(centerCard.element, item);
                    await sleep(1000);
                    setShowBackButton(true);
                }
            } else if (isTen) {
                const highestRarity = items.reduce((highest, current) => {
                    const ranks = { threeStar: 1, fourStar: 2, fiveStar: 3 };
                    return ranks[current.rarity] > ranks[highest.rarity] ? current : highest;
                }, items[0]);
                
                if (highestRarity.rarity === 'fiveStar') {
                    playSound('fiveStar');
                } else if (highestRarity.rarity === 'fourStar') {
                    playSound('fourStar');
                } else {
                    playSound('threeStar');
                }
                
                const tenCards = [];
                let centerCardSelected = null;
                
                cards.forEach((c) => {
                    const angle = c.baseAngle - totalRotation;
                    const distance = Math.abs(Math.sin(angle));
                    const isCenter = Math.abs(angle % (2 * Math.PI)) < 0.1 || Math.abs((angle % (2 * Math.PI)) - 2 * Math.PI) < 0.1;
                    
                    if (isCenter && !centerCardSelected) {
                        centerCardSelected = { card: c.element, distance: 0 };
                    } else {
                        tenCards.push({ card: c.element, distance });
                    }
                });
                
                tenCards.sort((a, b) => a.distance - b.distance);
                const otherNineCards = tenCards.slice(0, 9);
                
                const selectedCards = centerCardSelected 
                    ? [centerCardSelected, ...otherNineCards] 
                    : tenCards.slice(0, 10);
                
                const selectedCardSet = new Set(selectedCards.map(s => s.card));
                
                cards.forEach((c) => {
                    c.element.style.transition = 'all 0.5s ease-out';
                    
                    if (!selectedCardSet.has(c.element)) {
                        c.element.style.opacity = '0';
                    }
                });
                
                const cardsWithPositions = selectedCards.map(({ card }, index) => {
                    const row = Math.floor(index / 5);
                    const col = index % 5;
                    const x = (col - 2) * 300;
                    const y = (row - 0.5) * 320;
                    return { card, x, y, index, item: items[index] };
                });
                
                cardsWithPositions.forEach(({ card, x, y, index }) => {
                    card.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(0) scale(4)`;
                    card.style.opacity = '1';
                    card.style.zIndex = 200 + index;
                });
                
                await sleep(500);
                
                await Promise.all(cardsWithPositions.map(({ card, x, y }) => 
                    flipCard(card, 4, x, y)
                ));
                
                cardsWithPositions.forEach(({ card, item }) => {
                    showResultOverlay(card, item);
                });
                
                await sleep(1000);
                setShowBackButton(true);
            }
        };
        
        const flipCard = async (element, scale = 4, x = 0, y = 0) => {
            element.style.transition = 'transform 0.8s ease-in-out';
            element.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(0) scale(${scale}) rotateY(90deg)`;
            
            await sleep(800);
            
            element.querySelector('img').src = '/assets/images/card-face-template.png';
            
            element.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(0) scale(${scale}) rotateY(180deg)`;
            
            await sleep(800);
        };
        
        const showResultOverlay = (element, item) => {
            const overlay = document.createElement('div');
            overlay.className = 'result-overlay';
            
            const resultCard = document.createElement('div');
            const starText = item.rarity === 'fiveStar' ? '★★★★★' :
                            item.rarity === 'fourStar' ? '★★★★' : '★★★';
            
            resultCard.className = `card ${item.rarity}`;
            resultCard.style.background = 'transparent';
            resultCard.innerHTML = `
                <div class="card-icon">${item.icon}</div>
                <div class="card-rarity">${starText}</div>
                <div class="card-name">${item.name}</div>
                <div class="card-type">${item.type}</div>
            `;
            resultCard.style.color = '#000';
            
            overlay.appendChild(resultCard);
            element.appendChild(overlay);
        };
        
        animationRef.current = requestAnimationFrame(animate);
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isOpen, item, items]);
    
    useEffect(() => {
        document.body.addEventListener('click', () => {
            initAudio();
        }, { once: true });
    }, []);
    
    return (
        <div className={`gacha-overlay ${isOpen ? 'active' : ''}`} id="gachaOverlay">
            <div className="lightning"></div>
            <div className="card-circle-animation" id="cardCircleAnimation">
                <div className="circle-container" ref={circleContainerRef} id="circleContainer"></div>
                {showBackButton && (
                    <button 
                        className="back-button" 
                        id="backButton" 
                        onClick={onClose}
                    >
                        返回
                    </button>
                )}
            </div>
            <div className="card-reveal" id="cardReveal"></div>
        </div>
    );
}
