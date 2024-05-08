require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL)

app.get('/blog', async (req, res) => {
    const blogPosts = await sequelize.query("SELECT * FROM blog", { type: QueryTypes.SELECT })
    res.json(blogPosts)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})