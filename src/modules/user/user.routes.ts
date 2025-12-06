import express from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get('/users', auth("admin"), userController.getUsers);
router.put('/users/:userId', userController.updateUser);
router.delete('/users/:userId', auth("admin"), userController.deleteUser);

export const userRoutes = router;