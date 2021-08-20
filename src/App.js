import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {io} from 'socket.io-client';
import {Modal, Alert, Row, Col} from 'reactstrap';
import {rand, randRgb} from './services/Rand';
import {fetchApi, fetchUser} from './services/api';
import {DEFAULT_IMAGE} from './services/constants';
import MessageList from './components/Messages/MessageList';
import Board from './components/Board/Board';
import Navigation from './components/Nav/Nav';
import Profile from './components/Profile/Profile';
import Invite from './components/Invite/Invite';
import './App.css';

const defaultState = {
  socket: null,
  id: -1,
  username: 'Anonymous'+rand(1000),
  email: '',
  image: DEFAULT_IMAGE,
  color: randRgb(),
  wins: 0,
  profileOpen: false,
  invitesReceived: [{username: 'e', game: 'checkers'}],
}

class App extends React.Component {
  constructor() {
    super();

    // this.socket = null;

    this.state = {...defaultState};
  }

  componentDidMount() {
    // this.socket = io('http://localhost:8000');
    this.setState({socket: io('http://localhost:8000')});
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.id !== this.state.id && this.state.id !== -1) {
      fetchUser(this.state.id)
        .then(user => this.setState({...user, color: user.color || randRgb()}))
        .catch(console.log)
    }
    if(prevState.socket !== this.state.socket) {
      this.state.socket.on('receive-invite', this.receiveInvite)
    }
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

  receiveInvite = () => {

  }

  declineInvite = () => {

  }

  render() {
    const {socket, id, username, email, image, color, wins, profileOpen, invitesReceived} = this.state;

    return (
      <div className="App">
        <Switch>
          <Route exact path='/' render={() => (
            <>
              <Navigation user={{image, color}} userSignedIn={id !== -1} 
                onAuthSubmit={this.onAuthSubmit} onSignout={this.onSignout} toggleProfile={this.toggleProfileModal} />
              <Row>
                <Col xs='9'><MessageList user={{username, email, image, color, wins}} socket={socket} /></Col>
                <Col xs='3'>
                  {invitesReceived.map((invite, i) => <Invite key={i} {...invite} />)}
                  {/* <Invite username={'e'} game={'checkers'}/> */}
                </Col>
              </Row>
              {/* <MessageList user={{username, email, image, color, wins}} socket={socket} /> */}
              <Modal isOpen={profileOpen}>
                <Profile user={{username, email, image, color, wins}} onSubmit={this.onProfileUpdate} toggleProfile={this.toggleProfileModal} />
              </Modal>
              {/* <Modal isOpen={inviteReceived}>
                <Invite username={'e'} game={'checkers'}/>
              </Modal> */}
            </>
          )} />
          <Route exact path='/checkers' render={() => <Board />} />
        </Switch>
      </div>
    );
  }
}

export default App;
