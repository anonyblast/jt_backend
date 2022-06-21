import Router from 'express';
const router = Router();
import Validate_Fields from '../middlewares/Validate_Fields.js';
import User from '../models/User.js';

router.post('/createUser', (req, res) => {
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
        if (userExists)
            res.status(400).send('User already exists');
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

router.get('/getUser', (req, res) => {
    const { email, password } = req.query;
    console.log(`email: ${email}\npassword: ${password}`);
    const user = User.findOne({
        where: {
            email: email,
            password: password
        }
    });
    if (user) {
        res.status(200).send(user);
    } else {
        res.status(400).send('User not found');
    }
});

router.put('/updateUser', (req, res) => {
    const { email, password, name, user_type } = req.body;
    console.log(`email: ${email}\npassword: ${password}\nname: ${name}\nuser_type: ${user_type}`);
    const user = User.findOne({
        where: {
            email: email,
            password: password
        }
    });

    if (user) {
        user.update({
            name: name,
            user_type: user_type
        }).then(() => {
            res.status(200).send('User updated');
        }).catch(err => {
            res.status(400).send(err);
        });
    } else {
        res.status(400).send('User not found');
    }
});

router.delete('/:email/delete', (req, res) => {
    const { email } = req.params;
    User.destroy({
        where: {
            email: email
        }
    }).then(() => {
        res.status(200).send('User deleted');
    }).catch(err => {
        res.status(400).send(err);
    });
});

export default router;