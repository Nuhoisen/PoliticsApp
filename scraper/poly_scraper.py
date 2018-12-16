import urllib3
from bs4 import BeautifulSoup # To get everything
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


class PolyScraper:

    c_url = ""
    c_soup = None
    c_driver = None
    def __init__(self):
        self.set_up_selenium()
        
    def set_up_selenium(self):
        chrome_opt = webdriver.ChromeOptions()
        chrome_opt.add_argument('headless')

        self.c_driver = webdriver.Chrome(options=chrome_opt)


    def retrieve_webpage(self,url):
        self.c_url = url
        self.c_driver.get(self.c_url)

        self.c_soup = BeautifulSoup(self.c_driver.page_source, "html.parser")

        

    def retrieve_legislastion(self):
    
        legislation_bulk = self.c_soup.find(id='BT50Widget')
        bills = legislation_bulk.find_all('li')
        formatted_bills = []

        for bill in bills:
            try:
                bill_title = bill.find('a').string
                bill_meat = bill.find_all('div')
                
                bill_descript = bill_meat[1].string
                bill_date = bill.find_all(class_='billNote alignLeft ellipsis')[0].string
            except IndexError:
                print("Index Error occurred")
            else:
                formatted_bills.append({"title": bill_title, "description" : bill_descript, "date": bill_date})
            
            
            
        for bill in formatted_bills:
            print("--------------------------------------")
            print("--------------------------------------")
            print(bill['title'])
            print(bill['description'])
            print(bill['date'])
            print("--------------------------------------")
            print("--------------------------------------")
        
    
    
    
    def retrieve_committees(self):
        formatted_committees = []
        i = 0
        while True:
        
            try:
                committee_bulk = self.c_soup.find(id=('collapsibleTable' + str(i)))
                years_committees = []
                committees = committee_bulk.find_all('td')
                for committee in committees:
                    committee_name = committee.find('a')
                    
                    years_committees.append(committee_name.string)
                
                formatted_committees.append({"year_id": i, "committees": years_committees})
                #update committees
                i+=1
            except AttributeError:
                break

        i = 0
        for years_committees in formatted_committees:
            print("Term: #" + str(i+1))
            for committee in years_committees['committees']:
                print(committee)
            
            i+=1
                

                
                
                
                
                
                
                