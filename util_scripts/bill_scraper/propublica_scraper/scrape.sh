#!/bin/sh


path="congress/data/""$1""/bills/""$2""/""$2""$3""/"


mkdir -p $path 

curl "https://api.propublica.org/congress/v1/"$1"/bills/"$2""$3".json" \
  -H "X-API-Key: "$4"" \
  > "$path"/data.json
