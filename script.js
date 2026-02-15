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

function createCardElement(item) {
    const card = document.createElement('div');
    const starCount = item.rarity === 'fiveStar' ? 5 : item.rarity === 'fourStar' ? 4 : 3;
    const stars = '★'.repeat(starCount);
    
    card.className = `card ${item.rarity}-card`;
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-stars">${stars}</div>
            <div class="card-icon">${item.icon}</div>
            <div class="card-name">${item.name}</div>
            <div class="card-type">${item.type}</div>
        </div>
    `;
    
    return card;
}

async function flipCard(element, scale = 4, x = 0, y = 0) {
    element.style.transition = 'transform 0.8s ease-in-out';
    element.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(0) scale(${scale}) rotateY(90deg)`;
    
    await sleep(800);
    
    element.querySelector('img').src = 'public/assets/images/card-face-template.png';
    
    element.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(0) scale(${scale}) rotateY(180deg)`;
    
    await sleep(800);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function playCardCircleAnimation(cardCount = 30, duration = 4400, item = null, items = null) {
    console.log('Starting card circle animation');
    
    const isSingle = item !== null;
    const isTen = items !== null;
    
    const overlay = document.getElementById('gachaOverlay');
    const cardCircle = document.getElementById('cardCircleAnimation');
    const circleContainer = document.getElementById('circleContainer');
    const backButton = document.getElementById('backButton');
    
    if (!overlay || !cardCircle || !circleContainer) {
        console.error('Elements not found:', { overlay, cardCircle, circleContainer });
        return;
    }
    
    overlay.classList.add('active');
    circleContainer.innerHTML = '';
    cardCircle.classList.add('active');
    backButton.style.display = 'none';
    
    console.log('Overlay and card circle activated');
    
    const radius = 800;
    const cards = [];
    
    for (let i = 0; i < cardCount; i++) {
        const angle = (i / cardCount) * Math.PI * 2;
        
        const card = document.createElement('div');
        card.className = 'circle-card';
        card.innerHTML = `<img src="public/assets/images/card-back.png" alt="card-back">`;
        
        circleContainer.appendChild(card);
        cards.push({ element: card, baseAngle: angle });
    }
    
    console.log('Cards created:', cardCount);
    
    const startTime = Date.now();
    let totalRotation = 0;
    let lastTime = startTime;
    let rotationSum = 0;
    
    const speedScale = 8;
    
    return new Promise(resolve => {
        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const deltaTime = now - lastTime;
            lastTime = now;
            
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                console.log('Animation completed');
                resolve();
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
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }).then(async () => {
        console.log('Processing card reveal');
        
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
                
                await flipCard(centerCard.element, 4);
                
                await sleep(1000);
                
                backButton.style.display = 'block';
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
                return { card, x, y, index };
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
            
            await sleep(1000);
            
            backButton.style.display = 'block';
        }
        
        let buttonClicked = false;
        let remainingSeconds = 10;
        const updateInterval = setInterval(() => {
            if (!buttonClicked && remainingSeconds > 0) {
                remainingSeconds--;
                backButton.textContent = `返回（${remainingSeconds}）`;
            }
        }, 1000);
        backButton.textContent = `返回（10）`;
        
        return new Promise(resolveBack => {
            const timeout = setTimeout(() => {
                if (!buttonClicked) {
                    clearInterval(updateInterval);
                    backButton.style.display = 'none';
                    cardCircle.classList.remove('active');
                    circleContainer.innerHTML = '';
                    overlay.classList.remove('active');
                    resolveBack();
                }
            }, 10000);
            
            backButton.onclick = () => {
                buttonClicked = true;
                clearInterval(updateInterval);
                clearTimeout(timeout);
                cardCircle.classList.remove('active');
                circleContainer.innerHTML = '';
                backButton.style.display = 'none';
                overlay.classList.remove('active');
                resolveBack();
            };
        });
    });
}

function updatePityDisplay() {
    const pityStatus = window.gachaSystem.getPityStatus();
    document.getElementById('fiveStarPity').textContent = pityStatus.fiveStar;
    document.getElementById('fourStarPity').textContent = pityStatus.fourStar;
}

async function doSinglePull() {
    if (window.gachaSystem.isAnimating) return;
    window.gachaSystem.isAnimating = true;
    
    const item = window.gachaSystem.getSingle();
    await playCardCircleAnimation(30, 4400, item, null);
    
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';
    resultContainer.appendChild(createCardElement(item));
    
    window.historySystem.add(item);
    window.inventorySystem.add(item);
    
    updatePityDisplay();
    
    window.gachaSystem.isAnimating = false;
}

async function doTenPull() {
    if (window.gachaSystem.isAnimating) return;
    window.gachaSystem.isAnimating = true;
    
    const items = window.gachaSystem.getTen();
    
    await playCardCircleAnimation(30, 4400, null, items);
    
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';
    items.forEach(item => {
        resultContainer.appendChild(createCardElement(item));
        window.historySystem.add(item);
        window.inventorySystem.add(item);
    });
    
    updatePityDisplay();
    
    window.gachaSystem.isAnimating = false;
}

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
            
            if (targetTab === 'history') {
                window.historySystem.render();
                window.historySystem.renderSummary();
            } else if (targetTab === 'inventory') {
                window.inventorySystem.render();
                window.inventorySystem.renderSummary();
            }
        });
    });
}

function init() {
    document.getElementById('singleBtn').addEventListener('click', doSinglePull);
    document.getElementById('tenBtn').addEventListener('click', doTenPull);
    
    initTabs();
    updatePityDisplay();
    
    document.body.addEventListener('click', () => {
        initAudio();
    }, { once: true });
}

document.addEventListener('DOMContentLoaded', init);
