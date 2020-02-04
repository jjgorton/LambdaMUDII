import React from 'react';

const Controls = ({move}) => {
    return <div className="control-panel">
        <button className="control-button" onClick={() => move('n')}>N</button>
        <button className="control-button" onClick={() => move('s')}>S</button>
        <button className="control-button" onClick={() => move('e')}>E</button>
        <button className="control-button" onClick={() => move('w')}>W</button>
        {/* pickup */}
        <button className="control-button">P</button>
        {/* drop */}
        <button className="control-button">D</button>
        {/* use */}
        <button className="control-button">U</button>
    </div>;
};

export default Controls;
