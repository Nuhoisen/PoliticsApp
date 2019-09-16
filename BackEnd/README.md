
# Backend 

## Contains backend server scripts including request handlers made from client and SQL Api calls.

## To run as daemon :
        gunicorn flask_server:app -b 0.0.0.0:5000 --daemon


## To run when generally debugging (non-daemon):
##  First open flask_server.py
## And ensure this is the last line listed: app.run(host='0.0.0.0')
        python3 flask_server.py

