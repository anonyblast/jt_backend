import jwt from 'jsonwebtoken';

const config = {
    env : {
        APIKey : 'aBZ6MY-7ThaHWFNvLJzPgA',
        APISecret : 'KJnPGQbURN2161fvGoYaHvPkV8Q9yFM1bzQ3',
    }
}

const payload = {
    iss : config.env.APIKey,
    exp : Math.floor(Date.now() / 1000) + (60 * 60)
}

const token = jwt.sign(payload, config.env.APISecret);

export default token;