import express from 'express';
import signup from '../../Controllers/manager/signup.js';

let managerSignup = express.Router();

managerSignup.post('/managerSignup', signup);

export default managerSignup;