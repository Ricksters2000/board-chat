import React, {useState} from 'react';
import { Form, FormGroup, Label, Input, Button, Fade, Row, Col } from 'reactstrap';
import ToggleInput from '../ToggleInput/ToggleInput';
import './Profile.css';

const Profile = ({user, onSubmit, toggleProfile, canEdit=true}) => {
    const [fadeIn, setFadeIn] = useState(false);
    const {username, email, image, color, wins} = user;

    const toggleFadeIn = () => setFadeIn(prev => !prev);
    
    return(
        <Form autoComplete='off' encType='multipart/form-data' onSubmit={onSubmit}>
            <Row>
                <Col md={4}>
                    <div onMouseEnter={toggleFadeIn} onMouseLeave={toggleFadeIn} 
                        className='pic' style={{backgroundImage: `url(${image})`, borderColor: color}}>
                        {canEdit &&
                            <Fade in={fadeIn} className='image-options'>
                                <Label className='image-btn' htmlFor='get-image'>Change</Label>
                                <input className='invis' type='file' id='get-image' />
                                <input className='invis' type='color' id='get-color' defaultValue={color} />
                                <Label className='color-container' htmlFor='get-color'>
                                    <img className='color-btn' src="https://img.icons8.com/ios/50/000000/color-dropper.png"/>
                                </Label>
                            </Fade>
                        }
                    </div>
                </Col>
                <Col md={8}>
                    <div className='submit-container'>
                        <h6>Wins: {wins}</h6>
                        <div className='submit-container'>
                            {canEdit && <input className='submit-btn' type='image' src="https://img.icons8.com/emoji/48/000000/check-mark-emoji.png"/>} 
                            <img className='submit-btn' style={canEdit ? {} : {width: '100%'}} onClick={toggleProfile} src="https://img.icons8.com/material-outlined/24/fa314a/delete-sign.png"/>
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