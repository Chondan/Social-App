const functions = require('firebase-functions');

// ---- Import Routers ----
const screamsRouter = require('./routers/screams');
const authRouter = require('./routers/auth');
const userRouter = require('./routers/user');
const notificationRouter = require('./routers/notification');

// ----- Express -----
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

// ----- Screams Router -----
app.use('/', screamsRouter);

// ----- Authentication Router -----
app.use('/', authRouter);

// ----- User Router -----
app.use('/user', userRouter);

// ----- Notification Router -----
app.use('/notifications', notificationRouter);

// ------ https://baseurl.com/api/ -----
exports.api = functions.https.onRequest(app);
// ------ Trigger -----
const { createNotificationOnAction, deleteNotificationOnAction, createNotificationOnUserImageChange, createNotificationOnScreamDelete } = require('./utils/triggers');
exports.createNotificationOnLike = createNotificationOnAction("like"); // like
exports.createNotificationOnComment = createNotificationOnAction("comment"); // comment
exports.deleteNotificationOnUnlike = deleteNotificationOnAction("unlike");
exports.createNotificationOnUserImageChange = createNotificationOnUserImageChange();
exports.createNotificationOnScreamDelete = createNotificationOnScreamDelete();