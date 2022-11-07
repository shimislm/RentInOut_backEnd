const { validateUser, validateUserLogin } = require("../validations/userValid");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel");
const { createToken } = require("../helpers/userHelper");
exports.authCtrl = {
    signUp: async(req ,res)=>{
        let validate = validateUser(req.body);
        if (validate.error) {
            return res.status(400).json(validate.error);
        }
        try {
            let user = new UserModel(req.body);
            user.password = await bcrypt.hash(user.password, 10);
            await user.save();
    
            user.password = "********";
            return res.status(201).json(user);
    
        } catch (err) {
            if (err.code == 11000) {
                return res.status(401).json({ msg: "Email is already exist...", err });
            }
            return res.status(500).json({msg: err.message, err});
        }
    },
    login: async(req, res) => {
        const validBody = validateUserLogin(req.body);
        if (validBody.error) {
            return res.status(401).json({ msg_err: validBody.error.details })
        }

        try {
            const user = await UserModel.findOne({ email: req.body.email })
            if (!user) {
                return res.status(401).json({ msg_err: "User not found" })
            }
            const validPass = await bcrypt.compare(req.body.password, user.password);
            if (!validPass) {
                return res.status(401).json({ msg_err: "Invalid password" })
            }

            let newToken = createToken(user._id ,user.role)
            return res.json({token:newToken});
        } catch (err) {
            return res.status(500).json({ msg_err: "There was an error signing" });
        }
    }
}