import React from 'react';
import './ScrollBoundary.css';

const ScrollBoundary = (props) => {
    return(
        <ul className='scroll'>
            {props.children}
        </ul>
    )
}

export default ScrollBoundary;