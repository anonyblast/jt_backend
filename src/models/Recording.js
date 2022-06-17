import Sequelize from 'sequelize';
import db from '../database/db.js';

const Recording = db.define('recording', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id : {
        type: Sequelize.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    buttons: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false
    },
    recording_video_url: {
        // Video URL Storage
        type: Sequelize.STRING,
        allowNull: false
    },
    recording_audio_url: {
        // Audio URL Storage
        type: Sequelize.STRING,
        allowNull: false
    },
    recording_chat_url: {
        // Chat URL Storage
        type: Sequelize.STRING,
        allowNull: false
    },
    recording_video: {
        // MP4 Video Storage
        type: Sequelize.BLOB,
        allowNull: false
    },
    recording_audio: {
        // MP3 Audio Storage
        type: Sequelize.BLOB,
        allowNull: false
    },
    recording_chat: {
        // JSON Chat Storage
        type: Sequelize.BLOB,
        allowNull: false
    }
});

export default Recording;