import json
import pymysql
#from . import DataTableExceptions               # Exceptions for the solution
import aeneid.utils.utils as ut

pymysql_exceptions = (
    pymysql.err.IntegrityError,
    pymysql.err.MySQLError,
    pymysql.err.ProgrammingError,
    pymysql.err.InternalError,
    pymysql.err.DatabaseError,
    pymysql.err.DataError,
    pymysql.err.InterfaceError,
    pymysql.err.NotSupportedError,
    pymysql.err.OperationalError)

default_db_params = {
    "dbhost": "localhost",                    # Changeable defaults in constructor
    "port": 3306,
    "dbname": "lahman2017",
    "dbuser": "dbuser",
    "dbpw": "dbuser",
    "cursorClass": pymysql.cursors.DictCursor,        # Default setting for DB connections
    "charset":  'utf8mb4'                             # Do not change
}

def get_new_connection(params=default_db_params):
    cnx = pymysql.connect(
        host=params["dbhost"],
        port=params["port"],
        user=params["dbuser"],
        password=params["dbpw"],
        db=params["dbname"],
        charset=params["charset"],
        cursorclass=params["cursorClass"])
    return cnx

