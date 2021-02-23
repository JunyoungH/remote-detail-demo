import { connect } from "react-redux";
import { addKeyword, deleteKeyword } from "../redux/keywordReducer";
import ChipInput  from 'material-ui-chip-input';

const mapStateToProps = (state) => {
    return { keywords: state.keywords };
}

const mapDispatchToProps = dispatch => {
    return {
        addKeyword: keyword => dispatch(addKeyword(keyword)),
        deleteKeyword: keyword => dispatch(deleteKeyword(keyword))
    }
}

const handleAddKeyword = (keyword, addKeyword) => {
    addKeyword(keyword);
}

const handleDeleteKeyword = (index, deleteKeyword) => {
    deleteKeyword(index);
}

function KeywordSearch ({ keywords, addKeyword, deleteKeyword }) {
    return (
        <div className="keyword-input-container">
            <ChipInput
                value={keywords.map(keyword => <button>{keyword}</button>)}
                onAdd={(keyword) => handleAddKeyword(keyword, addKeyword)}
                onDelete={(keyword, index) => handleDeleteKeyword(index, deleteKeyword)}
                fullWidth
                disableUnderline
            />
        </div>        
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(KeywordSearch);