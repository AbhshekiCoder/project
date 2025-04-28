import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../feature/userinfo'
import cartSlice from '../feature/cart'


const store =  configureStore({
    reducer:{
        name: userSlice,
        cart: cartSlice
    }
})
export default store