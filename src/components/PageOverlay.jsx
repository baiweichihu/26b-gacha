import HistoryPage from '../pages/HistoryPage';
import InventoryPage from '../pages/InventoryPage';
import RulesPage from '../pages/RulesPage';

export default function PageOverlay({ 
    isOpen, 
    currentPage, 
    onClose, 
    history, 
    inventory, 
    inventoryStats, 
    pityStatus 
}) {
    const renderContent = () => {
        switch (currentPage) {
            case 'history':
                return <HistoryPage history={history} />;
            case 'inventory':
                return <InventoryPage items={inventory} stats={inventoryStats} />;
            case 'rules':
                return <RulesPage pityStatus={pityStatus} />;
            default:
                return null;
        }
    };
    
    return (
        <div className={`page-overlay ${isOpen ? 'active' : ''}`} id="pageOverlay">
            <div className="page-content" id="pageContent">
                <button className="page-back-btn" id="pageBackBtn" onClick={onClose}>
                    ← 返回
                </button>
                <div className="page-inner" id="pageInner">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
