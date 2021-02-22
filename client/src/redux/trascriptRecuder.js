import { createSlice } from '@reduxjs/toolkit';

const transcriptReducer = createSlice({
    name: 'transcriptReducer',
    initialState: [],
    reducers: {
        addTranscript: (state, action) => {
            state.push(action.payload)
        },
    }
})

export const { addTranscript } = transcriptReducer.actions;
export default transcriptReducer;