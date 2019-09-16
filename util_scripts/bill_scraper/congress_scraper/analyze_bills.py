import os 
import xml.etree.ElementTree as ET

command = "sh grab_topic.sh "


subject_list = ["abortion", "guns" ]

pro_choice_index = 0
total_cosponsors = 0

for subject in subject_list:
    with open("path_lists/" + subject + ".txt") as fp:
        content = fp.readlines()
        for path in content:
                print(path)
                tree  = ET.parse(path.strip())
                root = tree.getroot()
                for bill_text in root.iter('summaries'):
                    print(bill_text)
                
                for cosponsors in root.iter('cosponsors'):
                        for cosponsor in cosponsors.iter('item'):
                            name = cosponsor.find("fullName").text
                            party = cosponsor.find("party").text
                            
                            # print(name)
                            # print(party)

                            if 'd' in party.lower():
                                pro_choice_index += 1
                            elif 'r' in party.lower():
                                pro_choice_index -= 1

                            # Increment total cosponsors regardless    
                            total_cosponsors += 1
                        try:
                            print("Percentage: {0} , total: {1}".format((pro_choice_index/total_cosponsors), pro_choice_index ) )
                            
                        except ZeroDivisionError :
                            continue
                        pro_choice_index = 0
                        total_cosponsors = 0
                    