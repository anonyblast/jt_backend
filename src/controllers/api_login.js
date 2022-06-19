import Router from 'express';
const router = Router();
import Validate_Fields from '../middlewares/Validate_Fields.js';
import User from '../models/User.js';

router.get('/:email/isUser', async (req, res) => {
    const { email } = req.params;
    const { password } = req.query;
    const user = await User.findOne({
        where: {
            email: email,
            password: password
        }
    });
    const pw = user.password;
    if (pw === password && user) {
        res.status(200).send(true);
    }
});

export default router;