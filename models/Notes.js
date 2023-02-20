const mongoose=require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
   user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user' 
   },
   title:{
    type:String,
    required:true
   },
   description:{
    type:String,
    required:true
   },
   tag:{
    type:String,
    default:"general"
   },
   date:{
    type:Date,
    default:Date.now
   }
});

const User=mongoose.model('Notes',NoteSchema);

module.exports=User;

// module.exports=mongoose.model('user',noteSchema);