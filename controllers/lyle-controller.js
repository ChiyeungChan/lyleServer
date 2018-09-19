var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

var mongoose = require('mongoose');

mongoose.connect('mongodb://chenzy11:chenzy11@ds161062.mlab.com:61062/lyleserver', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to database successfully!');
});

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    nickname: {type: String, default: "用户"},
    profile_pic: {type: String, default: ""},
    sign: {type: String, default: "这个人很懒，什么都没有留下"}
});

var User = mongoose.model('User', userSchema);

module.exports = function(app) {
    app.post('/register', jsonParser, function(req, res){
        console.log('register');
        console.log(req.body);
        var user = new User;
        user.username = req.body.UserName;
        user.password = req.body.PassWord;
        User.findOne({username: user.username}, function(err, data){
            if (data) {
                console.log('user existed');
                var result = {
                    state: 0
                };
                res.json(result);
            } else {
                user.save(function(err, data){
                    if (err) {
                        throw err;
                    }
                    console.log('user saved');
                    var result = {
                        state: state
                    };
                    res.json(result);
                });
            }
        });
    });

    app.post('/login', jsonParser, function(req, res){
        console.log('login');
        console.log(req.body);
        User.findOne({username: req.body.UserName}, function(err, data) {
            if (!data || data.password != req.body.PassWord) {
                var result = {
                    state: 0,
                    userInfo: null
                }
                res.json(result);
            } else {
                var result = {
                    state: 0,
                    userInfo: {
                        Uid: data._id,
                        UserName: data.username,
                        Nickname: data.nickname,
                        Profile_pic: data.profile_pic,
                        Sign: data.sign
                    }
                };
                console.log(result);
            }
        });
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