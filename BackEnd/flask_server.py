from flask import Flask, request
from flask_cors import CORS
from sql_retriever import SqlRetriever
from newspaper import Article
import json

app = Flask(__name__)
CORS(app)



politician_sql_db_name ="PoliticianInfo"
politician_sql_table_name = "politiciantable"


news_sql_db_name = "newsarticlesdb"
news_sql_table_name = "politician_based_newsarticlestable"
# Dummy Function
    
@app.route('/request_state/<state>', methods=['GET'])    
def request_state(state):
    return state
    
    
@app.route('/request_senator_profile_img/', methods=['GET'])    
def request_senator_profile_img():
    state = request.args.get('state')
    role = request.args.get('role')
    
    sql_type = SqlRetriever(politician_sql_db_name, politician_sql_table_name)
    sql_type.set_up_connection()
    
    response = sql_type.retrieve_senators_img_url(state, role)
    
    return response
    

@app.route('/request_state_politician_profile_img/', methods=['GET'])    
def request_state_politician_profile_img():
    state = request.args.get('state')
    role = request.args.get('role')
    district = request.args.get('district')
    sql_type = SqlRetriever(politician_sql_db_name, politician_sql_table_name)
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
        prof_list.append(prof_dict)
    return prof_list
        
@app.route('/request_state_politician_profile/', methods=['GET'])    
def request_state_politician_profile():
    state = request.args.get('state')
    role = request.args.get('role')
    district = request.args.get('district')
    sql_type = SqlRetriever(politician_sql_db_name, politician_sql_table_name)
    sql_type.set_up_connection()
    
    response = sql_type.retrieve_politician_profile(state, role, district)

    
    prof_list = convert_response_2_dict(response)
    
    
    return json.dumps(prof_list)

@app.route('/request_wildcard_match/', methods=['GET'])
def request_wildcard_match():
    query = request.args.get('query')
    sql_type = SqlRetriever(politician_sql_db_name, politician_sql_table_name)
    sql_type.set_up_connection()
    response = sql_type.retrieve_wildcard(query)
    prof_list = convert_response_2_dict(response)
    return json.dumps(prof_list)
    
    
@app.route('/request_state_partisanships/', methods=['GET'])
def request_state_partisanship():
    query = ""
    sql_type = SqlRetriever(politician_sql_db_name, politician_sql_table_name)
    sql_type.set_up_connection()
    response = sql_type.retrieve_state_partisanships(query)
    partisan_dict = {}
    
    
    for row in response:
        if row.State not in partisan_dict.keys():
            partisan_dict[row.State] = ""
        partisan_dict[row.State] += row.PartyAffiliation
        
        
    print(partisan_dict)
    # prof_list = convert_response_2_dict(response)
    return json.dumps(partisan_dict)
    
def convert_news_company(name):
    name= name.strip()
    new_name = ""
    name_convert = {
        "fox_news" : "FOX News",
        "breitbart" : "Breitbart",
        "cnn" : "CNN",
        "los_angeles_times" : "Los Angeles Times",
        "wall_street_journal" : "Wall Street Journal",
        "oregon_live" : "Oregon Live",
        "washington_post" : "Washington Post",
        "politico" : "Politico",
        "miami_herald" : "Miami Herald",
        "new_jersey_com" : "New Jersey AP",
        "npr" : "NPR",
        "new_york_times": "New York Times"
    }

    try:
        new_name = name_convert[name]
    except KeyError:
        new_name = name
    
    return new_name
    
    
    
    

def convert_rows_2_list(rows):
    art_list = []
    
    for row in rows:
        art_dict = {}
        art_url = row.ArticleURL.strip()
        
        art_dict['top_img'] = row.ArticleImgURL

        art_dict['url'] = art_url
        art_dict['top_img'] = row.ArticleImgURL
        art_dict['title'] = row.Title
        art_dict['news_company'] = convert_news_company(row.NewsCompany)
        art_list.append(art_dict)
    return art_list
    
@app.route('/request_articles/', methods=['GET'])    
def request_articles():
    keyword = request.args.get('keyword')
    
    
    sql_type = SqlRetriever(news_sql_db_name, news_sql_table_name)
    sql_type.set_up_connection()
    response = sql_type.retrieve_related_articles(keyword)
    
    art_list  = convert_rows_2_list(response)
    
    return json.dumps(art_list)

    
    
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


    
#app.run(host='0.0.0.0')    
