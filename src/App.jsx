import { useState } from 'react';
import Header from './components/Header';
import NavIcons from './components/NavIcons';
import GachaButtons from './components/GachaButtons';
import Card from './components/Card';
import PageOverlay from './components/PageOverlay';
import GachaAnimation from './components/GachaAnimation';
import { useGacha } from './hooks/useGacha';
import { useHistory } from './hooks/useHistory';
import { useInventory } from './hooks/useInventory';

function App() {
    const [currentPage, setCurrentPage] = useState(null);
    const [animationOpen, setAnimationOpen] = useState(false);
    const [animationItem, setAnimationItem] = useState(null);
    const [animationItems, setAnimationItems] = useState(null);
    
    const gacha = useGacha();
    const history = useHistory();
    const inventory = useInventory();
    
    const handleOpenPage = (page) => {
        setCurrentPage(page);
    };
    
    const handleClosePage = () => {
        setCurrentPage(null);
    };
    
    const handleSinglePull = async () => {
        if (gacha.isAnimating) return;
        
        gacha.setIsAnimating(true);
        const item = gacha.getSingle();
        
        setAnimationItem(item);
        setAnimationItems(null);
        setAnimationOpen(true);
    };
    
    const handleTenPull = async () => {
        if (gacha.isAnimating) return;
        
        gacha.setIsAnimating(true);
        const items = gacha.getTen();
        
        setAnimationItem(null);
        setAnimationItems(items);
        setAnimationOpen(true);
    };
    
    const handleAnimationClose = () => {
        if (animationItem) {
            history.add(animationItem);
            inventory.add(animationItem);
        } else if (animationItems) {
            history.addBatch(animationItems);
            inventory.addBatch(animationItems);
        }
        
        setAnimationOpen(false);
        setAnimationItem(null);
        setAnimationItems(null);
        gacha.setIsAnimating(false);
    };
    
    const historyStats = {
        fiveStar: history.getFiveStarCount(),
        fourStar: history.getFourStarCount(),
        threeStar: history.getThreeStarCount(),
        total: history.getTotalPulls()
    };
    
    const inventoryStats = {
        fiveStar: inventory.getRarityCount('fiveStar'),
        fourStar: inventory.getRarityCount('fourStar'),
        threeStar: inventory.getRarityCount('threeStar'),
        total: inventory.getTotalCount()
    };
    
    return (
        <div className="container">
            <Header />
            <NavIcons onOpenPage={handleOpenPage} />
            
            <div className="gacha-content">
                <div className="card-display" id="cardDisplay"></div>
                
                <GachaButtons 
                    onSinglePull={handleSinglePull}
                    onTenPull={handleTenPull}
                    disabled={gacha.isAnimating}
                />
            </div>
            
            <PageOverlay 
                isOpen={currentPage !== null}
                currentPage={currentPage}
                onClose={handleClosePage}
                history={history.history}
                historyStats={historyStats}
                inventory={inventory.getAll()}
                inventoryStats={inventoryStats}
                pityStatus={gacha.getPityStatus()}
            />
            
            <GachaAnimation 
                isOpen={animationOpen}
                item={animationItem}
                items={animationItems}
                onClose={handleAnimationClose}
            />
        </div>
    );
}

export default App;
