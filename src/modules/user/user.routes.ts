import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.get('/users', userController.getUsers);
router.delete('/users/:id', userController.deleteUser);
router.put('/users/:id', userController.updateUser);

export const userRoutes = router;