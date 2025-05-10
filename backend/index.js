import express from 'express';
import dotenv from 'dotenv';
import MongoDBConnect from './config/MongoDBConnect.js';
import bodyParser from 'body-parser';
import UserRouter from './Routers/user/user.js';
import loginRouter from './Routers/user/login.js';
import inventoryRouter from './Routers/accountant/inventory.js';
import product_fetch from './Routers/fetch/product.js';
import salesRouter from './Routers/user/sales.js';
import cors from 'cors'
import managerSignup from './Routers/manager/signup.js';
import managerRouter from './Routers/manager/login.js';
import cartRouter from './Routers/user/cart.js';
import userinfo from './Routers/fetch/user.js';
import cart_fetch from './Routers/fetch/cart.js';
import sales_fetch from './Routers/accountant/sales_fetch.js';
import sales_update_router from './Routers/accountant/sales_update.js';
import purchase_update_router from './Routers/accountant/purchase_update.js';
import purchaseRouter from './Routers/fetch/purchase.js';



const app = express();
app.use(express.json());
dotenv.config();
app.use(bodyParser.json())
app.use(cors())

app.use('/signup', UserRouter);
app.use('/signin', loginRouter)
app.use('/inventory', inventoryRouter)
app.use('/product', product_fetch)
app.use('/sales', salesRouter)
app.use('/managerSignup', managerSignup)
app.use('/managerSignin', managerRouter)
app.use('/cart', cartRouter)
app.use('/user', userinfo)
app.use('/cart_fetch', cart_fetch)
app.use('/sales_fetch',  sales_fetch)
app.use('/sales/update', sales_update_router)
app.use('/purchase/update', purchase_update_router)
app.use('/purchase', purchaseRouter)
MongoDBConnect()


















app.listen(process.env.PORT||5000, ()=>{
    console.log(`server is running on port${process.env.PORT}`);
})