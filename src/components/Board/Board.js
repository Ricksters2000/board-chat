import { WIN, LOSE } from '../ResultScreen/constants';
import { DEFAULT_IMAGE } from '../../services/constants';
import React from 'react';
import {Redirect} from 'react-router-dom';
import {fetchUser} from '../../services/api';
import { randRgb } from '../../services/Rand';
import Tile from './Tile';
import ResultScreen from '../ResultScreen/ResultScreen';
import ProfileCard from '../Profile/ProfileCard';
import './Board.css';

const defaultState = {
    player: -1,
    clientInfo: null,
    oppenentInfo: null,
    cols: -1,
    rows: -1,
    board: null,
    tileClicked: null,
    p1Pieces: 0,
    p2Pieces: 0,
    currentTurn: 1,
    result: '',
}

class Board extends React.Component {
    constructor(props) {
        super(props);

        this.board = null;
        this.possibleTiles = [];
        this.state = {...defaultState};
    }

    componentDidMount() {
        if(!this.props.socket) return;
        
        this.props.socket.on('game-started', (p1Id) => {
            this.setState({player: p1Id === this.props.socket.id ? 1 : 2});
            this.props.socket.emit('send-user-id', this.props.userId, this.props.roomId);
        })
        this.props.socket.on('get-user-id', (id) => {
            if(id == this.props.userId) return; //don't recieve it's own id

            this.getUserInfo(id)
                .then(user => {
                    this.setState({oppenentInfo: {...user}});
                })
                .catch(err => console.log(err))
        })
        this.props.socket.on('end-turn', this.onTurnEnd);

        const cols = 8;
        const rows = 8;
        const piecesPerTeam = 12;
        const patternA = '#000000';
        const patternB = '#ff0000';

        let onTop = true;
        let pieces = 0;
        const board = Array(rows).fill(0).map((b, r) => Array(cols).fill(0).map((t, c) => {
            // console.log('row:', r, 'col:', c)
            // const color = r % 2 === 0 ? c % 2 === 0 ? patternA : patternB : c % 2 === 0 ? patternB : patternA;
            let color;
            let hasPiece = false;
            let playerNum = 2;

            const addPiece = () => {
                if(pieces < piecesPerTeam) {
                    if(onTop || r>=rows-3) {
                        pieces++;
                        hasPiece = true;
                        playerNum = onTop ? 1 : 2;
                    }
                } else {
                    pieces = 0;
                    onTop = false;
                }
            }

            if(r % 2 === 0) {
                if(c % 2 === 0) {
                    color = patternB;
                } else {
                    color = patternA;
                    addPiece();
                }
            } else if(c % 2 === 0) {
                color = patternA;
                addPiece();
            } else {
                color = patternB;
            }
            return <Tile 
                        key={`${r}:${c}`} 
                        row={r+1} col={c+1} 
                        color={color} 
                        hasPiece={hasPiece} 
                        playerNum={playerNum} 
                        onTileChecked={this.onTileChecked} onTileMoved={this.onSendMove} />
        }));
        this.setState({cols, rows, board, p1Pieces: piecesPerTeam, p2Pieces: piecesPerTeam})
        
        this.getUserInfo(this.props.userId)
            .then(user => {
                this.setState({clientInfo: {...user}}, () => this.props.socket.emit('ready-up', this.props.roomId));
            })
            .catch(err => console.log(err))

        this.board = document.getElementsByClassName('board-container')[0];
        window.addEventListener('resize', this.onBoardResize);
        this.onBoardResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onBoardResize);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.currentTurn !== this.state.currentTurn) {
            if(this.didGameEnd()) {
                if(this.state.currentTurn === this.state.player) {
                    this.setState({result: LOSE});
                } else {
                    this.props.onWin();
                    this.setState({result: WIN});
                }
            }
        }
    }

    getUserInfo = (userId) => {
        if(isNaN(userId)) {
            return Promise.resolve({username: userId, image: DEFAULT_IMAGE, color: randRgb()});
        }

        return fetchUser(userId).then(user => {
            const {username, image, color} = user;
            return {username, image: image || DEFAULT_IMAGE, color};
        }).catch(err => Promise.reject(err))
    }

    onBoardResize = () => this.board.style.width = this.board.clientHeight + 'px'

    onTileChecked = (row, col, playerNum, isKing) => {
        if(playerNum !== this.state.player || this.state.currentTurn !== this.state.player) return;

        // console.log('possible tiles:', this.possibleTiles)
        if(this.possibleTiles) {
            this.resetPossibleTiles();
        }

        this.setAllPossibleTiles(row, col, playerNum, isKing);
        // this.setAllPossibleTiles(row, col, playerNum, false);
        this.setState({tileClicked: [row,col,playerNum,isKing]});
    }

    setAllPossibleTiles = (row, col, playerNum, isKing) => {
        const board = this.state.board;

        const rowIncrement = playerNum === 1 ? 1 : -1;
        // const colIncrement = forLeft ? -1 : 1;
        
        console.log('starting left side');
        this.helperSetTiles(board, row+rowIncrement, col-1, rowIncrement, playerNum, false, col, [], true);
        console.log('starting right side');
        this.helperSetTiles(board, row+rowIncrement, col+1, rowIncrement, playerNum, false, col, [], true);
        if(isKing) {
            console.log('starting king left side');
            this.helperSetTiles(board, row+rowIncrement*-1, col-1, rowIncrement*-1, playerNum, false, col, [], true);
            console.log('starting king right side');
            this.helperSetTiles(board, row+rowIncrement*-1, col+1, rowIncrement*-1, playerNum, false, col, [], true);
        }

        // console.log('possible tiles:', this.possibleTiles)
        /********setting tiles using for loop*********
        const startingRow = row + rowIncrement;
        const startingCol = col + colIncrement;
        let onPiece = false;
        console.log('starting set tiles for:', row, col, forLeft ? 'left-side' : 'right-side');
        for(let r=startingRow,c=startingCol;r >= 0 && r < board.length && c >= 0 && c < board.length;r+=rowIncrement,c+=colIncrement) {
            console.log(r, c)
            const tile = board[r][c];
            if(tile.props.hasPiece) {
                if(onPiece || tile.props.playerNum === playerNum) r = playerNum ? board.length : -1;
                onPiece = true;
                continue;
            }
            if(!onPiece && r !== startingRow && c !== startingCol) {
                r = playerNum ? board.length : -1;
                continue;
            }
            if(onPiece) onPiece = false;

            board[r][c] = <Tile key={tile.key} {...tile.props} isMovable={true} />
            possibleTiles.push([r,c])
        }

        this.setState({board, possibleTiles}); */
    }

    helperSetTiles = (board, row, col, rInc, playerNum, onPiece, prevCol=-1, piecesToKill=[], started=false) => {
        // console.log(row, col, onPiece, started?'just started':'continuing');
        let isMoveable = true;
        if(row < 0 || row >= board.length || col < 0 || col >= board.length) return console.log('end');
        
        const tile = board[row][col];
        if(tile.props.hasPiece) {
            //can't go over 2 pieces and can't go over own player's piece soo it will return else it will continue checking
            if(onPiece || tile.props.playerNum === playerNum) return;
            onPiece = true;
            isMoveable = false;
        } else {
            if(!onPiece && !started) return;
            if(onPiece) {
                onPiece = false;
                piecesToKill = [...piecesToKill, [row-rInc,prevCol]];
            }
        }
        
        if(isMoveable) {
            board[row][col] = <Tile key={tile.key} {...tile.props} isMovable={true} piecesToKill={piecesToKill} />
            this.possibleTiles.push([row,col]);
            if(started) return;
        }

        if(onPiece) {
            const colInc = prevCol < col ? 1 : -1;
            this.helperSetTiles(board, row+rInc, col+colInc, rInc, playerNum, onPiece, col, piecesToKill);
        } else {
            this.helperSetTiles(board, row+rInc, col-1, rInc, playerNum, onPiece, col, piecesToKill);
            this.helperSetTiles(board, row+rInc, col+1, rInc, playerNum, onPiece, col, piecesToKill);
        }
    }

    resetPossibleTiles = () => {
        const board = this.state.board;
        this.possibleTiles.forEach(p => {
            const [r,c] = p;
            const t = board[r][c];
            board[r][c] = <Tile key={t.key} {...t.props} isMovable={false} />
        })
        this.possibleTiles = [];
        this.setState({board});
    }

    onSendMove = (row, col, piecesToKill) => {
        if(this.state.currentTurn !== this.state.player) return;
        
        this.resetPossibleTiles();
        let options = {tileClicked: this.state.tileClicked, row, col, piecesToKill, room: this.props.roomId};
        this.props.socket.emit('end-turn', options);
    }

    onTurnEnd = (options) => {
        console.log('turn ended with opts:', options)
        const {tileClicked, row, col, piecesToKill} = options;
        const board = this.state.board;
        const [r,c,playerNum,isKing] = tileClicked;
        const tClicked = board[r][c];
        const tileToMoveTo = board[row][col];

        let isK = isKing;
        if(!isKing && row === 0 || row === board.length-1) isK = true;

        const piecesDied = piecesToKill.reduce((acc,p) => {
            const [x,y] = p;
            const t = board[x][y];
            board[x][y] = <Tile key={t.key} {...t.props} hasPiece={false} />
            return acc + 1;
        },0)

        board[r][c] = <Tile key={tClicked.key} {...tClicked.props} hasPiece={false} />
        board[row][col] = <Tile key={tileToMoveTo.key} {...tileToMoveTo.props} playerNum={playerNum} isKing={isK} hasPiece={true} />

        this.setState(prevState => ({board, 
            p1Pieces: playerNum === 1 ? prevState.p1Pieces : prevState.p1Pieces - piecesDied, 
            p2Pieces: playerNum === 1 ? prevState.p2Pieces - piecesDied : prevState.p2Pieces,
            currentTurn: prevState.currentTurn === 1 ? 2 : 1
        }));
    }

    didGameEnd = () => {
        if(this.state.p1Pieces <= 0 || this.state.p2Pieces <= 0) return true;

        const board = this.state.board;
        for(let r=0; r < board.length; r++) {
            for(let c=0; c < board[r].length; c++) {
                const tile = board[r][c];
                const {row, col, playerNum, hasPiece, isKing} = tile.props;
                if(hasPiece && playerNum === this.state.currentTurn) {
                    this.setAllPossibleTiles(row-1, col-1, playerNum, isKing);
                    if(this.possibleTiles.length > 0) {
                        this.resetPossibleTiles();
                        return false;
                    }
                }
            }
        }

        return true;
    }

    render() {
        const {player, currentTurn, clientInfo, oppenentInfo, cols, rows, board, result} = this.state;
        let p1CardProps, p2CardProps;

        if(player === 1) {
            p1CardProps = {...clientInfo, isThisClient: true};
            p2CardProps = {...oppenentInfo, isThisClient: false};
        } else {
            p1CardProps = {...oppenentInfo, isThisClient: false};
            p2CardProps = {...clientInfo, isThisClient: true};
        }

        return(
            <>
                <ResultScreen result={result} />
                {!this.props.socket && <Redirect to='/' />}
                <div style={{display: 'flex', padding: '.5rem'}}>
                    {/* Player 2's card (bottom-left side) */}
                    <ProfileCard style={{alignSelf: 'flex-end', marginLeft: 'auto'}} isPlaying={currentTurn === 2} {...p2CardProps} />
                    <div className='board-container' style={{gridTemplateColumns: `repeat(${cols},1fr)`, gridTemplateRows: `repeat(${rows},1fr)`}}>
                        {board && board.map(r => r.map(c => c))}
                    </div>
                    {/* Player 1's card (top-right side) */}
                    <ProfileCard style={{alignSelf: 'flex-start', marginRight: 'auto'}} statusStyle={{top: 0}} isPlaying={currentTurn === 1} {...p1CardProps} />
                </div>
            </>
        )
    }
}

export default Board;