import os 
import xml.etree.ElementTree as ET

command = "sh grab_topic.sh "


subject_list = ["abortion", "guns" ]

pro_choice_index = 0


for subject in subject_list:
    os.system(command + subject)
