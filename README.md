# fitnesstrackr
an API for our new fitness empire, FitnessTrac.kr, using node, express, and postgresql

## Getting Started
Install Packages

    npm i

Initialize Database

    createdb fitness-dev
    
Run Seed Script
    
    npm run seed:dev

## Automated Tests
**NOTE:**  At first, there will be too many errors for the tests to even run.  Start by running the seed:dev script above, until it is working.

Once you get to running the tests, we recommend to start with just the DB test first, and move to API next.  This is because there will be so many errors in the beginning, it's hard to see what tests are passing or failing.

To run all the tests in watch mode (re-runs on code update), run

    npm run test:watch

### DB Methods


    npm run test:watch db

### API Routes (server must be running for these to pass)

    npm run test:watch api


### THINGS TO DO 

be able to register for an account with a username and password such that
no duplicate username can be registered
no password under 8 characters in length can be used
EXTRA CREDIT: be secure knowing that my password is not stored as plain-text, but rather it is hashed before being stored
be secure knowing that my password will not be returned in any response when I hit any API endpoint
be able to login with my correct username/password combination and to be returned a JSON Web Token for future requests
be able to retrieve a list of all activities (exercises) from the database
be able to retrieve a list of all routines (collections of activities) from the database, and each routine should have an array of the activities that it contains
be able to retrieve a list of all routines that a specific user has created
be able to retrieve a list of all routines that feature a specific activity
be able to create a new activity, only if I am logged in
be able to update an activity, only if I am logged in (even if I was not the creator)
be able to create a new routine, only if I am logged in
be able to update or delete a routine, only if I am logged in _as_ the routine creator
be able to add an activity to a routine, only if it does not currently contain it and only if I am logged in _as_ the routine creator
be able to update the number of times or duration that an activity has in a certain routine, only if I am logged in _as_ the routine creator
be able to remove an activity from a routine, only if I am logged in _as_ the routine creator
be able to receive descriptive errors when I have made a mistake

First build out the database and the database connections using psql, node, and node-psql. Then start building out your API. This is the way we just did it, which was largely for instructional purposes (keep it to one new technology at a time). It creates "horizontal slices", and requires the developer to keep a whole layer in their head at one time.