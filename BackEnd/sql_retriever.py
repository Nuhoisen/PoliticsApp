import pyodbc

class SqlRetriever:

    c_query = None
    c_table_name = None
    c_db_name = None
    
    
    # CONSTRUCTOR
    def __init__(self, db_name="PoliticianInfo", table_name = "test"):
        self.c_query = ""
        self.c_table_name = table_name
        self.c_db_name = db_name         
        self.c_cnxn = None
                 
    # Connection SETUP
    def set_up_connection(self):
        command  = "DRIVER={MySQL ODBC 8.0 Driver};" \
                    "SERVER=localhost;" \
                    "DATABASE=%s;" \
                    "Trusted_Connection=yes;" \
                    "UID=root;" \
                    "PWD=sqlPW123!" % self.c_db_name


#        command = "Login Prompt=False; \
#                   User ID=root; \
#                   Password=root; \
#                   Data Source=localhost; \
#                   Database=test; \
#                   CHARSET=UTF8; "
	#pyodbc.connect('DRIVER={MySQL}; DATABASE=test; SOCKET=/var/lib/mysql/mysql.sock')
        self.c_cnxn = pyodbc.connect(command)
        self.c_cnxn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-8')
#        c_cnxn.setdecoding(encoding='uft-8')


    # Table CREATION
    # def create_table(self):
        # command = "CREATE TABLE %s ( Id int, \
                                    # Name varchar(255), \
                                    # State varchar(255), \
                                    # Role varchar(255), \
                                    # District varchar(255), \
                                    # FollowMoneyURL varchar(255), \
                                    # BallotpediaURL varchar(255), \
                                    # BillTrackURL varchar(255), \
                                    # ImageURL varchar(255) );" % self.c_table_name
        # cursor = self.c_cnxn.cursor()
        # try:
            # cursor.execute(command)
            # self.c_cnxn.commit()
        # except Exception:
            # print("Table: %s exists"% self.c_table_name)
            
    
    
    # ADD ENTRY
    # def add_formatted_entry(self, entry):
        # formatted_entry = (self.c_table_name, entry["Id"], entry["Name"], entry["State"], \
                            # entry["Role"], entry["District"], entry["FollowMoneyURL"], entry["BallotpediaURL"], \
                            # entry["BillTrackURL"], entry["ImageURL"] \
                            # )
        # self.c_query = "INSERT INTO %s (Id, Name, State, Role, District, FollowMoneyURL, BallotpediaURL, BillTrackURL, ImageURL) \
                        # VALUES (%d, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');" % formatted_entry 
        # print(self.c_query)      
        # cursor = self.c_cnxn.cursor()
        # cursor.execute(self.c_query)
        # self.c_cnxn.commit()

        
        
    def retrieve_senators_img_url(self, state, role):
        condition = ( self.c_table_name, state, role )
        command = "SELECT ImageURL from %s WHERE State='%s' AND Role='%s'" %condition
        print(command)
        cursor = self.c_cnxn.cursor()
        response = cursor.execute(command)
        
        str_response = ""
        
        for row in response:
            str_response = str_response + row[0] + ","
        str_response = str_response.strip(',')
        return str_response
        
    
    def retrieve_state_politician_img_url(self, state, role, district):
        print(district)
        condition = (self.c_table_name, state, role, district)
        command = "SELECT ImageURL from %s WHERE State='%s' AND Role='%s' AND District='%s'" %condition
        print(command)
        cursor = self.c_cnxn.cursor()
        response = cursor.execute(command)
        
        str_response = ""
        
        for row in response:
            str_response = str_response + row[0] + ","
        str_response = str_response.strip(',')
        
        print(str_response)
        return str_response
    
  
    # Returns profile info when provided specific
    # state, role, and district
    def retrieve_politician_profile(self, state, role, district):
        condition = (self.c_table_name, state, role, district)
        command = "SELECT * from %s WHERE State='%s' AND Role='%s' AND District='%s'" %condition
        cursor = self.c_cnxn.cursor()
        cursor.execute(command)
        row_response = cursor.fetchall()
        
        return row_response
        
    def retrieve_wildcard(self, query):
        condition = (self.c_table_name, query)
        
        command = "SELECT * from " + self.c_table_name +" \
                    WHERE Name LIKE '" + query +"%' \
                    OR Name LIKE '% "  + query +"%' \
                    OR District LIKE '% " + query + "%' LIMIT 200"
        cursor = self.c_cnxn.cursor()
        cursor.execute(command)
        row_response = cursor.fetchall()
  
  
        return row_response

        
    def retrieve_state_partisanships(self, query):
        command = "SELECT State, PartyAffiliation from " + self.c_table_name +" \
                    WHERE Role LIKE 'US Senator'"
        cursor = self.c_cnxn.cursor()
        cursor.execute(command)
        row_response = cursor.fetchall()
        for row in row_response:
            print(row)
        return row_response
        
    def retrieve_related_articles(self, politician_name, news_company=""):
        # tuple_list = [self.c_table_name, news_company]

        
        condition = (self.c_table_name, politician_name)
        
        # command = "SELECT ArticleURL from %s WHERE NewsCompany like '%%%s%%' AND (Keyword_1 like '%%%s%%' OR  Keyword_2 like '%%%s%%' OR  Keyword_3 like '%%%s%%' OR  Keyword_4 like '%%%s%%' OR  Keyword_5 like '%%%s%%' OR Keyword_6 like '%%%s%%' OR  Keyword_7 like '%%%s%%')" % condition
        command = "SELECT * from %s WHERE (Politician like '%s' )" % condition
        
        cursor = self.c_cnxn.cursor()
        cursor.execute(command)
        row_response = cursor.fetchall()
        print(row_response)
        return row_response    
    
       # Returns profile info when provided specific
    # state, role, and district
    # def retrieve_related_articles(self, subject_list, news_company=""):
        # print(subject_list)
        # # tuple_list = [self.c_table_name, news_company]
        # tuple_list = [self.c_table_name]
        # for subject in subject_list:    
            # tuple_list.append(subject)
        # # Just append the rest with the first subject
        # for i in range(len(subject_list), 7):
            # tuple_list.append(subject_list[0])
        
        # condition = tuple(tuple_list)
        
        # # command = "SELECT ArticleURL from %s WHERE NewsCompany like '%%%s%%' AND (Keyword_1 like '%%%s%%' OR  Keyword_2 like '%%%s%%' OR  Keyword_3 like '%%%s%%' OR  Keyword_4 like '%%%s%%' OR  Keyword_5 like '%%%s%%' OR Keyword_6 like '%%%s%%' OR  Keyword_7 like '%%%s%%')" % condition
        # command = "SELECT * from %s WHERE (Keyword_1 like '%%%s%%' OR  Keyword_2 like '%%%s%%' OR  Keyword_3 like '%%%s%%' OR  Keyword_4 like '%%%s%%' OR  Keyword_5 like '%%%s%%' OR Keyword_6 like '%%%s%%' OR  Keyword_7 like '%%%s%%')" % condition
        
        # cursor = self.c_cnxn.cursor()
        # cursor.execute(command)
        # row_response = cursor.fetchall()
        # return row_response
        
  
