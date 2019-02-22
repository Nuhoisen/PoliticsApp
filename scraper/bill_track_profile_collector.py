import os, sys
import json
import urllib3
from bs4 import BeautifulSoup
from collections import defaultdict
from poly_scraper import PolyScraper
urllib3.disable_warnings()

url = "https://www.billtrack50.com/LegislatorDetail/"
http = urllib3.PoolManager()

urls = ["https://www.billtrack50.com/LegislatorDetail/3308", "https://www.billtrack50.com/LegislatorDetail/15712", "https://www.billtrack50.com/LegislatorDetail/15789"]

legislature_dict = defaultdict(lambda: defaultdict(list))

def get_name(soup):
    name = soup.find(id='lblLegislator').string
    name = name.replace("&nbsp", " ")
    name = name.split('-')[0]
    return name
    
    
def get_ballotpedia(soup):
    return soup.find(id='lnkBallotpedia').get('href')
  
def get_follow_money(soup):
    return soup.find(id='lnkFollowTheMoney').get('href')

def get_role(soup):
    role = soup.find(id='lblRole').string.split('-')[0]
    
    return role
    
    
def get_state(soup):
    state = soup.find(id='lblRole').string.split('-')           
    state = state[1]
    state = state.split()
    district = " ".join(state)
    if( state[0].lower() == "new" ):
        state = ("%s %s" % (state[0], state[1]))
    else:
        state = state[0]
        
    return state
def get_district(soup):
    district = soup.find(id='lblRole').string.split('-')[1]
    return district
   
def get_sponsored_bills(soup):
    bill_list = []
    
    sponsored_body = soup.find(id= 'tblSponsors')
    sponsored_table = sponsored_body.find('tbody')
    
    for row in sponsored_table.find_all("tr"):
        bill_template = {"ID": None, "Name": None, "Summary": None}
        entries = row.find_all("td")
        bill_id = entries[0].find('a').string.strip()
        bill_name = entries[1].string
        bill_summary = entries[2].string
        
        bill_template['ID'] = bill_id
        bill_template['Name'] = bill_name
        bill_template['Summary'] = bill_summary
        
        
        bill_list.append(bill_template)
    
        
    return bill_list
     
def get_committees(soup): #soup):#
    committee_list = []
    
    committee_body = soup.find(id='tblCommittees')
    committee_table = committee_body.find('tbody')
    
    for row in committee_table.find_all("tr"):
        committee_template = {"Committee": None,"Role": None}
        entries = row.find_all("td")
        committee = entries[2].string
        role = entries[1].string
        
        
        committee_template['Committee'] = committee
        committee_template['Role'] = role
   
        
        committee_list.append(committee_template)
    

    return committee_list

passed = 0
failed = 0
for i in range(1, 30000):    
    try:
        billtrack = url+str(i)
        r = http.request('GET', billtrack)
        
        
        
        
        
        
        soup = BeautifulSoup(r.data, "lxml")
        
        
        
        in_office = soup.find(id= 'lblInOffice').string
        
        if("yes" in in_office.lower()):
            name = get_name(soup)
            
            
            
            ballotpedia = get_ballotpedia(soup) #soup.find(id='lnkBallotpedia').get('href')
            follow_money = get_follow_money(soup) #soup.find(id='lnkFollowTheMoney').get('href')
            role = get_role(soup)
            state = get_state(soup)            
            district = get_district(soup)

            sponsored_bills = None
            try:
                sponsored_bills = get_sponsored_bills(soup)
            except AttributeError as e:
                continue
                #print("No Sponsored Bills")

            committees = None
            try:
                committees = get_committees(soup)

            except AttributeError as e:
                continue
                #print("No Committees")
                
            
            
            profile = {"Name":name, "District": district, "BillTrack": billtrack, "FMLink": follow_money, "Ballotpedia": ballotpedia, "SponsoredBills": sponsored_bills, "Committees": committees}
            
            legislature_dict[state][role].append(profile)
            
            
            #print(legislature_dict)
            
            passed+=1
            
    except AttributeError or TypeError as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        print(exc_type, fname, exc_tb.tb_lineno)
    
        print("Failed link: %s" % billtrack)
        failed += 1
        print(e)
        

print("Passed: %d" % passed)
print("Failed: %d" % failed)
        
with open('data.json', 'w') as fp:
    json.dump( legislature_dict , fp)