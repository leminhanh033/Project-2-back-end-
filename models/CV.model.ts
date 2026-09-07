import mongoose from 'mongoose'

const model = new mongoose.Schema({
  jobID:String,
  fullname:String,
  phone:String,
  email:String,
  CV:String,

  status:String,
  view:Boolean,

  deleted:{
    type:Boolean,
    default:false,
  },

},{
  timestamps:true,
});

const CV = mongoose.model('CV', model,'CV');
export default CV;