let express = require('express');
let app = express();

// index
app.get('/', function (req, res) {
   res.send('hello');
});

// webhook
app.post('/sentry', function(req, res) {
    console.log(req.body);
});
 
const server = app.listen(8081, function () {
  const host = server.address().address
  const port = server.address().port
 
  console.log("host http://%s:%s", host, port)
})