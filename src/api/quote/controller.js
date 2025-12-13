const Quote = require("../../../models/quote");

exports.createQuote =async(req,res)=>{
    try{
        const{heading,description,points, buttonText , ctaLink}=req.body;
        if(!heading || !description){
            return res.status(400).json({message:"All fields are requird!!"})
        }
        const existing= await Quote.findOne({heading});
        if(existing){
            return res.status(400).json({message:"Quote already exists!!"})
        }
        const quote=await Quote.create({
            heading,
            description,
            points,
            buttonText,
            ctaLink
        })
        res.status(201).json({success:true,message:"Quote created successfully !",data:quote})
    }
    catch(e){
       res.status(500).json({message:e.message})
    }
}
exports.getQuote=async(req,res)=>{
    try{
        const quote = await Quote.find();
        if(!quote)
            return res.status(404).json({message:"Quote not found!!"});
        res.json(quote)
        }
    catch(e){
        res.status(500).json({message:e.message})
    }
}
exports.getQuoteById=async(req,res)=>{
    try{
        const quote = await Quote.findById(req.params.id);
         if(!quote)
            return res.status(404).json({message:"Quote not found!!"});
        res.json(quote);
    }
    catch(e){
        res.status(500).json({message:e.message})
    }
}
exports.updateQuote= async(req,res)=>{
    try{
        const quote= await Quote.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json({success:true,message:'Quote update successfully!!',quote})
    }
    catch(e){
        res.status(500).json({message:e.message})

    }
}
exports.deleteQuote=async(req,res)=>{
    try{
        const{id}=req.params;
        const quote = await Quote.findByIdAndDelete(id);
        if(!quote) return res.status(404).json({message:"Quote not found"});
        res.status(200).json({success:true,message:"Quote deleted successfully!!!"})
    }
    catch(e){
        res.status(500).json({message:e.message})
    }
}
