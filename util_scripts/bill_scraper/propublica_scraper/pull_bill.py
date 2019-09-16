import os 

bill_types = ["s", "hr", "hconres", "hjres", "hres", "sconres", "sjres", "sres" ]

congress_nums = 104



for i in range (104, 112):
        for bill_type in bill_types:
                for bill_num in range(0 , 1000):
                        res = os.system("sh /root/PoliticsApp/util_scripts/bill_scraper/propublica_scraper/scrape.sh " +  str(i) + " " + bill_type + " " + str(bill_num) )



