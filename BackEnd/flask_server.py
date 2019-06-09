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
    
def convert_response_2_dict(res):
    prof_list = []
    for row in res:
        prof_dict = {}
        prof_dict["State"] = row.State
        prof_dict["District"] = row.District
        prof_dict["Name"] = row.Name
        prof_dict["Id"] = row.Id
        prof_dict["FollowMoneyURL"] = row.FollowMoneyURL
        prof_dict["BallotpediaURL"] = row.BallotpediaURL
        prof_dict["BillTrackURL"] = row.BillTrackURL
        prof_dict["ImageURL"] = row.ImageURL
        prof_dict["Twitter"] = row.TwitterURL
        prof_dict["Facebook"] = row.FacebookURL
        prof_dict["Email"] = row.EmailAddress
        prof_dict["Bio"] = row.Bio
        print(prof_dict)
        prof_list.append(prof_dict)
    return prof_list
        
@app.route('/request_state_politician_profile/', methods=['GET'])    
def request_state_politician_profile():
    state = request.args.get('state')
    role = request.args.get('role')
    district = request.args.get('district')
    sql_type = SqlRetriever(sql_db_name, sql_table_name)
    sql_type.set_up_connection()
    
    
    print("making sql Call")
    response = sql_type.retrieve_politician_profile(state, role, district)
    print("sql Call response")
    print(response)
    
    prof_list = convert_response_2_dict(response)
    
    
    # for row in response:
        # prof_dict = {}
        # prof_dict["State"] = row.State
        # prof_dict["District"] = row.District
        # prof_dict["Name"] = row.Name
        # prof_dict["Id"] = row.Id
        # prof_dict["FollowMoneyURL"] = row.FollowMoneyURL
        # prof_dict["BallotpediaURL"] = row.BallotpediaURL
        # prof_dict["BillTrackURL"] = row.BillTrackURL
        # prof_dict["ImageURL"] = row.ImageURL
        # prof_list.append(prof_dict)
    
    return json.dumps(prof_list)

@app.route('/request_wildcard_match/', methods=['GET'])
def request_wildcard_match():
    query = request.args.get('query')
    sql_type = SqlRetriever(sql_db_name, sql_table_name)
    sql_type.set_up_connection()
    response = sql_type.retrieve_wildcard(query)
    print("SQL wildcard call response")
    prof_list = convert_response_2_dict(response)
    return json.dumps(prof_list)
    
    
    
# ---------------- MAP DATA ---------------------


@app.route('/request_map/<map_name>', methods=['GET'])
def request_map(map_name):
    f = open(map_name, 'r')
    f_data = f.read()
    return f_data


@app.route('/request_us_house/<state_id>', methods=['GET'])
def request_us_house(state_id):
    file_path = "congressional_borders/"+ state_id + "/us_representatives/us-house.json"

    f = open(file_path, 'r')
    f_data = f.read()
    return f_data
        
        
@app.route('/request_state_house/<state_id>', methods=['GET'])
def request_state_house(state_id):
    file_path = "congressional_borders/"+ state_id + "/state_house/topo_quantize.json"

    f = open(file_path, 'r')
    f_data = f.read()
    return f_data
    
    
    
@app.route('/request_state_senate/<state_id>', methods=['GET'])
def request_state_senate(state_id):
    file_path = "congressional_borders/"+ state_id + "/state_senate/topo_quantize.json"

    f = open(file_path, 'r')
    f_data = f.read()
    return f_data


    
app.run(host='0.0.0.0')    