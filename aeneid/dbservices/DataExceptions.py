
import pymysql

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

class DataException(Exception):

    invalid_column_definition   =   -100
    duplicate_table_name        =   -101
    not_implemented             =   -200
    invalid_file                =   -300

    data_error                  =   1000
    internal_error              =   1001
    not_found                   =   1002

    no_such_resource            =   2000


    def __init__(self, code=None, message=None, ex=None):
        self.code = code
        self.message = message
        self.original_exception = ex

    def __str__(self):
        """
        TODO We should map MySQL and infrastructure exceptions to more meaningful exceptions.
        :return:
        """
        result = ""

        if self.code:
            temp_c = str(self.code)
        else:
            temp_c = "None"

        if self.message is None:
            self.messsage = "None"

        result += "DataTableException: code: {:<5}, message: {}".format(temp_c, self.message)

        if self.original_exception is not None:
            result += "\nOriginal exception = " + repr(self.original_exception)

        return result

    @classmethod
    def map_exception(cls, e):

        if isinstance(e, pymysql.err.IntegrityError) or \
            isinstance(e, pymysql.err.ProgrammingError):
            result = DataException(DataException.data_error, None, e)
        else:
            result = DataException(DataException.internal_error, None, e)

        return result
