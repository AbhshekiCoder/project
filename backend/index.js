import express from 'express';
import dotenv from 'dotenv';
import MongoDBConnect from './config/MongoDBConnect.js';
import bodyParser from 'body-parser';
import UserRouter from './Routers/user/user.js';
import loginRouter from './Routers/user/login.js';
import inventoryRouter from './Routers/accountant/inventory.js';
import product_fetch from './Routers/fetch/product.js';

const app = express();
app.use(express.json());
dotenv.config();
app.use(bodyParser.json())

app.use('/signup', UserRouter);
app.use('/signin', loginRouter)
app.use('/inventory', inventoryRouter)
app.use('/product', product_fetch)
MongoDBConnect()


















app.listen(process.env.PORT||3000, ()=>{
    console.log(`server is running on port${process.env.PORT}`);
})