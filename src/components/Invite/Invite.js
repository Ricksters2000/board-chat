import React from 'react';
import { Alert, ButtonGroup, Button } from 'reactstrap';
import Timer from '../Timer/Timer';

const Invite = ({username, game, declined}) => {
    

    return(
        <Alert style={{marginRight: '1rem'}} isOpen={true}>
            <p>{username} invited you to <strong>{game}</strong></p>
            <ButtonGroup size='sm' style={{width: '100%'}}>
                <Button outline color='success'>E</Button>
                <Button outline color='danger' onClick={declined}>X</Button>
            </ButtonGroup>
            <Timer seconds={10} onTimeEnd={declined} />
        </Alert>
    )
}

export default Invite;