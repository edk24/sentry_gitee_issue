let express = require('express');
let bodyParser = require('body-parser');
let axios = require('axios');
let app = express();

const config = require('./config.json');

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('hello');
});

app.post('/sentry', function (req, res) {
  if (req.body.action == 'created' && typeof req.body.data.error == 'object') {
    let body = [];

    body.push(`- 运行环境：${req.body.data.error.environment}`);
    body.push(`- 罪魁祸首：${req.body.data.error.culprit}`)
    body.push(`- 文件位置：\`${req.body.data.error.location}\``);
    body.push(`- 问题定位：(${req.body.data.error.web_url})`);

    axios.post(`https://gitee.com/api/v5/repos/${config.gitee.owner}/issues`, {
      "access_token": config.gitee.access_token,
      "repo": config.gitee.repo,
      "title": req.body.data.error.title,
      "labels": 'bug',
      "body": body.join("\n")
    });
  }
  res.end('ok');
});


const server = app.listen(config.server.port, function () {
  const host = server.address().address
  const port = server.address().port

  console.log("host http://%s:%s", host, port)
})