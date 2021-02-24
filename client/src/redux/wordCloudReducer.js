import { createSlice } from "@reduxjs/toolkit";

const wordCloudReducer = createSlice({
    name: 'wordCloudReducer',
    initialState: [],
    reducers: {
        updateWordCloud: (state, action) => {
           return action.payload;
        }
    }
});

export const { updateWordCloud } = wordCloudReducer.actions;
export default wordCloudReducer;