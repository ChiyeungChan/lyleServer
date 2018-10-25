var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});

var mongoose = require('mongoose');

var fs = require('fs');

var multer = require('multer');
var upload = multer({dest: 'uploads/images/'});

var multiparty = require('multiparty');

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
    profile_pic: {type: String, default: "http://img4.imgtn.bdimg.com/it/u=4139308026,2925331886&fm=26&gp=0.jpg"},
    sign: {type: String, default: "这个人很懒，什么都没有留下"},
    moment_ids: [mongoose.Schema.Types.ObjectId]
});

var momentSchema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    longitude: Number,
    latitude: Number,
    text: String,
    image: [String],
    video: String,
    publish_time: Date,
    location: String,
    comments: [mongoose.Schema.Types.ObjectId],
    likes: [mongoose.Schema.Types.ObjectId]
});

var User = mongoose.model('User', userSchema);
var Moment = mongoose.model('Moment', momentSchema);

module.exports = function(app) {
    app.post('/register', jsonParser, function(req, res){
        console.log('register');
        console.log(req.body);
        var user = new User;
        user.username = req.body.UserName;
        user.password = req.body.PassWord;
        user.moment_ids = [];
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
                        state: 1
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
                console.log('login fail');
            } else {
                var result = {
                    state: 1,
                    userInfo: {
                        Uid: data._id,
                        UserName: data.username,
                        Nickname: data.nickname,
                        Profile_pic: data.profile_pic,
                        Sign: data.sign
                    }
                };
                console.log('login success');
                res.json(result);
            }
        });
    });

    app.post('/getnewmoment', jsonParser, function(req, res){
        console.log('refresh moment');
        console.log(req.body);
        User.findOne({username: "1234"}, function(err, data){
            var m = new Moment;
            m.user_id = data._id;
            m.longitude = 20;
            m.latitude = 20;
            m.text = "哈哈哈";
            m.image = [];
            m.video = '';
            m.publish_time = new Date();
            m.location = "这里";
            m.comments = [];
            m.likes = [];
            data.moment_ids.push(m._id);
            var result = {
                state: 1, 
                list: [
                    {
                        Mid: m._id,
                        Uid: m.user_id,
                        LocY: m.latitude,
                        LocX: m.longitude,
                        Text_m: m.text,
                        Image1: '',
                        Image2: '',
                        Image3: '',
                        Image4: '',
                        Image5: '',
                        Image6: '',
                        Image7: '',
                        Image8: '',
                        Image9: '',
                        Video: '',
                        Time_m: m.publish_time,
                        Loc_Des: m.location
                    }
                ]
            };
            res.json(result);
        });
    });

    app.post('/GetUserInfo', jsonParser, function(req, res) {
        console.log('GetUserInfo');
        var uid = mongoose.Types.ObjectId(req.body.Uid);
        User.findOne({_id: uid}, function(err, data){
            var result = {
                state: 1,
                userInfo: {
                    Uid: data._id,
                    UserName: data.username,
                    Nickname: data.nickname,
                    Profile_pic: "http://img2.imgtn.bdimg.com/it/u=1935882425,1123479399&fm=26&gp=0.jpg",
                    Sign: data.sign
                }
            };
            console.log(result);
            res.json(result);
        });
    });

    app.post('/DoMoment', function(req, res){
        var form = new multiparty.Form();
        form.encoding = 'utf-8';
        form.uploadDir = 'uploads/images/';
        form.maxFilesSize = 10 * 1024 * 1024;

        form.parse(req, function(err, fields, files){
            console.log(files);
            console.log(fields);
            User.findOne({_id: fields['Uid'][0]}, function(err, data) {
                var m = new Moment;
                m.user_id = data._id;
                m.longitude = fields['LocX'][0];
                m.latitude = fields['LocY'][0];
                m.text = fields['Text_m'][0];
                m.image = [];
                m.video = '';
                m.publish_time = new Date();
                m.location = fields['Loc_Des'][0];
                m.comments = [];
                m.likes = [];
                if (fields['type'][0] == '0') {
                    var indexPre = 'img';
                    for (var i = 0; i < 9; i++) {
                        var index = indexPre + i;
                        if (files[index] === undefined) {
                            break;
                        }
                        m.image.push(files[index][0]['path'].split('/')[2]);
                    }
                }
                console.log(m.image);
                data.moment_ids.push(m._id);
                moment.save(function(err, data){
                    
                });
            });
        });
        // console.log(req.files);
        // console.log(req.body);
    });
}