module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true
      },
      username: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true
      },
      roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'roles'
        }

      ],
    },
    { timestamps: true }
  );
  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model('user', schema);
  return User;
}
