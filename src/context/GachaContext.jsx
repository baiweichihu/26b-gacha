import { createContext, useContext } from 'react';
import { useGacha } from '../hooks/useGacha';
import { useHistory } from '../hooks/useHistory';
import { useInventory } from '../hooks/useInventory';

const GachaContext = createContext();

export function GachaProvider({ children }) {
    const gacha = useGacha();
    const history = useHistory();
    const inventory = useInventory();
    
    const value = {
        gacha,
        history,
        inventory,
        historyStats: {
            fiveStar: history.getFiveStarCount(),
            fourStar: history.getFourStarCount(),
            threeStar: history.getThreeStarCount(),
            total: history.getTotalPulls()
        },
        inventoryStats: {
            fiveStar: inventory.getRarityCount('fiveStar'),
            fourStar: inventory.getRarityCount('fourStar'),
            threeStar: inventory.getRarityCount('threeStar'),
            total: inventory.getTotalCount()
        }
    };
    
    return (
        <GachaContext.Provider value={value}>
            {children}
        </GachaContext.Provider>
    );
}

export function useGachaContext() {
    const context = useContext(GachaContext);
    if (!context) {
        throw new Error('useGachaContext must be used within a GachaProvider');
    }
    return context;
}
