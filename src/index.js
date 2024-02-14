const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const createHttpError = require('http-errors');
const connectDatabase = require('./api/database/mongo-connect');
const logHelper = require('./api/v1/helpers/log-helper');
const app = express();
const apiRouter = require('./api');
// const server = require('http').createServer(app);
// const SocketModule = require('@v1/modules/socket-module');
// const { socketMiddleware } = require('@v1/middlewares/socket-middleware');
// const cronjob = require('@v1/cronjobs');
// const io = require('socket.io')(server, {
//   serveClient: false,
//   cors: {
//     origins: '*',
//     // credentials: true //Để bật cookie HTTP qua CORS
//   },
// });

// cải thiện hiệu năng
// const os = require("os");
// process.env.UV_THREADPOOL_SIZE = os.cpus().length - 2;

global.__appRoot = path.resolve(__dirname);
// global.__io = io;

require('dotenv').config();

const port = process.env.PORT || 9999;

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
    optionsSuccessStatus: 200,
  }),
);
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan(':date[clf] :method :url :status :res[content-length] - :response-time ms'));
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
    // filter: (req, res, next) => {},
  }),
);

// global.__io.use(socketMiddleware);
// global.__io.on('connection', SocketModule.connection);

app.use('/api', apiRouter);

app.use(function (req, res, next) {
  next(createHttpError.NotFound('This router does not exist.'));
});
app.use(function (err, req, res, next) {
  console.error(err);
  let status = err.status || 500;
  logHelper.logEvent(
    ` ${req.method}:${req.url} ${status} --> err:${err.message}`,
  );
  return res.status(status).json({
    success: false,
    status,
    message: err.message,
  });
});

app.listen(port, async () => {
  await connectDatabase();
  // cronjob.init();
  console.log('RESTFUL API server started on: ' + port);
});
