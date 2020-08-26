module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            finalPrice: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            client: {
                type: String,
                required: true
            },
            salesman: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
            },
        },
        { timestamps: true }
    );
    schema.method('toJSON', function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Sale = mongoose.model('sale', schema);
    return Sale;
}