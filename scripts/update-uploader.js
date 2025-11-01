// Script to update anonymous photos with your email
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://tarunjitbiswas123:tarunjitbiswas1234@cluster0.jglf7om.mongodb.net/BatchBook?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true';
const YOUR_EMAIL = 'tarunjitbiswas24@gmail.com';

async function updatePhotos() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const Photo = mongoose.model('Photo', new mongoose.Schema({}, { strict: false }));
    
    // Update all photos with uploadedBy = "anonymous" to your email
    const result = await Photo.updateMany(
      { uploadedBy: 'anonymous' },
      { $set: { uploadedBy: YOUR_EMAIL } }
    );

    console.log(`Updated ${result.modifiedCount} photos`);
    console.log(`Matched ${result.matchedCount} photos`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updatePhotos();
