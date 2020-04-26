import pyodbc
import time

class NewsDBStorer:

    c_cnxn = None
    c_query = None
    c_table_name = None
    c_db_name = None
    
    
    # CONSTRUCTOR
    def __init__(self, db_name="newsarticlesdb", table_name = "newsarticlestable"):
        self.c_query = ""
        self.c_table_name = table_name
        self.c_db_name = db_name
                 
                 
    # Connection SETUP
    # "SERVER=ANDROIDPHONE\POLY_SQLEXPRESS;" \
    def set_up_connection(self):
        command  =  "DRIVER={MySQL ODBC 8.0 Driver};" \
                    "SERVER=localhost;" \
                    "DATABASE=%s;" \
                    "Trusted_Connection=yes;" \
                    "UID=root;" \
                    "PWD=sqlPW123!" % self.c_db_name
#        command =      "Login Prompt=False;" \
#		        "User ID=root;" \
#		        "Password=sqlPW123!;" \
#		        "Data Source=localhost;" \
#		        "Database=%s;" \
#		        "CHARSET=UTF8" % self.c_db_name 
        self.c_cnxn = pyodbc.connect(command)
        
        self.c_cnxn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-8')
        self.c_cnxn.setencoding(encoding='utf-8')
    
    
    # Commit Query:
    # Used to commit any sql command
    # including select and post.
    # Detects connection failures and attempts to reconnect.
    #
    # Returns cursor for further poss. operations
    def commit_query_return_cursor(self, query):
        cursor = None
        try:
            cursor = self.c_cnxn.cursor()
            cursor.execute(query)
            self.c_cnxn.commit()
        except pyodbc.OperationalError as e:
            print(str(e))
            # Reset connection in case it failed
            self.set_up_connection()
            # Retry commit
            cursor = self.c_cnxn.cursor()
            cursor.execute(self.c_query)
            self.c_cnxn.commit()
        return cursor
    
    # Add Formatted Entry
    # This function parses dictionary entry into
    # a SQL query. This query is then executed on SQL
    # side. 
    def add_formatted_entry(self, entry):
        print("Adding Article entry to the News Data Base, associated by politician")
        date_added = time.strftime("%Y-%m-%d")
        formatted_entry = (self.c_db_name +"."+ self.c_table_name, entry["News Company"], entry["Politician Name"], entry["Article URL"], entry["Article Title"], entry["Article Img URL"],  entry["Keywords"][0], \
                            entry["Keywords"][1], entry["Keywords"][2], entry["Keywords"][3], entry["Keywords"][4], \
                            entry["Keywords"][5], entry["Keywords"][6],   entry["Keywords"][7],  entry["Keywords"][8], \
                            entry["Keywords"][9], date_added )
        self.c_query = "INSERT INTO %s (NewsCompany, Politician, ArticleURL, Title, ArticleImgURL, Keyword_1, Keyword_2, Keyword_3, \
                                        Keyword_4, Keyword_5, Keyword_6, Keyword_7, Bigram_1, Bigram_2, Bigram_3, DateAdded) \
                                        VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');" % formatted_entry 
        print(self.c_query)
        rows = None
        
        self.commit_query_return_cursor(self.c_query)
        # try:
            # cursor = self.c_cnxn.cursor()
            # cursor.execute(self.c_query)
            # self.c_cnxn.commit()
        # except pyodbc.OperationalError as e:
            # print(str(e))
            # # Reset connection in case it failed
            # self.set_up_connection()
            # # Retry commit
            # cursor = self.c_cnxn.cursor()
            # cursor.execute(self.c_query)
            # self.c_cnxn.commit()


    
    def remove_prefix(self, text, prefix):
        if text.startswith(prefix):
            return text[len(prefix):]
        
        else:
            return text
            
    # Returns profile info when provided specific
    # state, role, and district
    def retrieve_entry(self, url):
        url = self.remove_prefix(url, "http://")
        url = self.remove_prefix(url, "https://")
        condition = (self.c_table_name, url)
        command = "SELECT * from %s WHERE ArticleURL LIKE '%%%s%%'" %condition
        
        # Commit the command
        cursor = self.commit_query_return_cursor(command)
        row_response = cursor.fetchall()
        
        # cursor = self.c_cnxn.cursor()
        # cursor.execute(command)
        
        return row_response    
        
        
    
    # Returns profile info when provided specific
    # state, role, and district
    def retrieve_entry_by_subject(self, subject_list, news_company=""):
        
        tuple_list = [self.c_table_name, news_company]
        for subject in subject_list:    
            tuple_list.append(subject)
        # Just append the rest with the first subject
        for i in range(len(subject_list), 7):
            tuple_list.append(subject_list[0])
        
        condition = tuple(tuple_list)
        
        command = "SELECT ArticleURL from %s WHERE NewsCompany like '%%%s%%' AND (Keyword_1 like '%%%s%%' OR  Keyword_2 like '%%%s%%' OR  Keyword_3 like '%%%s%%' OR  Keyword_4 like '%%%s%%' OR  Keyword_5 like '%%%s%%' OR Keyword_6 like '%%%s%%' OR  Keyword_7 like '%%%s%%')" % condition
        
        
        
        cursor = self.commit_query_return_cursor(command)
        row_response = cursor.fetchall()
        # cursor = self.c_cnxn.cursor()
        # cursor.execute(command)
        
        return row_response    

# dbStorer = NewsDBStorer()
# dbStorer.set_up_connection()
# dbStorer.pull_query()

# dbStorer.retrieve_entry_by_subject(subject_list=["trump"], news_company='fox_news')
# newdb = NewsDBStorer()
# newdb.set_up_connection()
# newdb.retrieve_entry("https://www.foxnewds.com/us/we-build-wall-starts-construction-border-texas")


# --------------EXAMPLES--------------
# cursor.execute("INSERT INTO polyTestTable (testID, testID2) VALUES (3, 2)")   
# cnxn.commit()
# cursor.execute("SELECT testID2 FROM polyTestTable")

# ------------------------------------
# cursor.execute("SELECT * FROM polyTestTable")
