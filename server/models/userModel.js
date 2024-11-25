import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Name is require']
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:[true, 'Email is require'],
        unique:true,
        validate: validator.isEmail
    },
    password:{
        type:String,
        required:[true,'Password is require'],
        minlength:[4, "Password length should be greater than 4 character"],
        select: true
    },
    location:{
        type:String,
        default:'India'
    }
},
{timestamps: true}
);

// Middleware
userSchema.pre('save', async function(){
    if(!this.isModified) return;
    this.password = await bcrypt.hash(this.password,10)
})

//Compare Password
userSchema.methods.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
}

// JSON Web Token
userSchema.methods.createJWT = function(){
    return JWT.sign({userId:this._id},process.env.JWT_SECRET, {expiresIn:'1d'})
}

export default mongoose.model('User', userSchema)