const mongoose=require('mongoose');
const quoteSchema = new mongoose.Schema({
    heading:{type:String,required:true,trim:true},
    description:{type:String,required:true,trim:true},
    points:{type:[String]},
    buttonText:{type:String},
     ctaLink:{type:String}

},{timestamps:true});
module.exports=mongoose.model('Quote',quoteSchema);