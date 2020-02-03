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


# This function is used to convert 
# a pyodbc Politician profile response    
# to a JSON convertable dictionary
def convert_politician_response_2_dict(res):
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
    state       = request.args.get('state')
    role        = request.args.get('role')
    district    = request.args.get('district')
    sql_type    = SqlRetriever(politician_sql_db_name, politician_sql_table_name)
    sql_type.set_up_connection()
    
    response    = sql_type.retrieve_politician_profile(state, role, district)
    prof_list   = convert_politician_response_2_dict(response)
    
    return json.dumps(prof_list)



@app.route('/request_wildcard_match/', methods=['GET'])
def request_wildcard_match():
    query = request.args.get('query')
    sql_type = SqlRetriever(politician_sql_db_name, politician_sql_table_name)
    sql_type.set_up_connection()
    response = sql_type.retrieve_wildcard(query)
    prof_list = convert_politician_response_2_dict(response)
    return json.dumps(prof_list)
    
    
@app.route('/request_us_senator_partisanships/', methods=['GET'])
def request_us_senator_partisanships():
    role = request.args.get('role')
    # print(role)
    query_dict = {"Role" : role}# "US Senator"}
    
    partisan_dict = {}
    # Retrieve state partisanships
    state_partisanships_retriever = SqlStorer(db_name=politician_sql_db_name, table_name=politician_sql_table_name)
    state_partisanships_retriever.set_up_connection()
   
    response = state_partisanships_retriever.retrieve_by_wildcard_and(query_dict, verbose= True)
    
    for row in response:
        if row.State not in partisan_dict.keys():
            partisan_dict[row.State] = ""
        partisan_dict[row.State] += row.PartyAffiliation
        
    
    return json.dumps(partisan_dict)


@app.route('/request_state_partisanships/', methods=['GET'])
def request_state_partisanships():
    # role = request.args.get('role')
    state =  request.args.get('state')
    
    partisan_dict = {}
    # Retrieve state partisanships
    state_partisanships_retriever = SqlStorer(db_name=politician_sql_db_name, table_name=politician_sql_table_name)
    state_partisanships_retriever.set_up_connection()
   
    # Define the raw query, targeting the database and table name
    raw_query = "SELECT * FROM %s.%s WHERE State LIKE '%s' AND InOffice='Yes' and Role NOT LIKE 'US Senator'" % (politician_sql_db_name, politician_sql_table_name, state)
   
    response = state_partisanships_retriever.execute_raw_query(raw_query, verbose= True)
    
    for row in response:
        if row.District not in partisan_dict.keys():
            partisan_dict[row.District] = ""
        partisan_dict[row.District] += row.PartyAffiliation
        
    
    return json.dumps(partisan_dict)

# ------------------------------------------------
# ------------------------------------------------
# ---------------- BILL DATA ---------------------       
# ------------------------------------------------
# ------------------------------------------------
# cand_bills_db_name = "PoliticianInfo"
# cand_bills_table_name = "politician_voting_record_table"

# bill_info_table_name = "bill_info_table"


# # SQL Retriever
# poly_voting_record_sql_retriever = SqlStorer(db_name=cand_bills_db_name, table_name=cand_bills_table_name)
# poly_voting_record_sql_retriever.set_up_connection()

# bill_info_sql_retriever = SqlStorer(db_name=cand_bills_db_name, table_name=bill_info_table_name)
# bill_info_sql_retriever.set_up_connection() 
 
 
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
        bill_dict['VoteSmartBillID']            = cand_bill_record_row.VoteSmartBillId
        ################################################
        ########## Set Up The Wild Card Query ##########
        ################################################
        # wild_card_query['VoteSmartBillId']      = cand_bill_record_row.VoteSmartBillId
        # bill_res = bill_info_sql_retriever.retrieve_by_wildcard_and(wild_card_query)
        
        ################################################
        ######## This should only iterate once #########
        ################################################
        # for cand_bill_record_row in bill_res:
        bill_dict['BillTitle']                      = cand_bill_record_row.BillTitle
        bill_dict['BillNumber']                     = cand_bill_record_row.BillNumber
        bill_dict['BillHighlights']                 = cand_bill_record_row.BillHighlights
        bill_dict['BillSynopsis']                   = cand_bill_record_row.BillSynopsis
        bill_dict['BillType']                       = cand_bill_record_row.BillType
        bill_dict['State']                          = cand_bill_record_row.State
        
        bill_dict['VoteSmartPrimaryCategoryId']     = cand_bill_record_row.VoteSmartPrimaryCategoryId
        bill_dict['VoteSmartPrimaryCategoryName']   = cand_bill_record_row.VoteSmartPrimaryCategoryName
        bill_dict['DateIntroduced']                 = cand_bill_record_row.DateIntroduced
        bill_dict['IntroducedIn']                   = cand_bill_record_row.IntroducedIn
        
        bill_dict['SenateYea']                      = cand_bill_record_row.SenateYea
        bill_dict['SenateNay']                      = cand_bill_record_row.SenateNay
        bill_dict['SenateDemocratYea']              = cand_bill_record_row.SenateDemocratYea
        bill_dict['SenateDemocratNay']              = cand_bill_record_row.SenateDemocratNay
        bill_dict['SenateRepublicanYea']            = cand_bill_record_row.SenateRepublicanYea
        bill_dict['SenateRepublicanNay']            = cand_bill_record_row.SenateRepublicanNay
        
        bill_dict['HouseYea']                       = cand_bill_record_row.HouseYea
        bill_dict['HouseNay']                       = cand_bill_record_row.HouseNay
        bill_dict['HouseDemocratYea']               = cand_bill_record_row.HouseDemocratYea
        bill_dict['HouseDemocratNay']               = cand_bill_record_row.HouseDemocratNay
        bill_dict['HouseRepublicanYea']             = cand_bill_record_row.HouseRepublicanYea
        bill_dict['HouseRepublicanNay']             = cand_bill_record_row.HouseRepublicanNay
            # break
        print(bill_dict['BillNumber'])
        
        bills_list.append(bill_dict.copy())
        bill_dict.clear()
            
    return bills_list     


# ------------------------------------------------
# ------------------------------------------------
# ---------------- BILL DATA ---------------------       
# ------------------------------------------------
# ------------------------------------------------ 
cand_bills_db_name = "PoliticianInfo"
cand_bills_table_name = "politician_voting_record_table"

bill_info_table_name = "bill_info_table" 
 
# ------------------------------------
# ---- Used for date time conversion
# ------------------------------------
def myconverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__() 


@app.route('/request_candidates_bills/', methods=['GET'])
def request_candidates_bills():

    # SQL Retriever
    poly_voting_record_sql_retriever = SqlStorer(db_name=cand_bills_db_name, table_name=cand_bills_table_name)
    poly_voting_record_sql_retriever.set_up_connection()
    
    # ----------------------
    wild_card_query = {}
    bills_list = []
    
    cand_id =       request.args.get("VoteSmartCandID")
    category_id =   request.args.get("VoteSmartPrimaryCategoryId")
    print("Candidate ID: %s " % cand_id)
    print("Category ID: %s "  % category_id)
    
    # Specialized raw request query
    raw_query = "   SELECT  B.*,V.* FROM    PoliticianInfo.bill_info_table B \
                    inner join              PoliticianInfo.politician_voting_record_table V ON \
                    B.VoteSmartBillId = V.VoteSmartBillId \
                    where V.VoteSmartCandID='%s' and B.VoteSmartPrimaryCategoryId='%s' " % (cand_id, category_id);  
    
    response = poly_voting_record_sql_retriever.execute_raw_query(raw_query, verbose=False)
    
    if response:
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



# Tets out using a sql_storer instead here
# SQL Retriever
news_retrieval_sql_retriever = SqlStorer(db_name=news_sql_db_name, table_name=news_sql_table_name)
news_retrieval_sql_retriever.set_up_connection()

@app.route('/request_articles/', methods=['GET'])    
def request_articles():
    # Form a query dict that contains the politicians name
    query_dict = {}
    politician_name = request.args.get('keyword')
    query_dict["Politician"] = politician_name
    
    # Then execute that query
    response = news_retrieval_sql_retriever.retrieve_by_wildcard_and(query_dict)
    
    art_list  = convert_rows_2_list(response)
    
    return json.dumps(art_list)

# ------------------------------------------------
# ------------------------------------------------
# ---------------- MAP DATA ----------------------
# ------------------------------------------------
# ------------------------------------------------
@app.route('/request_map/<map_name>', methods=['GET'])
def request_map(map_name):
    # print("Request_made")
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
# app.run(host='0.0.0.0', threaded=True)    
