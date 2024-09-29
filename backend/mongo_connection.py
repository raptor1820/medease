
import pymongo
from urllib.parse import quote_plus


def get_mongo_client(mongo_uri):
    """Establish connection to the MongoDB."""
    try:
        client = pymongo.MongoClient(mongo_uri)
        print("Connection to MongoDB successful")
        return client
    except pymongo.errors.ConnectionFailure as e:
        print(f"Connection failed: {e}")
        return None


username = quote_plus("asao6")
password = quote_plus("JpztdWCT1Fp6mNvN")
mongo_uri = 'mongodb+srv://{username}:{password}@hackgt-cluster.7tzme.mongodb.net/'
if not mongo_uri:
    print("MONGO_URI not set in environment variables")

mongo_client = get_mongo_client(mongo_uri)

DB_NAME = "hackgt11-rag-vector-db"
COLLECTION_NAME = "hackgt11-collections"

db = mongo_client[DB_NAME]
collection = db[COLLECTION_NAME]
