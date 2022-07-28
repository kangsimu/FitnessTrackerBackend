const express = require('express');
const router = express.Router();
const {getAllPublicRoutines, createRoutine} = require('../db')
const {requireUser} = require('./utils')


// GET /api/routines
router.get("/", async (req,res,next) => {
    try {
      const routines = await getAllPublicRoutines()
      res.send(routines)
    } catch ({ name, message }) {
        next({ name, message, status: 401 });
    }
})

// POST /api/routines
router.post("/", requireUser, async (req,res,next) => {
    const userId = req.user.id
    const {isPublic, name, goal} = req.body
    const obj = {creatorId:userId, isPublic:isPublic, name:name, goal:goal}
    try {
        const newRoutine = await createRoutine(obj)  
        res.send(newRoutine)
    } catch ({ name, message }) {
        next({ name, message, status: 401 });
    }
    
})

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
