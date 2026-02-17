export default function GachaButtons({ onSinglePull, onTenPull, disabled }) {
    return (
        <div className="buttons">
            <button 
                className="btn single-btn" 
                onClick={onSinglePull}
                disabled={disabled}
            >
                <span className="btn-text">拾忆·一次</span>
                <span className="btn-sub">Recall ×1</span>
            </button>
            <button 
                className="btn ten-btn" 
                onClick={onTenPull}
                disabled={disabled}
            >
                <span className="btn-text">拾忆·十次</span>
                <span className="btn-sub">Recall ×10</span>
            </button>
        </div>
    );
}
