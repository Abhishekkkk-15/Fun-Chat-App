import cloudinary from '../lib/cloudinary.js'
import { generateToken } from '../lib/utils.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export const signup = async (req, res) => {
    const { password, email, fullName } = req.body
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All feilds are required" })
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be 8 character's" })
        }
        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "Email already exist" })
        const salt = await bcrypt.genSalt(10)
        const hasdedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hasdedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        } else {
            return res.status(400).json({ message: "Invalid user data" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internel Server Error" })
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const ifPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!ifPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        generateToken(user._id, res)

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })

    } catch (error) {
        console.log("Error in login user : ",error.message)
        return res.status(500).json({ message: "Internel server error" })

    }
}

export const logout = (req, res) => {
    try {
        res.cookie('jwt','',{maxAge:0})
        res.status(201).json({message: "User loged out"})
    } catch (error) {
        console.log("Error in login user : ",error.message)
        return res.status(500).json({ message: "Internel server error" })
    }
}

export const updateProfile = async(req,res) =>{
    const {profilePic} = req.body;
    const userId = req.user._id
   try {
     if(!profilePic){
         return res.status(400).json({message:"Profile picture is required!!"})
     }
 
     const uploadResponse = await cloudinary.uploader.upload(profilePic)
 
     const updateUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
 
     res.status(200).json(updateUser)
   } catch (error) {
    console.log("Error while updateing User pic : ",error.message)
    res.status(500).json({message:"Internel server error"})
   }

}

export const checkAuth = (req,res) =>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Check route Error ",error.message)
        res.status(500).json({message:"Internel server error"})
    }
}