# vote_smart_collector.py

## runs through existing politician database
## looking for politicians without existing vote smart IDs
##

## Politicians are searched for in the votesmart api database,
## Using following url:
## "http://api.votesmart.org/Candidates.getByOfficeTypeState?key=9125e6afe9e4b86c1dd87da7f889e7b9&o=JSON&officeTypeId=L&stateId=AK&electionYear=2018"
## Searches for legistlators from alaska in 2018


## Performs a name comparison, then a district comparison,
## and InOffice check

## If all three pass, then the VoteSmart ID is pulled and the Politicians 
## Row entry is updated
