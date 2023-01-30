import mongoose from 'mongoose';
const connectDB = (url) => {
    mongoose.set('strictQuery', true); // Search facilities
    mongoose.connect(url)
        .then(() => console.log('Connected to database'))
        .catch((err) => console.log(err));
}
export default connectDB;