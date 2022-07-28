const express = require('express');
const router = express.Router();
const {getAllPublicRoutines} = require('../db')
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

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
