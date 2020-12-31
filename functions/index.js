const functions = require('firebase-functions');

// ---- Import Routers ----
const screamsRouter = require('./routers/screams');
const authRouter = require('./routers/auth');
const userRouter = require('./routers/user');

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

// ------ https://baseurl.com/api/ -----
exports.api = functions.https.onRequest(app);