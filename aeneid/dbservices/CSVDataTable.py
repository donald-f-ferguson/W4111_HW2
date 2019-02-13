from aeneid.dbservices.BaseDataTable import BaseDataTable
import pandas
import copy

import csv
from aeneid.dbservices.BaseDataTable import BaseDataTable
import csv
import copy


class CSVDataTable(BaseDataTable):
    """
    The implementation classes (XXXDataTable) for CSV database, relational, etc. will extend the
    base class and implement the abstract methods.
    """

    def __init__(self, table_name, connect_info, key_columns=None, debug=True):
        """

        :param table_name: Name of the table. This is the table name for an RDB table or the file name for
            a CSV file holding data.
        :param connect_info: Dictionary of parameters necessary to connect to the data. See examples in subclasses.
        :param key_columns: List, in order, of the columns (fields) that comprise the primary key.
            A primary key is a set of columns whose values are unique and uniquely identify a row. For Appearances,
            the columns are ['playerID', 'teamID', 'yearID']
        :param debug: If true, print debug messages.
        """
        self._table_name = table_name
        self._connect_info = connect_info
        self._key_columns = key_columns
        self._debug = debug

        self._rows = None
        self._column_names = None

    def __str__(self):
        result = str(type(self))  + ": name = " + self._table_name
        result += "\nconnect_info = " + str(self._connect_info)
        result += "\nKey columns = " + str(self._key_columns)

        if self._column_names is not None:
            result += "\nColumn names = " + str(self._column_names)
        if self._rows is not None:
            row_count = len(self._rows)
        else:
            row_count = 0

        result += "\nNo. of rows = " + str(row_count)

        to_print = min(5, row_count)
        for i in range(0, to_print):
            result += "\n" + str(dict(self._rows[i]))

        return result

    def load(self):
        """
        You need to implement data load here.
        :return: None
        """
        raise NotImplementedError("Student must implement method.")

    def find_by_primary_key(self, key_fields, field_list=None):
        """

        :param key_fields: The values for the key_columns, in order, to use to find a record. For example,
            for Appearances this could be ['willite01', 'BOS', '1960']
        :param field_list: A subset of the fields of the record to return. The CSV file or RDB table may have many
            additional columns, but the caller only requests this subset.
        :return: None, or a dictionary containing the columns/values for the row.
        """
        raise NotImplementedError("Student must implement method.")

    def find_by_template(self, template, field_list=None, limit=None, offset=None, order_by=None):
        """

        :param template: A dictionary of the form { "field1" : value1, "field2": value2, ...}. The function will return
            a derived table containing the rows that match the template.
        :param field_list: A list of requested fields of the form, ['fielda', 'fieldb', ...]
        :param limit: Do not worry about this for now.
        :param offset: Do not worry about this for now.
        :param order_by: Do not worry about this for now.
        :return: A derived table containing the computed rows.
        """
        raise NotImplementedError("Student must implement method.")


    def insert(self, new_record):
        """

        :param new_record: A dictionary representing a row to add to the set of records. Raises an exception if this
            creates a duplicate primary key.
        :return: None
        """
        raise NotImplementedError("Student must implement method.")


    def delete_by_template(self, template):
        """

        Deletes all records that match the template.

        :param template: A template.
        :return: A count of the rows deleted.
        """
        raise NotImplementedError("Student must implement method.")


    def delete_by_key(self, key_fields):
        """

        Deletes the record  that match the key values.

        :param key_fields: List containing the values for the key columns
        :return: A count of the rows deleted.
        """
        raise NotImplementedError("Student must implement method.")

    def update_by_template(self, template, new_values):
        """

        :param template: A template that defines which matching rows to update.
        :param new_values: A dictionary containing fields and the values to set for the corresponding fields
            in the records. This returns an error if the update would create a duplicate primary key. NO ROWS are
            update on this error.
        :return: The number of rows updates.
        """
        raise NotImplementedError("Student must implement method.")


    def update_by_key(self, key_fields, new_values):
        """

        :param key_fields: List of values for primary key fields
        :param new_values: A dictionary containing fields and the values to set for the corresponding fields
            in the records. This returns an error if the update would create a duplicate primary key. NO ROWS are
            update on this error.
        :return: The number of rows updates.
        """
        raise NotImplementedError("Student must implement method.")
