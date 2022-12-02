import { Router} from 'express';
import UserModel from '../models/UserModel.js';
import userController from '../controllers/userController.js';

const { createUser, loginUser } = new userController(UserModel);

const router = Router();

router.post('/', createUser);
router.post('/login', loginUser);

export default router;