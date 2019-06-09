import re
import os, sys
import json
import urllib3
from bs4 import BeautifulSoup
from collections import defaultdict
from poly_scraper import PolyScraper
from sql_storer import SqlStorer
urllib3.disable_warnings()

url = "https://www.billtrack50.com/LegislatorDetail/"
http = urllib3.PoolManager()

urls = ["https://www.billtrack50.com/LegislatorDetail/3308", "https://www.billtrack50.com/LegislatorDetail/15712", "https://www.billtrack50.com/LegislatorDetail/15789"]

legislature_dict = defaultdict(lambda: defaultdict(list))



my_sql = SqlStorer("PoliticianInfo", "PoliticianTable")
my_sql.set_up_connection()
my_sql.create_table()


def get_name(soup):
    name = soup.find(id='lblLegislator').string
    name = name.replace("&nbsp", " ")
    name = name.split('-')[0]
    name = name.replace("'", "''")
    return name
    
    
def get_ballotpedia(soup):
    bal_link = ""
    try:
        bal_link = soup.find(id='lnkBallotpedia').get('href')
    except Exception:
        bal_link = ""
    bal_link = bal_link.replace("'", "''")
    return bal_link
  
def get_follow_money(soup):
    fm_link = ""
    try:
        fm_link = soup.find(id='lnkFollowTheMoney').get('href')
    except Exception:
        fm_link = ""
    fm_link = fm_link.replace("'", "''")
    return fm_link

def get_role(soup):
    role = ""
    try:
        role = soup.find(id='lblRole').string.split('-')[0]
    except Exception:
        role = ""
    role = role.replace("'", "''")
    return role
    
    
def get_state(soup):
    state = ""
    try:
        state = soup.find(id='lblRole').string.split('-')           
        state = state[1]
        state = state.split()
        district = " ".join(state)
        if( state[0].lower() == "new" ):
            state = ("%s %s" % (state[0], state[1]))
        else:
            state = state[0]
    except Exception:
        state = ""
    state = state.replace("'", "''")        
    return state
    
def get_district(soup):
    district = ""
    try:
        district = soup.find(id='lblRole').string.split('-')[1]
    except Exception:
        district = ""
    district.replace("'", "''")
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

def get_img_url(id):
        return "https://www.billtrack50.com/Handlers/LegislatorImageHandler.ashx?id=" + str(id)

        
def get_facebook(soup):
    hrefs = soup.find_all('a', href=re.compile("facebook"))
    
    facebook = ""
    backup_facebook = ""
    for href in hrefs:
        if "LegiNation" in href['href']:
            backup_facebook = href['href']
        else:
            facebook = href['href']
            
    if facebook is not "":
        return facebook.replace("'", "''")
    else:
        return backup_facebook.replace("'", "''")
    
# Retrieves twitter handle
def get_twitter(soup):
    hrefs = soup.find_all('a', href=re.compile("twitter"))
    
    twitter = ""
    backup_twitter = ""
    for href in hrefs:
        if "BillTrack50" in href['href']:
            backup_twitter = href['href']
        else:
            twitter = href['href']
            
    if twitter is not "":
        return twitter.replace("'", "''")
    else:
        return backup_twitter.replace("'", "''")
        
def get_email(soup):
    hrefs = soup.find_all('a', href=re.compile("mailto:"))
    email = ""
    
    for href in hrefs:
        email = href['href']
    
    return email.replace("'", "''")
        
def get_bio(soup):
    bio = soup.find("span", id="lblBio")
    bio = str(bio)
    # print((bio))
    bio = bio.replace("'", "''")
    bio = bio.replace("_", "[_]")
    bio = bio.replace("%", "[%]")
    print(len(bio))
    return bio
    
    
def run():    
    passed = 0
    failed = 0
    
    for i in range(181, 30000):    
        try:
            billtrack = url+str(i)
            r = http.request('GET', billtrack)
            
            soup = BeautifulSoup(r.data, "lxml")
            
            
            
            in_office = soup.find(id= 'lblInOffice').string
            
            if("yes" in in_office.lower()):
                name = get_name(soup).strip()
                
                
                ballotpedia = get_ballotpedia(soup).strip() #soup.find(id='lnkBallotpedia').get('href')
                follow_money = get_follow_money(soup).strip() #soup.find(id='lnkFollowTheMoney').get('href')
                role = get_role(soup).strip()
                state = get_state(soup).strip()            
                district = get_district(soup).strip()
                img_url = get_img_url(i).strip()
                sql_profile =  {"Id": i, "Name":name, "State": state, "Role": role, "District": district, \
                "FollowMoneyURL": follow_money, "BallotpediaURL" : ballotpedia, \
                "BillTrackURL" : billtrack, "ImageURL": img_url}
                my_sql.add_formatted_entry(sql_profile)
                
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
            
def run_social_media():
    entries = {}
    row_entries = my_sql.retrieve_billtrack_urls()
    for entry in row_entries[2583:]:
        try:
            billtrack = entry[0]
            print(billtrack)
            r = http.request('GET', billtrack)
            
            soup = BeautifulSoup(r.data, "lxml")
            
            # hrefs = soup.find_all('a', href=True)
            facebook = get_facebook(soup)
            print(facebook)
            
            twitter =  get_twitter(soup)
            print(twitter)
            
            email = get_email(soup)
            print(email)
            
            entries['Twitter'] = twitter 
            entries['Facebook'] = facebook
            entries['Email'] = email
            entries['BillTrack'] = billtrack
            my_sql.update_with_social_media(entries)
        except AttributeError or TypeError as e:
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            print(exc_type, fname, exc_tb.tb_lineno)
        
            print("Failed link: %s" % billtrack)
            failed += 1
            print(e)
            

    print("Passed: %d" % passed)
    print("Failed: %d" % failed)

def run_bio():
    entries = {}
    row_entries = my_sql.retrieve_billtrack_urls()
    for entry in row_entries[3339:]:
        try:
            billtrack = entry[0]
            print(billtrack)
            r = http.request('GET', billtrack)
            
            soup = BeautifulSoup(r.data, "lxml")
            
            # hrefs = soup.find_all('a', href=True)
            bio = get_bio(soup)
            
            entries['Bio'] = bio 
            entries['BillTrack'] = billtrack
            
            my_sql.update_with_bio(entries)
        except AttributeError or TypeError as e:
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            print(exc_type, fname, exc_tb.tb_lineno)
        
            print("Failed link: %s" % billtrack)
            
            print(e)
            

    print("Passed: %d" % passed)
    print("Failed: %d" % failed)
# print("mailto:Angelo.D'Emilia@mahouse.gov".replace("'", "''"))

# run_social_media()
run_bio()


# r = http.request('GET', 'https://www.billtrack50.com/LegislatorDetail/15626' )
# soup =   BeautifulSoup(r.data, "lxml")
# bio = soup.find("span", id="lblBio")

