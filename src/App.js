import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {io} from 'socket.io-client';
import Home from './components/Home/Home';
import Board from './components/Board/Board';
import './App.css';

class App extends React.Component {
  constructor() {
    super();

    this.state = {socket: null, win: false};
  }

  componentDidMount() {
    this.setState({socket: io('http://localhost:8000')});
  }

  setWin = (state) => this.setState({win: state});

  render() {
    const {socket, win} = this.state;

    return (
      <div className="App">
        <Switch>
          <Route exact path='/' render={() => <Home socket={socket} win={win} />} />
          <Route exact path='/checkers/:userId/:roomId' render={({match}) => <Board socket={socket} userId={match.params.userId} roomId={match.params.roomId} setWin={this.setWin} />} />
        </Switch>
      </div>
    );
  }
}

export default App;
