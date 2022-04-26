import flask

app = flask.Flask(__name__)

@app.route('/', methods = ['GET'])
def home ():
  return flask.redirect('/hash')

@app.route('/hash', methods = ['GET'])
def hash ():
  return flask.render_template('hash.html'), 200

@app.route('/block', methods = ['GET'])
def block ():
  return flask.render_template('block.html'), 200

@app.route('/blockchain', methods = ['GET'])
def blockchain ():
  return flask.render_template('blockchain.html'), 200

app.run(host = '127.0.0.1', port = 8888, debug = True)
