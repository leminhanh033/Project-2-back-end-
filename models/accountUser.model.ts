import mongoose from 'mongoose'

const model = new mongoose.Schema({
  fullname: String,
  email:String,
  password:String,
  phone:String,
  avatar:String,
  deleted:{
    type:Boolean,
    default:false,
  },
  deletedAt:Date,
  deletedBy:String,
},{
  timestamps:true,
});

const accountUser = mongoose.model('accountUser', model,'account-user');
export default accountUser;