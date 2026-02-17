import { useState, useCallback } from 'react';
import Header from './components/Header';
import NavIcons from './components/NavIcons';
import GachaButtons from './components/GachaButtons';
import PageOverlay from './components/PageOverlay';
import GachaAnimation from './components/GachaAnimation';
import { useGachaContext } from './context/GachaContext';

function App() {
    const [currentPage, setCurrentPage] = useState(null);
    const [animationOpen, setAnimationOpen] = useState(false);
    const [animationItem, setAnimationItem] = useState(null);
    const [animationItems, setAnimationItems] = useState(null);
    
    const { gacha, history, inventory, inventoryStats } = useGachaContext();
    
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
        setAnimationOpen(false);
        setAnimationItem(null);
        setAnimationItems(null);
        gacha.setIsAnimating(false);
    };

    const handleAnimationComplete = useCallback(() => {
        if (animationItem) {
            history.add(animationItem);
            inventory.add(animationItem);
        } else if (animationItems) {
            history.addBatch(animationItems);
            inventory.addBatch(animationItems);
        }
    }, [animationItem, animationItems, history, inventory]);
    
    return (
        <div className="container">
            <Header hidden={animationOpen} />
            <NavIcons onOpenPage={handleOpenPage} hidden={animationOpen} />
            
            <div className="gacha-content">
                <div className="card-display" id="cardDisplay"></div>
                
                <GachaButtons 
                    onSinglePull={handleSinglePull}
                    onTenPull={handleTenPull}
                    disabled={gacha.isAnimating || animationOpen}
                    hidden={animationOpen}
                />
            </div>
            
            <PageOverlay 
                isOpen={currentPage !== null}
                currentPage={currentPage}
                onClose={handleClosePage}
                history={history.history}
                inventory={inventory.getAll()}
                inventoryStats={inventoryStats}
                pityStatus={gacha.getPityStatus()}
            />
            
            <GachaAnimation 
                isOpen={animationOpen}
                item={animationItem}
                items={animationItems}
                onClose={handleAnimationClose}
                onComplete={handleAnimationComplete}
            />
        </div>
    );
}

export default App;
