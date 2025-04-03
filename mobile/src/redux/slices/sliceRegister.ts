import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiRegisterUser } from "../../services/apiRegister";

enum currentStatus { idle = 'idle', loading = 'loading', success = 'success', failed = 'failed' }
interface User {
    response: any;
    name: string;
    email: string;
    password: string;
    role: "admin" | "mentee" | "mentor";
    status: currentStatus;

}

const initialState: User = {
    response: [],
    name: '',
    email: '',
    password: '',
    role: "mentee",
    status: currentStatus.idle
};

const sliceRegister = createSlice({
    name: 'userRegister',
    initialState,
    reducers: {
        setUserRole: (state, action: PayloadAction<"admin" | "mentee" | "mentor">) => {
            state.role = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(registerUser.pending, (state, action) => {
            state.status = currentStatus.loading;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.response = action.payload;
            state.status = currentStatus.success;
        }).addCase(registerUser.rejected, (state, action) => {
            state.status = currentStatus.failed;
        })
    }
});

export const registerUser = createAsyncThunk("userLogin/registerUser", async ({ email, password, name, role }: { email: string, password: string, name: string, role: "admin" | "mentee" | "mentor" }) => {
    const response = await apiRegisterUser({ email, password, name, role });
    // console.log(`Response in the slice is `, response);
    return response;
});

export default sliceRegister.reducer;