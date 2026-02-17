import { useState, useEffect, useCallback } from 'react';

export function useHistory(maxSize = 100) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('gachaHistory');
            if (saved) {
                setHistory(JSON.parse(saved));
            }
        } catch (e) {
            console.warn('无法从本地存储加载历史记录');
        }
    }, []);

    const saveToStorage = useCallback((newHistory) => {
        try {
            localStorage.setItem('gachaHistory', JSON.stringify(newHistory));
        } catch (e) {
            console.warn('无法保存历史记录到本地存储');
        }
    }, []);

    const add = useCallback((item) => {
        const record = {
            ...item,
            timestamp: Date.now(),
            id: Date.now() + Math.random().toString(36).substr(2, 9)
        };

        setHistory(prev => {
            let newHistory = [record, ...prev];
            if (newHistory.length > maxSize) {
                newHistory = newHistory.slice(0, maxSize);
            }
            saveToStorage(newHistory);
            return newHistory;
        });
    }, [maxSize, saveToStorage]);

    const addBatch = useCallback((items) => {
        const records = items.map(item => ({
            ...item,
            timestamp: Date.now(),
            id: Date.now() + Math.random().toString(36).substr(2, 9)
        }));

        setHistory(prev => {
            let newHistory = [...records, ...prev];
            if (newHistory.length > maxSize) {
                newHistory = newHistory.slice(0, maxSize);
            }
            saveToStorage(newHistory);
            return newHistory;
        });
    }, [maxSize, saveToStorage]);

    const getByRarity = useCallback((rarity) => {
        return history.filter(item => item.rarity === rarity);
    }, [history]);

    const getFiveStarCount = useCallback(() => {
        return history.filter(item => item.rarity === 'fiveStar').length;
    }, [history]);

    const getFourStarCount = useCallback(() => {
        return history.filter(item => item.rarity === 'fourStar').length;
    }, [history]);

    const getThreeStarCount = useCallback(() => {
        return history.filter(item => item.rarity === 'threeStar').length;
    }, [history]);

    const clear = useCallback(() => {
        setHistory([]);
        saveToStorage([]);
    }, [saveToStorage]);

    return {
        history,
        add,
        addBatch,
        getByRarity,
        getFiveStarCount,
        getFourStarCount,
        getThreeStarCount,
        getTotalPulls: () => history.length,
        clear
    };
}
