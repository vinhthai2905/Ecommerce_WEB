import { Notifications } from '@/core/model/notifications';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        data: [] as Notifications[],
    },
    reducers: {
        initNotifications: (state, action: PayloadAction<Notifications[]>) => {
            state.data = action.payload;
        },
        addNewNotifications: (state, action: PayloadAction<Notifications>) => {
            state.data = [action.payload, ...state.data];
        },
    },
});

export const { initNotifications, addNewNotifications } =
    notificationsSlice.actions;

export default notificationsSlice.reducer;