const express = require('express');
const router = express.Router();
const {requireUser} = require('./utils')
const { updateRoutineActivity , getRoutineActivityById, getRoutineById, destroyRoutineActivity } = require('../db')

// PATCH /api/RoutineActivities/:routineActivityId
router.patch("/:routineActivityId", requireUser, async (req,res,next) => {
    const userId = req.user.id
    const routineActivityId = Number(req.params.routineActivityId)
    const { count, duration } = req.body;


    try {
      const _routineActivity = await getRoutineActivityById(routineActivityId)
      const _routineId = _routineActivity.routineId
      const _routine = await getRoutineById(_routineId)

      if (_routine.creatorId != userId) {
        res.status(403)
        next({
            name: 'You are not the Owner',
            message: `User ${req.user.username} is not allowed to update ${_routine.name}`,
            error: 'There was an error'            
        })
      }
      const obj = {id:routineActivityId, count:count, duration:duration }
      const newRoutine = await updateRoutineActivity(obj)
      res.send(newRoutine)
    } catch ({ name, message }) {
        next({ name, message, status: 401 });
    }
})


// DELETE /api/RoutineActivities/:routineActivityId
router.delete('/:routineActivityId', requireUser, async (req, res, next)=>{
    const userId = req.user.id
    const routineActivityId = Number(req.params.routineActivityId)
try {
    const _routineActivity = await getRoutineActivityById(routineActivityId)
    const _routineId = _routineActivity.routineId
    const _routine = await getRoutineById(_routineId)
    
    if (_routine.creatorId != userId) {
        res.status(403)
        next({
            name: 'You are not the Owner',
            message: `User ${req.user.username} is not allowed to delete ${_routine.name}`,
            error: 'There was an error'            
        })
      }
    const deletedActivityRoutine= await destroyRoutineActivity(routineActivityId)
    res.send(deletedActivityRoutine)
} catch ({ name, message }) {
    next({ name, message, status: 401 });
}
})

module.exports = router;
