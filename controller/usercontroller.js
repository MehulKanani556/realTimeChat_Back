var user = require("../model/usermodel")

exports.userRegister = async (req,res)=>{
    console.log("sdfzf")
    try {
        const { mobileNumber, name } = req.body;
        const existingUser = await user.findOne({ mobileNumber });
        console.log(mobileNumber)
        if (existingUser) {
          return res.status(400).json({ error: 'User with this mobile number already exists' });
        }
        
        const newUser = new user({
          mobileNumber: mobileNumber,
          name: name
        });
        
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
      } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'An error occurred during registration' });
      }
}