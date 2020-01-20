from sql_storer import SqlStorer
import os 
import urllib3
import json


VERBOSE_DEBUG = True

# Used to clear the screen
clear = lambda: os.system("clear")

# Set up http
http = urllib3.PoolManager()


dict_fields = {}

fail_log_fp = open('mismatches.log', 'w+')


# Set up sql
politician_sql = SqlStorer()
politician_sql.set_up_connection()

##################################################
# Makes URL call and returns json formated data
##################################################
def json_request(url):
    if VERBOSE_DEBUG:
        print(url)
    r = http.request('GET', url)
    json_res = json.loads(r.data)
    return json_res

##################################################
# Pulls candidate from vs database,
# based on candidate name and state name
# Used to retrieve the candidates unique ID
##################################################
def retrieve_unique_id(field_dict):
    query = "SELECT * FROM  politiciantable where VoteSmartID is NULL and " \
                                                   "Name  LIKE '%%%s%%' and " \
                                                   "State LIKE '%%%s%%'  "  % ( field_dict['Name'], field_dict['State'])
    res = politician_sql.execute_raw_query(query)
    
    if res:
        for row in res:
            return row.Id
    
    return None

##################################################
# Makes a VS api call with/cand id in order to 
# pull their vs district id
##################################################
def get_candidate_vs_district(vs_cand_id):
    try:
        search_url = "http://api.votesmart.org/CandidateBio.getBio?key=9125e6afe9e4b86c1dd87da7f889e7b9&o=JSON&candidateId=%s" % vs_cand_id
        vs_content = json_request(search_url)
        if isinstance(vs_content['bio']['office'], list):
            district_id = vs_content['bio']['office'][0]['districtId']
        else:
            district_id = vs_content['bio']['office']['districtId']
        return district_id
    except KeyError as e:
        print("KEY ERROR EXCEPTION OCCURRED. CANDIDATE DOESN'T HAVE A DISTRICT")
        return None




##################################################
# Identifies candidate in the sql database
# and updates their votesmart fields
##################################################
def update_candidate_vs(field_dict, raw_fields):
    unique_id  = retrieve_unique_id(field_dict)
    
    if unique_id:
    
        # 
        # SQL Condition
        query_condition = {}
        
        # SQL Entry
        query_entry = {}
        
        # Update query fields`
        query_entry['VoteSmartID']          = field_dict['VoteSmartID']
        
        # Get district id
        district_id = get_candidate_vs_district(field_dict['VoteSmartID'])
        if district_id:
            query_entry['VoteSmartDistrictID']  = str(district_id)
        
        # Update query condition`
        query_condition['Id'] = str(unique_id)
        
        
        # This is where we commit the final entry
        politician_sql.add_wildcard_entry_by_wildcard_condition_exact_match(query_entry, query_condition)
        
        
        
    else:
        print("EXCEPTION: SQL RETRIEVAL FAILURE")
        fail_log_fp.write("--\n")
        fail_log_fp.write("CANDIDATE NOT FOUND IN SQL:\n")
        fail_log_fp.write(raw_fields + "\n")
        


## This function parses the name from 
## the raw text
def parse_name(raw_fields):
    names = raw_fields[2]
    names = names.replace(',' , '')
    name = names.split("SQL Cand:")[1]
    name = name.strip()
    return name
    
## This function parses the state from
## the raw text
def parse_state(raw_fields):
    state = raw_fields[3]
    state = state.replace(',' , '')
    state = state.split(':')[1]
    state = state.strip()
    return state
    
    
## This function acts as a user selection
## mechanism    
def init_prompt():
    start_index = 0
    end_index   = 0
    
    # Set user_selected to false
    user_selected = False
    
    while not user_selected:
        ##################################
        print("#########################")
        print("###### USER SELECT ######")
        print("#1 . Tanner ")
        print("#2 . Henry ")
        print("#3 . Hunter ")
        print("#########################")
        user = input("SELECT USER:")
        # Set it to True initiallly
        user_selected = True
        ##################################
        if user.lower() == "1":
            start_index = 0 
            end_index   = 185
        elif user.lower() == "2":
            start_index = 186 
            end_index   = 371
        elif user.lower() == "3":
            start_index = 372
            end_index   = 558
        else:
            print("-----------------------")
            print("INVALID SELECTION.")
            print("SELECT AGAIN.")
            print("-----------------------")
            user_selected = False

    return start_index, end_index
    
    
record_count = 0

try:
    with open("candidate_anomolies_v2.log" , 'r') as fp:
        contents = fp.read()
        
        records = contents.split("--")
        
        ############################
        ############################
        ##### ITERATE RECORDS ######
        ############################
        ############################
        
        # Give the boys their respective loads
        start_index, end_index = init_prompt()
        for i in range(start_index, end_index):
            record = records[i]
            
            
            try:
                fields = record.split('\n')
                
                # names = fields[1].split(',')
                candidates_fields   = record.split('VoteSmartID:')[0]
                votesmart_id        = record.split('VoteSmartID:')[1]
                votesmart_id        = votesmart_id.strip()
                verif_url           = "https://justfacts.votesmart.org/candidate/biography/" + votesmart_id
                
                
                dict_fields['Name'] = parse_name(fields)
                dict_fields['State']= parse_state(fields)
                dict_fields['VoteSmartID'] = votesmart_id
                
                
                
                print("################################################################")
                print("################################################################")
                print("################################################################")

                print(candidates_fields.strip())
                print("################################################################")
                print("################################################################")
                print("################################################################")
                print(verif_url)
                
                
                print("################################################################")
                print("DO THE DISTRICT, STATE, and POSITION MATCH THE CANDIDATE ONLINE?")
                print("################################################################")
                print("y/n:")
                print("################################################################")
                
                
                prompt_lock = True
                
                while prompt_lock:
                    response = input()
                    if response.lower() == 'y':
                        update_candidate_vs(dict_fields, record)
                        prompt_lock = False
                    elif response.lower() == 'n':
                        fail_log_fp.write("--\n")
                        fail_log_fp.write("CANDIDATE MISMATCH:\n")
                        fail_log_fp.write(record + "\n")
                        prompt_lock = False
                        
                    
                        
                
             
                clear()
                
            except IndexError:
                continue
    
                
except KeyboardInterrupt as e:
    print("KEYBOARD INTERRUPT DETECTED. EXITING NOW")
    fail_log_fp.write("--\n")
    fail_log_fp.write("KEYBOARD INTERRUPT DETECTED\n")
    fail_log_fp.write("CLOSING FILE\n")
    
fail_log_fp.close()