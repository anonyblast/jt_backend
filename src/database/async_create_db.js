import db from './db.js';
import User from '../models/User.js';
import Recording from '../models/Recording.js';
import Video from '../models/Video.js';
import { v4 as uuidv4 } from 'uuid';

(async () => {
    const database = db;
    const blue = '\u001b[34m';
    const reset = '\u001b[0m';

    try {
        const result = await database.sync();
        console.log(blue + "++++++ Base de Dados conectada com sucesso ++++++" + reset);
    } catch (error) {
        console.log(error);
    }

    // // Tá funcionando
    // const resultCreateUser = await User.create({
    //     name: 'Olivia',
    //     email: 'email@email.com',
    //     password: '123456',
    //     user_type: 'teste'
    // }).then((user) => {
    //     console.log(blue + "User created sucessfully" + reset);
    // }).catch((error) => {
    //     console.log('Error creating user');
    // });

    // // Tá funcionando
    // const resultCreateRecording = await Recording.create({
    //     id: 1,
    //     host_id: 'NHJK3JdLRAConekriTeste',
    //     meeting_id: 81206522155,
    //     host_email: 'teste@email.com',
    //     description: 'teste',
    //     buttons: 'teste',
    //     start_time: '2022-01-01',
    //     end_time: '2022-01-01',
    //     recording_video_url: 'https://zoom.us/j/81206522134',
    //     recording_audio_url: 'https://zoom.us/j/81206522134',
    //     recording_chat_url: 'https://zoom.us/j/81206522134',
    //     recording_timeline_url: 'https://zoom.us/j/81206522134'
    // }).then((recording) => {
    //     console.log(blue + "Recording created sucessfully" + reset);
    // }).catch((error) => {
    //     console.log('Error creating recording\n' + error);
    // });

    const resultCreateVideo = await Video.create({
        meeting_id: 81206522155,
        title: 'teste',
        participants: 'teste',
        file: 'C:\\Users\\gusta\\Documents\\jt_node\\.gitignore',
        txt_file: 'C:\\Users\\gusta\Documents\\jt_node\\.gitignore',
        file_name: 'teste',
        buttons: '1,2,3',
    }).then((video) => {
        console.log(blue + "Video created sucessfully" + reset);
    }).catch((error) => {
        console.log('Error creating video\n' + error);
    });

})();