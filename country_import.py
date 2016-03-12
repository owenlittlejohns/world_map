from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
import pandas as pd
import os, sys, json

def import_csv():
    """
    Read in the CSV file and input each row to MongoDB
    """
    # Read in the CSV file to a Pandas data frame
    country_df = pd.read_csv(input_folder + input_file)

    print(country_df.to_dict('records')[0:2])
    
    # Enter row by row into MongoDB
    mongo_db.countries.insert_many(country_df.to_dict('records'))

if __name__ == "__main__":
    # Set the file name
    input_folder = os.path.dirname(os.path.abspath(__file__))
    if input_folder[-1] != "/": input_folder += "/"
    input_file   = "country_pops.csv"

    # Set MongoDB client
    with open (input_folder + "config.json") as f:
        config = json.loads(f.read())

    mongo_config = config["mongo"]
    print(mongo_config)

    if not mongo_config['local']:
        try:
            mongo_client = MongoClient(mongo_config['host'], \
                                           mongo_config['port'], \
                                           serverSelectionTimeoutMS = 5000)
            mongo_client.server_info()
        except ServerSelectionTimeoutError as err:
            print(err)
            sys.exit()

    else:
        mongo_client = MongoClient()

    mongo_db = mongo_client[mongo_config["database"]]

    if mongo_config['secured']:
        try:
            mongo_db.authenticate(mongo_config["user"], \
                                      password = mongo_config["password"], \
                                      source = mongo_config["source"])
        except:
            print("MongoDB authentication error!")
            sys.exit()

    import_csv()
