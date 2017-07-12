var Sequelize = require('sequelize');

// 连接数据库
var sequelize = new Sequelize({
    logging: false,
    dialect: 'sqlite',
    storage: 'shiyanlou.sqlite',
});

// 定义 User 表
var User = sequelize.define('user', {
    name: {
        type: Sequelize.STRING
    },
});

// 定义 Course 表
var Course = sequelize.define('course', {
    name: {
        type: Sequelize.STRING
    },
});

// 定义 UserCourse 表
// 存储用户学习记录
var UserCourse = sequelize.define('usercourse', {
    studyTime: Sequelize.INTEGER
});
UserCourse.belongsTo(User);
UserCourse.belongsTo(Course);

// 删除表
User.drop();
Course.drop();
UserCourse.drop();

// 创建表
User.sync();
Course.sync();
UserCourse.sync();

// 插入数据
// 此处的 user、course及usercourse 都是 promise 对象

// User.create({
//     name: 'jack'
// }).then((user)=>{
//     Course.create({
//         name: 'node.js'
//     }).then((course)=>{
//         UserCourse.create({
//             userId: user.id,
//             courseId: course.id,
//             studyTime: 10,
//         }).then(()=>{
//             // 查询学习记录
//             UserCourse.findOne().then(usercourse => {
//                 var u = usercourse.userId;
//                 var c = usercourse.courseId;
//                 var t = usercourse.studyTime;

//                 console.log('学习记录：用户ID %d，课程ID %d，学习时间 %d', u, c, t);
//             });
//         });
//     });
// });

Promise.all([User.create({
    name: 'jack'
}),Course.create({
    name: 'node.js'
})]).then((result)=>{
    var user = result[0]
    var course = result[1]

    UserCourse.create({
        userId: user.id,
        courseId: course.id,
        studyTime: 10,
    }).then(()=>{
        UserCourse.findOne().then(usercourse => {
            var u = usercourse.userId;
            var c = usercourse.courseId;
            var t = usercourse.studyTime;

            console.log('学习记录：用户ID %d，课程ID %d，学习时间 %d', u, c, t);
        });
    })
})
