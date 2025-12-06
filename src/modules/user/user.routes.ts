import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.get('/users', userController.getUsers);
router.delete('/users/:userId', userController.deleteUser);
router.put('/users/:userId', userController.updateUser);

export const userRoutes = router;