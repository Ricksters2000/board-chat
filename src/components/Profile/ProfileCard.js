import React from 'react';
import { insert } from '../../services/Str';
import './ProfileCard.css';

const alphaVal = '.45';

const ProfileCard = ({style={}, username, image, color='', isThisClient}) => {
    return (
        <div className='player-card' style={{borderColor: color, backgroundColor: insert(color, ','+alphaVal, color.length-1), ...style}}>
            <image className='profile-icon' alt='' src={image} />
            <p className='name'>{isThisClient && <strong style={{marginRight: '.5rem'}}>(YOU)  </strong>}{username}</p>
        </div>
    )
}

export default ProfileCard;