var express = require('express');
var Sequelize = require('sequelize');
var passport = require('passport');
var Strategy = require('passport-github').Strategy;

var app = express();
var sequelize = new Sequelize({
    logging: false,
    dialect: 'sqlite',
    storage: 'shiyanlou.sqlite'
});

var User = sequelize.define('user', {
    githubId: Sequelize.INTEGER,
    githubName: Sequelize.STRING
});

User.drop();
User.sync();

// 创建策略
passport.use(new Strategy({
    clientID: '39159589cdbee75ae605',
    clientSecret: '9bc41514e909c3510e7ab280e28bc0e80985756a',
    callbackURL: 'http://localhost:3000/login/github/callback'
}, (accessToken, refreshToken, profile, cb) => {
    // 首次登录时会自动注册
    User.findOrCreate({
        where: {
            githubId: profile.id,
        },
    }).spread((user, created) => {
        // 首次登录或者GitHub的登录名有变更
        if (user.githubName !== profile.username) {
            User.update({
                githubName: profile.username
            }, {
                where: {
                    githubId: user.githubId
                }
            }).then(() => {
                User.findOne({
                    where: {
                        githubId: user.githubId
                    }
                }).then(user => {
                    // 登录成功后返回用户信息
                    cb(null, user)
                });
            });
        } else {
            cb(null, user)
            // 登录成功后返回用户信息
        }
    });
}));

// 序列化用户对象
passport.serializeUser((user, done) => {
    done(null, user);
});
// 反序列化用户对象
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', function(req, res) {
    if (req.user) { res.send('<p>View your <a href="/profile">profile</a>.</p>');
    } else {
        res.send('<p>Welcome! Please <a href="/login">log in</a>.</p>');
    }
});
app.get('/login', function(req, res) {
    res.send('<a href="/login/github">Log In with github</a>');
});
// 认证登录
app.get('/login/github', passport.authenticate('github'));
// 认证后回调地址
app.get('/login/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/');
    });
// 展示登录成功后的用户信息
app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res) {
        res.send(req.user);
    });

app.listen(3000);

