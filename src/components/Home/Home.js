import React from 'react';
import {Redirect} from 'react-router-dom';
import {Modal, Alert, Row, Col} from 'reactstrap';
import {rand, randRgb} from '../../services/Rand';
import {fetchApi, fetchUser, incrementUserWin} from '../../services/api';
import {DEFAULT_IMAGE} from '../../services/constants';
import MessageList from '../Messages/MessageList';
import Navigation from '../Nav/Nav';
import Profile from '../Profile/Profile';
import Invite from '../Invite/Invite';
import ScrollBoundary from '../ScrollBoundary/ScrollBoundary';
import ProfileCard from '../Profile/ProfileCard';

const defaultState = {
    id: -1,
    username: 'Anonymous'+rand(1000),
    email: '',
    image: DEFAULT_IMAGE,
    color: randRgb(),
    wins: 0,
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
        if(this.props.win && this.state.id !== -1) {
            incrementUserWin(this.state.id)
                .then(wins => {
                    this.setState({wins});
                }).catch(err => console.log(err))
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(prevState.id !== this.state.id && this.state.id !== -1) {
          fetchUser(this.state.id)
            .then(user => this.setState({...user, color: user.color || randRgb()}))
            .catch(console.log)
        }
        if(prevProps.socket !== this.props.socket) {
            this.props.socket.on('receive-invite', this.receiveInvite)
            this.props.socket.on('load-game', this.loadGame);
        }
    }

    componentWillUnmount() {
        this.setState({currentGame: null});
    }
    
    toggleProfileModal = () => this.setState(prevState => ({profileOpen: !prevState.profileOpen}))
    
      //#region Profile
    onAuthSubmit = (evt) => {
        evt.preventDefault();
    
        console.log(evt.target);
    
        const form = evt.target;
    
        const data = {
            name: form['username']?.value,
            email: form['email'].value,
            password: form['password'].value,
            color: randRgb(),
        }
    
        fetchApi(data['name'] ? '/register' : '/signin', 'post', {'Content-Type': 'application/json'}, data)
          .then(id => {
            if(!isNaN(id))
                this.setState({id});
            else {
                console.log(id)
            }
          }).catch(console.log)
    }
    
    onProfileUpdate = (evt) => {
        evt.preventDefault();
    
        const form = evt.target;
        const data = {
            name: form['username']?.value || this.state.username,
            email: form['email']?.value || this.state.email,
            image: form['image']?.file,
            color: form['color']?.value || this.state.color,
            prevEmail: this.state.email
        }
    
        console.log(form, data);
    
        fetchApi(`/profile/${this.state.id}`, 'post', {'Content-Type': 'application/json'}, data)
            .then(resp => {
                this.setState({
                    username: data.name,
                    email: data.email,
                    image: data.image,
                    color: data.color
                })
            }).catch(console.log)
    }
    //#endregion
    
    onSignout = () => {
        this.setState({...defaultState});
    }
    
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
        const {id, username, email, image, color, wins, profileOpen, invitesReceived, currentGame} = this.state;
        const {socket} = this.props;
    
        return (
            <>
                {currentGame && <Redirect to={`/${currentGame.game}/${id===-1 ? username : id}/${currentGame.roomId}`} />}
                <Navigation user={{image, color}} userSignedIn={id !== -1} 
                onAuthSubmit={this.onAuthSubmit} onSignout={this.onSignout} toggleProfile={this.toggleProfileModal} />
                <Row>
                <Col xs={invitesReceived.length ? '9' : '12'}><MessageList user={{username, email, image, color, wins}} socket={socket} /></Col>
                {invitesReceived.length && <Col xs='3' style={{padding: 0}}>
                    <ScrollBoundary style={{margin: 0, padding: 0}}>
                        {invitesReceived.map((invite, i) => <Invite key={i} {...invite} declined={this.declineInvite} accept={this.acceptInvite} />)}
                    </ScrollBoundary>
                </Col>}
                </Row>
                <Modal isOpen={profileOpen}>
                    <Profile user={{username, email, image, color, wins}} onSubmit={this.onProfileUpdate} toggleProfile={this.toggleProfileModal} />
                </Modal>
            </>
        )
    }
}

export default Home;