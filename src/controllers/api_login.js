import Router from 'express';
const router = Router();
import Validate_Fields from '../middlewares/Validate_Fields.js';
import User from '../models/User.js';

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        where: {
            email: email,
            password: password
        }
    });
    const pw = user.password;
    if (pw === password && user) 
        res.status(200).send(true);
    else
        res.status(400).send(false);
});

export default router;