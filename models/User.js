const mongoose=require('mongoose')
const Schema=mongoose.Schema


let MatchSchema=new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    contact: String

})


module.exports=mongoose.model('User',MatchSchema);