import { useState, useEffect, useCallback } from 'react';

export function useInventory() {
    const [inventory, setInventory] = useState({});

    useEffect(() => {
        try {
            const saved = localStorage.getItem('gachaInventory');
            if (saved) {
                setInventory(JSON.parse(saved));
            }
        } catch (e) {
            console.warn('无法从本地存储加载背包');
        }
    }, []);

    const saveToStorage = useCallback((newInventory) => {
        try {
            localStorage.setItem('gachaInventory', JSON.stringify(newInventory));
        } catch (e) {
            console.warn('无法保存背包到本地存储');
        }
    }, []);

    const add = useCallback((item) => {
        const key = item.name;

        setInventory(prev => {
            const newInventory = { ...prev };
            if (!newInventory[key]) {
                newInventory[key] = {
                    name: item.name,
                    icon: item.icon,
                    type: item.type,
                    rarity: item.rarity,
                    count: 0
                };
            }
            newInventory[key].count++;
            saveToStorage(newInventory);
            return newInventory;
        });
    }, [saveToStorage]);

    const addBatch = useCallback((items) => {
        setInventory(prev => {
            const newInventory = { ...prev };
            items.forEach(item => {
                const key = item.name;
                if (!newInventory[key]) {
                    newInventory[key] = {
                        name: item.name,
                        icon: item.icon,
                        type: item.type,
                        rarity: item.rarity,
                        count: 0
                    };
                }
                newInventory[key].count++;
            });
            saveToStorage(newInventory);
            return newInventory;
        });
    }, [saveToStorage]);

    const remove = useCallback((itemName, amount = 1) => {
        const key = itemName;

        setInventory(prev => {
            const newInventory = { ...prev };
            if (!newInventory[key]) return prev;

            newInventory[key].count -= amount;
            if (newInventory[key].count <= 0) {
                delete newInventory[key];
            }
            saveToStorage(newInventory);
            return newInventory;
        });
    }, [saveToStorage]);

    const getItem = useCallback((name) => {
        return inventory[name] || null;
    }, [inventory]);

    const getAll = useCallback(() => {
        return Object.values(inventory);
    }, [inventory]);

    const getByRarity = useCallback((rarity) => {
        return Object.values(inventory).filter(item => item.rarity === rarity);
    }, [inventory]);

    const getByType = useCallback((type) => {
        return Object.values(inventory).filter(item => item.type === type);
    }, [inventory]);

    const getTotalCount = useCallback(() => {
        return Object.values(inventory).reduce((sum, item) => sum + item.count, 0);
    }, [inventory]);

    const getUniqueCount = useCallback(() => {
        return Object.keys(inventory).length;
    }, [inventory]);

    const getRarityCount = useCallback((rarity) => {
        return Object.values(inventory)
            .filter(item => item.rarity === rarity)
            .reduce((sum, item) => sum + item.count, 0);
    }, [inventory]);

    const clear = useCallback(() => {
        setInventory({});
        saveToStorage({});
    }, [saveToStorage]);

    return {
        inventory,
        add,
        addBatch,
        remove,
        getItem,
        getAll,
        getByRarity,
        getByType,
        getTotalCount,
        getUniqueCount,
        getRarityCount,
        clear
    };
}
