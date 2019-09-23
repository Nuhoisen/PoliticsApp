import os 
import json

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




# XML Parsing
from parsers.xml_parser import XMLParser
xml_bills_parser = XMLParser()



# Subject List
subject_list = ["abortion"]#, "guns" ]


pro_choice_index = 0
total_cosponsors = 0


# Current directory, system agnostic
CURRENT_DIR = os.getcwd().replace("\\", "/") + "/"

ENDORSEMENT_THRESHHOLD = 5

full_fp = open("bill_label_lists/abortion_data_labels_full_path.txt", 'w')
rel_fp  = open("bill_label_lists/abortion_data_labels_rel_path.txt", 'w')



testpath = "./congress/data/115/bills/sres/sres15/data.json"
def write_path_to_file(f_path, partisan_index, fp):
        rating = 0
        # If positive, assign 1 label
        if (partisan_index > 0):
            rating = 1
        # else negative (pro-choice), assign 0 label
        else:
            rating = 0
        
        rel_string = f_path + " , " + str(rating) + "\n"
        print(rel_string)
        fp.write(rel_string)
        



for subject in subject_list:
    with open("path_lists/" + subject + ".txt") as fp:
        content = fp.readlines()
        for path in content:
        
            path=path.strip()
            if(path.endswith(".xml")):
                if(xml_bills_parser.parse_file(path)):
                    content_file_path = xml_bills_parser.get_content_file_path()
                    
                    if(xml_bills_parser.get_partisan_index()  > 0 ):
                        write_path_to_file(content_file_path, 1, rel_fp)
                        write_path_to_file(CURRENT_DIR+ content_file_path, 1, full_fp)
                    else:
                        write_path_to_file(content_file_path, 0, rel_fp)
                        write_path_to_file(CURRENT_DIR+ content_file_path, 0, full_fp)
                    
            elif(path.endswith(".json")):
                with open(path, 'r') as json_fp:
                    try:
                        json_data = json.load(json_fp)
                        if json_data['subjects']:
                            print(json_data['summary']['text'])
                        
                    except KeyError as e:
                        
                        print("keyerror")
                        continue
                # print(xml_bills_parser.get_content())
                # # print(path)
                
                # # open file at path
                # tree  = ET.parse(path)
                # root = tree.getroot()

                # # Co-sponsors apparently only show up in the 
                # # status xml
                # for cosponsors in root.iter('cosponsors'):
                        # for cosponsor in cosponsors.iter('item'):
                            # name = cosponsor.find("fullName").text
                            # party = cosponsor.find("party").text
                            
                            # # print(name)
                            # # print(party)

                            # if 'd' in party.lower():
                                # pro_choice_index += 1
                            # elif 'r' in party.lower():
                                # pro_choice_index -= 1

                            # # Increment total cosponsors regardless    
                            # total_cosponsors += 1
                        
                        # # At this point we have a solid impression of the bill status, if there
                        # # are a certain number of politicians for it.
                        # # Open the bill.
                        # # The bill will be located in the same path as the status bill.
                        # try:
                        
                            # partisan_decimal = pro_choice_index/total_cosponsors
                            
                            # if abs(pro_choice_index) > ENDORSEMENT_THRESHHOLD and abs(partisan_decimal) > .8 :
                                # # If there are more than 10 policitians voting in favor for something
                                # directory_path = path.split("/")
                                # # Strip the path
                                # directory_path = path.rstrip(directory_path[-1])
                                # directory_path += "data.xml"
                                
                                # try:
                                    # # Try to open the file, if it succeeds, than proceed to dump the path (Essentially an assert statement)
                                    # bill_tree  = ET.parse(directory_path.strip())
                                    
                                    
                                    # rating = 0
                                    # # If positive, assign 1 label
                                    # if (pro_choice_index > 0):
                                        # rating = 1
                                    # # else negative (pro-choice), assign 0 label
                                    # else:
                                        # rating = 0
                                    
                                    # # Write to file : FUNCTION CALL
                                    # write_path_to_file(directory_path, pro_choice_index, rel_fp)
                                    # write_path_to_file(CURRENT_DIR+directory_path, pro_choice_index, full_fp)
                                    
                                    # # rel_string = directory_path + " , " + str(rating) + "\n"
                                    
                                    # # rel_fp.write(rel_string)
                                    
                                    # # full_string = CURRENT_DIR + directory_path + " , " + str(rating) + "\n"
                                    
                                    # # full_fp.write(full_string)
                                    
                                    
                                    
                                    
                                    
                                # # NOW, if the sponsor text, didn't have an associated data bill
                                # # Try to traverse it and find any potential data.
                                # except FileNotFoundError as e:
                                    # print("No corresponding data bill exists")
                                    # print(path)
                                    # for summary in root.iter('summaries'):
                                        # for fs_status_text in summary.iter('text'):
                                            # s = MLStripper()
                                            # s.feed(fs_status_text.text)
                                            # res_text = s.get_data()
                                            # print(res_text)
                                            # # Write to file : FUNCTION CALL
                                            # write_path_to_file(path, pro_choice_index, rel_fp)
                                            # write_path_to_file(CURRENT_DIR+path, pro_choice_index, full_fp)
                                            
                                            
                                # # print("Percentage: {0} , total: {1}".format((partisan_decimal), pro_choice_index ) )
                            
                        # except ZeroDivisionError :
                            # continue
                        # pro_choice_index = 0
                        # total_cosponsors = 0
                    
    break
    
    

        
        
full_fp.close()
rel_fp.close()