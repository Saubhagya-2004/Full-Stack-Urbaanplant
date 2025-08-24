const express = require('express');
const Plant = require('../models/plant');
// const {userAuth} = require('../middleware/auth');
const { plantvalidation} = require('../utils/validation');
const plantRouter = express.Router();

//post
exports.addplant = async(req,res)=>{
    try{
        plantvalidation(req);
        const user = req.user;
        if(user.Role !=="admin"){
            return res.status(400).json({message:"Only Admin can add plant"});
        }
        const {name,price,categories,availaible}= req.body;
       const plant = new Plant({
        name,price,categories,availaible,createdBy:user._id
       });
       const saveplant = await plant.save();
       res.status(201).json({message:"Plant added sucessfully",data:saveplant})


    }catch(err){
        console.log(err.message);
        res.status(400).json({message:err.message})
    }
};

//get
exports.getplants = async(req,res)=>{
    try{
        const {name,categories} = req.query;
        let filter={};
        if(name){
            filter.name={$regex:name,$options:"i"};
        }
        if(categories){
          filter.categories={$regex:categories,$options:"i"};

        }
        const plants = await Plant.find(filter);
        res.status(200).json({message:"plants",data:plants})
    }
    catch(err){
        console.log(err.message);
        
        res.status(400).json({message:err.message})
    }
}

// update plant details
exports .updatedplant = async(req,res)=>{
    try{
        plantvalidation(req);
        const user = req.user;
        if(user.Role!='admin'){
            return res.status(400).json({message:"Only Admin can update plant"});
        }
        const plantlist = await Plant.findById(req.params.id);
        if(!plantlist){
            return res.status(400).json({message:"Plant Not found"})
        }
        Object.keys(req.body).forEach((key)=>{
            plantlist[key]= req.body[key];
        });
        const updatedplant = await plantlist.save();
        res.status(200).json({message:"Plant updated sucessfully",data:updatedplant})

    }
    catch(err){
        console.log(err.message);
        res.status(400).json({message:err.message});
    }
};

//get single plant data
exports.plantdetails = async(req,res)=>{
    try{
        const plantlist = await Plant.findById(req.params.id);
        if(!plantlist){
            return res.status(400).json({message:"Plant Not found"})
        }
        res.status(200).json({message:"Plant details",data:plantlist})
    }
    catch(err){
        return res.status(400).json({message:err.message})
    }
}

//delete
exports.deleteplant = async(req,res)=>{
    try{
        const user = req.user;
         if(user.Role!='admin'){
            return res.status(400).json({message:"Only Admin can update plant"});
        }
        const plantlist = await Plant.findById(req.params.id);
        if(!plantlist){
            return res.status(400).json({message:"Plant Not found"})
        }
        const deleteplant = await Plant.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Plant deleted sucessfully",data:deleteplant.name})

    }
    catch(err){
        res.status(400).json({message:err.message})
    }
}

