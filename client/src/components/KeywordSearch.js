import { connect } from "react-redux";
import { addKeyword, deleteKeyword } from "../redux/keywordReducer";
import ChipInput  from 'material-ui-chip-input';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Chip from '@material-ui/core/Chip';
import { withStyles } from "@material-ui/core";
import { useRef } from "react";

const handleAddKeyword = (keyword, addKeyword) => {
    addKeyword(keyword);
}

const handleDeleteKeyword = (index, deleteKeyword) => {
    deleteKeyword(index);
}

const mapStateToProps = (state) => {
    return { keywords: state.keywords };
}

const mapDispatchToProps = dispatch => {
    return {
        addKeyword: keyword => dispatch(addKeyword(keyword)),
        deleteKeyword: keyword => dispatch(deleteKeyword(keyword))
    }
}

function KeywordSearch ({ classes, keywords, addKeyword, deleteKeyword }) {
    return (
        <div className="keyword-input-container">
            <ChipInput
                value={keywords}
                onAdd={(keyword) => handleAddKeyword(keyword, addKeyword)}
                onDelete={(keyword, index) => handleDeleteKeyword(index, deleteKeyword)}
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
                <button className="pubmed-button">Pubmed</button>
            </div>
        </div>        
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(KeywordSearch);