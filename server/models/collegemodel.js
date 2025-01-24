import asynchandler from "../utils/asynchandler.js";
import mongoose from mongoose
import Department from "./departmentmodel.js";

const collegeSchema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    id:{
        type:String,
        require:true,
        unique:true
    },
    degree:[String],
    department:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department', 
    }],
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', }
    ]
})
export default College;

collegeSchema.pre('remove',asynchandler(async function(next) {
    //delete all department college
    const depIds=this.department

    //store the total number of course
    const num_course=depIds.length;
  
    //filter the courses and delete
    const result=await Department.deleteMany({_id:{$in:depIds}});
  
    //check all courses delete successfully
      if (result.deletedCount!== num_course) {
        return next(new ApiError('error in deleted course of department ', 422));
      }   
}))
