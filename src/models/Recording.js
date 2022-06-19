import Sequelize from 'sequelize';
import db from '../database/db.js';

const Recording = db.define('recording', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    host_id : {
        type: Sequelize.STRING,
        allowNull: false
    },
    meeting_id: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    host_email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description : {
        type: Sequelize.STRING,
        allowNull: true
    },
    buttons : {
        type: Sequelize.STRING,
        allowNull: true
    },
    start_time : {
        type: Sequelize.STRING,
        allowNull: true
    },
    end_time : {
        type: Sequelize.STRING,
        allowNull: true
    },
    recording_video_url : {
        type: Sequelize.STRING,
        allowNull: false
    },
    recording_audio_url : {
        type: Sequelize.STRING,
        allowNull: true
    },
    recording_chat_url : {
        type: Sequelize.STRING,
        allowNull: false
    },
    recording_timeline_url : {
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default Recording;