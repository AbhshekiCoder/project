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
import inventoryUpdate from './Routers/accountant/inventoryUpdate.js';
import inventoryDelete from './Routers/accountant/inventory_delete.js';
import delete_sales from './Routers/accountant/delete_sales.js';
import inventoryModel from './Models/inventoryModel.js';
import delete_purchase from './Routers/accountant/delete_purchase.js';
import cartFetch from './Routers/fetch/cartFecth.js';
import delete_cart from './Routers/user/delete_cart.js';
import {Server} from  'socket.io'
import http from 'http'
import { WebSocket, WebSocketServer } from 'ws';



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
app.use('/inventory/update', inventoryUpdate)
app.use('/inventory/delete', inventoryDelete);
app.use('/sales/delete', delete_sales )
app.use('/purchase/delete', delete_purchase)
app.use('/cart/delete', delete_cart)

MongoDBConnect()





const server = http.createServer(app);


const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: 'https://project-six-omega-66.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true // For legacy compatibility
});

// Connection handler
io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);
  
  socket.on('send_message', (data) => {
    socket.broadcast.emit('receive_message', data);
    console.log(data)
  });
  socket.on('disconnect', () => {
    console.log(`💤 Client disconnected: ${socket.id}`);
  });
});






app.post('/inventory', async(req, res)=>{
   let result = await inventoryModel.insertMany(req.body)
   if(result){
    res.send({success: true, message: "successfully added"})
   }

})






server.listen(process.env.PORT,  ()=>{
    console.log(`server is running on port${process.env.PORT}`);
})