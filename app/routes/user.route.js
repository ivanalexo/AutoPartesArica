module.exports = app => {
  const { authJwt } = require('../middlewares');
  const user = require('../controllers/user.controller');
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  var router = require('express').Router();

  router.get('/', user.findAll);
  router.get('/:id', [authJwt.verifyToken], user.findOne);
  router.put('/:id', user.update);
  router.delete('/:id', user.delete);
  router.delete('/', user.deleteAll);

  //test
  router.get('/test/admin/:id',
    [authJwt.verifyToken, authJwt.isAdmin],
    user.adminBoard
  );

  app.use('/api/user', router)
};
