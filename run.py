from __init__ import create_app

# Get app instance
app = create_app(debug=True)

app.run(host="0.0.0.0", port=3000, threaded=True)
