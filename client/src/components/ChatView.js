import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import ChatBubble from './ChatBubbule';

const mapStateToProps = (state) => {
    return {
        transcripts: state.transcript.results,
        isHasError: state.transcript.isHasError
    }
}

function ChatView ({ transcripts, isHasError }) {

    return (
        <>
            <div className={`chat-container ${isHasError && 'has-error'}`}>
                {transcripts.map((transcript, idx) => <ChatBubble {...transcript} key={idx}></ChatBubble>)}
            </div>
        </>
    );
}

export default connect(mapStateToProps)(ChatView)