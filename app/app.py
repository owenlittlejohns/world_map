from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    """
    Run the app. It will listen on http://localhost:5000/.
    """
    #app.run(host='http://localhost', port=5000, debug = True)
    app.run()
