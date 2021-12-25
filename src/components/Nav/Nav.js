import React from 'react';
import {
    Navbar, NavbarBrand, NavbarToggler, NavItem, Nav, Collapse, 
    UncontrolledDropdown, DropdownToggle, DropdownMenu,
} from 'reactstrap';
import Auth from '../Auth/Auth';
import ProfileIcon from '../Profile/ProfileIcon';
import './Nav.css';

const Navigation = ({userSignedIn, user, onAuthSubmit, onSignout, toggleProfile}) => {
    return(
        <Navbar className='px-3 mb-3' color='light' light expand='md'>
            <NavbarBrand ><img style={{width: '32px'}} src="https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-board-game-sports-activities-flatart-icons-outline-flatarticons.png"/></NavbarBrand>
            <NavbarToggler />
            <Collapse navbar isOpen={true}>
                <Nav className="ms-auto" navbar>
                    {userSignedIn ? 
                        <NavItem className='me-2'>
                            <ProfileIcon user={user} onSignout={onSignout} toggleProfile={toggleProfile} />
                        </NavItem>
                    : 
                    <>
                        <NavItem className='mx-2' >
                            <UncontrolledDropdown>
                                <DropdownToggle className='auth-opts' >Signin</DropdownToggle>
                                <DropdownMenu right>
                                    <Auth isRegistering={false} onSubmit={onAuthSubmit} />
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </NavItem>
                        <NavItem className='mx-2' >
                        <UncontrolledDropdown>
                            <DropdownToggle className='auth-opts' >Register</DropdownToggle>
                            <DropdownMenu right>
                                <Auth isRegistering={true} onSubmit={onAuthSubmit} />
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        </NavItem>
                    </>
                    }
                </Nav>
            </Collapse>
        </Navbar>
    )
}

export default Navigation;