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

  router.get('/',[authJwt.verifyToken, authJwt.isAdmin], user.findAll);
  router.get('/:id', [authJwt.verifyToken, authJwt.isAdmin], user.findOne);
  router.put('/:id', [authJwt.verifyToken, authJwt.isAdmin, authJwt.isEmployee], user.update);
  router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], user.delete);
  router.delete('/', [authJwt.verifyToken, authJwt.isAdmin], user.deleteAll);

  //test
  router.get('/test/admin/:id',
    [authJwt.verifyToken, authJwt.isAdmin],
    user.adminBoard
  );

  app.use('/api/user', router)
};
