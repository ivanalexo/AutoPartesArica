module.exports = app => {
  const { authJwt } = require('../middlewares');
  const products = require('../controllers/products.controller.js');
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  var router = require('express').Router();

  router.post('/',[authJwt.verifyToken, authJwt.isAdmin], products.create);
  router.get('/', [authJwt.verifyToken, authJwt.isAdmin, authJwt.isEmployee], products.findAll);
  router.get('/:id', products.findOne);
  router.put('/:id', [authJwt.verifyToken, authJwt.isAdmin], products.update);
  router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], products.delete);
  router.delete('/', [authJwt.verifyToken, authJwt.isAdmin], products.deleteAll);

  app.use('/api/products', router);
};
