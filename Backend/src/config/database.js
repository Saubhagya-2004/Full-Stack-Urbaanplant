const mongoose = require('mongoose');
const connectDb=async()=>{
    try{
        await mongoose.connect("mongodb+srv://saubhagyabaliarsingh624:MXQ40jLuzXzq3GTK@cluster0.7kczesw.mongodb.net/urbanplant");
    }
    catch(err){
        console.log("mongoose connection error" + err);
    }
};
module.exports= connectDb;







// password:MXQ40jLuzXzq3GTK
// mongodb+srv://saubhagyabaliarsingh624:MXQ40jLuzXzq3GTK@cluster0.7kczesw.mongodb.net/
// mongodb+srv://saubhagyabaliarsingh624:MXQ40jLuzXzq3GTK@cluster0.7kczesw.mongodb.net/