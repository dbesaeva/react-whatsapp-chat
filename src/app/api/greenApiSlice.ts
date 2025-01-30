import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface GreenApiState {
    messages: string[];
    loading: boolean;
    error: string | null;
}

const initialState: GreenApiState = {
    messages: [],
    loading: false,
    error: null,
};

export const sendMessage = createAsyncThunk(
    "greenApi/sendMessage",
    async (data: { idInstance: string; apiTokenInstance: string; phoneNumber: string; message: string }) => {
        const response = await axios.post(
            `https://api.green-api.com/waInstance${data.idInstance}/SendMessage`,
            {
                apiTokenInstance: data.apiTokenInstance,
                phoneNumber: data.phoneNumber,
                message: data.message,
            }
        );
        return response.data;
    }
);

export const getMessages = createAsyncThunk(
    "greenApi/getMessages",
    async (idInstance: string) => {
        const response = await axios.get(
            `https://api.green-api.com/waInstance${idInstance}/ReceivedMessages`
        );
        return response.data;
    }
);

const greenApiSlice = createSlice({
    name: "greenApi",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages.push(action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Something went wrong";
            })
            .addCase(getMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch messages";
            });
    },
});

export default greenApiSlice.reducer;
