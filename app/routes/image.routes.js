
module.exports = app => {
    const controller = require('../controllers/image.controller');

    var router = require('express').Router();

    router.post('/', controller.create);

    app.use('/api/image', router);
};