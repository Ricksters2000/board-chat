import React from 'react';
import { insert } from '../../services/Str';
import './ProfileCard.css';
import './Profile.css';

const alphaVal = '.45';

const ProfileCard = ({style={}, statusStyle={}, username, image, color='', isThisClient, isPlaying}) => {
    const colorStyle = {borderColor: color, backgroundColor: insert(color, ','+alphaVal, color.length-1)};
    
    return (
        <div className='game-card player-card' style={{...colorStyle, ...style}}>
            {isPlaying && <div className='game-card status' style={{...colorStyle, ...statusStyle}}><p>Playing</p></div>}
            <div className='pic small' style={{backgroundImage: `url(${image})`}} />
            <p className='name'>{isThisClient && <strong style={{marginRight: '.5rem'}}>(YOU)  </strong>}{username}</p>
        </div>
    )
}

export default ProfileCard;