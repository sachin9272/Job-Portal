import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {

    const { name, email, password } = req.body;
    if (!name) {
        next("name is required")
    }
    if (!email) {
        next("email is required")
    }
    if (!password) {
        next("Password is required and greater than 6 character")
    }
    const existingUser = await userModel.findOne({ email })
    if (existingUser) return res.status(200).send({
        success: false,
        message: "Email already registered please login"
    })
    const user = await userModel.create({ name, email, password });
    const token = user.createJWT()
    res.status(201).send({
        success: true,
        message: "User created Successfully",
        user:{
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            location: user.location,
        },
        token
    })
}

// Login Controller
export const loginController= async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        next('Please provide all Field');
    }
    const user = await userModel.findOne({email}).select("+password");
    if(!user){
        next('Invalid Username or Password');
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        next('Invalid Username or Password')
    }
    user.password = undefined;
    const token = user.createJWT()

    res.status(200).json({
        success: true,
        messag: "Login Successfully",
        user,
        token
    })
}