const express= require('express');

const { createQuote, getQuote, getQuoteById, updateQuote, deleteQuote } = require('./controller');
const router = express.Router();
router.post('/create',createQuote);
router.get('/',getQuote);
router.get('/:id',getQuoteById);
router.put('/update/:id',updateQuote);
router.delete('/delete/:id',deleteQuote);
module.exports=router;