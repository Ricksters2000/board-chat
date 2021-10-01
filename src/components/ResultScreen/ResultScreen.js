import React from 'react';
import { Link } from 'react-router-dom';
import {Modal, Button} from 'reactstrap';
import { LOSE, WIN } from './constants';
import './ResultScreen.css';

const ResultScreen = ({result}) => {
    const text = result === WIN ? WIN : LOSE;

    return(
        <Modal contentClassName={result === WIN ? 'win-bg' : 'lose-bg'} isOpen={!!result}>
            <div className='container'>
                <h1 className='result-txt'>YOU {text}</h1>
                <Link to='/'>
                    <Button color='primary'>Return</Button>
                </Link>
            </div>
        </Modal>
    )
}

export default ResultScreen;