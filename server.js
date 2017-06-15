let log4js = require( "log4js" );
let logger = console;
let express = require('express');
let morgan = require('morgan');
let app = express();
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let port = 8080;
let book = require('./app/routes/book');
let config = require('config');
let options = {
                server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
              };

//Replace log4js with console when it is testing or will interfere with Mocha output
if(config.util.getEnv('NODE_ENV') !== 'test') {
  log4js.configure( "./config/log4js.json" );
  logger = log4js.getLogger("file-appender");
  app.use(morgan('combined'));
}

//db connection
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('connected', logger.info.bind(logger, 'Connection DB established.'));
db.on('error', logger.error.bind(logger, 'Connection DB error:'));
db.on('disconnected', logger.error.bind(logger, 'connection error:'));
process.on('SIGINT', function() {
  db.close(function () {
    logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

app.get("/", (req, res) => res.json({message: "Welcome to our Bookstore!"}));

app.route("/book")
    .get(book.getBooks)
    .post(book.postBook);
app.route("/book/:id")
    .get(book.getBook)
    .delete(book.deleteBook)
    .put(book.updateBook);

app.listen(port);
logger.info("Listening on port " + port);

module.exports = app; // for testing
