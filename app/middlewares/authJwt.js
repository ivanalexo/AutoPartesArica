const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.users;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'Token is missing' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.params.id).then(data => {
    console.log(data)
    if (!data) {
      res.status(500).send({ message: 'Data not found' });
      return;
    }

    Role.find({
      _id: { $in: data.roles }
    },
      (err, roles) => {
        console.log(roles)
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            next();
            return;
          }
        }

        res.status(403).send({ message: 'Require admin role' });
        return;
      });
  });
};

isEmployee = (req, res, next) => {
  User.findById(req.userId).then(data => {
    if (!data) {
      res.status(500).send({ message: 'Data not found' });
      return;
    }

    Role.find({
      _id: { $in: data.roles }
    },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'employee') {
            next();
            return;
          }
        }

        res.status(403).send({ message: 'Require employee role' });
      });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isEmployee
};

module.exports = authJwt;
