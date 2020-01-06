from flask import Flask, request
from flask_cors import CORS
from sql_retriever import SqlRetriever
from sql_storer import SqlStorer
import datetime


from newspaper import Article
import json

app = Flask(__name__)
CORS(app)



politician_sql_db_name ="PoliticianInfo"
politician_sql_table_name = "politiciantable"


news_sql_db_name = "newsarticlesdb"
news_sql_table_name = "politician_based_newsarticlestable"



    
# ------------------------------------------------
# ------------------------------------------------
# ---------------- POLITICIAN DATA ---------------
# ------------------------------------------------
# ------------------------------------------------
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
        prof_dict["VoteSmartID"] =  row.VoteSmartID
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




# ------------------------------------------------
# ------------------------------------------------
# ---------------- BILL DATA ---------------------       
# ------------------------------------------------
# ------------------------------------------------
cand_bills_db_name = "PoliticianInfo"
cand_bills_table_name = "politician_voting_record_table"

bill_info_table_name = "bill_info_table"


# SQL Retriever
poly_voting_record_sql_retriever = SqlStorer(db_name=cand_bills_db_name, table_name=cand_bills_table_name)
poly_voting_record_sql_retriever.set_up_connection()

bill_info_sql_retriever = SqlStorer(db_name=cand_bills_db_name, table_name=bill_info_table_name)
bill_info_sql_retriever.set_up_connection() 
 
 
def convert_bills_response_2_detailed_dict(cand_bill_record_res):
    
    # Ultimate list containing dictionaries of detailed bill information
    bills_list = []
    
    # Dictionary used for collecting all total fields
    bill_dict = {}
    
    wild_card_query = {}
    
    ############################################################
    ##### Iterate through all of the Bills the candidate has_key
    ##### ever voted on ########################################
    ############################################################
    for cand_bill_record_row in cand_bill_record_res:
        ################################################
        ######## Enter immediately known fields ########
        ################################################
        bill_dict['PoliticianVote']             = cand_bill_record_row.Vote
        bill_dict['PoliticianSponsored']        = cand_bill_record_row.Sponsored
        bill_dict['VoteSmartBillID']            = cand_bill_record_row.VoteSmartBillID
        ################################################
        ########## Set Up The Wild Card Query ##########
        ################################################
        wild_card_query['VoteSmartBillId']      = cand_bill_record_row.VoteSmartBillID
        bill_res = bill_info_sql_retriever.retrieve_by_wildcard_and(wild_card_query)
        
        ################################################
        ######## This should only iterate once #########
        ################################################
        for bill_row in bill_res:
            bill_dict['BillTitle']                      = bill_row.BillTitle
            bill_dict['BillNumber']                     = bill_row.BillNumber
            bill_dict['BillHighlights']                 = bill_row.BillHighlights
            bill_dict['BillSynopsis']                   = bill_row.BillSynopsis
            bill_dict['BillType']                       = bill_row.BillType
            bill_dict['State']                          = bill_row.State
            
            bill_dict['VoteSmartPrimaryCategoryId']     = bill_row.VoteSmartPrimaryCategoryId
            bill_dict['VoteSmartPrimaryCategoryName']   = bill_row.VoteSmartPrimaryCategoryName
            bill_dict['DateIntroduced']                 = bill_row.DateIntroduced
            bill_dict['IntroducedIn']                   = bill_row.IntroducedIn
            
            bill_dict['SenateYea']                      = bill_row.SenateYea
            bill_dict['SenateNay']                      = bill_row.SenateNay
            bill_dict['SenateDemocratYea']              = bill_row.SenateDemocratYea
            bill_dict['SenateDemocratNay']              = bill_row.SenateDemocratNay
            bill_dict['SenateRepublicanYea']            = bill_row.SenateRepublicanYea
            bill_dict['SenateRepublicanNay']            = bill_row.SenateRepublicanNay
            
            bill_dict['HouseYea']                       = bill_row.HouseYea
            bill_dict['HouseNay']                       = bill_row.HouseNay
            bill_dict['HouseDemocratYea']               = bill_row.HouseDemocratYea
            bill_dict['HouseDemocratNay']               = bill_row.HouseDemocratNay
            bill_dict['HouseRepublicanYea']             = bill_row.HouseRepublicanYea
            bill_dict['HouseRepublicanNay']             = bill_row.HouseRepublicanNay
            break
        
        bills_list.append(bill_dict.copy())
        bill_dict.clear()
            
        
    return bills_list       
 
# ------------------------------------
# ---- Used for date time conversion
# ------------------------------------
def myconverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__() 

@app.route('/request_candidates_bills/', methods=['GET'])
def request_candidates_bills():
    wild_card_query = {}
    cand_id = request.args.get("VoteSmartCandID")
    wild_card_query['VoteSmartCandID'] = cand_id
    
    response = poly_voting_record_sql_retriever.retrieve_by_wildcard_and(wild_card_query)
    
    bills_list = convert_bills_response_2_detailed_dict(response)
    
    return json.dumps(bills_list, default = myconverter)
    
    

# ------------------------------------------------
# ------------------------------------------------
# ---------------- NEWS DATA ---------------------     
# ------------------------------------------------
# ------------------------------------------------   
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
        "new_york_times": "New York Times",
        "new_yorker" : "The New Yorker",
        "the_sacramento_bee" : "The Sacramento Bee"
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

# ------------------------------------------------
# ------------------------------------------------
# ---------------- MAP DATA ----------------------
# ------------------------------------------------
# ------------------------------------------------
@app.route('/request_map/<map_name>', methods=['GET'])
def request_map(map_name):
    print("Request_made")
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

# ------------------------------------------------
# ------------------------------------------------
# ------------------------------------------------
# ------------------------------------------------
# ------------------------------------------------

# Remove when run with gunicorn    
app.run(host='0.0.0.0')    
