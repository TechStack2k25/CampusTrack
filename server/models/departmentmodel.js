import mongoose from mongoose

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