import pyodbc




class SqlStorer:

    c_cnxn = None
    c_query = None
    c_table_name = None
    c_db_name = None
    
    # CONSTRUCTOR
    def __init__(self, db_name="PoliticianInfo", table_name = "TestPoliticianTable"):
        self.c_query = ""
        self.c_table_name = table_name
        self.c_db_name = db_name

    def set_up_connection(self):
        command  = "DRIVER={ODBC Driver 13 for SQL Server};" \
                    "SERVER=ANDROIDPHONE\POLY_SQLEXPRESS;" \
                    "DATABASE=%s;" \
                    "Trusted_Connection=yes;" \
                    "UID=ANDROIDPHONE\Kelly" \
                    "PWD=microsoftSucks123!" % self.c_db_name
        self.c_cnxn = pyodbc.connect(command)
        
        
    def insert_entries(self, state, role):
        formatted_entry = (self.c_table_name, state,role)
        command = "INSERT INTO %s (State, Role) VALUES ('%s', '%s')" % formatted_entry
        cursor = self.c_cnxn.cursor()
        cursor.execute(command)
        self.c_cnxn.commit()

#Kansas US Senate        
    def rename_states(self):
        ren_cmd = "UPDATE TestPoliticianTable SET State='North Carolina' where Role LIKE 'North Carolina%'"
        cursor = self.c_cnxn.cursor()
        response = cursor.execute(ren_cmd)
        self.c_cnxn.commit()
        
        
    def rename_house_districts(self, state):
        cmd = "SELECT District FROM [PoliticianInfo].[dbo].[PoliticianTable] WHERE State='"+ state + "' AND District LIKE'"+state+" House District 0%'"
        print(cmd)
        cursor = self.c_cnxn.cursor()
        response = cursor.execute(cmd).fetchall()
        
        
        for line in response:
            line = line[0]
            old_district = line
            
            number = line.split("District")[1]
            number = number[2:]
            
            new_district = state +" House District " + number
            # print(old_district)
            # print(new_district)
            
            cmd = "UPDATE PoliticianTable SET District='%s' where State='%s' AND District='%s'" % (new_district, state, old_district)
            print(cmd)
            cursor = self.c_cnxn.cursor()
            cursor.execute(cmd)
            self.c_cnxn.commit()
            
    def rename_senate_districts(self, state):
            cmd = "SELECT District FROM [PoliticianInfo].[dbo].[PoliticianTable] WHERE State='"+ state + "' AND District LIKE'"+state+" Senate District 0%'"
            print(cmd)
            cursor = self.c_cnxn.cursor()
            response = cursor.execute(cmd).fetchall()
            
            
            for line in response:
                line = line[0]
                old_district = line
                
                number = line.split("District")[1]
                number = number[2:]
                
                new_district = state +" Senate District " + number
                # print(old_district)
                # print(new_district)
                
                cmd = "UPDATE PoliticianTable SET District='%s' where State='%s' AND District='%s'" % (new_district, state, old_district)
                print(cmd)            
        
        
sql_store = SqlStorer()        

sql_store.set_up_connection()
sql_store.rename_house_districts("Alabama")

# sql_store.insert_entries("North",  "North Carolina US Senate")
# sql_store.insert_entries("North",  "North Carolina District")
# sql_store.insert_entries("North",  "North Carolina Senate District")
# sql_store.insert_entries("North",  "North Carolina House District Senate")


