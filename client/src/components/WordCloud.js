import { connect } from "react-redux";
import ReactWordcloud from 'react-wordcloud';
import { addKeyword } from "../redux/keywordReducer";

const callbacks = {
    getWordTooltip: word => `${word.text} (${word.value})`,
  }

const handleAddKeyword = (word, addKeyword) => {
    addKeyword(word.text);
}

const mapStateToProps = state => {
    return {
        words: state.words
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addKeyword: keyword => dispatch(addKeyword(keyword))
    }
}

function WordCloud ({ words, addKeyword }) {
    return (
        <div className="word-cloud-container">
            {
                words.length > 0 ? 
                    <ReactWordcloud
                    callbacks={{
                        ...callbacks,
                         onWordClick: word => handleAddKeyword(word, addKeyword)
                        }}
                    options={{
                        rotations: 2,
                        rotationAngles: [-90, 0],
                        fontFamily: 'Nanum Myeongjo', 
                      }}
                    words={words}
                    /> :
                    <span>데이터가 없습니다.</span>
            }
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(WordCloud);