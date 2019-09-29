import pyodbc


class SqlStorer:

    c_cnxn = None
    c_query = None
    c_table_name = None
    c_db_name = None
    
    
    # CONSTRUCTOR
    def __init__(self, db_name="PoliticianInfo", table_name = "politiciantable"):
        self.c_query = ""
        self.c_table_name = table_name
        self.c_db_name = db_name
                 
                 
    # Connection SETUP
    def set_up_connection(self):
        command  =  "DRIVER={MySQL ODBC 8.0 Driver};" \
                    "SERVER=localhost;" \
                    "DATABASE=%s;" \
                    "Trusted_Connection=yes;" \
                    "UID=root;" \
                    "PWD=sqlPW123!" % self.c_db_name
        self.c_cnxn = pyodbc.connect(command)
        # self.c_cnxn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-8')
        self.c_cnxn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-16')

    # Table CREATION
    def create_table(self):
        command = "CREATE TABLE %s ( Id int, \
                                    Name varchar(255), \
                                    State varchar(255), \
                                    Role varchar(255), \
                                    District varchar(255), \
                                    FollowMoneyURL varchar(255), \
                                    BallotpediaURL varchar(255), \
                                    BillTrackURL varchar(255), \
                                    ImageURL varchar(255) );" % self.c_table_name
        cursor = self.c_cnxn.cursor()
        try:
            cursor.execute(command)
            self.c_cnxn.commit()
        except Exception:
            print("Table: %s exists"% self.c_table_name)
            
    # This function performs a wilcard search on database
    # Search conditions are provided in a dictioanry, where the column 
    # is the key, and the row_value is the dict value
    
    # Function returns none if the query fails
    def retrieve_by_wildcard_and(self, wildcard_dict):
        select_query = "SELECT * from %s where " % self.c_table_name
        count = 0
        for key,value in wildcard_dict.items():
            temp = "%s like '%%%s%%' " % (key, value) 
            select_query += temp
            count +=1 
            # If last condition in set, don't add an AND condition
            if(count == len(wildcard_dict)): 
                   break
            select_query += " AND " 


        self.c_query = select_query
        cursor = self.c_cnxn.cursor()
        res = cursor.execute(self.c_query)
        if cursor.rowcount == 0:
            return None
        return res
        
        
    # Function returns none if the query fails
    def retrieve_by_wildcard_or(self, wildcard_dict):
        select_query = "SELECT * from %s where " % self.c_table_name
        count = 0
        for key,value in wildcard_dict.items():
               temp = "%s like '%%%s%%' " % (key, value) 
               select_query += temp
               count +=1 
               # If last condition in set, don't add an AND condition
               if(count == len(wildcard_dict)): 
                       break
               select_query += " OR " 


        self.c_query = select_query
        cursor = self.c_cnxn.cursor()
        res = cursor.execute(self.c_query)
        if cursor.rowcount == 0:
            return None
        return res


    # Function returns none if the query fails
    def retrieve_by_null_value_wildcard(self, wildcard_dict):
        select_query = "SELECT * from %s where " % self.c_table_name
        count = 0
        for key,value in wildcard_dict.items():
               temp = "%s is NULL " % (key) #, value) 
               select_query += temp
               count +=1 
               # If last condition in set, don't add an AND condition
               if(count == len(wildcard_dict)): 
                       break
               select_query += " AND " 


        self.c_query = select_query
        cursor = self.c_cnxn.cursor()
        res = cursor.execute(self.c_query)
        if cursor.rowcount == 0:
            return None
        return res

        
    def add_wildcard_entry(self, wc_entry):
        # Update & Condition 
        column_query =  "INSERT INTO %s (" % self.c_table_name
        value_query = " VALUES(" 
        count= 0
        for key,value in wc_entry.items():
               column_query += key
               value_query = value_query + "'"+ value + "'"
               count +=1 
               # If last condition in set, don't add an AND condition
               if(count == len(wc_entry)): 
                       break
               column_query += ", " 
               value_query += ", " 

        column_query += " ) " 
        value_query += " ) " 
        final_query = column_query + value_query
        
        print(final_query)
        # Query
        self.c_query = final_query
        cursor = self.c_cnxn.cursor()
        res = cursor.execute(self.c_query)
        self.c_cnxn.commit()
        return res

    def add_wildcard_entry_by_wildcard_condition(self, wc_entry, wc_condition):
        # Update & Condition 
        update_query = "UPDATE %s " % self.c_table_name
        condition_query  = " WHERE "
        # Entry
        entry = " SET " 
        count= 0
        for key,value in wc_entry.items():
               temp = " %s='%s'" % (key, value) 
               entry += temp
               count +=1 
               # If last condition in set, don't add an AND condition
               if(count == len(wc_entry)): 
                       break
               entry += ", " 

        count= 0 
        for key,value in wc_condition.items():
               temp = "%s like '%%%s%%' " % (key, value) 
               condition_query += temp
               count +=1 

               # If last condition in set, don't add an AND condition
               if(count == len(wc_condition)): 
                       break
               condition_query += " AND " 
         
        print(update_query + entry + condition_query )
        final_query = update_query + entry + condition_query
        self.c_query = final_query
        cursor = self.c_cnxn.cursor()
        res = cursor.execute(self.c_query)
        self.c_cnxn.commit()
        return res

    # ADD ENTRY
    def add_formatted_entry(self, entry):
        formatted_entry = (self.c_table_name, entry["Id"], entry["Name"], entry["State"], \
                            entry["Role"], entry["District"], entry["FollowMoneyURL"], entry["BallotpediaURL"], \
                            entry["BillTrackURL"], entry["ImageURL"], entry["ThomasID"] \
                            )
        self.c_query = "INSERT INTO %s (Id, Name, State, Role, District, FollowMoneyURL, BallotpediaURL, BillTrackURL, ImageURL) \
                        VALUES (%d, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');" % formatted_entry 
        print(self.c_query)      
        cursor = self.c_cnxn.cursor()
        cursor.execute(self.c_query)
        self.c_cnxn.commit()

        
        
        
    def retrieve_billtrack_urls(self):
        formatted_entry = (self.c_table_name)
        self.c_query = "SELECT BillTrackURL FROM %s; " % formatted_entry
        
        cursor = self.c_cnxn.cursor()
        cursor.execute(self.c_query)
        rows = cursor.fetchall()

        return rows


    def retrieve_billtrack_urls_federal_politicans(self):
        formatted_entry = (self.c_table_name)
        self.c_query = "SELECT BillTrackURL FROM %s WHERE Role='US Representative' OR Role='US Senator'; " % formatted_entry
        
        cursor = self.c_cnxn.cursor()
        cursor.execute(self.c_query)
        rows = cursor.fetchall()

        return rows
        
    def update_with_social_media(self, entry):
        formatted_entry = (self.c_table_name,  entry['Twitter'], entry['Facebook'],entry['Email'], entry['BillTrack'] )
        self.c_query = "UPDATE %s SET TwitterURL = '%s', FacebookURL = '%s', EmailAddress = '%s' WHERE BillTrackURL = '%s'; " % formatted_entry
        print(self.c_query)
        cursor = self.c_cnxn.cursor()
        cursor.execute(self.c_query)
        self.c_cnxn.commit()
    
    def update_with_bio(self, entry):
        formatted_entry = (self.c_table_name,  entry['Bio'], entry['BillTrack'] )
        self.c_query = "UPDATE %s SET Bio = '%s' WHERE BillTrackURL = '%s'; " % formatted_entry
        print(self.c_query)
        cursor = self.c_cnxn.cursor()
        cursor.execute(self.c_query)
        self.c_cnxn.commit()

    def update_with_party(self, entry):
    
        formatted_entry = (self.c_table_name, entry['Party'], entry['BillTrack'] )
        self.c_query = "UPDATE %s SET PartyAffiliation = '%s' WHERE BillTrackURL = '%s'; " % formatted_entry
        print(self.c_query)
        cursor = self.c_cnxn.cursor()
        cursor.execute(self.c_query)
        self.c_cnxn.commit()
        
        
    def update_with_office_status(self, entry):
    
        formatted_entry = (self.c_table_name, entry['InOffice'], entry['BillTrack'] )
        self.c_query = "UPDATE %s SET InOffice = '%s' WHERE BillTrackURL = '%s'; " % formatted_entry
        print(self.c_query)
        cursor = self.c_cnxn.cursor()
        cursor.execute(self.c_query)
        self.c_cnxn.commit()
    
