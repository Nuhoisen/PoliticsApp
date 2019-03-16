import json
import os

combined_json = {
    "type": "FeatureCollection",
    "features": []
}

for subdir, dirs, filenames in os.walk("./states/"):
    if(subdir.endswith("sldu")):
        print(subdir)
        for geo_file in os.listdir(subdir):
            if(geo_file.endswith(".geojson")):
                with open(subdir+ "\\" + geo_file) as f:
                    data = json.load(f)
                    combined_json['features'].append(data)
            
        with open((subdir + "\\" + "combined.json"), 'w') as outfile:
            json.dump(combined_json, outfile)
            print("Dumped " +  subdir)

        combined_json = {
            "type": "FeatureCollection",
            "features": []
        }
print("Dumping Data")            
