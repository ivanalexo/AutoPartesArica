const { verifySignUp } = require('../middlewares/index');
const controller = require('../controllers/auth.controller');

module.exports = app => {
  var router = require('express').Router();

  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  router.post(
    '/signup',
    [
      verifySignUp.checkDuplicateUsernameOrEmail
    ],
    controller.signup
  );

  router.post('/signin', controller.signin);

  app.use('/api/auth', router);
};
