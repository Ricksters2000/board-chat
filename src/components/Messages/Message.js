import React, {useState} from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal } from 'reactstrap';
import Profile from '../Profile/Profile';
import InviteMenu from '../Invite/InviteMenu';
import './Message.css';

const Message = ({clientId, id, user, text, invite}) => {
    const [showProfile, setShowProfile] = useState(false);
    const {username, image, color} = user;

    const toggleShowProfile = () => setShowProfile(prevState => !prevState);

    const dropDownPlacement = (obj, opt) => {
        // console.log('offset', obj, opt)
        if(obj.placement === 'bottom-start') {
            // console.log('on bottom', obj.attributes)
            // obj.offsets.popper.top = 49;
            obj.styles.transform = 'translate3d(0px, 49px, 0px)';
            return obj;
        }
        return obj;
    }
    
    return(
        <li>
            <UncontrolledDropdown>
                <DropdownToggle tag='span'>
                    <div className='user-display'>
                        <img style={{borderColor: color}} src={image} />
                        <div style={{color: color}}>{username}</div>
                    </div>
                </DropdownToggle>
                <DropdownMenu modifiers={{offset: {fn: dropDownPlacement, /* offset: '0px, 47px' */}}}>
                    <DropdownItem onClick={toggleShowProfile}>Profile</DropdownItem>
                    {clientId !== id &&
                    <>
                        <DropdownItem divider />
                        <InviteMenu invite={(game) => invite(id, game)} />
                    </>
                    }
                </DropdownMenu>
            </UncontrolledDropdown>
            <p className='text-light message-text' >{text}</p>
            <Modal isOpen={showProfile}>
                <Profile user={user} toggleProfile={toggleShowProfile} canEdit={false} />
            </Modal>
        </li>
    )
}

export default Message;