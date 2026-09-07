import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'
mongoose.plugin(slug);

const model = new mongoose.Schema({
  companyID:String,
  name: String,
  salaryMin:Number,
  salaryMax:Number,
  level:String,
  workingMethod:String,
  images:Array,
  technology:Array,
  description:String,

  slug:{ type: String, slug: "name", unique: true },
  province:String,

  deleted:{
    type:Boolean,
    default:false,
  },
  deletedAt:Date,
  deletedBy:String,
},{
  timestamps:true,
});

const job = mongoose.model('job', model,'job');
export default job;