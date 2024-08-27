const User = require("../model/usermodel");
const bcrypt = require("bcrypt");

exports.userRegister = async (req, res) => {
  try {
    const { mobileNumber, name, password } = req.body;
    const existingUser = await User.findOne({ mobileNumber });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this mobile number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      mobileNumber,
      name,
      password: hashedPassword
    });
    
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: { mobileNumber: newUser.mobileNumber, name: newUser.name } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;
    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    res.status(200).json({ message: 'Login successful', user: { mobileNumber: user.mobileNumber, name: user.name } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    console.log(users)
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};
