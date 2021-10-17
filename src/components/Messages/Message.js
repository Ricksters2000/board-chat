import React, {useState} from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal } from 'reactstrap';
import Profile from '../Profile/Profile';
import InviteMenu from '../Invite/InviteMenu';
import './Message.css';
import '../Profile/Profile.css';

const Message = ({clientId, id, user, text, invite}) => {
    const [showProfile, setShowProfile] = useState(false);
    const {username, image, color} = user;

    const toggleShowProfile = () => setShowProfile(prevState => !prevState);

    const dropDownPlacement = (obj, opt) => {
        // console.log('offset', obj, opt)
        if(obj.placement === 'bottom-start') {
            // obj.offsets.popper.top = 49;
            // obj.styles.transform = 'translate3d(48px, 320px, 0px)';
            obj.styles.transform = `translate3d(${obj.offsets.popper.left}px, ${obj.offsets.popper.top - 40}px, 0)`;
            return obj;
        }
        return obj;
    }
    
    return(
        <li>
            <UncontrolledDropdown>
                <DropdownToggle tag='span'>
                    <div className='user-display'>
                        <div className='pic small' style={{backgroundImage: `url(${image})`, borderColor: color}} />
                        <div style={{color: color}}>{username}</div>
                    </div>
                </DropdownToggle>
                <DropdownMenu container='body' modifiers={{offset: {fn: dropDownPlacement, /* offset: '0px, 47px' */}}}>
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