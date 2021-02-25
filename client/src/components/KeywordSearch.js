import { connect } from 'react-redux';
import { addKeyword, deleteKeyword } from '../redux/keywordReducer';
import { getTranslation } from '../services/transcriptService';
import ChipInput  from 'material-ui-chip-input';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core';

const mapStateToProps = (state) => {
    return { keywords: state.keywords };
}

const mapDispatchToProps = dispatch => {
    return {
        addKeyword: keyword => dispatch(addKeyword(keyword)),
        deleteKeyword: keyword => dispatch(deleteKeyword(keyword))
    }
}

const handleKeywordSearch = keywords => {
    const params = new URLSearchParams({transcripts: JSON.stringify(keywords)});

    getTranslation(params).then(({ keywords }) => {
        const params = keywords.map(keyword => `(${keyword})`).join(' AND ');
        window.open(`https://pubmed.ncbi.nlm.nih.gov/?term=${params}`, '_blank', `height=500,width=655`);
    });
}

const styles = {
    standard: {
        minHeight: '24px'
    }
}

function KeywordSearch ({ classes, keywords, addKeyword, deleteKeyword }) {
    return (
        <div className="keyword-input-container">
            <ChipInput
                classes={{standard: classes.standard}}
                value={keywords}
                onAdd={(keyword) => addKeyword(keyword)}
                onDelete={(keyword, index) => deleteKeyword(index)}
                placeholder="키워드를 입력하세요."
                chipRenderer={
                    ({text, isFocused, handleClick, handleDelete}, key) => 
                        <Chip
                            size="small"
                            label={text}
                            onClick={handleClick}
                            onDelete={handleDelete}
                            style={{backgroundColor: isFocused && '#30309e'}} 
                            key={key}
                        />
                }
                fullWidth
                disableUnderline
            />
            <div>
                <button className="pubmed-button" onClick={() => handleKeywordSearch(keywords)}>검색</button>
            </div>
        </div>        
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(KeywordSearch));