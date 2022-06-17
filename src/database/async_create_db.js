import db from './db.js';
import User from '../models/User.js';
import Recording from '../models/Recording.js';
(async () => {
    const database = db;
    const blue  = '\u001b[34m';
    const reset = '\u001b[0m';
 
    try {
        const result = await database.sync();
        console.log(blue + "++++++ Base de Dados conectada com sucesso ++++++" + reset);
    } catch (error) {
        console.log(error);
    }

    // Tá funcionando
    const resultCreateUser = await User.create({
        name: 'Olivia',
        email: 'email@email.com',
        password: '123456',
        user_type: 'teste'
    }).then((user) => {
        console.log(blue + "User created sucessfully" + reset);
    }).catch((error) => {
        console.log('Error creating user');
    });

    // Corrigir o schema para criar dados fakes e inicializar a tabela no banco de dados
    const resultCreateRecording = await Recording.create({
        user_id : 1,
        name: 'Recording 1',
        description: 'Recording 1 description',
        buttons: [1, 2, 3],
        created_at: new Date(),
        recording_video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        recording_audio: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        recording_chat: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }) .then((recording) => {
        console.log(blue + "Recording created sucessfully" + reset);
    }) .catch((error) => {
        console.log('Error creating recording');
    });
})();