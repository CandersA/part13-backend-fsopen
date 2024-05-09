const Blog = require('./blog')
const User = require('./user')

// Sequelize will automatically create an attribute called userId on the Note model to which, when referenced gives access to the database column user_id
User.hasMany(Blog)
Blog.belongsTo(User)
Blog.sync({ alter: true })
User.sync({ alter: true })

module.exports = {
    Blog,
    User
}