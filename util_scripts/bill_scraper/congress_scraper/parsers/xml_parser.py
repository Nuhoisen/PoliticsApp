
import xml.etree.ElementTree as ET

# FOR STRIPPING HTML Text
from html.parser import HTMLParser

class MLStripper(HTMLParser):
    def __init__(self):
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.fed = []
    def handle_data(self, d):
        self.fed.append(d)
    def get_data(self):
        return ''.join(self.fed)
# ------------------------

class XMLParser:

    def __init__(self, endorcement_threashold=5):
        self.path = ""
        self.content = ""
        self.content_file_path = ""
        self.endorcement_threashold = endorcement_threashold
        self.partisan_index = 0
        self.total_cosponsors = 0
        self.partisan_decimal = 0
        
    def get_content(self):
        return self.content

    def get_content_file_path(self):
        return self.content_file_path

    def get_partisan_index(self):
        return self.partisan_index


    def get_partisan_decimal(self):
        return self.partisan_decimal

    def parse_file(self, path):
        self.path=path

        tree  = ET.parse(self.path)
        root = tree.getroot()
        # Co-sponsors apparently only show up in the 
        # status xml
        self.partisan_index = 0
        self.total_cosponsors = 0
        for cosponsors in root.iter('cosponsors'):
            for cosponsor in cosponsors.iter('item'):
                name = cosponsor.find("fullName").text
                party = cosponsor.find("party").text
                
                # print(name)
                # print(party)

                if 'd' in party.lower():
                    self.partisan_index += 1
                elif 'r' in party.lower():
                    self.partisan_index -= 1

                # Increment total cosponsors regardless    
                self.total_cosponsors += 1
        
        print(self.partisan_index)
        # At this point we have a solid impression of the bill status, if there
        # are a certain number of politicians for it.
        # Open the bill.
        # The bill will be located in the same path as the status bill.
        try:
            self.partisan_decimal = self.partisan_index/self.total_cosponsors
            
                
                
            if abs(self.partisan_index) > self.endorcement_threashold and abs(self.partisan_decimal) > .8 :
                # If there are more than 10 policitians voting in favor for something
                directory_path = self.path.split("/")
                # Strip the path
                directory_path = self.path.rstrip(directory_path[-1])
                directory_path += "data.xml"
                
                try:
                    # Try to open the file, if it succeeds, than proceed to dump the path (Essentially an assert statement)
                    bill_tree  = ET.parse(directory_path.strip())
                    
                    # CONTENT File Path set here
                    self.content_file_path = directory_path
                    
                    # CONTENT SET Here
                    self.content = bill_tree.find("summary").text
                    
                    return True
                
                # NOW, if the sponsor text, didn't have an associated data bill
                # Try to traverse it and find any potential data.
                except FileNotFoundError as e:
                    print("No corresponding data bill exists")
                    self.content_file_path = path
                    for summary in root.iter('summaries'):
                        for fs_status_text in summary.iter('text'):
                            s = MLStripper()
                            s.feed(fs_status_text.text)
                            self.content = s.get_data()
                            
                            # Write to file : FUNCTION CALL 
                
                        return True
                
            else:
                return False
        except ZeroDivisionError :
            pass

