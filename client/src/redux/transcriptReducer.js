import { createSlice } from '@reduxjs/toolkit';

const transcriptReducer = createSlice({
    name: 'transcriptReducer',
    initialState: { results: [], isHasError: false },
    reducers: {
        addTranscript: ({ results }, action) => {
            results.push(action.payload.transcript)
        },
        updateTranscript: ({ results }, action) => {
            const { start, end, keywords } = action.payload;

            for (let i = start; i < end; i++) {
                results[i]['isAnalyzed'] = true;
                results[i]['keywords'] = keywords
            }
        },
        hasTranscriptError: (socket, action) => {
            socket.isHasError = action.payload.isHasError;
        }
    }
})

export const { addTranscript, updateTranscript, hasTranscriptError } = transcriptReducer.actions;
export default transcriptReducer;