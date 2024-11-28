import os
from datetime import datetime

LOG_DIRECTORY = "static/logs"

def create_log_file():
    if not os.path.exists(LOG_DIRECTORY):
        os.makedirs(LOG_DIRECTORY)

    log_file_name = datetime.now().strftime('%Y-%m-%d') + '.txt'
    log_file_path = os.path.join(LOG_DIRECTORY, log_file_name)

    if not os.path.exists(log_file_path):
        with open(log_file_path, 'w') as log_file:
            log_file.write(f"Log file created on {datetime.now()}\n")
    
    return log_file_path

def log_message(message, log_file_name):
    with open(log_file_name, 'a') as log_file:
        log_file.write(f"{datetime.now()}: {message}\n")