const { createSlice } = require("@reduxjs/toolkit");


let cartSlice = createSlice({
    name: 'cart',
    initialState:{
        value: 0
    },
    reducers:{
        cartinfo: (state, action) =>{
            state.value = action.payload
        }
    }
})

export const {cartinfo} = cartSlice.actions
export default cartSlice.reducer