import mongoose from 'mongoose'

const model = new mongoose.Schema({
  name: String,
},{
  timestamps:true,
});

const province = mongoose.model('province', model,'province');
export default province;