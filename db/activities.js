const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
 
      const {rows} = await client.query(
      `
        INSERT INTO activities(name, description) 
        VALUES($1, $2) 
        ON CONFLICT (name) DO NOTHING 
        RETURNING *;
      `,
      [name, description]
    );
    console.log(rows)
    return rows[0];
  } catch (error) {
    console.error(error)  
  }
}

async function getAllActivities() {
  // select and return an array of all activities
}

async function getActivityById(id) {}

async function getActivityByName(name) {}

async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
