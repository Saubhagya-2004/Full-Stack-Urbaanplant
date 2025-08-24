const express = require('express');
const {addplant,getplants,updatedplant,deleteplant,plantdetails}= require('../controllers/plantcontroller');
const plantcontroller = express.Router();
const {userAuth} = require('../middleware/auth');
plantcontroller.post('/addplant',userAuth,addplant);
plantcontroller.get('/getplants',userAuth,getplants);
plantcontroller.patch('/update/plant/:id',userAuth,updatedplant);
plantcontroller.delete('/delete/plant/:id',userAuth,deleteplant);
plantcontroller.get('/plant/:id',userAuth,plantdetails)
module.exports = plantcontroller;