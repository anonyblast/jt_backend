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
        id: 1,
        host_id : 'NHJK3JdLRAConekriTeste',
        meeting_id: 81206522155,
        host_email: 'teste@email.com',
        description : 'teste',
        buttons : 'teste',
        start_time : '2022-01-01',
        end_time : '2022-01-01',
        recording_video_url : 'https://zoom.us/j/81206522134',
        recording_audio_url : 'https://zoom.us/j/81206522134',
        recording_chat_url : 'https://zoom.us/j/81206522134',
        recording_timeline_url : 'https://zoom.us/j/81206522134'
    }) .then((recording) => {
        console.log(blue + "Recording created sucessfully" + reset);
    }) .catch((error) => {
        console.log('Error creating recording\n' + error);
    });
})();