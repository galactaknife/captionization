from flask import Flask
import main

def create_app(debug=False):
    global app

    # Create app instance
    app = Flask(__name__)
    app.debug = debug
    app.secret_key = "secret key"

    # Disable file caching
    app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0

    # Set upload folder
    app.config["UPLOAD_FOLDER"] = "/uploads"

    # Use all routes defined in the main blueprint
    app.register_blueprint(main.main)
    return app
