import { Posts } from '@/core/model/posts';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        data: [] as Posts[],
    },
    reducers: {
        initPosts: (state, action: PayloadAction<Posts[]>) => {
            state.data = action.payload;
        },
        addNewPost: (state, action: PayloadAction<Posts>) => {
            // add new post to the first index
            state.data = [action.payload, ...state.data];
        },
    },
});

export const { initPosts, addNewPost } = postsSlice.actions;

export default postsSlice.reducer;