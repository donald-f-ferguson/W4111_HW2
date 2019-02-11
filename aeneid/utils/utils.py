import json

debug_mode = None

def set_debug_mode(m):
    global debug_mode
    debug_mode = m

# Some objects are not JSON serializable. This function tries calling the __str__() function.
def my_converter(obj):
    return obj.__str__()

# Safely dumps a JSON object. Passes a default converter for non-serializable objects.
def safe_dumps(obj):
    return json.dumps(obj, default=my_converter, indent=2)


# Read JSON config file and return value.
def get_config_params(file_path):
    try:
        with open(file_path, "r") as config_file:
            config_info = json.load(config_file)
            return config_info
    except Exception as e:
        print_message("util.get_config_params: Exception = ", e)
        raise e


def print_message(msg, obj=None):
    """

    :param msg: String message to print
    :param obj: Optional object to convert to json dumps for message.
    :return: None
    """
    try:
        if obj:
            print(msg, safe_dumps(obj))
        else:
            print(msg)
    except Exception as e:
        # Fall back if something fails.
        print(msg, obj)


# Print a message if debugging is on. This should really be using a more formal
# logging service.
def debug_message(msg, obj=None):
    if debug_mode:
        print_message(msg, obj)


# Print a message if debugging is on. This should really be using a more formal
# logging service.
def error_message(msg, obj=None):
    print_message(msg, obj)