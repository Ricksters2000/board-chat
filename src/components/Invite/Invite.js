import React from 'react';
import Timer from '../Timer/Timer';

const Invite = ({username, game}) => {
    return(
        <div>
            <p>{username} invited you to <strong>{game}</strong></p>
            <Timer seconds={10} />
        </div>
    )
}

export default Invite;