const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userComments = require('./userComments.json');
const userPosts = require('./userPosts.json');
const userData = require('./userData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    await Post.bulkCreate(userPosts, {
        returning: true,
    });

    await Comment.bulkCreate(userComments, {
        returning: true,
    });

    process.exit(0);
};

seedDatabase();