
# Pro-publica scraper

##  Used for bills raning from mid ~1990s- ~2013 . 

## pull_bills.py : executes shell script that makes a wget api call to the pro-publica database.
## Database returns a json response, which is subsequently saved to the congress directory. 

## subject_lists directory : contains text files for each subject, that contain and/or conditioned keywords, that find bills for that subject.

## path_lists directory: contains text files holding the paths to the bills, believed to contain pain-points relating to each specified subject. Used by analyze_bills.py
