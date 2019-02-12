from flask import Flask
from aeneid.dbservices import dataservice as ds
from flask import Flask
from flask import request
import os
import json
import copy
from aeneid.utils import utils as utils
import re
from aeneid.utils import webutils as wu
from aeneid.dbservices.DataExceptions import DataException
from flask import Response

# Default delimiter to delineate primary key fields in string.
key_delimiter = "_"


app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'You probably want to go either to the content home page or call an API at /api'


@app.route('/api')
def api():
    return 'You probably want to call an API on one of the resources.'


@app.route('/api/<dbname>/<resource_name>/<primary_key>')
def handle_resource(dbname, resource_name, primary_key):

    resp = Response("Internal server error", status=500, mimetype="text/plain")

    try:

        key_columns = primary_key.split(key_delimiter)
        resource = dbname + "." + resource_name

        field_list = request.args.get('fields', None)
        field_list = field_list.split(",")

        result = ds.get_by_primary_key(resource, key_columns, field_list=field_list)

        if result:
            result_data = json.dumps(result, default=str)
            resp = Response(result_data, status=200, mimetype='application/json')
        else:
            resp = Response("Not found", status=404, mimetype="text/plain")
    except Exception as e:
        utils.debug_message("Something awlful happened, e = ", e)

    return resp

@app.route('/api/<dbname>/<resource_name>')
def handle_collection(dbname, resource_name):

    resp = Response("Internal server error", status=500, mimetype="text/plain")

    try:

        resource = dbname + "." + resource_name

        field_list = request.args.get('fields', None)
        field_list = field_list.split(",")

        tmp = None
        for k,v in request.args.items():
            if not k == 'fields':
                if tmp is None:
                    tmp = {}
                tmp[k] = v

        result = ds.get_by_template(resource, tmp, field_list=field_list)

        if result:
            result_data = json.dumps(result, default=str)
            resp = Response(result_data, status=200, mimetype='application/json')
        else:
            resp = Response("Not found", status=404, mimetype="text/plain")
    except Exception as e:
        utils.debug_message("Something awlful happened, e = ", e)

    return resp



if __name__ == '__main__':
    app.run()
