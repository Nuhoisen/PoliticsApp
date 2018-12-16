import urllib3
from collections import defaultdict
from bs4 import BeautifulSoup

urllib3.disable_warnings()

url = "https://www.billtrack50.com/LegislatorDetail/"
http = urllib3.PoolManager()

urls = ["https://www.billtrack50.com/LegislatorDetail/3308", "https://www.billtrack50.com/LegislatorDetail/15712", "https://www.billtrack50.com/LegislatorDetail/15789"]

legislature_dict = defaultdict(lambda: defaultdict(list))
def rec_dd():
    return defaultdict(rec_dd)


for i in range(1, 100):    
    try:
        r = http.request('GET', (url+str(i)))
        
        
        
        soup = BeautifulSoup(r.data, "lxml")
        
        
        in_office = soup.find(id= 'lblInOffice').string
        
        if("yes" in in_office.lower()):
            name = soup.find(id='lblLegislator').string
            name = name.replace("&nbsp", " ")
            name = name.split('-')[0]
            
            role = soup.find(id='lblRole').string.split('-')
            
            state = role[1]
            role = role[0]
            
            
            state = state.split()
            district = " ".join(state) #( "%s %s %s" % ( state[1], state[2], state [3] ) )
            if(state[0].lower() == "new"):
                state = ("%s %s" % (state[0], state[1]))
            else:
                state = state[0]
            
           
            
            
            profile = {"Name":name, "District": district}
            
            legislature_dict[state][role].append(profile)
            
            
            print(legislature_dict)
            
            
            
    except AttributeError or TypeError as e:
        print(e)
        

with open('data.json', 'w') as fp:
    json.dump( legislature_dict , fp)
