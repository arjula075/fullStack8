if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = process.env.PORT
let mongoUrl = process.env.MONGO_DB

if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  mongoUrl = process.env.TEST_MONGO_DB
}

const log = (file, text) => {
  var fs = require('fs');

  var stream = fs.createWriteStream("./" + file + ".txt");
  stream.once('open', function(fd) {
  stream.write(text);
  stream.end();
});
}


module.exports = {
  mongoUrl,
  port,
  log
}
