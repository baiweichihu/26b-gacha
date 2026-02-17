export default function Header({ hidden }) {
    if (hidden) return null;
    
    return (
        <div className="header">
            <h1 className="title">少26B·拾忆</h1>
            <p className="subtitle">Class 26B Echos of Memories</p>
        </div>
    );
}
