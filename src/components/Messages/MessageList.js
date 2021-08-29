import React from 'react';
import MessageForm from '../MessageForm/MessageForm';
import Message from './Message';
import ScrollBoundary from '../ScrollBoundary/ScrollBoundary';
import './MessageList.css';

class MessageList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            currentMessage: ''
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.socket !== this.props.socket) {
            this.props.socket.on('message', this.onMessageReceived);
        }
    }

    onMessageReceived = async (info) => {
        // console.log('message received with info:', info)
        const data = await JSON.parse(info);
        this.setState({messages: [...this.state.messages, data]});
    }

    onMessageSent = () => {
        const {username, email, image, color, wins} = this.props.user;

        this.props.socket.emit('message', {username, email, image, color, wins, id: this.props.socket.id, msg: this.state.currentMessage});
    }

    onTypingMessage = (evt) => {
        this.setState({currentMessage: evt.target.value});
    }

    sendInvite = (toId, game) => {
        this.props.socket.emit('send-invite', toId, {username: this.props.user.username, game});
    }

    render() {
        const {messages} = this.state;

        return(
            <div className='messages'>
                <ScrollBoundary >
                    {messages.map((m,i) => {
                        const {id, username, email, image, color, wins, msg} = m;
                        return(<Message key={i} id={id} user={{username, email, image, color, wins}} text={msg} invite={this.sendInvite} />)
                    })}
                </ScrollBoundary>
                <MessageForm onSubmit={this.onMessageSent} onTextChange={this.onTypingMessage} />
            </div>
        )
    }
}

export default MessageList;