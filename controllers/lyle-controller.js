var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

module.exports = function(app) {
    app.post('/register', jsonParser, function(req, res){
        console.log('register');
        console.log(req.body);
        var result = {
            state: 1
        };
        res.json(result);
    });

    app.post('/login', jsonParser, function(req, res){
        console.log('login');
        console.log(req.body);
        var result = {
            state: 1,
            userInfo: {
                Uid: 10,
                UserName: '111',
                Nickname: 'chenzy',
                Profile_pic: '',
                Sign: 'haha'
            },
        };
        console.log(result);
        res.json(result);
    });
}