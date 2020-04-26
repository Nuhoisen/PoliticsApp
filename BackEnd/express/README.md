# Express Backend Server (To replace flask server )
## To Run, use pm2.
### pm2 start app.js


## To check status, issue:
### pm2 status

## To enable the server to run on start up 
### pm2 startup ubuntu


# Potential Errors
## If you receive
### [PM2] Applying action restartProcessId on app [0] (ids: 0)
### [PM2] [ERROR] Process 0 not found

## Issue following:
### pm2 update
