import React from "react";
import { Alert } from "reactstrap";
import { SUCCESS } from "./StatusTypes";
import './StatusDisplay.css';

export const defaultOpts = {
    type: SUCCESS,
    msg: ''
}

const StatusDisplay = ({opts={...defaultOpts}, onClose}) => {
    return(
        <Alert className='status' color={opts.type} isOpen={!!opts.msg} toggle={onClose}>
            {opts.msg}
        </Alert>
    )
}

export default StatusDisplay;