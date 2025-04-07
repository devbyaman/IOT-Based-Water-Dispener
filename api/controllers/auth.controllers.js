import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    console.log(req.body);
    const { username, password, email } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token with user data
        const token = jwt.sign(
            { 
                id: user._id, 
                role: user.role,
                email: user.email,
                username: user.username
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Return user data without password
        const { password: _, ...userData } = user._doc;

        res.status(200).json({ 
            success: true,
            token, 
            user: userData
        });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
}

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: hashedPassword, ...rest } = user._doc;
            const expiryDate = new Date(Date.now() + 3600000); //1 hour
            res.cookie('access_token', token, {
                httpOnly: true,
                expires: expiryDate
            }).status(200).json(rest);
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.floor(Math.random() * 10000).toString(), email: req.body.email, password: hashedPassword, profilePicture: req.body.photo });
            await newUser.save();
            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const {password:hashedPassword2, ...rest}= newUser._doc;
            const expiryDate = new Date(Date.now()+3600000); // 1 hour
            res.cookie('access_token',token,{
                httpOnly: true,
                expires: expiryDate
            }).status(200).json(rest);
        }
    } catch (error) {

    }
}

export const signout = (req, res) => {
    res.clearCookie('access_token').status(200).json('Signout success!');
}
