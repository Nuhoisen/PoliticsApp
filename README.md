### BACK END
## CONDA INSTRUCTIONS
# This environement was created using conda:
conda create --name poly_scraper

# This environement uses scrapy
conda install -n poly_scraper scrapy

# Activate this environement
conda activate poly_scraper

## SCRAPY INSTRUCTIONS


## SQL ACCESS
# Must specify the proper driver for SQL server. It is:
{ODBC Driver 13 for SQL Server}

#For more info see: https://github.com/mkleehammer/pyodbc/wiki/Connecting-to-SQL-Server-from-Windows


### FRONT END
## CORDOVA INSTRUCTIONS
# To create Cordova environment
cordova create poly_frontend

# Add supported platforms
cordova add ios
cordova add android

# Now copy  PoliticsApp/FrontEnd/www/* over to PoliticsApp/FrontEnd/poly_frontend/www

# To run
cordova run android
cordova run ios




