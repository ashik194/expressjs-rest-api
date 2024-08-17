import express from "express"
import { getAllUsers, login, registerUser } from "../controllers/user-controller.js";


const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", registerUser);
router.post("/login", login);

export default router;