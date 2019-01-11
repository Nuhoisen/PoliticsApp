import os
import subprocess

for subdir, dirs, filenames in os.walk("./states/"):
    if(subdir.endswith("sldl")):
        input_file = subdir  + "/combined.json"
        output_file = subdir + "/topo_combine.json"
        
        os.system("geo2topo " + input_file + " > " + output_file )
        
        