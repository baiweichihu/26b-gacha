import { useState, useCallback } from 'react';
import { GachaData, GachaConfig } from '../data/gachaData';

export function useGacha() {
    const [fiveStarPityCounter, setFiveStarPityCounter] = useState(0);
    const [fourStarPityCounter, setFourStarPityCounter] = useState(0);
    const [totalPulls, setTotalPulls] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

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

        for (let i = 0; i < 10; i++) {
            const item = getRandomItem();
            items.push(item);

            if (item.rarity === 'fourStar') hasFourStar = true;
            if (item.rarity === 'fiveStar') hasFiveStar = true;
        }

        return items;
    }, [getRandomItem]);

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
