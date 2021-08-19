import React from 'react';
import {UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import './ProfileIcon.css';

const ProfileIcon = ({user, onSignout, toggleProfile}) => {
    const {image, color} = user;

    return(
        <>
            <UncontrolledDropdown>
                <DropdownToggle tag='span'>
                    <img alt='' className='profile-icon' src={image} style={{borderColor: color}} />
                </DropdownToggle>
                <DropdownMenu right modifiers={{offset: {offset: '0px, 7px'}}}>
                    <DropdownItem onClick={toggleProfile}>Profile</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={onSignout}>Sign Out</DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        </>
    )
}

export default ProfileIcon;