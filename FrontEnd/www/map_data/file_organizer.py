import os
import shutil

target_path = "./states/"
src_path = "./districts-gh-pages/states/"

for dir_name in os.listdir(target_path):
    src = src_path + dir_name + "/sldl/topo_simple.json"
    target = target_path+dir_name+"/state_house/"
    try:
        shutil.copy(src, target)
    except FileNotFoundError:
        continue
    
    