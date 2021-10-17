import React from 'react';
import {UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import './Profile.css';

const ProfileIcon = ({user, onSignout, toggleProfile}) => {
    const {image, color} = user;

    return(
        <>
            <UncontrolledDropdown inNavbar>
                <DropdownToggle tag='span'>
                    <div className='pic small' style={{backgroundImage: `url(${image})`, borderColor: color}} />
                </DropdownToggle>
                <DropdownMenu style={{right: 0}} /* right modifiers={{offset: {offset: '0px, 7px'}}} */>
                    <DropdownItem onClick={toggleProfile}>Profile</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={onSignout}>Sign Out</DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        </>
    )
}

export default ProfileIcon;