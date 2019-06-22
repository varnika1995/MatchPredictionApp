const mongoose=require('mongoose')
const Schema=mongoose.Schema


let MatchSchema=new Schema({
    matchNo: String,
    teams:[
        {
            name: String,
            vote: Number
        }
    ]

})


module.exports=mongoose.model('Match',MatchSchema);