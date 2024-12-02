import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const bookMarkSlice = createSlice({
    name: 'posts',
    initialState: {
        data: [] as number[],
    },
    reducers: {
        initBookMark: (state, action: PayloadAction<number[]>) => {
            state.data = action.payload;
        },
        addBookMark: (state, action: PayloadAction<number>) => {
            // add new post to the first index
            state.data = [action.payload, ...state.data];
        },
        deleteBookMark: (state, action: PayloadAction<number>) => {
            state.data = state.data.filter((post) => post !== action.payload);
        },
    },
});

export const { initBookMark, addBookMark, deleteBookMark } =
    bookMarkSlice.actions;

export default bookMarkSlice.reducer;