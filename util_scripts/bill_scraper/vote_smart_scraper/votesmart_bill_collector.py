# My libs
from sql_storer import SqlStorer

# Global libs
import urllib3
import json
import pickle
import sys, os

DEBUG_API_REQUEST_CALLS = True

DEBUG_RESPONSE_HIGHLIGHTS = False
DEBUG_RESPONSE_SYNOPSIS = False

DEBUG_PARTISAN_VOTES = False
DEBUG_TOTAL_VOTES = False

DEBUG_UNORTHODOX_ACTIONS = False

DEBUG_DICTIONARY_FIELDS = True

COMMIT_VOTE_RECORDS = True
COMMIT_BILL_RECORDS = True


sql_query_dict = { "VoteSmartID":"" }


# HTTP Set up
http = urllib3.PoolManager()

# SQL Set up - Default Politician Database
sql_store = SqlStorer()
sql_store.set_up_connection()

# SQL Set Up - Used for voting records
voting_record_sql = SqlStorer(db_name="PoliticianInfo", table_name= "politician_voting_record_table")
voting_record_sql.set_up_connection()

# SQL Set Up - Used for storing bill records
bill_record_sql = SqlStorer(db_name="PoliticianInfo", table_name= "bill_info_table")
bill_record_sql.set_up_connection()


# Pulls the most possible bills, importantly: pulls bill action
get_bills_by_official_url = "http://api.votesmart.org/Votes.getByOfficial?key=9125e6afe9e4b86c1dd87da7f889e7b9&o=JSON&candidateId=%s"
# get_categories_url= "http://api.votesmart.org/Votes.getCategories?key=9125e6afe9e4b86c1dd87da7f889e7b9&o=JSON&year=2019"

# Get Bill , and its actionss
get_bill_details_url =  "http://api.votesmart.org/Votes.getBill?key=9125e6afe9e4b86c1dd87da7f889e7b9&o=JSON&billId=%s"

# Used to extract bill synopsis
get_bill_action_url = "http://api.votesmart.org/Votes.getBillAction?key=9125e6afe9e4b86c1dd87da7f889e7b9&o=JSON&actionId=%s"


get_bill_votes_url = "http://api.votesmart.org/Votes.getBillActionVotes?key=9125e6afe9e4b86c1dd87da7f889e7b9&o=JSON&actionId=%s"


# Makes URL call and returns json formated data
def json_request(url):
    if DEBUG_API_REQUEST_CALLS:
        print(url)

    r = http.request('GET', url)
    json_res = json.loads(r.data)
    return json_res
    
    
def get_synopsis_highlight( action_json ) : 
    if not action_json["highlight"]:
        return False
    
    
# Accepts Bill JSON
# Returns the bills highlight
def get_bill_action(bill_json):
    
    # Pull the action ID from the bill json
    action_id = bill_json["actionId"]   
    
    search_url = get_bill_action_url % action_id
    # Make a URL request for JSON
    action_json = json_request(search_url)
    
    # Get rid of the redundant header
    action_json  = action_json["action"]
    return action_json

# Takes bills json from a officials bill collection
def get_bill_details(bill_json):
    # Get the BillId in order to make bill request
    bill_id = bill_json["billId"]
    
    search_url = get_bill_details_url % bill_id
    
    
    bill_details_json = json_request(search_url)
    
    return bill_details_json

# Takes a candidate ID, specific year (optional)
def get_cand_bills(cand_id, year= None):
    search_url = get_bills_by_official_url % cand_id
    
    if year:
        search_url += ("&year=%s" % year)
    
    bills_json = json_request(search_url)
    
    return bills_json["bills"]["bill"]



# Keep track of politicians 
politician_sponsor_set =  set()


# Takes action ID, performs a retrieve vote API call
# Returns the number of rep. yeas,  nays, dem. yeas, nays
def tally_partisan_votes( action_id , bill_id):
    dem_yeas = 0
    dem_nays = 0
    rep_yeas = 0
    rep_nays = 0
    
    search_url = get_bill_votes_url % action_id
    
    votes_json = json_request(search_url)
    
    voting_record_query = {}
    # voting_record_query = {
        # "VoteSmartCandID"   : "",
        # "VoteSmartActionID" : "",
        # "VoteSmartBillId"   : "",
        # "Sponsored"         : "", 
        # "Vote"              : ""
    # }
    
    # BILL ACTION VOTES API JSON
    
    try:
        votes_json = votes_json['votes']["vote"]
        
        for vote in votes_json:

            voting_record_query.clear()
            voting_record_query["VoteSmartCandID"]      = vote['candidateId']
            voting_record_query["VoteSmartActionID"]    = action_id
            voting_record_query["VoteSmartBillId"]      = bill_id
            voting_record_query["Vote"]                 = vote['action']
            if vote['candidateId'] in politician_sponsor_set:
                voting_record_query["Sponsored"]  = "Y"
             
            else:
                voting_record_query["Sponsored"]  = "N"
                
            
            # Check if entry exists already
            if not voting_record_sql.retrieve_by_wildcard_and( voting_record_query, verbose= False ):
                # print( "NEW RECORD TO ADD" )
                if COMMIT_VOTE_RECORDS:
                    voting_record_sql.add_wildcard_entry( voting_record_query, verbose = False )
            
            
            #
            if vote["officeParties"] == "Democratic":
            #
                if vote["action"] == "Yea":
                    dem_yeas += 1
                    
                elif vote["action"] == "Nay":
                    dem_nays += 1
                
                else:
                    if DEBUG_UNORTHODOX_ACTIONS:
                        print("DEMOCRAT: ODD ACTION OUT: %s" %  vote["action"])    
            #
            elif vote["officeParties"] == "Republican":
            #
                if vote["action"] == "Yea":
                    rep_yeas += 1
                    
                elif vote["action"] == "Nay":
                    rep_nays += 1
              
                else:
                    if DEBUG_UNORTHODOX_ACTIONS:
                        print("REPUBLICAN: ODD ACTION OUT: %s" %  vote["action"])    
                
            else:
                if DEBUG_UNORTHODOX_ACTIONS:
                    print("ODD PARTY OUT: %s" %  vote["officeParties"])
    except KeyError as e:
        print("ERROR KEY EXCEPTION OCCURRED TALLYING VOTES: %s " % (str(e) )) 
            
    return rep_yeas, rep_nays, dem_yeas, dem_nays
    
# Make a SQL request
sql_res = sql_store.retrieve_by_non_null_value_wildcard(sql_query_dict, verbose = False)


# Bill Fields
prototype_target_bill = {
    "VoteSmartBillId" : "",
    "BillTitle" : "",
    "BillNumber" : "",
    "BillHighlights": "",
    "BillSynopsis" : "",
    "BillType" : "",
    "State" : "",
    
    # 
    "VoteSmartPrimaryCategoryId": "",
    "VoteSmartPrimaryCategoryName": "",
    "VoteSmartSecondaryCategoryId" : "",
    "VoteSmartSecondaryCategoryName" : "",
    "DateIntroduced" : "",
    "IntroducedIn" : "",
    "SenateYea" : "",
    "SenateNay" : "",
    "HouseYea" : "",
    "HouseNay" : "",
    
    # House Rep.
    "HouseRepublicanYea": "",
    "HouseRepublicanNay": "",
    
    # House Dems.
    "HouseDemocratYea": "",
    "HouseDemocratNay": "",
    
    # Senate Rep.
    "SenateRepublicanYea": "",
    "SenateRepublicanNay": "",
    
    # Senate Dems.
    "SenateDemocratYea": "",
    "SenateDemocratNay": "",  
    
    "BillPassed" : ""
}
target_bill = {}


# 
try:
    for row in sql_res:
        print( " RUNNING THROUGH CANDIDATE: %s  , Vote Smart ID: %s" % (row.Name , row.VoteSmartID) ) 
        bills = get_cand_bills(row.VoteSmartID)
        
        for bill in bills:
                # Clean UP set here
                politician_sponsor_set.clear()
                # Clean up the dictionary
                target_bill.clear()
                
                # Collect bill id
                bill_id                         = bill["billId"]
                
                # Check if the record exists first before doing anthing
                if not bill_record_sql.retrieve_by_wildcard_and( { "VoteSmartBillId" : bill_id }, verbose= False ):
                    # Reset the entry dictionary to contain all necessary keys
                    # target_bill = dict.fromkeys(prototype_target_bill.keys())
                    
                    ########################################
                    ########### Collect Fields #############
                    
                    target_bill['VoteSmartBillId']  = bill_id
                    
                    bill_title                      = bill['title']
                    target_bill['BillTitle']        = bill_title.encode('ascii', 'ignore').decode('utf-8')
                    
                    bill_number                     = bill['billNumber']
                    target_bill['BillNumber']       = bill_number
                    
                    target_bill['State']            = row.State
                    
                    ########################################
                    ########################################
                    
                    

                        
                        
                        
                    # Get bill details
                    bill_details            = get_bill_details(bill)
                    
                    # Get rid of redundant layer
                    bill_details            = bill_details["bill"]
                    
                    bill_type               = bill_details["type"]
                    
                    # Enter the bill type
                    target_bill["BillType"] = bill_type
                    
                    
                    
                    ########################################
                    ############### CATEGORIES #############
                    try:
                        if bill_details['categories']['category']:
                            # 
                            bill_categories                                     = bill_details['categories']['category']
                            
                            try:
                                target_bill["VoteSmartPrimaryCategoryId"]       = bill_categories[0]['categoryId']            
                                target_bill["VoteSmartPrimaryCategoryName"]     = bill_categories[0]['name']    
                                
                                target_bill["VoteSmartSecondaryCategoryId"]     = bill_categories[1]['categoryId']            
                                target_bill["VoteSmartSecondaryCategoryName"]   = bill_categories[1]['name']
                                
                            except KeyError as e:
                                target_bill["VoteSmartPrimaryCategoryId"]       = bill_categories['categoryId']            
                                target_bill["VoteSmartPrimaryCategoryName"]     = bill_categories['name']    
                                pass
                    except TypeError as e:
                        print( "TYPE ERROR OCCURRED: No Bill categories found")
                        ########################################
                        ########################################
                        
                    
                    
                    # Pull out actions from bill
                    # All Bill actions are retrieved from a bill Detail API call
                    bill_actions = bill_details["actions"]["action"]
                    
                    # Pull out bill sponsors 
                    # Sponsors are retrieved from a billDetail API Call
                    bill_sponsors = None
                    try:
                        if bill_details["sponsors"]:
                            bill_sponsors = bill_details["sponsors"]["sponsor"]
                        
                            # Create the sponsorship set first
                            for sponsor in bill_sponsors:
                                politician_sponsor_set.add(sponsor["candidateId"])
                    # Trigger an exception in case there is only one sponsor
                    # One sponsor is contained in a list as opposed to a dict
                    except TypeError as e:
                        print("TYPE ERROR OCCURRED: Only one sponsor exists: ")
                        print(bill_sponsors)
                        sponsor = bill_sponsors
                        politician_sponsor_set.add(sponsor["candidateId"])
                    
                    # This is on the BILL DETAIL LEVEL
                    # Collect the yeas and nays  
                    for bill_action in bill_actions:
                        if bill_action['stage'] == "Passage" :
             
                            # Get the yeas/ nays
                            if bill_action['level'] == 'House':
                                target_bill['HouseYea'] = bill_action['yea'] 
                                target_bill['HouseNay'] = bill_action['nay'] 
                                
                                ########################################
                                ###### Convert any empty votes up ######
                                if not target_bill['HouseYea'].isdigit():
                                    target_bill['HouseYea'] = str(0)
                                
                                if not target_bill['HouseNay'].isdigit():
                                    target_bill['HouseNay'] = str(0) 
                                ########################################
                                ########################################
                                
                                # Tally Partisan Lines
                                rep_yeas, rep_nays, dem_yeas, dem_nays = tally_partisan_votes( bill_action['actionId'], bill_id )
                                
                                ########################################
                                ########################################
                                target_bill["HouseRepublicanYea"] = str(rep_yeas)
                                target_bill["HouseRepublicanNay"] = str(rep_nays)
                                
                                target_bill["HouseDemocratYea" ] = str(dem_yeas)
                                target_bill["HouseDemocratNay" ] = str(dem_nays)
                                ########################################
                                ########################################
                                
                            elif bill_action['level'] == 'Senate':
                                target_bill['SenateYea'] = bill_action['yea'] 
                                target_bill['SenateNay'] = bill_action['nay'] 
                    
                                ########################################
                                ###### Convert any empty votes up ######
                                if not target_bill['SenateYea'].isdigit():
                                    target_bill['SenateYea'] = str(0)
                                
                                if not target_bill['SenateNay'].isdigit():
                                    target_bill['SenateNay'] = str(0) 
                                ########################################
                                ########################################
                                
                                
                                # Tally the partisan lines
                                rep_yeas, rep_nays, dem_yeas, dem_nays = tally_partisan_votes( bill_action['actionId'], bill_id )
                                
                                ########################################
                                ########################################
                                target_bill["SenateRepublicanYea"] =    str(rep_yeas)
                                target_bill["SenateRepublicanNay"] =    str(rep_nays)
                                
                                target_bill["SenateDemocratYea" ] =     str(dem_yeas)
                                target_bill["SenateDemocratNay" ] =     str(dem_nays)
                                ########################################
                                ########################################
                                
                        elif bill_action['stage'] == "Introduced" :
                            target_bill['DateIntroduced']   = bill_action['statusDate']
                            target_bill['IntroducedIn']     = bill_action['level']
                    
                    
                    # Get synopsis and highlights
                    for bill_action in bill_actions:
                        action_details_json = get_bill_action(bill_action)
                        
                        if action_details_json["highlight"]:
                            
                            encoded_highlight = action_details_json["highlight"]
                            target_bill["BillHighlights"] = ( encoded_highlight.encode('ascii', 'ignore')).decode('utf-8')
                            # print(target_bill["BillHighlights"])
                            
                            encoded_synopsis  = action_details_json["synopsis"]
                            target_bill["BillSynopsis"] = ( encoded_synopsis.encode( 'ascii', 'ignore' ) ).decode('utf-8')
                            break
                        
                    
                    if DEBUG_DICTIONARY_FIELDS:
                        for key, value in target_bill.items():
                            if key not in "BillSynopsis" and key not in "BillHighlights":
                                print("TargetBill[ %s ] = %s" % ( key, target_bill[key]) )
                    
                    
                    if DEBUG_RESPONSE_HIGHLIGHTS:
                        print("Target Bill Highlights: %s " % target_bill["Highlights"])
                    if DEBUG_RESPONSE_SYNOPSIS:
                        print("Target Bill Synopsis: %s " % target_bill["Synopsis"])
                        
                    
                        
                        
                    if COMMIT_BILL_RECORDS:
                        bill_record_sql.add_wildcard_entry(target_bill)
                    
            
except TypeError as e:
    exc_type, exc_obj, exc_tb = sys.exc_info()
    print( "TYPE ERROR EXCEPTION ENCOUNTERED: %s  Line #%d" %  ( str( e ) ,  exc_tb.tb_lineno  ) )
    pass
        
    
    
    
    
    
    