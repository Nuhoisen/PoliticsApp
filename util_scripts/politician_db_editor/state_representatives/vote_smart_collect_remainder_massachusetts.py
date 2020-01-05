
# my libs
from sql_storer import SqlStorer
import state_mappings

# Global libs
from num2words import num2words
import json
import urllib3
import sys, os


ENABLE_EXCEPTION_DEBUG = True

# Print Messages of exact matches and close matches
ENABLE_CANDIDATE_DEBUG = True

ENABLE_CAND_EXACT_MATCH_DEBUG = True
ENABLE_CAND_CLOSE_MATCH_DEBUG = True

# Print Messages of mismatches and anomolies 
ENABLE_CAND_ANOMOLGY_DEBUG = True
ENABLE_CAND_MISMATCH_DEBUG = True

# Enable commiting exact and close matches
COMMIT_EXACT_MATCHES = False
COMMIT_CLOSE_MATCHES = False


# Print a message for every entry checked
DEBUG_SQL_UPDATE_ENTRIES = False

# Print out the URLs that are processed 
DEBUG_VOTESMART_API_CALLS = True

DEBUG_SQL_CAND_IDS = False

http = urllib3.PoolManager()

state_dict =  {}


name_2_abbrev = state_mappings.state_name_2_abbrev_remaining

    

# Makes URL call and returns json formated data
def json_request(url):
    r = http.request('GET', url)
    json_res = json.loads(r.data)
    return json_res

                        
office_type_state_url = "http://api.votesmart.org/Officials.getByOfficeTypeState?key=9125e6afe9e4b86c1dd87da7f889e7b9&o=JSON&officeTypeId=L&stateId=%s"


# RETRIEVABLES
vote_smart_cand_id = None
vote_smart_dist_id = None
    
    
print(state_dict)
sql_store = SqlStorer()
sql_store.set_up_connection()


wild_card_null_query =  { "VoteSmartID": ""}
wild_card_valid_query = {  "State": "" , 
                           "Role": "State Representative",
                           "InOffice": "Yes",
                           "District": ""}




update_wild_card_entry      = { "VoteSmartID": "",
                                "VoteSmartDistrictID": ""}
update_wild_card_condition  = { "Name": "",
                                "Id" : "" }

mass_districts = ["Norfolk", "Middlesex", "Essex", "Bristol", "Suffolk", "Worcester", "Hampden", "Berkshire", "Plymouth", "Barnstable"]


def iterative_levenshtein(s, t):
    """ 
        iterative_levenshtein(s, t) -> ldist
        ldist is the Levenshtein distance between the strings 
        s and t.
        For all i and j, dist[i,j] will contain the Levenshtein 
        distance between the first i characters of s and the 
        first j characters of t
    """
    rows = len(s)+1
    cols = len(t)+1
    dist = [[0 for x in range(cols)] for x in range(rows)]

    # source prefixes can be transformed into empty strings 
    # by deletions:
    for i in range(1, rows):
        dist[i][0] = i

    # target prefixes can be created from an empty source string
    # by inserting the characters
    for i in range(1, cols):
        dist[0][i] = i
        
    for col in range(1, cols):
        for row in range(1, rows):
            if s[row-1] == t[col-1]:
                cost = 0
            else:
                cost = 1
            dist[row][col] = min(dist[row-1][col] + 1,      # deletion
                                 dist[row][col-1] + 1,      # insertion
                                 dist[row-1][col-1] + cost) # substitution

    # for r in range(rows):
        # print(dist[r])
    
 
    return dist[row][col]


def search_last_name( target_full_name, search_last_name):
    if search_last_name in target_full_name:
        return True
    return False


def search_for_matching_vs_cand( sql_cand, sorted_vs_cand_list):
    vs_matches = []
    
    print("SEARCHING FOR MATCHES. District Number: %s " % sql_cand["OrdinalDistrictNumber"] ) 
    #  Pull out the matching VS district
    for j in range( 0 , len( sorted_vs_cand_list ) ):
        vs_cand = sorted_vs_cand_list[j]
        # print(vs_cand["officeDistrictName"])
        # First Match the District name
        if sql_cand["DistrictName"].lower() in vs_cand["officeDistrictName"].lower():
            # Then match the Ordinal District Number to the vs district Name
            if sql_cand["OrdinalDistrictNumber"].lower() in vs_cand["officeDistrictName"].lower():
                vs_matches.append( vs_cand )
            

    if not vs_matches:
        print("NO MATCHES FOUND. District Number: %s " % sql_cand["OrdinalDistrictNumber"] ) 

    return vs_matches


def convert_words_to_numbers(words):
    word_look_up_translation = {
        "first": 1
    
    }

# Iterate through states
for key,value in name_2_abbrev.items():
    
    
    try:
        wild_card_valid_query["State"] = key
        
        
          
        # Make API calls searching for state related candidates
        
        # Value is the abbreviation
        cand_state  = value
        # Search url ,  + cand state abbrev. and year
        search_url = office_type_state_url % ( cand_state )
        
        # Display the url searching for
        if DEBUG_VOTESMART_API_CALLS:
            print(search_url)
        

        
        # Make request, save results
        json_results = json_request(search_url)
        
        
        # Parse results
        cand_list = json_results['candidateList']['candidate']
        
        # Run once for each district, performing the match
        
        ####################################################
        ####################################################
        ####################################################
        ############## DISTRICT ITERATION ##################
        ####################################################
        ####################################################
        ####################################################
        for district in mass_districts:
        
                
            ####################################################
            ####################################################
            ####################################################
            ################### VOTE SMART #####################
            ####################################################
            ####################################################
            ####################################################
            
            # Clear refined_cand_list
            refined_vs_cand_list = []
        
            # Extract just the representatives
            for candidate in cand_list:
                try:
                    # Generally houses go by 2 names: Assembly or House
                    if candidate["officeName"] == "State House":
                    
                        # Specially Tailored to Massachusetts
                        # First check district 1, then check district 2
                        if district in candidate["officeDistrictName"]:
                            
                            # Add the candidate to the list
                            refined_vs_cand_list.append(candidate)
                        
                # Value error triggers when district 2 is converted to int . Line #195
                except ValueError as e:
                    exc_type, exc_obj, exc_tb = sys.exc_info()
                    if ENABLE_EXCEPTION_DEBUG:
                        print( "VS API VALUE ERROR EXCEPTION: State: %s  Exception: %s , Line #%d" % ( key, str(e), exc_tb.tb_lineno ) )
                        
                # Type error triggers when district is compared to what is in the candidate option. Line #190
                except TypeError as e:
                    exc_type, exc_obj, exc_tb = sys.exc_info()
                    if ENABLE_EXCEPTION_DEBUG:
                        print( "VS API TYPE ERROR EXCEPTION: State: %s  Exception: %s , Line #%d" % ( key, str(e), exc_tb.tb_lineno ) )
                        
            sorted_vs_cand_list = refined_vs_cand_list#, key = lambda i: int(i["officeDistrictName"]))
            
            ####################################################
            ####################################################
            ####################################################
            ################## SQL DATABASE ####################
            ####################################################
            ####################################################
            ####################################################
            
            # Update District to only match those
            wild_card_valid_query['District'] = district
            # Pull results where Cands are null from a certain state
            sql_results = sql_store.retrieve_by_wildcard_and(wild_card_valid_query, verbose=True)
            # sql_results = sql_store.retrieve_by_null_value_plus_valid_and_wildcard(wild_card_null_query, wild_card_valid_query, verbose=False)

            sql_cand_list = []
            
            # Form a dictionary to compare
            temp = {}
            
            
            for row in sql_results:
                try:
                    # Only take the number
                    cand_district_num               = row.District.split()[-1]
                    
                    cand_name                       = row.Name
                    
                    temp["Id"]                      = row.Id
                    temp["LastName"]                = cand_name.split()[-1]
                    temp["Name"]                    = cand_name
                    temp["District"]                = int(cand_district_num)
                    temp["OrdinalDistrictNumber"]   = num2words( int( cand_district_num ) , to= 'ordinal' )
                    temp["DistrictName"]            = district
                    # Add entry to list
                    sql_cand_list.append(temp.copy())
                    
                    # clear the dictionary entry
                    temp.clear()
                    
                except ValueError as e:
                    exc_type, exc_obj, exc_tb = sys.exc_info()
                    if ENABLE_EXCEPTION_DEBUG:
                        print( "SQL VALUE ERROR EXCEPTION: State: %s  Exception: %s , Line #%d" % ( key, str(e), exc_tb.tb_lineno ) )
            
            # create sorted version of list
            sorted_sql_cand_list = sql_cand_list #, key = lambda i: i["District"])
             
            # Iterate through
            
            for i in range(0, len(sorted_sql_cand_list)):
                # Get SQL candidate
                sql_cand = sorted_sql_cand_list[i]


                # Get Votesmart candidate
                possible_vs_matches = search_for_matching_vs_cand( sql_cand, sorted_vs_cand_list)

                for vs_match_cand in possible_vs_matches:
                   
                    # Votesmart Candiate Name
                    vs_cand_name = "%s %s" % ( vs_match_cand["firstName"], vs_match_cand["lastName"] )
                    vs_cand_id      = vs_match_cand["candidateId"]
                    vs_cand_dist_id = vs_match_cand["officeDistrictId"]
                    
                    
                    # SQL Candidate Name
                    sql_cand_name = sql_cand["Name"]
                    
                    #SQL Cand Id 
                    sql_cand_id = 0 
                    sql_cand_id   = sql_cand["Id"]
                    
                    
                    
                    
                    # Set up dictionaries for entry
                    update_wild_card_entry.clear()
                    update_wild_card_condition.clear()
                    
                    
                    if DEBUG_SQL_CAND_IDS:
                        print("sql cand id: %s" % sql_cand_id)
                    
                    update_wild_card_entry["VoteSmartID"] =         str(vs_cand_id)
                    update_wild_card_entry["VoteSmartDistrictID"] = str(vs_cand_dist_id)
                    
                    update_wild_card_condition["Name"] = sql_cand_name
                    update_wild_card_condition["Id"] = str(sql_cand_id)
                    
                    
                    if DEBUG_SQL_UPDATE_ENTRIES:
                        print("Entry to Update: \n\tName: %s \n\t SQL ID: %s \n\t VoteSmart ID: %s \n\t VoteSmart District ID: %s \n\t"
                                            % ( update_wild_card_condition["Name"],
                                                update_wild_card_condition["Id"],
                                                update_wild_card_entry["VoteSmartID"],
                                                update_wild_card_entry["VoteSmartDistrictID"]) )
                    
                    
                    # First check if Levenshtein on both full names, if less than 3, we can assume perfect
                    if iterative_levenshtein(sql_cand_name, vs_cand_name) < 3:
                        if ENABLE_CANDIDATE_DEBUG and ENABLE_CAND_EXACT_MATCH_DEBUG:
                            print( "EXACT MATCH FOUND: \n\tVotesmart Cand: %s, \tSQL Cand: %s, \n\tState: %s, \n\tPosition: %s, \n\tVS District: %s , \tSQL District: %s, \n\tVoteSmartID: %s" %  (vs_cand_name, sql_cand_name, key, vs_match_cand["officeName"], sql_cand["District"], vs_match_cand["officeDistrictName"], vs_match_cand["candidateId"] ) )
                        
                        # SQL Commit 
                        if COMMIT_EXACT_MATCHES:
                            sql_store.add_wildcard_entry_by_wildcard_condition(update_wild_card_entry, update_wild_card_condition)
                            
                    # If not, check if their first name is the issue
                    elif search_last_name( vs_cand_name, sql_cand["LastName"]):
                        # Perform an excessive levenshtein check to confirm
                        if iterative_levenshtein(sql_cand_name, vs_cand_name) < 5:
                            if ENABLE_CANDIDATE_DEBUG and ENABLE_CAND_CLOSE_MATCH_DEBUG:
                                print( "MATCH FOUND: \n\tVotesmart Cand: %s, \tSQL Cand: %s, \n\tState: %s, \n\tPosition: %s, \n\tVS District: %s , \tSQL District: %s, \n\tVoteSmartID: %s" %  (vs_cand_name, sql_cand_name, key, vs_match_cand["officeName"], sql_cand["District"], vs_match_cand["officeDistrictName"], vs_match_cand["candidateId"] ) )
                            
                            # SQL Commit 
                            if COMMIT_CLOSE_MATCHES:
                                sql_store.add_wildcard_entry_by_wildcard_condition(update_wild_card_entry, update_wild_card_condition)
                    
                        else:
                            if ENABLE_CANDIDATE_DEBUG and ENABLE_CAND_ANOMOLGY_DEBUG:
                                print( "ANOMOLY FOUND: \n\tVotesmart Cand: %s, \tSQL Cand: %s, \n\tState: %s, \n\tPosition: %s, \n\tVS District: %s , \tSQL District: %s, \n\tVoteSmartID: %s" %  (vs_cand_name, sql_cand_name, key, vs_match_cand["officeName"], sql_cand["District"], vs_match_cand["officeDistrictName"], vs_match_cand["candidateId"] ) )
                                
                            
                    # If fails, it could be problem with sql last name, perform last name match using vs id
                    elif search_last_name( sql_cand_name, vs_match_cand["lastName"]):
                        if iterative_levenshtein(sql_cand_name, vs_cand_name) < 5:
                            if ENABLE_CANDIDATE_DEBUG and ENABLE_CAND_CLOSE_MATCH_DEBUG:
                                print( "MATCH FOUND: \n\tVotesmart Cand: %s, \tSQL Cand: %s, \n\tState: %s, \n\tPosition: %s, \n\tVS District: %s , \tSQL District: %s, \n\tVoteSmartID: %s" %  (vs_cand_name, sql_cand_name, key, vs_match_cand["officeName"], sql_cand["District"], vs_match_cand["officeDistrictName"], vs_match_cand["candidateId"] ) )
                                
                            # SQL Commit 
                            if COMMIT_CLOSE_MATCHES:
                                sql_store.add_wildcard_entry_by_wildcard_condition(update_wild_card_entry, update_wild_card_condition)
                        else:
                            if ENABLE_CANDIDATE_DEBUG and ENABLE_CAND_ANOMOLGY_DEBUG:
                                print( "ANOMOLY FOUND: \n\tVotesmart Cand: %s, \tSQL Cand: %s, \n\tState: %s, \n\tPosition: %s, \n\tVS District: %s , \tSQL District: %s, \n\tVoteSmartID: %s" %  (vs_cand_name, sql_cand_name, key, vs_match_cand["officeName"], sql_cand["District"], vs_match_cand["officeDistrictName"], vs_match_cand["candidateId"] ) )
                            
              
                    
                    else:
                        if ENABLE_CANDIDATE_DEBUG and ENABLE_CAND_MISMATCH_DEBUG:
                            print( "DIFFERENT OFFICE HOLDER: \n\tVotesmart Cand: %s, \tSQL Cand: %s, \n\tState: %s, \n\tPosition: %s, \n\tVS District: %s , \tSQL District: %s, \n\tVoteSmartID: %s" %  (vs_cand_name, sql_cand_name, key, vs_match_cand["officeName"], sql_cand["District"], vs_match_cand["officeDistrictName"], vs_match_cand["candidateId"] ) )
          
    except ValueError as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        # fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
 
        if ENABLE_EXCEPTION_DEBUG:
            print( "VALUE ERROR EXCEPTION: State: %s  Exception: %s , Line #%d" % ( key, str(e), exc_tb.tb_lineno ) )
    except KeyError as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        
        if ENABLE_EXCEPTION_DEBUG:
            print( "KEY ERROR EXCEPTION: State: %s Exception: %s, Line #%d" % ( key, str(e), exc_tb.tb_lineno  ) )
        
    except TypeError as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        if ENABLE_EXCEPTION_DEBUG:
            print( "TYPE ERROR EXCEPTION: State: %s Exception: %s, Line #%d" % ( key, str(e), exc_tb.tb_lineno ) )