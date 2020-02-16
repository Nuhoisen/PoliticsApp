import os
import urllib3
import json
http = urllib3.PoolManager()

PWD= os.getcwd()

vote_file_name = "votes.json"

API_KEY = "8QYsbZrHwSYJj51VBNwSLhrGz6JtYLZwrObeOzTH"
count = 0
with open("vote_dump_paths.txt") as fp:
    lines = fp.readlines()
    
    for line in lines:
        try:
            ## Read each line.
            ## Split the line by the delimiter to retrieve the path
            path = line.split("data.json")[0]
            file_path = PWD + "/" + path
            
            ## Extract URL, Removing excessive quotation marks
            url = line.split('api_url":')[1].replace('"','').strip()
            
            ## Only Execute this if the votes.json file
            ## has not been downloaded yet
            if not os.path.isfile( file_path + "/" + vote_file_name ):
                print(url)
                ## Make the http request for the data
                ## passing the headers API KEY
                r = http.request('GET', url, headers={"X-API-Key": API_KEY})
                
                ## Write the contents (r.data) 
                ## to a new file handle 
                with open(file_path+"/"+ vote_file_name, 'wb') as json_fp:
                    json_fp.write(r.data)
            
            
                ## Increment the count only if 
                ## the file has been retrieved
                count +=1 
            
            
            
        except FileNotFoundError as e:
            print(str(e))
            continue
        except IndexError as e:
            print(str(e))
            
        except Exception as e:
            print("UNEXPECTED EXCEPTION CAUGHT: %s" % str(e))
            print("On VOTE COUNT #: %d" % count )
            break
