import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    theme:"light"
}

const themeSlice = createSlice({
    name:"theme",
    initialState,
    reducers:{
        toggleThem:(state)=>{
            state.theme = state.theme ==  "light" ? "dark":"light"
        }
    }
})

export default themeSlice;



