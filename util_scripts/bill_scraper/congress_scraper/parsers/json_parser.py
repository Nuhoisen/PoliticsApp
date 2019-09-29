import json
from parsers.sql_storer import SqlStorer

class JSONParser:

    def __init__(self, endorcement_threashold=5):
        # Path Information
        self.path = ""
        self.content = ""
        self.content_file_path = ""
        self.endorcement_threashold = endorcement_threashold
        self.partisan_index = 0
        self.total_cosponsors = 0
        self.partisan_decimal = 0
        

        # SQL Storer
        self.bill_sql_storer = SqlStorer()
        self.bill_sql_storer.set_up_connection()
        
        # SQL Query for wildcards
        self.query = {}
        
    def get_content(self):
        return self.content


    def get_content_file_path(self):
        return self.content_file_path

    def get_partisan_index(self):
        return self.partisan_index


    def get_partisan_decimal(self):
        return self.partisan_decimal

    def add_to_query(self, key, value, dict_struct=None):
        if dict_struct: 
            try:
                self.query[key] = dict_struct[value]
            except KeyError as e:
                return False
        else:
            self.query[key] = value
        return True
        
    def parse_name(self, unparsed_name):
        name = unparsed_name.split(',')[1]  + "%" + unparsed_name.split(',')[0]  
        name = name.strip()
        return name
        
        
    def extract_billtext(self, content):
        try:
            self.content  = content["summary"]["text"]
            
        except KeyError:            
            print("Unable to find bill content. Path: %s"  % self.path)
            try:
                self.content = content["description"]
            except KeyError:
                print("ONCE AGAIN: Unable to find bill content. Path: %s" % self.path)
            
        
    def parse_file(self, path):
        self.content_file_path = path
        self.path = path
        self.query = {}
        

        with open(self.path, 'r') as fp:
            file_content = json.load(fp)

            try:
                # Save file content
                self.extract_billtext(file_content)
                
                co_sponsors = file_content["cosponsors"]
                
                self.partisan_index = 0
                self.total_cosponsors = 0
                self.partisan_decimal = 0
                for co_sponsor in co_sponsors:
                    self.query.clear()
                    self.add_to_query( "BioguideID", "bioguide_id", co_sponsor ) 
                    self.add_to_query( "ThomasID", "thomas_id", co_sponsor ) 
                           
                    # print(self.query)
                    res = self.bill_sql_storer.retrieve_by_wildcard_or(self.query)
                    
                    # If not a response, then do a search via name
                    if not res:
                        self.query.clear()
                        name = self.parse_name(co_sponsor["name"])
                        self.add_to_query("Name", name)
                        res = self.bill_sql_storer.retrieve_by_wildcard_or(self.query)

                    # Check res, look at the party affiliation.
                    if res:
                        for row in res:
                            # For some reason there are duplicates in the database, where one party is NULL
                            # This work around will have to work for now.
                            if row.PartyAffiliation:
                                party = row.PartyAffiliation
                                if 'd' in party.lower():
                                    self.partisan_index += 1
                                elif 'r' in party.lower():
                                    self.partisan_index -= 1
                                break
                    self.total_cosponsors += 1
                try:
                    self.partisan_decimal = self.partisan_index/self.total_cosponsors
                    
                    if ( abs(self.partisan_index) > self.endorcement_threashold ) and ( abs(self.partisan_decimal) > .8 ):
                        # print("Partisan index for bill: %d, Partisan decimal: %f " % (self.partisan_index, self.partisan_decimal))
                        return True
                        
                except ZeroDivisionError as e:
                    pass

                self.partisan_index = 0
            except KeyError as e:
                pass
       
        return False
