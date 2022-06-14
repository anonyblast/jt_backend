// Criar uma classe de middleware para validar os campos do usuário
export default class Validate_Fields {
    constructor() {
        this.validate_fields = this.validate_fields.bind(this);
    }
    validate_fields(req, res, next) {
        const { name, email, password, user_type } = req.body;
        // Verificar se o email é válido
        if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
            return res.status(400).send("Invalid email");
        }
        // Verificar se o nome é válido
        if (!name.match(/^[a-zA-Z0-9]{3,20}$/)) {
            return res.status(400).send("Invalid name");
        }
        // Verificar se a senha é válida (mínimo de 6 caracteres, e deve conter pelo menos um número e uma letra maiscula)
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
            return res.status(400).send("Invalid password");
        }
        // Verificar se o tipo de usuário é válido (instituition ou user)
        if (!user_type.match(/^(institution|user)$/)) {
            return res.status(400).send("Invalid user type");
        }
        next();
    }
}