import Sequelize from 'sequelize';
import db from '../database/db.js';

export default Recording = db.define('recording', {
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
    recording_video: {
        // Video URL Storage
        type: Sequelize.BLOB,
        allowNull: false
    },
    recording_audio: {
        // Audio URL Storage
        type: Sequelize.BLOB,
        allowNull: false
    },
    recording_chat: {
        // Chat URL Storage
        type: Sequelize.BLOB,
        allowNull: false
    }
});