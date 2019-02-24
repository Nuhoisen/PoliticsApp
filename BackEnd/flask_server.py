from flask import Flask, request
from flask_cors import CORS
from sql_retriever import SqlRetriever
import json

app = Flask(__name__)
CORS(app)



sql_db_name ="PoliticianInfo"
sql_table_name = "PoliticianTable"

# Dummy Function
    
@app.route('/request_state/<state>', methods=['GET'])    
def request_state(state):
    print(state)
    return state
    
    
@app.route('/request_senator_profile_img/', methods=['GET'])    
def request_senator_profile_img():
    state = request.args.get('state')
    role = request.args.get('role')
    
    sql_type = SqlRetriever(sql_db_name, sql_table_name)
    sql_type.set_up_connection()
    
    response = sql_type.retrieve_senators_img_url(state, role)
    
    
    
    return response
    

@app.route('/request_state_politician_profile_img/', methods=['GET'])    
def request_state_politician_profile_img():
    state = request.args.get('state')
    role = request.args.get('role')
    district = request.args.get('district')
    sql_type = SqlRetriever(sql_db_name, sql_table_name)
    sql_type.set_up_connection()
    
    response = sql_type.retrieve_state_politician_img_url(state, role, district)
    
    
    
    return response
    
    
    
app.run(host='0.0.0.0')    