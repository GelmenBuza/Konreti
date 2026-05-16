import express from "express";
import {login, logout, refreshToken, register} from "@/controllers/authController.ts";


const router = express.Router();

router.post("/login", login)
router.post("/register", register)
router.post("/logout", logout)
router.post("/refresh-token", refreshToken)

export default router;