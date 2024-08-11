var express = require('express');
var router = express.Router();
var user = require('../controller/usercontroller')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/register',user.userRegister);

module.exports = router;
