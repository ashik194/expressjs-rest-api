import User from "../models/User.js";
import bcrypt from "bcryptjs"


export const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    }catch(error) {
        console.log(error);
    }

    if(!users) 
    {
        return res.status(404).json({ message: "No User found" })
    }
    
    return res.status(200).json({ users })
}


export const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    let userExists;
    try {
        userExists = await User.findOne({ email })
    }catch( error ){
        console.log(error);
    }

    if(userExists)
    {
        return res.status(400).json({ message: "This user already exists in our systems "});
    }

    const hashedPass = bcrypt.hashSync(password)

    const user = new User({
        name,
        email,
        password: hashedPass,
        blogs:[]
    });

    try{
        await user.save();
    }catch(error) {
        console.log(error);
    }

    return res.status(201).json({ message: "User Created Successfully...!! ", user});
}


export const login = async (req, res, next) => {
    const { email, password } = req.body;

    let userExists;
    try{
        userExists = await User.findOne({ email });
    }catch(error){
        console.log(error);
    }

    if(!userExists)
    {
        return res.status(404).json({ message: "User not exists in our system. First register then try to logged in"});
    }

    const isPasswordCorrect = bcrypt.compareSync(password, userExists.password);
    if(!isPasswordCorrect)
    {
        return res.status(401).json({ message: "Incorrect Password" });
    }

    return res.status(200).json({ message: "Successfully logged in..!!!" });
}