module.exports = app => {
    const sales = require('../controllers/sales.controller');

    var router = require('express').Router();

    router.post('/', sales.create);

    app.use('/api/sales', router);
}