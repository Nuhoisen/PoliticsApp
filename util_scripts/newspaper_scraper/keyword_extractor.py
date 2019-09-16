# NLTK - For keyword extraction
from nltk.stem.porter import PorterStemmer
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import stopwords

# sklearn - CountVectorizer
from sklearn.feature_extraction.text import CountVectorizer

# Regex
import re

# String for stripping
import string

# Stop words, get rid of them
stop_words = set(stopwords.words("english"))
##Creating a list of custom stopwords
new_words = ["using", "show", "result", "large", "also", "iv", "one", "two", "new", "previously", "shown"]
stop_words = stop_words.union(new_words)

class KeywordExtractor:

    def __init__(self):
        with open("politician_names.txt", 'r') as fp:
            self.name_dict = {}
            for line in fp.readlines():
                line = line.rstrip()
                
                last_name = line.split()[-1]
                if  last_name in self.name_dict.keys():
                    self.name_dict[last_name].append(line)
                else:
                    self.name_dict[last_name] = []
                    self.name_dict[last_name].append(line)
                
                
                
            # print(name_dict)
            
        
    @staticmethod
    def get_top_n_words(corpus, n=None):
        vec = CountVectorizer().fit(corpus)
        bag_of_words = vec.transform(corpus)
        sum_words = bag_of_words.sum(axis=0) 
        words_freq = [(word, sum_words[0, idx]) for word, idx in      
                       vec.vocabulary_.items()]
        words_freq =sorted(words_freq, key = lambda x: x[1], 
                           reverse=True)
        # print(words_freq[:n])
        return words_freq[:n]
    
    @staticmethod    
    def get_top_n2_words(corpus, n=None):
        vec1 = CountVectorizer(ngram_range=(2,2),  
                max_features=2000).fit(corpus)
        bag_of_words = vec1.transform(corpus)
        sum_words = bag_of_words.sum(axis=0) 
        words_freq = [(word, sum_words[0, idx]) for word, idx in     
                      vec1.vocabulary_.items()]
        words_freq =sorted(words_freq, key = lambda x: x[1], 
                    reverse=True)
        
        # print(words_freq[:n])
        return words_freq[:n]

    
    #Most frequently occuring Tri-grams
    @staticmethod
    def get_top_n3_words(corpus, n=None):
        vec1 = CountVectorizer(ngram_range=(3,3), 
               max_features=2000).fit(corpus)
        bag_of_words = vec1.transform(corpus)
        sum_words = bag_of_words.sum(axis=0) 
        words_freq = [(word, sum_words[0, idx]) for word, idx in     
                      vec1.vocabulary_.items()]
        words_freq =sorted(words_freq, key = lambda x: x[1], 
                    reverse=True)
                    
        # print(words_freq[:n])
        return words_freq[:n]
        
    @staticmethod
    def process_text(art_text):
        test_list = []
        # for i in range(0, 3847):
        
        #Remove punctuations
        text = re.sub('[^a-zA-Z]', ' ', art_text)
        
        #Convert to lowercase
        text = text.lower()
        
        #remove tags
        text=re.sub("&lt;/?.*?&gt;"," &lt;&gt; ",text)
        
        # remove special characters and digits
        text=re.sub("(\\d|\\W)+"," ",text)
        
        ##Convert to list from string
        text = text.split()
        
        ##Stemming
        ps=PorterStemmer()

        #Lemmatisation
        lem = WordNetLemmatizer()
        text = [lem.lemmatize(word) for word in text if not word in  
                stop_words] 
        text = " ".join(text)
        
        # print (text)
        test_list.append(text)
        # Mono-grams
        common_words =  KeywordExtractor.get_top_n_words(test_list, n = 7)
        # Bi- grams
        common_words += KeywordExtractor.get_top_n2_words(test_list, n = 3)
        
        return common_words
        # return text
        
    
    def format_string(self, text):
        text = text.translate({ord(c): None for c in string.whitespace})
        text = text.replace("-", "")
        text = text.lower()
        return text
        
    
    def find_name_matches(self, text):
        split_text = text.split()
        
        matched_names = set()
        for i in range(len(split_text)):
        # for word in split_text:
            
            if split_text[i] in self.name_dict.keys():
                poss_names = self.name_dict[split_text[i]]
                
                # Form the name, strip out all white space 
                test_name =  (split_text[i-1] + split_text[i])
                
                # Formatt the name, remove any white space, remove any hypens
                test_name = self.format_string(test_name)
                
                
                
                for unformatted_name in poss_names:
                    # Modifiy the name to be compact and free of any irregularities
                    name = self.format_string(unformatted_name)
                    # If there's a match between names, 
                    if  test_name in name:
                        matched_names.add(unformatted_name)
                        print(unformatted_name)
                
        return matched_names
    

# parse_text(test_str)