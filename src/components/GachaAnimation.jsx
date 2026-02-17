import { useEffect, useRef, useState } from 'react';

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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function playTickSound(speed = 1, interval = 100) {
    if (!audioContext) {
        initAudio();
    }
    if (!audioContext) return;
    
    const now = audioContext.currentTime;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    const baseFreq = 120 + speed * 10;
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(baseFreq, now);
    oscillator.frequency.exponentialRampToValueAtTime(40, now + 0.1);
    
    gainNode.gain.setValueAtTime(0.8, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
}

function GachaAnimation({ isOpen, item, items, onClose, onComplete }) {
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef(null);
    const circleContainerRef = useRef(null);
    const animationFrameRef = useRef(null);
    const isRunningRef = useRef(false);
    const totalRotationRef = useRef(0);
    const lastTickTimeRef = useRef(0);
    const fadeTimerRef = useRef(null);
    
    const isSingle = item !== null;
    const cardItems = isSingle ? [item] : (items || []);
    
    const flipCard = async (element, scale = 4, x = 0, y = 0) => {
        element.style.transition = 'transform 0.8s ease-in-out';
        element.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(0) scale(${scale}) rotateY(90deg)`;
        
        await sleep(800);
        
        const img = element.querySelector('img');
        if (img) {
            img.src = '/assets/images/card-face-template.png';
        }
        
        element.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(0) scale(${scale}) rotateY(180deg)`;
        
        await sleep(800);
    };
    
    const showResultOverlay = (element, cardItem) => {
        const overlay = document.createElement('div');
        overlay.className = 'result-overlay';
        
        const resultCard = document.createElement('div');
        const starText = cardItem.rarity === 'fiveStar' ? '★★★★★' :
                        cardItem.rarity === 'fourStar' ? '★★★★' : '★★★';
        
        resultCard.className = `card ${cardItem.rarity}`;
        resultCard.innerHTML = `
            <div class="card-inner">
                <div class="card-icon">${cardItem.icon}</div>
                <div class="card-stars">${starText}</div>
                <div class="card-name">${cardItem.name}</div>
                <div class="card-type">${cardItem.type}</div>
            </div>
        `;
        
        overlay.appendChild(resultCard);
        element.appendChild(overlay);
    };
    
    const runReveal = async (cards) => {
        await sleep(1000);
        
        if (isSingle) {
            let minAngleDiff = Infinity;
            let centerCard = null;
            let centerCardIndex = -1;
            
            cards.forEach((card, index) => {
                const currentAngle = card.baseAngle - totalRotationRef.current;
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
                setShowResults(true);
                
                if (onComplete) {
                    onComplete();
                }
            }
        } else if (items) {
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
                const angle = c.baseAngle - totalRotationRef.current;
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
            setShowResults(true);
            
            if (onComplete) {
                onComplete();
            }
        }
    };
    
    const runAnimation = async () => {
        if (!circleContainerRef.current) return;
        if (isRunningRef.current) return;
        
        isRunningRef.current = true;
        circleContainerRef.current.innerHTML = '';
        
        const cardCount = 30;
        const duration = 4400;
        const radius = 800;
        const cards = [];
        
        for (let i = 0; i < cardCount; i++) {
            const angle = (i / cardCount) * Math.PI * 2;
            
            const card = document.createElement('div');
            card.className = 'circle-card';
            card.innerHTML = `<img src="/assets/images/card-back.png" alt="card-back">`;
            
            circleContainerRef.current.appendChild(card);
            cards.push({ element: card, baseAngle: angle });
        }
        
        const startTime = Date.now();
        let totalRotation = 0;
        let lastTime = startTime;
        let rotationSum = 0;
        const speedScale = 8;
        
        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const deltaTime = now - lastTime;
            lastTime = now;
            
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                isRunningRef.current = false;
                animationFrameRef.current = null;
                totalRotationRef.current = totalRotation;
                runReveal(cards);
                return;
            }
            
            const speed = speedScale * Math.sin(progress * Math.PI) * Math.sin(progress * Math.PI / 2) * Math.sin(progress * Math.PI / 2);
            
            rotationSum += speed * (deltaTime / 1000);
            totalRotation = rotationSum;
            
            const tickInterval = Math.max(30, 200 - speed * 30);
            if (now - lastTickTimeRef.current > tickInterval) {
                playTickSound(speed, tickInterval);
                lastTickTimeRef.current = now;
            }
            
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
            
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        animate();
    };
    
    useEffect(() => {
        if (!isOpen) {
            setShowResults(false);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            isRunningRef.current = false;
            return;
        }
        
        if (animationFrameRef.current || isRunningRef.current) {
            return;
        }

        const container = containerRef.current;
        if (!container) return;
        
        container.classList.add('active');
        
        runAnimation();
    }, [isOpen]);
    
    const handleClose = () => {
        const container = containerRef.current;
        const circleContainer = circleContainerRef.current;
        
        if (container) container.classList.remove('active');
        if (circleContainer) circleContainer.innerHTML = '';
        
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        isRunningRef.current = false;

        setShowResults(false);
        onClose();
    };
    
    return (
        <>
            <div 
                className="card-circle-animation"
                ref={containerRef}
            >
                <div 
                    className="circle-container"
                    ref={circleContainerRef}
                >
                </div>
                
                <button 
                    className="back-button"
                    onClick={handleClose}
                    style={{
                        display: showResults ? 'block' : 'none'
                    }}
                >
                    返回
                </button>
            </div>
        </>
    );
}

export default GachaAnimation;
