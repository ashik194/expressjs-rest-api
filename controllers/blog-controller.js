import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import User from "../models/User.js";

export const getBlogList = async (req, res, next) => {
    let allBlogs;
    try{
        allBlogs = await Blog.find();
    }catch(error) {
        console.log(error);
    }

    if(!allBlogs)
    {
        return res.status(400).json({ message: "No blog found" });
    }

    return res.status(200).json({ allBlogs });
}

export const blogCreate = async (req, res, next) => {
    const { title, description, image, user } = req.body;

    if (!title || !description || !user) {
        return res.status(400).json({ message: "Title, description, and user ID are required" });
    }

    let userExists;
    try {
        userExists = await User.findById(user);

        if (!userExists) {
            return res.status(404).json({ message: "User does not exist in our system" });
        }

        const blog = new Blog({
            title,
            description,
            image,
            user
        });

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await blog.save();
            userExists.blogs.push(blog);
            await userExists.save();
            await session.commitTransaction();

            return res.status(201).json({ blog });
        } catch (error) {
            await session.abortTransaction();
            throw error; 
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An unexpected error occurred", error });
    }
};


export const blogUpdate = async (req, res, next) => {
    const { title, description, image } = req.body;

    const blogId = req.params.id;
    let blog;
    try{
        blog = await Blog.findByIdAndUpdate(blogId,{
            title,
            description,
            image,
        });
    }catch(error) {
        console.log(error);
    }
    
    if(!blog) 
    {
        return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ blog });
}

export const getBlogById = async (req, res, next) => {
    const blogId = req.params.id;
    let blog;
    try{
        blog = await Blog.findById(blogId);
    }catch(error) {
        console.log(error);
    }

    if(!blog)
    {
        return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ blog });
}

export const blogDelete = async (req, res, next) => {
    const blogId = req.params.id;

    let blog;
    try{
        blog = await Blog.findByIdAndDelete(blogId).populate('user');
        if (blog.user) {
            const user = await User.findById(blog.user._id);

            if (user) {
                user.blogs = user.blogs.filter(id => !id.equals(blogId));
                await user.save();
            } else {
                console.error("User not found after blog deletion");
            }
        }
    }catch(error) {
        console.log(error);
    }

    if(!blog)
    {
        return res.status(500).json({ message: "Unable to delete the blog"});
    }

    return res.status(200).json({ message: "Successfully Deleted the blog" });
}

export const getBlogUser = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try{
        userBlogs = await User.findById(userId).populate('blogs');
    }catch(error) {
        console.log(error);
    }

    if(!userBlogs)
    {
        return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ blogs: userBlogs });
}