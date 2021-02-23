import trascriptRecuder from './trascriptRecuder';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import keywordReducer from './keywordReducer';

const rootReducer = combineReducers({
    transcripts: trascriptRecuder.reducer,
    keywords: keywordReducer.reducer
})
export default configureStore({ reducer:  rootReducer});
