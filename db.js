const mongoose=require('mongoose');
// const mongourl="mongodb://localhost:27017/inotebook";
const mongourl='mongodb+srv://lokesh96:Hari0000@cluster0.7nwtzsv.mongodb.net/mydatabase?retryWrites=true&w=majority'

const connectmongo=()=>{
    mongoose.connect(mongourl,()=>{
        console.log('connected successfully');
    })
};

module.exports=connectmongo;