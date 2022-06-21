import Sequelize from 'sequelize';
import db from '../database/db.js';

const Video = db.define('video', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    meeting_id: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    participants: {
        type: Sequelize.STRING,
        allowNull: false
    },
    file: {
        type: Sequelize.BLOB,
        allowNull: false
    },
    txt_file : {
        type: Sequelize.BLOB,
        allowNull: true
    },
    file_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    buttons : {
        type: Sequelize.STRING,
        allowNull: true
    }
});

export default Video;