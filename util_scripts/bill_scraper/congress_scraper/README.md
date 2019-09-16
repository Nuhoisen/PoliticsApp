
# Congress scraper

## Consists of two python scripts that perform congressional bill duties

## analyze_bills.py : Opens each and every bill flagged by 'grab_subject.sh' , and looks for keywording. 
## Analyzes the parties of all co-sponsors involved and forms gives the bill a conservative-democrate rating.

## iterate_grab_topic.py :  iterates through all categories execute script 'grab_subject.sh' . grab_subject.sh should 
## perform a grep, searching for bills nested, that contain specified subject's keywords. 


## subject_lists directory : contains text files for each subject, that contain and/or conditioned keywords, that find bills for that subject.

## path_lists directory: contains text files holding the paths to the bills, believed to contain pain-points relating to each specified subject. Used by analyze_bills.py
