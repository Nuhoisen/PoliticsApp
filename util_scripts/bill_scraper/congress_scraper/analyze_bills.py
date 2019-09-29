import os 
import json
import pickle
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

#JSON Parsing
from parsers.json_parser import JSONParser
json_bills_parser = JSONParser()

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


# This list contains dictionary pairs, 
content_list  = []
temp_dict = { "label" : None,
              "content" :  None}
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
        

try:

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
                            write_path_to_file(CURRENT_DIR + content_file_path, 1, full_fp)
                            temp_dict["label"] = 1
                            
                        else:
                            write_path_to_file(content_file_path, 0, rel_fp)
                            write_path_to_file(CURRENT_DIR + content_file_path, 0, full_fp)
                            temp_dict["label"] = 0
                            
                        temp_dict["content"] = xml_bills_parser.get_content()
                        
                        
                        
                elif(path.endswith(".json")):
                    if(json_bills_parser.parse_file(path)):
                        content_file_path = json_bills_parser.get_content_file_path()
                        
                        if(json_bills_parser.get_partisan_index() > 0 ):
                            write_path_to_file(content_file_path, 1, rel_fp)
                            write_path_to_file(CURRENT_DIR + content_file_path, 1, full_fp)
                            temp_dict["label"] = 1
                        else:
                            write_path_to_file(content_file_path, 0, rel_fp)
                            write_path_to_file(CURRENT_DIR + content_file_path, 0, full_fp)
                            temp_dict["label"] = 0
                        
                        temp_dict["content"] = json_bills_parser.get_content()
                
                # Add the new dictionary entry
                content_list.append(temp_dict.copy())
                temp_dict.clear()
        break
        
        
except KeyboardInterrupt:
    print("Keyboard interrupt sensed")
    pass
    
# Executes no matter what    
finally:
    full_fp.close()
    rel_fp.close()
    with open("abortion_data_and_labels.pkl", 'wb') as fp_pkl:
        pickle.dump(content_list,fp_pkl)
        
    
