const config = require('../config/auth.config');
const db = require('../models');
const User = db.users;
const Role = db.role;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
  const user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find({
        name: { $in: req.body.roles }
      },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({
              status: 1,
              message: 'User was registerd' 
            });
          });
        });
    } else {
      Role.findOne({ name: 'user' }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
          }

          res.send({
            status: 1,
            message: 'User was registerd'
           });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      var passwordIdValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIdValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password'
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400
      });

      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push('ROLE_' + user.roles[i]);
      }

      res.status(200).send({
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};
