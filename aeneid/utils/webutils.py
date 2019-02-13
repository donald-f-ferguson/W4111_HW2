import aeneid.utils.utils as ut
import aeneid.dbservices.dataservice as ds
import copy
import json

url_base = "http://localhost:5000/api"

def set_url_base(url):
    global url_base

    url_based = url

