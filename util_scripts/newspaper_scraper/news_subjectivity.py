
from textblob import TextBlob

from time import sleep
from bs4 import BeautifulSoup
import urllib3



class SentimentCalculator:

    def __init__(self, news_prvdr):
        self.tot_subj = 0
        self.avg_subj = 0
        self.tot_articles = 0
        
        self.tot_poly = 0
        self.avg_poly = 0
        
        self.news_prvdr = news_prvdr

        
        self.link_log = {""}
        
    def calc_article_sub(self, content):
        blob = TextBlob(content)
        self.tot_subj += blob.sentiment.subjectivity
        return blob.sentiment.subjectivity
        
    def calc_article_pol(self, content):
        blob = TextBlob(content)
        self.tot_poly += blob.sentiment.polarity
        return blob.sentiment.polarity
        
    def calc_sentiment(self, content, link=""):
        if link in self.link_log:
            return False
        else:
            self.link_log.add(link)
            self.tot_articles += 1
            temp_pol = self.calc_article_pol(content)
            temp_sub = self.calc_article_sub(content)
            print(self.news_prvdr + ": article #" + str(self.tot_articles) + " Polarity:" + str(temp_pol)  + " Subjectivity:" + str(temp_sub))
            return True
        # print(self.news_prvdr + ": article #" + str(self.tot_articles))
        
    def get_avg_sub(self):
        try:
            self.avg_subj = self.tot_subj/self.tot_articles
        except ZeroDivisionError:
            print("No articles parsed")
            self.avg_subj = 0
        return self.avg_subj
        
    def get_avg_pol(self):
        try:
            self.avg_poly = self.tot_poly/self.tot_articles
        except ZeroDivisionError:
            print("No articles parsed")
            self.avg_poly = 0
        return self.avg_poly

      
