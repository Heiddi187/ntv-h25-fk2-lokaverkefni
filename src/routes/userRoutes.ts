import { Router } from "express";
import { deleteUserController, getAllUsersController, loginController, signupController, updateUserController } from "../controllers/userController";
import { authMiddleware } from "../middleware/jwt";

const router = Router();

router.get('/', getAllUsersController);
router.post('/signup', signupController);
router.post('/login', loginController);
router.patch('/user', authMiddleware, updateUserController);
router.delete('/user', authMiddleware, deleteUserController);

export default router;