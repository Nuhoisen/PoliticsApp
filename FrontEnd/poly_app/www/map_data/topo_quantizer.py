import os
import subprocess

for subdir, dirs, filenames in os.walk("./states/"):
    if(subdir.endswith("sldl")):
        input_file = subdir + "/topo_combine.json"
        output_file = subdir  + "/topo_simple.json"
        command = "toposimplify -p .00001 <" + input_file + " > " + output_file 
        print(command)
        os.system(command)
        
        