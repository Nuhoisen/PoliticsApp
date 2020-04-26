import newspaper

class ArticleLister:
    def __init__(self, np_url=""):
        self.np_url = np_url
        
    def list_articles(self, cache_art=True):
        opts = newspaper.build(self.np_url, memoize_articles=cache_art, language='en')
        
        
        return opts
        # for article in opts.articles:
            # print(article.url)
            
    
