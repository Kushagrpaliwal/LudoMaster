import mongoose, { mongo } from "mongoose";

const supportdetails = new mongoose.Schema({
  email:{
    type:String,
    required:false
  },
  message:{
    type:String,
    required:false,
  },
 UpdatedAt:{
    type:String,
    default:Date.now
 }

})
const aboutdetails = new mongoose.Schema({
  title:{
    type:String,
    required:false
  },
  content:{
    type:String,
    required:false,
  },
  UpdatedAt:{
    type:String,
    default:Date.now
 }
})

const supportSchema = new mongoose.Schema({
   support:[supportdetails],
   about:[aboutdetails],
   feedback:[feedbackdetails],
})

const support = mongoose.models.supportSchema || mongoose.model('support' , supportSchema);
export default support;
