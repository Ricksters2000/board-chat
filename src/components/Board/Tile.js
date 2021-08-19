import React from 'react';
import pieces from './pieces';
import './Board.css';

const Tile = ({row, col, color, playerNum, hasPiece, isKing=false, isMovable, piecesToKill=[], onTileChecked, onTileMoved}) => {
    let piece = '';
    if(hasPiece) {
        if(playerNum === 1) piece = isKing ? pieces.blackKing : pieces.blackPiece;
        else piece = isKing ? pieces.redKing : pieces.redPiece;
    }
    
    const onClick = () => {
        if(!hasPiece && !isMovable) return;

        if(hasPiece) {
            onTileChecked(row-1,col-1, playerNum, isKing);
            return;
        }

        onTileMoved(row-1, col-1, piecesToKill);
    }
    
    return(
        <div className={`${hasPiece ? 'piece' : ''} ${isMovable ? 'movable' : ''}`} 
            style={{gridColumn: `${col}`, gridRow: `${row}`, backgroundColor: color, backgroundImage: `url(${piece})`}} onClick={onClick}>
            {/* {hasPiece && <img src={blackKing} />} */}
        </div>
    )
}

export default Tile;