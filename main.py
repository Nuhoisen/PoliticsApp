from scraper.poly_scraper import PolyScraper

url = "https://ballotpedia.org/Dallas_Heard"#"https://ballotpedia.org/William_Cook_(North_Carolina)"

thatcher = PolyScraper()
thatcher.retrieve_webpage(url)
thatcher.retrieve_committees()