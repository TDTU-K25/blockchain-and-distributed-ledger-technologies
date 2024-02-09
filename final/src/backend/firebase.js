// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAykVuPVKmbxk7dUxV065nZhJsRCclEoNU',
    authDomain: 'get-tech-eco.firebaseapp.com',
    projectId: 'get-tech-eco',
    storageBucket: 'get-tech-eco.appspot.com',
    messagingSenderId: '658985312390',
    appId: '1:658985312390:web:0b0a0242f896000a917107',
    measurementId: 'G-Q1NSY0M5WG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
        if (file) {
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload progress: ${progress}%`);
                },
                (error) => {
                    console.error('Error uploading image:', error.message);
                    reject(false);
                },
                () => {
                    // Upload completed successfully
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            resolve(downloadURL);
                        })
                        .catch((error) => {
                            console.error('Error getting download URL:', error.message);
                            reject(false);
                        });
                },
            );
        } else {
            reject(false);
        }
    });
};

export default uploadImage;
