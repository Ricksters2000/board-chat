import React from 'react';

const MessageForm = ({onSubmit, onTextChange}) => {
    const onFormSubmit = (evt) => {
        evt.preventDefault();
        // console.log(evt.target, evt.target['send-message'])
        evt.target['send-message'].value = ''
        onSubmit();
    }
    
    return(
        <form autoComplete='off' onSubmit={onFormSubmit}>
            <input name='send-message' type='text' onChange={onTextChange} required />
            <input type='submit' />
        </form>
    )
}

export default MessageForm;