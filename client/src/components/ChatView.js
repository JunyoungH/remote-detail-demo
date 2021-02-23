import { connect } from 'react-redux';
import ChatBubble from './ChatBubbule';

const mapStateToProps = (state) => {
    return {
        transcripts: state.transcripts
    }
}

function ChatView ({ transcripts }) {
    return (
        <ul className="chat-container">
            {transcripts.map((transcript, idx) => <ChatBubble {...transcript} key={idx}></ChatBubble>)}
        </ul>
    );
}

export default connect(mapStateToProps)(ChatView)