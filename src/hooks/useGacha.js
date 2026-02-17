import { useState, useCallback, useEffect } from 'react';
import { GachaData, GachaConfig } from '../data/gachaData';

export function useGacha() {
    const [fiveStarPityCounter, setFiveStarPityCounter] = useState(0);
    const [fourStarPityCounter, setFourStarPityCounter] = useState(0);
    const [totalPulls, setTotalPulls] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('gachaPity');
            if (saved) {
                const data = JSON.parse(saved);
                if (typeof data.fiveStar === 'number') {
                    setFiveStarPityCounter(data.fiveStar);
                }
                if (typeof data.fourStar === 'number') {
                    setFourStarPityCounter(data.fourStar);
                }
                if (typeof data.total === 'number') {
                    setTotalPulls(data.total);
                }
            }
        } catch (e) {
        }
    }, []);

    const savePityToStorage = useCallback((fiveStar, fourStar, total) => {
        try {
            localStorage.setItem('gachaPity', JSON.stringify({
                fiveStar,
                fourStar,
                total
            }));
        } catch (e) {
        }
    }, []);

    const calculatePityRate = useCallback((counter, pityThreshold, baseRate) => {
        if (counter >= pityThreshold) {
            return 100;
        }
        const progress = counter / pityThreshold;
        return baseRate + (100 - baseRate) * Math.pow(progress, 3);
    }, []);

    const getRandomItem = useCallback(() => {
        const newFiveStarPity = fiveStarPityCounter + 1;
        const newFourStarPity = fourStarPityCounter + 1;
        const newTotal = totalPulls + 1;

        const fiveStarPityRate = calculatePityRate(newFiveStarPity, GachaConfig.fiveStarPity, GachaConfig.fiveStarBaseRate);
        const fourStarPityRate = calculatePityRate(newFourStarPity, GachaConfig.fourStarPity, GachaConfig.fourStarBaseRate);

        const rand = Math.random() * 100;
        let rarity;
        let finalFiveStarPity = newFiveStarPity;
        let finalFourStarPity = newFourStarPity;

        if (rand < fiveStarPityRate) {
            rarity = 'fiveStar';
            finalFiveStarPity = 0;
            finalFourStarPity = 0;
        } else if (rand < fiveStarPityRate + fourStarPityRate) {
            rarity = 'fourStar';
            finalFourStarPity = 0;
        } else {
            rarity = 'threeStar';
        }

        const items = GachaData[rarity];
        const item = items[Math.floor(Math.random() * items.length)];

        setFiveStarPityCounter(finalFiveStarPity);
        setFourStarPityCounter(finalFourStarPity);
        setTotalPulls(newTotal);
        savePityToStorage(finalFiveStarPity, finalFourStarPity, newTotal);

        return {
            ...item,
            rarity,
            pullNumber: newTotal
        };
    }, [fiveStarPityCounter, fourStarPityCounter, totalPulls, calculatePityRate]);

    const getSingle = useCallback(() => {
        return getRandomItem();
    }, [getRandomItem]);

    const getTen = useCallback(() => {
        const items = [];
        let hasFourStar = false;
        let hasFiveStar = false;
        let tempFiveStarPity = fiveStarPityCounter;
        let tempFourStarPity = fourStarPityCounter;
        let tempTotal = totalPulls;

        for (let i = 0; i < 10; i++) {
            tempFiveStarPity++;
            tempFourStarPity++;
            tempTotal++;

            const fiveStarPityRate = calculatePityRate(tempFiveStarPity, GachaConfig.fiveStarPity, GachaConfig.fiveStarBaseRate);
            const fourStarPityRate = calculatePityRate(tempFourStarPity, GachaConfig.fourStarPity, GachaConfig.fourStarBaseRate);

            const rand = Math.random() * 100;
            let rarity;

            if (rand < fiveStarPityRate) {
                rarity = 'fiveStar';
                tempFiveStarPity = 0;
                tempFourStarPity = 0;
            } else if (rand < fiveStarPityRate + fourStarPityRate) {
                rarity = 'fourStar';
                tempFourStarPity = 0;
            } else {
                rarity = 'threeStar';
            }

            const gachaItems = GachaData[rarity];
            const item = gachaItems[Math.floor(Math.random() * gachaItems.length)];

            items.push({
                ...item,
                rarity,
                pullNumber: tempTotal
            });

            if (item.rarity === 'fourStar') hasFourStar = true;
            if (item.rarity === 'fiveStar') hasFiveStar = true;
        }

        setFiveStarPityCounter(tempFiveStarPity);
        setFourStarPityCounter(tempFourStarPity);
        setTotalPulls(tempTotal);
        savePityToStorage(tempFiveStarPity, tempFourStarPity, tempTotal);

        return items;
    }, [fiveStarPityCounter, fourStarPityCounter, totalPulls, calculatePityRate]);

    const getPityStatus = useCallback(() => {
        return {
            fiveStar: fiveStarPityCounter,
            fourStar: fourStarPityCounter,
            total: totalPulls
        };
    }, [fiveStarPityCounter, fourStarPityCounter, totalPulls]);

    return {
        getSingle,
        getTen,
        getPityStatus,
        isAnimating,
        setIsAnimating
    };
}
