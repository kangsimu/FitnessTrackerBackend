const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        INSERT INTO routines("creatorId", "isPublic", name, goal) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (name) DO NOTHING 
        RETURNING *;
      `,
      [creatorId, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    console.error(error)  
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(`
    SELECT *    
    FROM routines
    WHERE id=${id};
    `);
    return routine
  } catch (error) {
    console.error(error)
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const {
      rows: [routine],
    } = await client.query(`
    SELECT *  
    FROM routines
    WHERE NOT EXISTS (
      SELECT RoutineActivities.id
      FROM   RoutineActivities
      WHERE  routines.id = RoutineActivities.id
      );
    `);
    //maybe run, double check for sure
    return routine
  } catch (error) {
    console.error(error)
  }
}

async function getAllRoutines() {
  try {
  const {
    rows
  } = await client.query(`
  SELECT routines.id, routines."creatorId", routines."isPublic", routines.name,
   routines.goal, users.username AS "creatorName", to_json((SELECT RoutineActivities FROM (SELECT  "routineId", duration, count) RoutineActivities)) AS activities
  FROM routines
  JOIN users ON users.id=routines."creatorId"
  JOIN activities ON activities.id=routines.id 
  JOIN RoutineActivities ON RoutineActivities.id=activities.id;
  `);
  console.log(rows)
  return rows
} catch (error) {
  console.error(error)
}}

async function getAllPublicRoutines() {
  try {
    const {
      rows: [routines],
    } = await client.query(`
    SELECT *   
    FROM routines
    WHERE "isPublic"=true;
    `);
    
    return routines
  } catch (error) {
    console.error(error)
  }  
}

async function getAllRoutinesByUser({ username }) {
  try {
    const {
      rows: [routines],
    } = await client.query(
      `
      SELECT routines."creatorId"
      FROM routines
      JOIN users ON users."creatorId"=users.id
      WHERE users.username=$1;`
    ,
      [username]
    );
    console.log(routines)
    return routines;
  } catch (error) {
    console.error(error) }
}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
