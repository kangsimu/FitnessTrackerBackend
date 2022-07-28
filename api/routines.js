const express = require('express');
const router = express.Router();
const {getAllPublicRoutines, createRoutine, getRoutineById, updateRoutine, destroyRoutine, addActivityToRoutine, getRoutineActivityById, getRoutineActivitiesByRoutine} = require('../db')
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
router.patch("/:routineId", requireUser, async (req,res,next) => {
    const userId = req.user.id
    const routineId = Number(req.params.routineId)
    const { isPublic, name, goal } = req.body;
    const obj = {id:routineId, isPublic:isPublic, name:name, goal:goal }
    try {
      const _routine = await getRoutineById(routineId)
      if (_routine.creatorId != userId) {
        res.status(403)
        next({
            name: 'You are not the Owner',
            message: `User ${req.user.username} is not allowed to update ${_routine.name}`,
            error: 'There was an error'            
        })
      }
      const newRoutine = await updateRoutine(obj)
      res.send(newRoutine)
    } catch ({ name, message }) {
        next({ name, message, status: 401 });
    }
})

// DELETE /api/routines/:routineId
router.delete('/:routineId', requireUser, async (req, res, next)=>{
    const userId = req.user.id
    const routineId = Number(req.params.routineId)
try {
    const _routine = await getRoutineById(routineId)
    if (_routine.creatorId != userId) {
        res.status(403)
        next({
            name: 'You are not the Owner',
            message: `User ${req.user.username} is not allowed to delete ${_routine.name}`,
            error: 'There was an error'            
        })
      }
    const deletedRoutine = await destroyRoutine(routineId)
    res.send(deletedRoutine)
} catch ({ name, message }) {
    next({ name, message, status: 401 });
}
})


// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", async (req, res,next)=>{
    const routineId = Number(req.params.routineId)
    // const objId = {id:routineId}

    const { activityId, count, duration } = req.body;

    const addObj = {routineId:routineId,
        activityId:activityId,
        count:count,
        duration:duration}
    try {
        const _routine = await getRoutineActivityById(activityId)

        if (_routine){
            res.status(403)
        next({
            name: 'Error',
            message: `Activity ID ${activityId} already exists in Routine ID ${_routine.routineId}`,
            error: 'There was an error'            
        })
        }
        const activity = await addActivityToRoutine(addObj)
        res.send(activity)
    } catch ({ name, message }) {
        next({ name, message, status: 401 });
    }
})


module.exports = router;
