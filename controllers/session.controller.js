const Session = require('../models/session.model');
const User = require('../models/user.model');

const tokenHelper = require('../helpers/token');

module.exports.login = function (req, res, next) {
    const user = new User(req.body);

    User.getById(user.id, async (data) => {
        if(!data || (data && data.password !== user.password)) {
            return res.json({ success: false, message: 'Incorrect username or password' }).status(401);
        }

        const accessToken = await tokenHelper.createAccessToken(user);
        const refreshToken = await tokenHelper.createRefreshToken(user);

        const session = new Session({ userId: user.id, accessToken, refreshToken });

        Session.create(session, () => {
            return res.json({
                success: true,
                accessToken,
                refreshToken,
            }).status(200);
        });
    });
};

module.exports.refreshToken = function (req, res, next) {
    const { refreshToken } = req.body;


    Session.findByRefreshToken(refreshToken, (session) => {
        if(!session) {
            return res.json({ success: false, message: 'Incorrect refresh token' }).status(401);
        }

        User.getById(session.userId, async (data) => {

            const user = new User({ id: data.id, password: data.password });

            const accessToken = await tokenHelper.createAccessToken(user);
            const refreshToken = await tokenHelper.createRefreshToken(user);

            const newSession = new Session({ userId: user.id, accessToken, refreshToken });

            Session.create(newSession, (data) => {
                Session.delete(session.accessToken, () => {
                    return res.json({
                        success: true,
                        accessToken,
                        refreshToken,
                    }).status(200);
                });
            });
        });
    });
};

module.exports.signup = function (req, res, next) {
    const newUser = new User(req.body);

    User.getById(newUser.id, (user) => {
        if(user) {
            return response.json({ success: false, message: 'User already exists' }).status(402);
        }
        User.create(newUser, async () => {
            const accessToken = await tokenHelper.createAccessToken(newUser);
            const refreshToken = await tokenHelper.createRefreshToken(newUser);

            const session = new Session({ userId: newUser.id, accessToken, refreshToken });

            Session.create(session, () => {
                return res.json({
                    success: true,
                    id: newUser.id,
                    accessToken,
                    refreshToken,
                }).status(200);
            });
        });
    });
};

module.exports.info = async function (req, res, next) {
    const accessToken = (req.get('Authorization') || req.query['Authorization']).replace('Bearer ', '');
    console.log('accessToken: ', accessToken);
    try {
        const token = await tokenHelper.decodeAccessToken(accessToken);
        return res.json({ id: token.body.id }).status(200);
    } catch (e) {
        return res.json({ message: 'Token is expired' }).status(401);
    }
};

module.exports.logout = function (req, res, next) {
    const accessToken = (req.get('Authorization') || req.query['Authorization']).replace('Bearer ', '');

    Session.delete(accessToken, () => {
        return res.json({
            success: true,
        }).status(200);
    });
};

module.exports.checkToken = function (req, res, next) {
    const accessToken = (req.get('Authorization') || req.query['Authorization']).replace('Bearer ', '');
    if (!accessToken) {
        return res.json({ message: 'No token', status: 401 });
    }

    Session.findByAccessToken(accessToken, (session) => {
        if (!session) {
            return res.json({ message: 'No session', status: 401 });
        }

        const expiresInDate = new Date();
        expiresInDate.setTime(session.expiresIn.getTime() + (-(new Date().getTimezoneOffset()) * 60 * 1000));
        if (expiresInDate < new Date()) {
            Session.delete(session.accessToken, () => {
                return res.json({ message: 'Unauthorized', status: 401 });
            });
        }

        User.getById(session.userId, (user) => {
            if (!user) {
                return res.json({ message: 'Unauthorized', status: 401 });
            }

            Session.updateExpiresInDate(session, () => {
                return next();
            });
        });
    });
};
