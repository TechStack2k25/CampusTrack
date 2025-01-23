import mongoose from mongoose

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
