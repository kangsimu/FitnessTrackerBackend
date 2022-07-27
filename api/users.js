/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const {createUser, getUserByUsername} = require("../db")

// POST /api/users/register
router.post("/register", async (req, res, next) => {
    
    const {username, password} = req.body
    if (password.length < 8) {
        next({
            name: "PasswordTooShort",
            message: "Password Too Short!",
            error: "This is an error"
          });
    
    } try {
    const _user =  await getUserByUsername(username)

    if (_user) {
        next({
            name: 'UserExistsError',
            message: `User ${username} is already taken.`,
            error: 'There was an error'
        })
    } 
    console.log("about to create user")
    const user = await createUser({username, password})
    console.log("created user")
    
    res.send({
        token: "tokenIsHere",
        user: user,
        message: "Thank you for signing up!"
    })
    } catch ({ name, message }){
        next({ name, message })
    }

}) 


// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
