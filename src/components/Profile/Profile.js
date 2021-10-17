import React, {useState} from 'react';
import { Form, FormGroup, Label, Input, Button, Fade, Row, Col, Modal } from 'reactstrap';
import { fetchApi } from '../../services/api';
import { rgbToHex } from '../../services/Converter';
import StatusDisplay, { defaultOpts } from '../StatusDisplay/StatusDisplay';
import { ERROR } from '../StatusDisplay/StatusTypes';
import ToggleInput from '../ToggleInput/ToggleInput';
import './Profile.css';

const Profile = ({user, onSubmit, toggleProfile, canEdit=true}) => {
    const [tempImage, setTempImage] = useState('');
    const [tempColor, setTempColor] = useState('');
    const [fadeIn, setFadeIn] = useState(false);
    const [result, setResult] = useState({...defaultOpts});
    const {username, email, image, color, wins} = user;

    const toggleFadeIn = () => setFadeIn(prev => !prev);
    
    const onImageChange = (evt) => {
        const data = new FormData();
        data.append('image', evt.target.files[0]);

        fetchApi('/temp/img', 'post', data)
            .then(image => setTempImage(image))
            .catch(err => setResult({type: ERROR, msg: err}))
    }

    const onColorChange = (evt) => {
        setTempColor(evt.target.value);
    }

    const submitForm = (evt) => {
        onSubmit(evt)
            .then(status => setResult(status));
    }

    return(
        <Form autoComplete='off' encType='multipart/form-data' onSubmit={submitForm}>
            <StatusDisplay opts={result} onClose={() => setResult({...defaultOpts})}/>
            <Row>
                <Col md={4}>
                    <div onMouseEnter={toggleFadeIn} onMouseLeave={toggleFadeIn} 
                        className='pic' style={{backgroundImage: `url(${tempImage || image})`, borderColor: tempColor || color}}>
                        {canEdit &&
                            <Fade in={fadeIn} className='image-options'>
                                <Label className='image-btn' htmlFor='get-image'>Change</Label>
                                <input className='invis' type='file' name='image' id='get-image' onChange={onImageChange} />
                                <input className='invis' type='color' name='color' id='get-color' defaultValue={rgbToHex(color)} onChange={onColorChange} />
                                <Label className='color-container' htmlFor='get-color'>
                                    <img className='color-btn' src='https://img.icons8.com/ios/50/000000/color-dropper.png'/>
                                </Label>
                            </Fade>
                        }
                    </div>
                </Col>
                <Col md={8}>
                    <div className='submit-container'>
                        <h6>Wins: {wins}</h6>
                        <div className='submit-container'>
                            {canEdit && <input className='submit-btn' type='image' src='https://img.icons8.com/emoji/48/000000/check-mark-emoji.png'/>} 
                            <img className='submit-btn' style={canEdit ? {} : {width: '100%'}} onClick={toggleProfile} src='https://img.icons8.com/material-outlined/24/fa314a/delete-sign.png'/>
                        </div>
                    </div>
                    <ToggleInput inputName='username' placeholder={username} canEdit={canEdit} />
                    {email && <ToggleInput inputName='email' placeholder={email} canEdit={canEdit} />}
                </Col>
            </Row>
        </Form>
    )
}

export default Profile;