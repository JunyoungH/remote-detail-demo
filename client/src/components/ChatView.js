import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        transcripts: state.transcripts
    }
}

function ChatView({ transcripts }) {
    console.log(transcripts)

    return (
        <ul>
            
        </ul>
    );
}

export default connect(mapStateToProps)(ChatView)