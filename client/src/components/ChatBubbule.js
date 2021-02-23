import { connect } from 'react-redux';
import regexifyString from 'regexify-string';
import { addKeyword } from '../redux/keywordReducer';


const handleAddKeyword = (keyword, addKeyword) => {
    addKeyword(keyword);
}

const updateButtle = (props) => {
    const { transcript, keywords, isAnalyzed, addKeyword } = props;

    if(isAnalyzed) {
        const pattern = keywords.join('|');
        return regexifyString({
            pattern: new RegExp(pattern, 'g'),
            decorator: (match, index) => {
                return (
                    <span 
                        className="bubble-keyword" 
                        onClick={() => handleAddKeyword(match, addKeyword)} 
                        key={index}>{match}
                    </span>
                )
            },
            input: transcript
        });
    } 

    return transcript; 
}

const mapDispatchToProps = dispatch => {
    return {
        addKeyword: keyword => dispatch(addKeyword(keyword))
    }
}

function ChatBubble (props) {
    return (
        <li className={props.type === 'mAudio' ? 'bubble-left' : 'bubble-right'}>
            {updateButtle(props)}
        </li>
    );
}

export default connect(null, mapDispatchToProps)(ChatBubble);