from flask import Flask, request

from flask_cors import CORS


app = Flask(__name__)
CORS(app)

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

    
app.run(host='0.0.0.0', port=6060)    