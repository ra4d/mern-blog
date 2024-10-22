import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    currentUser:null,
    error:null,
    loading:null,
}

const userSlice = createSlice({
    name:"use",
    initialState,
    reducers:{ 
        signInStart:(state)=>{
            state.loading = true;
            state.error =null;
        },
        signInSuccess:(state , action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure:(state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        updataStart:(state)=>{
            state.loading = true;
            state.error =null;
        },
        updataSuccess:(state , action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updataFailure:(state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        deleteStart:(state)=>{
            state.loading = true;
            state.error =null;
        },
        deleteSuccess:(state )=>{
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteFailure:(state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        signoutSuccess:(state )=>{
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },

    },
})

export default userSlice;

