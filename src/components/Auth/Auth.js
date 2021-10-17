import { ERROR } from '../StatusDisplay/StatusTypes';
import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import StatusDisplay from '../StatusDisplay/StatusDisplay';

const Auth = ({isRegistering, onSubmit}) => {
    const [err, setErr] = useState('');

    const submitForm = (evt) => {
        onSubmit(evt).then(setErr);
    }

    return(
        <Form encType='multipart/form-data' onSubmit={submitForm}>
            <StatusDisplay opts={{type: ERROR, msg: err}} onClose={() => setErr('')} />
            {isRegistering && 
                <FormGroup>
                    <Label for='username'>Username</Label>
                    <Input type='text' name='username' id='username' />
                </FormGroup>
            }
            <FormGroup>
                <Label for='email'>Email</Label>
                <Input type='email' name='email' id='email' />
            </FormGroup>
            <FormGroup>
                <Label for='password'>Password</Label>
                <Input type='password' name='password' id='password' />
            </FormGroup>
            <FormGroup>
                <Label className='mx-auto' for='submit'>
                    <Button outline color='primary'>{isRegistering ? 'Register' : 'Sign In'}</Button>
                </Label>
            </FormGroup>
            <Input type='submit' id='submit' style={{visibility: 'hidden', padding: 0, height: 0}} />
        </Form>
)}

export default Auth;