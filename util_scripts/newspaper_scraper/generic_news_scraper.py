# Newspaper parser
import newspaper
from newspaper import Article

# Sentiment analyser
from textblob import TextBlob

# NLTK - For keyword extraction
from nltk.stem.porter import PorterStemmer
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import stopwords

# SQL Access 
import pyodbc

# Caching
import pickle

# Common libs
from time import sleep
from bs4 import BeautifulSoup
import urllib3
import random

# Custom Libs
from article_lister import ArticleLister
from keyword_extractor import KeywordExtractor
from news_db_storer import NewsDBStorer

cache_dir = "./pkl_cache/"

dbstore = NewsDBStorer(db_name="newsarticlesdb", table_name="politician_based_newsarticlestable")
dbstore.set_up_connection()

keyword_xtractor = KeywordExtractor()

class GenericNewsScraper:
    def __init__(self,  paper_name = "cnn", base_url="https://www.cnn.com/"):
        self.articles = []
        self.base_url = base_url
        self.paper_name = paper_name
        self.art_obj = set()
        
   
  
    # Loads article cache
    def load_articles(self):
        f = open(cache_dir + self.paper_name+".pkl", 'rb')
        cache_obj = pickle.load(f)
        f.close()    
        return cache_obj
        
  
    # Saves article list to cache
    # Also updates passed object, with existing cached items
    def dump_articles(self, art_obj):
        
        try:
            # Open bin file for concatentaion
            cache_obj = self.load_articles()
            for cache_val in cache_obj:
                if cache_val not in art_obj:
                    art_obj.add(cache_val)
                
        except FileNotFoundError:
            pass
        # Dump new file
        f = open(cache_dir + self.paper_name+".pkl", 'wb')
        pickle.dump(art_obj, f, -1)
        f.close()
        return art_obj
    

    # Retrieves new articles
    # Adds them to existing cache list
    def pull_articles(self):
    
        art_list = ArticleLister(self.base_url)
        # Pull articles, w/caching
        opts = art_list.list_articles(cache_art = True)
        
        # 
        for article in opts.articles:
            if article.url not in self.art_obj:
                self.art_obj.add(article.url)
        
        return self.art_obj        
        # self.art_obj = self.dump_articles(self.art_obj)
        
    
    def entry_exists(self, url):
        row = dbstore.retrieve_entry(url)
        return len(row)
    
    # Run through them
    def parse_articles(self):
        for art_url in self.art_obj:
            print("Parsing articles. Current URL: " + art_url) 
            try:
                if not self.entry_exists(art_url):
                    art = Article(url= art_url, language= "en")
                    art.download()
                    art.parse()
                    
                    title = ""
                    top_img_url = ""
                    
                    key_words = []
                    
                    if len(art.text) > 5:
                        matched_names = keyword_xtractor.find_name_matches(art.text)
                        if matched_names:
                            print(matched_names)
                            sql_dict= {"News Company" : self.paper_name, "Article URL": art_url, "Keywords": key_words}
                            common_words = keyword_xtractor.process_text(art.text)
                            
                            # Special exception check for img_url and title
                            try:
                                top_img_url  = art.top_image
                                title = art.title
                                
                            except Exception as e:
                                print("Unable to download title or img url")
                                title = self.paper_name
                                top_img_url= "default"
                                print(str(e))
                                
                            title = title.replace("'", "''")
                            title = title.replace('"', '""')
                            title = title.replace('%', '%%')
                            
                            
                            sql_dict["Article Title"] = title
                            sql_dict["Article Img URL"] = top_img_url
                            # Parse out keywords
                            for key_word in common_words:
                                key_words.append(key_word[0])
                            sql_dict["Keywords"] = key_words
                            
                            
                            # Add a entry for each politician name
                            for name in matched_names:
                                sql_dict["Politician Name"] = name
                                dbstore.add_formatted_entry(sql_dict)

                    
                    # Add list to dicts
                        # sql_dict["Keywords"] = key_words
                        # dbstore.add_formatted_entry(sql_dict)
                    
                    sleep(random.random())
                else:
                    print("Article exists")
            except Exception as e:
                print(str(e))
            
         


# scraper = GenericNewsScraper(paper_name="politico", base_url="https://www.politico.com/" )
# scraper.pull_articles()
# scraper.art_obj = scraper.dump_articles(scraper.art_obj)

# # scraper.art_obj = scraper.load_articles()
# scraper.parse_articles()


# scraper_2 = GenericNewsScraper(paper_name="washington_post", base_url="https://www.washingtonpost.com/" )
# scraper_2.pull_articles()
# scraper_2.art_obj = scraper_2.dump_articles(scraper_2.art_obj)

# # scraper.art_obj = scraper.load_articles()
# scraper_2.parse_articles()

# scraper_3 = GenericNewsScraper(paper_name="npr", base_url="https://www.npr.org/" )
# scraper_3.pull_articles()
# scraper_3.art_obj = scraper_3.dump_articles(scraper_3.art_obj)

# # scraper.art_obj = scraper.load_articles()
# scraper_3.parse_articles()
