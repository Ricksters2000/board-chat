import React from 'react';
import { Alert, ButtonGroup, Button } from 'reactstrap';
import Timer from '../Timer/Timer';

const Invite = ({id, username, game, declined, accept}) => {
    return(
        <Alert style={{marginRight: '1rem'}} isOpen={true}>
            <p>{username} invited you to <strong>{game}</strong></p>
            <ButtonGroup size='sm' style={{width: '100%'}}>
                <Button outline color='success' onClick={() => accept(id)}>E</Button>
                <Button outline color='danger' onClick={() => declined(id)}>X</Button>
            </ButtonGroup>
            <Timer seconds={10} onTimeEnd={() => declined(id)} />
        </Alert>
    )
}

export default Invite;