import express from "express"
import { blogCreate, blogDelete, blogUpdate, getBlogById, getBlogList, getBlogUser } from "../controllers/blog-controller.js";

const blogRouter = express.Router();

blogRouter.get("/", getBlogList);
blogRouter.post("/blog-create", blogCreate);
blogRouter.put("/blog-update/:id", blogUpdate);
blogRouter.get("/blog-show/:id", getBlogById);
blogRouter.delete("/blog-delete/:id", blogDelete);
blogRouter.get("/blog-user/:id", getBlogUser);

export default blogRouter;