module.exports.getExpiresInDate = () => {
    const date = new Date();
    const res = new Date();
    res.setTime(date.getTime() + (10 * 60 * 1000));
    return new Date(res).toISOString().slice(0, 19).replace('T', ' ');
};

module.exports.getExpiredTokenDate = () => {
    const date = new Date();
    const res = new Date();
    res.setTime(date.getTime() + (10 * 60 * 1000));
    return new Date(res);
};
