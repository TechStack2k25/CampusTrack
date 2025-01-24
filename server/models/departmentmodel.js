import asynchandler from "../utils/asynchandler";
import mongoose from mongoose
import Course from "./coursemodel";
import User from "./usermodel";

const deparmentSchema= mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    code:{
        type:String,
        require:true
    },
    courses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course', 
        },
      ],
    user:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
          }, 
    ],
    hod:{
      type: mongoose.Schema.Types.ObjectId,
       ref: 'User', 
    },
    
    college:{
      type: mongoose.Schema.Types.ObjectId,
       ref: 'College', 
    }
});

const Department=new mongoose.model('Department',deparmentSchema)

export default Department

deparmentSchema.pre('remove',asynchandler(async function(next){
  //delete all the course of department
  const courseIds=this.courses
   
  //change the role of hod to  user
  await User.findByIdAndUpdate(this.hod,{role:'User'})
  
  //store the total number of course
  const num_course=courseIds.length;

  //filter the courses and delete
  const result=await Course.deleteMany({_id:{$in:courseIds}});

  //check all courses delete successfully
    if (result.deletedCount!== num_course) {
      return next(new ApiError('error in deleted course of department ', 422));
    }
  
    next();
}))