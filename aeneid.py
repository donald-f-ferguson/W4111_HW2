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

        # The design pattern is that the primary key comes in in the form value1_value2_value3
        key_columns = primary_key.split(key_delimiter)

        # Merge dbname and resource names to form the dbschema.tablename element for the resource.
        # This should probably occur in the data service and not here.
        resource = dbname + "." + resource_name

        # Look for the fields=f1,f2, ... argument in the query parameters.
        field_list = request.args.get('fields', None)
        if field_list is not None:
            field_list = field_list.split(",")

        # Call the data service layer.
        result = ds.get_by_primary_key(resource, key_columns, field_list=field_list)

        if result:
            # We managed to find a row. Return JSON data and 200
            result_data = json.dumps(result, default=str)
            resp = Response(result_data, status=200, mimetype='application/json')
        else:
            # We did not get an exception and we did not get data, therefore this is 404 not found.
            resp = Response("Not found", status=404, mimetype="text/plain")
    except Exception as e:
        # We need a better overall approach to generating correct errors.
        utils.debug_message("Something awlful happened, e = ", e)

    return resp

@app.route('/api/<dbname>/<resource_name>')
def handle_collection(dbname, resource_name):

    resp = Response("Internal server error", status=500, mimetype="text/plain")

    try:

        # Form the compound resource names dbschema.table_name
        resource = dbname + "." + resource_name

        # Get the field list if it exists.
        field_list = request.args.get('fields', None)
        if field_list is not None:
            field_list = field_list.split(",")

        # The query string is of the form ?f1=v1&f2=v2& ...
        # This maps to a query template of the form { "f1" : "v1", ... }
        # We need to ignore the fields parameters.
        tmp = None
        for k,v in request.args.items():
            if not k == 'fields':
                if tmp is None:
                    tmp = {}
                tmp[k] = v

        # Find by template.
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
