import React from 'react';
import {Redirect} from 'react-router-dom';
import {Modal, Alert, Row, Col} from 'reactstrap';
import MessageList from '../Messages/MessageList';
import Navigation from '../Nav/Nav';
import Profile from '../Profile/Profile';
import Invite from '../Invite/Invite';
import ScrollBoundary from '../ScrollBoundary/ScrollBoundary';

const defaultState = {
    profileOpen: false,
    invitesReceived: [],
    currentGame: null
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {...defaultState};
    }

    componentDidMount() {
        if(this.props.socket) {
            this.setupSocket();
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.socket !== this.props.socket) {
            this.setupSocket();
        }
    }

    componentWillUnmount() {
        this.setState({currentGame: null});
    }

    setupSocket = () => {
        this.props.socket.on('receive-invite', this.receiveInvite)
        this.props.socket.on('load-game', this.loadGame);
    }
    
    toggleProfileModal = () => this.setState(prevState => ({profileOpen: !prevState.profileOpen}))
    
    receiveInvite = (from) => {
        const newInvite = {id: from.socketId, username: from.username, game: from.game};
        this.setState(prevState => ({invitesReceived: [...prevState.invitesReceived, newInvite]}))
    }
    
    declineInvite = (id) => {
        this.setState(prevState => ({invitesReceived: prevState.invitesReceived.filter((inv) => inv.id !== id)}));
    }
    
    acceptInvite = (inviteId) => {
        const {id, game} = this.state.invitesReceived.filter(inv => inv.id === inviteId)[0];
        console.log('accpeted invite:', id, game);
        this.props.socket.emit('accept-invite', id, game);
    }
    
    loadGame = (game, roomId) => {
        console.log('loading game:', game, 'with id:', roomId)
        this.setState({currentGame: {game, roomId}});
    }
    
    render() {
        const {profileOpen, invitesReceived, currentGame} = this.state;
        const {socket, onAuthSubmit, onProfileUpdate} = this.props;
        const {id, username, email, image, color, wins} = this.props.user;
    
        return (
            <>
                {currentGame && <Redirect to={`/${currentGame.game}/${id===-1 ? username : id}/${currentGame.roomId}`} />}
                <Navigation user={{image, color}} userSignedIn={id !== -1} 
                onAuthSubmit={onAuthSubmit} onSignout={this.props.onSignout} toggleProfile={this.toggleProfileModal} />
                <Row>
                <Col xs={invitesReceived.length ? '9' : '12'}><MessageList user={{username, email, image, color, wins}} socket={socket} /></Col>
                {invitesReceived.length && <Col xs='3' style={{padding: 0}}>
                    <ScrollBoundary style={{margin: 0, padding: 0}}>
                        {invitesReceived.map((invite, i) => <Invite key={i} {...invite} declined={this.declineInvite} accept={this.acceptInvite} />)}
                    </ScrollBoundary>
                </Col>}
                </Row>
                <Modal isOpen={profileOpen} centered={true}>
                    <Profile user={{username, email, image, color, wins}} onSubmit={onProfileUpdate} toggleProfile={this.toggleProfileModal} />
                </Modal>
            </>
        )
    }
}

export default Home;