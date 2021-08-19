import React, {useState} from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

const InviteMenu = ({invite}) => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleShowMenu = () => setShowMenu(prevState => !prevState);

    return(
        <Dropdown direction='right' isOpen={showMenu} onMouseEnter={toggleShowMenu} onMouseLeave={toggleShowMenu}>
            <DropdownToggle caret dir='right' >Invite</DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={invite}>Checkers</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}

export default InviteMenu;