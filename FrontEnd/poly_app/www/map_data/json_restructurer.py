import copy
import json
import os

head_dir = "./us_house_borders/"


new_json = {}
count_ind = 0
for subdir, dirs, filenames in os.walk(head_dir):
    try:
        t_filename = subdir+ "/" + filenames[0]

        with open(t_filename) as congr_file:
            congr_json = json.load(congr_file)
            new_json = copy.deepcopy(congr_json)
            new_json['objects'] = {"combined":{ "geometries":[] , "type": "GeometryCollection" }}
            print(new_json['objects'])
            for key in congr_json['objects']:
                
                
                tar_dict = congr_json['objects'][key]['geometries'][0]
                print(tar_dict)
                new_json['objects']['combined']['geometries'].append(tar_dict)
                count_ind+=1
            
        with open(subdir + "/update-"+filenames[0], 'w') as dummyfile:
            json.dump(new_json, dummyfile)
        
        new_json={}
    except IndexError:
        continue

        # break
    
            
            
    
    
    
