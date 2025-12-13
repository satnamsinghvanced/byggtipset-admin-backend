const express= require('express');

const { createAgentPage, getAgentPage, getAgentById,updateAgent, deleteAgent } = require('./controller');
const router = express.Router();
router.post('/create',createAgentPage);
router.get('/',getAgentPage);
router.get('/:id',getAgentById);
router.put('/update/:id',updateAgent);
router.delete('/delete/:id',deleteAgent);
module.exports=router;