var express = require('express');
var router = express.Router();
var user = require('../controller/usercontroller')
const { getUserMessages } = require('../controller/messageController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/register',user.userRegister);
router.post('/login',user.userLogin);

router.get('/messages/:mobileNumber', getUserMessages);
router.get('/users', user.getAllUser);

module.exports = router;