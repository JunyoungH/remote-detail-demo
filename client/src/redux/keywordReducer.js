import { createSlice } from "@reduxjs/toolkit";

const keywordReducer = createSlice({
    name: 'keywordReducer',
    initialState: [],
    reducers: {
        addKeyword: (state, action) => { 
            state.push(action.payload);
        },
        deleteKeyword: (state, action) => {
           state.splice(action.payload, 1);
        }
    }
});

export const { addKeyword, deleteKeyword } = keywordReducer.actions;
export default keywordReducer;