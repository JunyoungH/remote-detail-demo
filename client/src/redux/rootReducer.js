import trascriptRecuder from './trascriptRecuder';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
    transcripts: trascriptRecuder.reducer
})
export default configureStore({ reducer:  rootReducer});
