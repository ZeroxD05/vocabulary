from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/exercises')
def exercises():
    return render_template('exercises.html')

@app.route('/flashcards')
def flashcards():
    return render_template('flashcards.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

@app.route('/timer')
def timer():
    return render_template('timer.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Allow access from any IP on local network
