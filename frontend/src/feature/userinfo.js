"use client"
import { createSlice } from "@reduxjs/toolkit"



const userSlice = createSlice({
    name: "user",
    initialState:{
        value: ''
    },

    reducers:{
        userinfo:(state, action) =>{
            state.value = action.payload
        }
    }
})

export const {userinfo} = userSlice.actions
export default userSlice.reducer