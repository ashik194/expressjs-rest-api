import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-router.js";
import blogRouter from "./routes/blog-router.js";

const app = express();

// app.use("/api", (req, res, next) => {
//     res.send("First Testing");
// })

app.use(express.json());
app.use("/api/users", router);
app.use("/api/blogs", blogRouter);

mongoose.connect("mongodb://localhost:27017/express-rest-api").then(() => app.listen(5000)).then(()=>console.log("MongoDB Connected")).catch((error) => console.error(error));

// app.listen(5000);