import random
from time import sleep
from newspaper import Article
#Local Imports
from news_db_storer import NewsDBStorer
from news_subjectivity import SentimentCalculator
from generic_news_scraper import GenericNewsScraper


news_list = []
news_ind = 1
# Add source here
news_dict = {  
                        
                "arizona_central" : "https://www.azcentral.com/",
				"seattle_times" : "https://www.seattletimes.com/",
				"los_angeles_times": "https://www.latimes.com/",
				"miami_herald": "https://www.miamiherald.com/",
				"fox_news": "https://www.foxnews.com/", 
                "politico": "https://www.politico.com/" , 
                "washington_post": "https://www.washingtonpost.com/",
                "npr": "https://www.npr.org/",
                "breitbart" :"https://www.breitbart.com/",
                "new_york_times" : "https://www.nytimes.com/",
				"oregon_live": "https://www.oregonlive.com/",
				"new_jersey_com" : "https://www.nj.com/news/",
                "tennessean":"https://www.tennessean.com/news/politics/",
				"star_tribune" : "http://www.startribune.com/",
				"the_sacramento_bee" : "https://www.sacbee.com/",
				"the_guardian" : "https://www.theguardian.com/us",
				"detroit_news" : "https://www.detroitnews.com/",
				"chicago_tribune" : "https://www.chicagotribune.com/",
				"kansas_city_star" : "https://www.kansascity.com/",
				"las_vegas_sun" : "https://lasvegassun.com/",
				"houston_chronicle" : "https://www.chron.com/",
                "wosu_Ohio_Public_Media" : "https://wosu.org/"
				}




for option, option_url  in  news_dict.items():
        print("Paper name:" + option)
        scraper = GenericNewsScraper(paper_name=option, base_url=option_url)
        print("Instantiated scraper")
        
        scraper.pull_articles()
        scraper.art_obj = scraper.dump_articles(scraper.art_obj)
                        
        scraper.art_obj = scraper.load_articles()
        scraper.parse_articles()
