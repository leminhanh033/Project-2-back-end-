import mongoose from 'mongoose'

const model = new mongoose.Schema({
  name: String,
  province:String,
  address:String,
  companyModel:String,
  companySize:String,
  workingTime:String,
  workingOvertime:String,
  email:String,
  phone:String,
  description:String,
  logo:String,
  password:String,
  deleted:{
    type:Boolean,
    default:false,
  },
  deletedAt:Date,
  deletedBy:String,
},{
  timestamps:true,
});

const employer = mongoose.model('employer', model,'employer');
export default employer;