import pyodbc


class SqlStorer:

    c_cnxn = None
    c_query = None
    c_table_name = None
    c_db_name = None
    
    
    # CONSTRUCTOR
    def __init__(self, db_name="PoliticianInfo", table_name = "test"):
        self.c_query = ""
        self.c_table_name = table_name
        self.c_db_name = db_name
                 
                 
    # Connection SETUP
    def set_up_connection(self):
        command  = "DRIVER={ODBC Driver 13 for SQL Server};" \
                    "SERVER=ANDROIDPHONE\POLY_SQLEXPRESS;" \
                    "DATABASE=%s;" \
                    "Trusted_Connection=yes;" \
                    "UID=ANDROIDPHONE\Kelly" \
                    "PWD=microsoftSucks123!" % self.c_db_name
        self.c_cnxn = pyodbc.connect(command)
                      

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
        #try:
        cursor.execute(command)
        self.c_cnxn.commit()
        #except Exception:
            
         #   print("Table: %s exists"% self.c_table_name)
            
    
    
    # ADD ENTRY
    def add_formatted_entry(self, entry):
        formatted_entry = (self.c_table_name, entry["Id"], entry["Name"], entry["State"], \
                            entry["Role"], entry["District"], entry["FollowMoneyURL"], entry["BallotpediaURL"], \
                            entry["BillTrackURL"], entry["ImageURL"] \
                            )
        self.c_query = "INSERT INTO %s (Id, Name, State, Role, District, FollowMoneyURL, BallotpediaURL, BillTrackURL, ImageURL) \
                        VALUES (%d, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');" % formatted_entry 
        print(self.c_query)      
        cursor = self.c_cnxn.cursor()
        cursor.execute(self.c_query)
        self.c_cnxn.commit()

        
        

        
        
        
        
        
        
# --------------EXAMPLES--------------
# cursor.execute("INSERT INTO polyTestTable (testID, testID2) VALUES (3, 2)")   
# cnxn.commit()
# cursor.execute("SELECT testID2 FROM polyTestTable")

# ------------------------------------
# cursor.execute("SELECT * FROM polyTestTable")