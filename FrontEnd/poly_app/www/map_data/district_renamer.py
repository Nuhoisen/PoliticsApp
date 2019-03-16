import os
import subprocess

from sql_renamer import SqlStorer

def rename_house_topo_json():
    for state_name in os.listdir("./congressional_borders_backup/"):
        print(state_name)
        try:
            f = open("./congressional_borders_backup/"+ state_name +"/state_house/topo_simple.json", 'r')
            contents = f.read()
            f.close()
            contents = contents.replace("State House District", state_name + " House District")

            
            f = open("./congressional_borders_backup/"+ state_name +"/state_house/topo_simple.json", "w+")
            f.write(contents)
            f.close()
        except FileNotFoundError:
            continue
def rename_senate_topo_json():        
    for state_name in os.listdir("./congressional_borders_backup/"):
        print(state_name)
        try:
            f = open("./congressional_borders_backup/"+ state_name +"/state_senate/topo_simple.json", 'r')
            contents = f.read()
            f.close()
            contents = contents.replace("State Senate District", state_name + " Senate District")

            
            f = open("./congressional_borders_backup/"+ state_name +"/state_senate/topo_simple.json", "w+")
            f.write(contents)
            f.close()
        except FileNotFoundError:
            continue
        
        
def rename_house_sql():      
    for state_name in os.listdir("./congressional_borders/"):
        sql_store = SqlStorer()        

        sql_store.set_up_connection()
        sql_store.rename_house_districts(state_name)     

def rename_senate_sql():      
    for state_name in os.listdir("./congressional_borders/"):
        sql_store = SqlStorer()        

        sql_store.set_up_connection()
        sql_store.rename_senate_districts(state_name)          

def rename_assembly_sql():      
    for state_name in os.listdir("./congressional_borders_backup/"):
        sql_store = SqlStorer()        

        sql_store.set_up_connection()
        sql_store.rename_assembly_districts(state_name)           
        
rename_house_sql()        
# for subdir, dirs, filenames in os.walk("./congressional_borders_backup/"):
    # print(subdir)
    