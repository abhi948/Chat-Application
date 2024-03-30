const User = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    try {
        
        const { username, email, pass } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck){
            return res.json({ msg: "Username already Used", status: false })
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck){
            return res.json({ msg: "Email already Used", stajtus: false });
        }
        
        const hashedpass = await bcrypt.hash(pass, 10);
        const user = await User.create({
            email, username, pass: hashedpass,
        });
        delete user.pass;
        return res.json({ status: true, user });
        
    } catch (error) {
        next(error);
        console.log("error");
    }
};

module.exports.login = async (req, res, next) => {
    try {
        
        const { username, pass } = req.body;
        const uname = await User.findOne({ username });
        if (!uname){
            return res.json({ msg: " Incorrect Username or Password ", status: false })
        }
        const isPassValid = await bcrypt.compare(pass, uname.pass);
        if (!isPassValid){
            return res.json({ msg: " Incorrect Username or Password ", status: false })
        }
        delete uname.pass;
        return res.json({ status: true, uname });
        
    } catch (error) {
        next(error);
        console.log("error");
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImage,
        },
        { new: true }
      );
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (ex) {
      next(ex);
    }
  };

module.exports.getAllUsers = async(req, res, next)=> {
    try {
        const users = await User.find({_id: {$ne:req.params.id} }).select([
            "email", "username", "avatarImage", "_id"
        ]);
        return res.json(users);
    } catch (error) {
        next(error);
    }
};