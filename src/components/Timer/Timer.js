import React, {useState, useEffect} from 'react';
import { Progress } from 'reactstrap';

const Timer = ({seconds, onTimeEnd}) => {
    const [time, setTime] = useState(0);
    let interval;
    let t = seconds;

    useEffect(() => {
        const startingTime = new Date();

        interval = setInterval(() => {
            // console.log(t)
            if(t <= 0) {
                clearInterval(interval);
                onTimeEnd();
                return;
            }
            const currentTime = new Date();

            t = seconds - ((currentTime - startingTime) / 1000)
            setTime(t);
        }, 1000/24)
    },[])
    
    return(
        <div>
            <Progress style={{height: '.3rem'}} value={time} max={seconds} />
        </div>
    )
}

export default Timer;