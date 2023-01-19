const express = require('express');
const {create, verifyEmail, sigin}  =  require('../controllers/user')
const{useValidator, validate} = require('../middleware/validator')

const router = express.Router();
router.post('/create',useValidator,validate, create);
router.post('/verify-email', verifyEmail);
router.post('/sign-in', sigin);


module.exports = router;
