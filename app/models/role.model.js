module.exports = mongoose => {
  const schema = mongoose.Schema({
    name: {
      type: String,
    }
  });

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Role = mongoose.model('roles', schema)
  return Role;
}
