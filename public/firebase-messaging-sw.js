self.addEventListener('notificationclick', function(event) {
    // console.log(event)
    event.notification.close();
    if(event.notification.data && event.notification.data.FCM_MSG.data.url) {
        event.waitUntil(clients.openWindow(event.notification.data.FCM_MSG.data.url));
    }
});
//
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyCaQN-3SiE55OhdvgZ6-OFb3a8n0kzvel0",
    authDomain: "fplandcrm.firebaseapp.com",
    projectId: "fplandcrm",
    storageBucket: "fplandcrm.appspot.com",
    messagingSenderId: "354382168210",
    appId: "1:354382168210:web:c94e388fd939c63974e64b",
    measurementId: "G-8VEZ7JKF51"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
firebase.messaging();


