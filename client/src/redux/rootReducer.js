import transcriptReducer from './transcriptReducer';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import keywordReducer from './keywordReducer';
import wordCloudReducer from './wordCloudReducer';

const rootReducer = combineReducers({
    transcript: transcriptReducer.reducer,
    keywords: keywordReducer.reducer,
    words: wordCloudReducer.reducer
})

export default configureStore({ reducer:  rootReducer});
