import React, {useState, useEffect} from 'react';
import './ScrollBoundary.css';

const ScrollBoundary = (props) => {
    const [list, setList] = useState(null);
    useEffect(() => {
        setList(document.getElementsByClassName('scroll')[0]);
    },[])

    useEffect(() => {
        if(!list) return;

        // console.log('on effect', list.scrollHeight);
        setTimeout(() => {
            list.scroll(0, list.scrollHeight);
        }, 50)
    }, [props.children.length])
    
    return(
        <ul className='scroll' style={props.style}>
            {props.children}
        </ul>
    )
}

export default ScrollBoundary;