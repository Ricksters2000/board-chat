import {DEFAULT_IMAGE} from './services/constants';
import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {io} from 'socket.io-client';
import {fetchApi, fetchUser, incrementUserWin} from './services/api';
import {rand, randRgb} from './services/Rand';
import Home from './components/Home/Home';
import Board from './components/Board/Board';
import './App.css';
import { hexToRgb } from './services/Converter';
import { ERROR, SUCCESS } from './components/StatusDisplay/StatusTypes';

const defaultState = {
  id: -1,
  username: 'Anonymous'+rand(1000),
  email: '',
  image: DEFAULT_IMAGE,
  color: randRgb(),
  wins: 0,
  socket: null
}

class App extends React.Component {
  constructor() {
    super();

    this.state = {...defaultState};
  }

  componentDidMount() {
    this.setState({socket: io('http://localhost:8000')});
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.id !== this.state.id && this.state.id !== -1) {
      this.setUser();
    }
  }

  setUser = () => {
    fetchUser(this.state.id)
      .then(user => this.setState({...user, color: user.color || randRgb()}))
      .catch(console.log)
  }

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

    return fetchApi(data['name'] ? '/register' : '/signin', 'post', data)
      .then(id => {
        if(!isNaN(id))
          this.setState({id});
        else {
          console.log(id)
        }

        return Promise.resolve('')
      }).catch(err => Promise.resolve(err))
  }
  
  onProfileUpdate = (evt) => {
    evt.preventDefault();

    const {username, email, image, color} = evt.target.elements;
    // const data = {
    //   name: form['username']?.value || this.state.username,
    //   email: form['email']?.value || this.state.email,
    //   image: form['image']?.files[0],
    //   color: form['color']?.value || this.state.color,
    //   prevEmail: this.state.email
    // }

    const data = new FormData();
    data.append('name', username?.value || this.state.username);
    data.append('email', email?.value || this.state.email);
    data.append('image', image?.files[0]);
    data.append('color', color?.value ? hexToRgb(color.value) : this.state.color);
    data.append('prevEmail', this.state.email);
    data.append('prevImage', this.state.image.substr(this.state.image.indexOf('.com')+5));

    console.log('data:', Object.fromEntries(data));

    return fetchApi(`/profile/${this.state.id}`, 'post', data)
      .then(resp => {
        this.setUser();
        return Promise.resolve({type: SUCCESS, msg: 'Saved!'});
      }).catch(err => Promise.resolve({type: ERROR, msg: err}))
  }

  onSignout = () => this.setState({...defaultState, socket: this.state.socket})
  //#endregion

  onWin = () => {
    if(this.state.id !== -1) {
      incrementUserWin(this.state.id)
        .then(wins => this.setState({wins}))
        .catch(console.log)
    }
  }

  render() {
    const {id, username, email, image, color, wins, socket} = this.state;

    return (
      <div className="App">
        <Switch>
          <Route exact path='/' render={() => <Home socket={socket} user={{id, username, email, image, color, wins}} onAuthSubmit={this.onAuthSubmit} onProfileUpdate={this.onProfileUpdate} onSignout={this.onSignout} />} />
          <Route exact path='/checkers/:userId/:roomId' render={({match}) => <Board socket={socket} userId={match.params.userId} roomId={match.params.roomId} onWin={this.onWin} />} />
        </Switch>
      </div>
    );
  }
}

export default App;
