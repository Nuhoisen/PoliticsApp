### BACK END
## CONDA INSTRUCTIONS
# This environement was created using conda:
conda create --name poly_scraper

# This environement uses scrapy
conda install -n poly_scraper scrapy

# Activate this environement
conda activate poly_scraper

## SCRAPY INSTRUCTIONS



### FRONT END
## CORDOVA INSTRUCTIONS
# To create Cordova environment
cordova create poly_frontend

#Add supported platforms
cordova add ios
cordova add android

# Now copy  PoliticsApp/FrontEnd/www/* over to PoliticsApp/FrontEnd/poly_frontend/www

# To run
cordova run android
cordova run ios