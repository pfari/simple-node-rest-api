// Modules
let log4js = require( "log4js" );
let express = require('express');
let morgan = require('morgan');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let config = require('config');

// Internal modules
let book = require('./app/routes/book');
let logger = console;  // console is default logger

// Config
let app = express();
let port = config.webServer.port;
let options = {
                server: { socketOptions: { keepAlive: config.DB.serverKeepAlive, connectTimeoutMS: config.DB.serverConnectTimeoutMS } },
                replset: { socketOptions: { keepAlive: config.DB.replsetKeepAlive, connectTimeoutMS : config.DB.replsetConnectTimeoutMS } }
              };

//Diable log service when testing or will interfere with Mocha output
if(config.util.getEnv('NODE_ENV') !== 'test') {
  log4js.configure( "./log4js.json" );
  logger = log4js.getLogger("file-appender");

  // TODO - fix this because morgan is loggin to the console
  app.use(morgan('combined')); // Apache 2 log style
}

//DB connection
mongoose.connect(config.DB.host, options);
let db = mongoose.connection;
db.on('connected', function() {
    logger.info('Connection to DB established.');
  });
db.on('error', function(err) {
    logger.error('Connection DB error:' + err);
    process.exit(0);
  });
process.on('SIGINT', function() {
  db.close(function () {
    logger.info('SIGINT event received, closing DB connection.');
    process.exit(0);
  });
});

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

// Routing
app.get("/", (req, res) => res.json({message: "Welcome to our Bookstore!"}));

app.route("/book")
    .get(book.getBooks)
    .post(book.postBook);
app.route("/book/:id")
    .get(book.getBook)
    .delete(book.deleteBook)
    .put(book.updateBook);

// Start server
app.listen(port);
logger.info("Listening on port " + port);

module.exports = app; // for testing
