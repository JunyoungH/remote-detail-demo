import { connect } from 'react-redux';
import regexifyString from 'regexify-string';
import { addKeyword } from '../redux/keywordReducer';
import watsonImg from '../images/watson.png';
import mrImg from '../images/mr.png';
import drImg from '../images/dr.png';


const handleAddKeyword = (keyword, addKeyword) => {
    addKeyword(keyword);
}

const updateBubble = (props) => {
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
    const source = props.type === 'mAudio' ? 
        { class: 'bubble-left', img: mrImg } : 
        { class: 'bubble-right', img: drImg };

    const analysis = props.isAnalyzed ? 'chat-analyzed': '';

    return (
        <div className={`chat-bubble ${source.class}`}>  
            <span className="chat-bubble-icon">
                <img src={source.img}></img>
            </span>
            <div className="chat-bubble-text">
                <span className={`chat-analysis-icon ${analysis}`}>
                    <img src={watsonImg}></img>
                </span>
                {updateBubble(props)}
            </div>
        </div>

    );
}

export default connect(null, mapDispatchToProps)(ChatBubble);