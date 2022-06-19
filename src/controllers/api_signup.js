import Router from 'express';
const router = Router();
import Validate_Fields from '../middlewares/Validate_Fields.js';
import User from '../models/User.js';

router.post('/', (req, res) => {
    // Validar os campos com o middleware Validate_Fields, se estiver tudo ok, criar um novo usuário
    const validate_fields = new Validate_Fields();
    validate_fields.validate_fields(req, res, () => {
        const { name, email, password, user_type } = req.body;
        console.log(`name: ${name}\nemail: ${email}\npassword: ${password}\nuser_type: ${user_type}`);
        const userExists = User.findOne({
            where: {
                email: email
            }
        });
        if (userExists) {
            res.status(400).send('User already exists');
        }
        User.create({
            name : name,
            email : email,
            password : password,
            user_type : user_type
        }).then(user => {
            res.status(201).send(user);
        }).catch(err => {
            res.status(400).send(err);
        });
    });
});

export default router;