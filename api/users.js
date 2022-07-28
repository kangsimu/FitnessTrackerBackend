/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const {createUser, getUserByUsername, getUser, getUserById, getAllRoutinesByUser, getAllPublicRoutines, getPublicRoutinesByUser} = require("../db")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const {requireUser} = require('./utils')

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
    const user = await createUser({username, password})
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET
      );

    res.send({
        token: token,
        user: user,
        message: "Thank you for signing up!"
    })
    } catch ({ name, message }){
        next({ name, message })
    }

}) 


// POST /api/users/login

router.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
  
    // request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password",
      });
    }
  
    try {
    const user = await getUser({username, password});

      if (user) {

        delete user.password

        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET
        );
 
        res.send({ message: "you're logged in!", token: token , user:user});

      } else {
        next({
          name: "IncorrectCredentialsError",
          message: "Username or password is incorrect",
        });
      }
    } catch ({ name, message }) {
        next({ name, message })
    }
  });




// GET /api/users/me

router.get('/me', requireUser, async (req, res, next)=>{

    const prefix = "Bearer ";
    const auth = req.header("Authorization");
    const token = auth.slice(prefix.length);

      try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET)
        if (id) {
          res.send(await getUserById(id));
        } 
      } catch ({ name, message }) {
        next({ name, message, status: 401 });
      }

});


// GET /api/users/:username/routines
router.get('/:username/routines', async(req,res,next)=>{
    
        let userName = req.params.username
        
        if (req.params.username != req.user.username) {
          const userObj = {username:userName}
          try { 
            const allRoutines = await getPublicRoutinesByUser(userObj)
            res.send(allRoutines)
       
        } catch ({ name, message }) {
            next({ name, message, status: 401 });
        }
      
        }
        if (req.user.username === req.params.username) {
          let userName = req.user.username
          const userObj = {username:userName}
          try { 
            const allRoutines = await getAllRoutinesByUser(userObj)
            res.send(allRoutines)
       
        } catch ({ name, message }) {
            next({ name, message, status: 401 });
        } 
        }
   
   
})

module.exports = router;
