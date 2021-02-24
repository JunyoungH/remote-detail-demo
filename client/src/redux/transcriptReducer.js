import { createSlice } from '@reduxjs/toolkit';

const transcriptReducer = createSlice({
    name: 'transcriptReducer',
    initialState: [],
    reducers: {
        addTranscript: (state, action) => {
            state.push(action.payload)
        },
        updateTranscript: (state, action) => {
            const { start, end, keywords } = action.payload;

            for (let i = start; i < end; i++) {
                state[i]['isAnalyzed'] = true;
                state[i]['keywords'] = keywords
            }
        },
    }
})

export const { addTranscript, updateTranscript } = transcriptReducer.actions;
export default transcriptReducer;