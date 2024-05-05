// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_FIREBASE_API_KEY,
  authDomain: "insta-next-de77d.firebaseapp.com",
  projectId: "insta-next-de77d",
  storageBucket: "insta-next-de77d.appspot.com",
  messagingSenderId: "18666965506",
  appId: "1:18666965506:web:2fc146a120d233995b751b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// service firebase.storage {
//     match /b/{bucket}/o {
//       match /{allPaths=**} {
//         allow read;
//         allow write; if
//         request.resource.size < 2 *1024 *1024 &&
//         request.resource.contentType.matches("image/.*")
//       }
//     }
//   }
