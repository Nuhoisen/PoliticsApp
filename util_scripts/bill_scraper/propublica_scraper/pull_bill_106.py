import os 

bill_types = ["hr", "hconres", "hjres", "hres", "sconres", "sjres", "sres" ]

# API_KEY = "rspx4ARofsfOsbjnLR9xKOJqbXAfGBIAtN8GSqF3"
# API_KEY = "8QYsbZrHwSYJj51VBNwSLhrGz6JtYLZwrObeOzTH"
API_KEY = "8FueXrAO7DUbLSncfKCQ0SBs4mypOvtXhNS3i6b5"


for i in range (106):
    for bill_type in bill_types:
        # TODO - Increase bill range to 4000
        for bill_num in range(1001 , 5000):
            command = "sh /root/PoliticsApp/util_scripts/bill_scraper/propublica_scraper/scrape.sh " +  str(i) + " " + bill_type + " " + str(bill_num)+ " " + API_KEY
            print(command)
            res = os.system(command)
            
        break
    break
