
from sql_storer import SqlStorer
import state_mappings
import json
import urllib3

http = urllib3.PoolManager()

state_dict =  {}


name_2_abbrev = state_mappings.state_name_2_abbrev

    
print(state_dict)
sql_store = SqlStorer()
sql_store.set_up_connection()


wild_card_query = { "VoteSmartID": ""}

sql_results = sql_store.retrieve_by_null_value_wildcard(wild_card_query)



office_type_state_url = "http://api.votesmart.org/Candidates.getByOfficeTypeState?key=9125e6afe9e4b86c1dd87da7f889e7b9&o=JSON&officeTypeId=L&stateId=%s&electionYear=%d"


# Makes URL call and returns json formated data
def json_request(url):
    r = http.request('GET', url)
    json_res = json.loads(r.data)
    return json_res



# RETRIEVABLES
vote_smart_cand_id = None
vote_smart_dist_id = None


def identify_candidate(row):
        
        # Get candidates state
        cand_state = name_2_abbrev[row.State]
        
        
        # Get candidates name
        cand_name = row.Name 
        
        
        # Get the district for later analysis
        cand_district = row.District.split()[-1]
        
        # Only search thorugh recent years
        for i in range(2019, 2014, -1):
        
            # Search url ,  + cand state abbrev. and year
            search_url = office_type_state_url % ( cand_state, i )
            
            # Make request, save results
            json_results = json_request(search_url)
            
            
            #Get Candiate List
            try:
                cand_list = json_results['candidateList']['candidate']
            
                cand_aliases = cand_name.split()
                

                # Do  a series of checks to verify the candidate from 
                # the vote smart API matches the one in the database
                for candidate in cand_list:
                    try:
                        if candidate["officeStatus"] in "active":
                            for i in range(1, len(cand_aliases)):
                                
                                if cand_aliases[i] in candidate["lastName"] :
                                    if cand_district in  candidate["electionDistrictName"]:
                                        vote_smart_cand_id = candidate["candidateId"]
                                        
                                        return vote_smart_cand_id

                    except KeyError:
                        print("KeyError occurred in inner-loop")
                        pass
            except KeyError:
                print("KeyError occurred in outter-loop")
                pass
                
        return 0

wild_card_condition = {}
wild_card_entry = {}


running_count = 0
last_stop = 863


for row in sql_results:

    # Use this to skip over already hit iterations
    if running_count >= last_stop:
        if row.InOffice and ('y' in row.InOffice.lower()):
            vote_smart_cand_id = identify_candidate(row)
            
            if vote_smart_cand_id != 0:
                print(vote_smart_cand_id)
                
                wild_card_condition['Id'] = str(row.Id)
                wild_card_condition['Name'] = row.Name
                
                
                wild_card_entry["VoteSmartID"] = str(vote_smart_cand_id)
                
                
                
                sql_store.add_wildcard_entry_by_wildcard_condition(wild_card_entry, wild_card_condition)
                
            else:
                print("Nothing found")
            
            
    
    running_count+=1
    
    print("Finishing Iteration: %d" % running_count )
        
        


