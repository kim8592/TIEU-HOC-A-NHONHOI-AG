// Firebase Config
        const myFirebaseConfig = {
          apiKey: "AIzaSyC-tb8Jy3Pet2FiOJWqb8bwtE4BIPKk3qc",
          authDomain: "dgth-43076.firebaseapp.com",
          projectId: "dgth-43076",
          storageBucket: "dgth-43076.firebasestorage.app",
          messagingSenderId: "283923655731",
          appId: "1:283923655731:web:4070a11034725a915a4746"
        };

        let app, auth, db;
        try {
          app = firebase.initializeApp(myFirebaseConfig);
          auth = firebase.auth();
          db = firebase.firestore();
        } catch (e) {
          console.error('Firebase init error:', e);
        }

        const appId = 'dgth-43076-A-NHON-HOI';
