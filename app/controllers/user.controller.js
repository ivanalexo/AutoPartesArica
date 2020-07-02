const db = require('../models');
const User = db.users;

exports.create = (req, res) => {
    if (!req.body.email && !req.body.password && !req.body.name) {
        res.status(400).send({ message: 'Content cannot be empty' });
        return;
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: !req.body.hasOwnProperty('role') ? 'employee' : req.body.role 
    });

    user
        .save(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'An error occurred while creating a user'
            });
        });
};

exports.findAll = (req, res) => {
    const id = req.query.id;
    var condition = id ? { id: { $regex: new RegExp(id), $options: 'i' } } : {};
  
    User.find(condition)
      .then(data => {
          res.send(data);
      })
      .catch(err => {
          res.status(500).send({
              message:
                  err.message || 'Some error occurred while retriving users'
          });
      });
  };
  
  exports.findOne = (req, res) => {
      const id = req.params.id;
  
      User.findById(id)
          .then(data => {
              if (!data) {
                  res.status(404).send({ message: 'Not found user with id ' + id });
              } else {
                  res.send(data);
              }
          })
          .catch(err => {
              res
                  .status(500)
                  .send({ message: 'Error retriving user with id ' + id});
          });
  };
  
  exports.update = (req, res) => {
      if (!req.body) {
          return res.status(400).send({
              message: 'Data to update cannot be empty'
          });
      }
  
      const id = req.params.id;
  
      User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
          then(data => {
              if (!data) {
                  res.status(404).send({
                      message: 'Cannot update user'
                  });
              } else res.send({ message: 'User was updated succesfully' });
          })
          .catch(err => {
              res.status(500).send({
                  message: 'Error updating user wit id ' + id
              });
          });
  };
  
  exports.delete = (req, res) => {
      const id = req.params.id;
  
      User.findByIdAndRemove(id)
          .then(data => {
              if (!data) {
                  res.status(404).send({
                      message: 'Cannot delete'
                  });
              } else res.send({ message: 'User was deleted succesfully' });
          })
          .catch(err => {
              res.status(500).send({
                  message: 'Could not delete this user'
              });
          });
  };
  
  exports.deleteAll = (req, res) => {
      User.deleteMany({})
          .then(data => {
              res.send({
                  message: `${data.deletedCount} Users were deleted`
              });
          })
          .catch(err => {
              res.status(500).send({
                  message:
                      err.message || 'Some error occurred while deleting'
              });
          });
  };