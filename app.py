from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import random
import json

app = Flask(__name__, static_folder = 'static', template_folder = 'templates')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
CORS(app)

# Hangman Variables
word = "COMPUTER"
wordlist = ["COMPUTER", "SCIENCE", "HARDWARE", "HYPERLINK", "MICROPROCESSOR", "ALGORITHM", "BANDWIDTH", "CAPTCHA", "DESKSTOP", "ENCRYPTION", "FIREWALL", "GIGABYTE", "INTERNET", "JAVASCRIPT", "KEYBOARD", "MOTHERBOARD", "NETWORK", "OFFLINE", "PROGRAMMER", "QWERTY", "RUNTIME", "SCREENSHOT", "TERABYTE", "USERNAME", "VIRUS", "WEBSITE", "XML", "ZIP"]


# Render Home Page
@app.route('/')
def home():
    return render_template('index.html')

# Render About Page
@app.route('/about')
def about():
    return render_template('about.html')

# Render Projects Page
@app.route('/projects')
def projects():
    return render_template('projects.html')

# =======================================
# Login Section
@app.route('/accounts')
def accounts():
    return render_template('accounts.html')

@app.route('/saveaccount')
def saveaccount():
	username = request.args.get('username')
	password = request.args.get('password')
	#username = username.strip() #{"username": "angelo", "password": "1234"}
	#password = password.strip() #{"username": "angelo", "password": "1234"}

	account = {"username": username, "password": password}
	string_account = json.dumps(account)

	f = open('accounts.txt', 'a')
	f.writelines(['\n', string_account])
	f.close()
	return "Correct", 201

@app.route('/verify')
def verify():
	username = request.args.get('username')
	password = request.args.get('password')

	f = open('accounts.txt', 'r')
	lines = f.readlines()
	f.close()

	for i in range(len(lines)):
		lines[i] = lines[i].strip()
		if (lines[i] != ''):
			temp = json.loads(lines[i])
			if (temp['username'] == username and temp['password'] == password):
				return "Correct"
	return ''

@app.route('/verifyusername')
def verifyusername():
	username = request.args.get('username')

	f = open('accounts.txt', 'r')
	lines = f.readlines()
	f.close()

	for i in range(len(lines)):
		lines[i] = lines[i].strip()
		if (lines[i] != ''):
			temp = json.loads(lines[i])
			if (temp['username'] == username.strip()): #.strip() # {"username": "angelo     3", "password": "1234"}
				return "Correct"
	return ''
# =======================================


# =======================================
# Comments Section
@app.route('/comments')
def comments():
    return render_template('comments.html')

@app.route('/savecomment')
def save():
	name = request.args.get('name')
	message = request.args.get('message')

	comment = {"name": name, "message": message}
	print(name)
	print(message)

	string_comment = json.dumps(comment)
	print(string_comment)

	f = open('comments.txt', 'a')
	f.writelines(['\n', string_comment])
	f.close()
	return "", 201

@app.route('/getcomments')
def files():
	f = open('comments.txt', 'r')
	lines = f.readlines()
	f.close()

	comments = []

	for i in range(len(lines)):
		lines[i] = lines[i].strip()
		temp = json.loads(lines[i])
		comments.append(temp)

	return {"comments": comments}
# =======================================


# =======================================
# Hangman Section
@app.route('/game')
def game():
    return render_template('game.html')
	
@app.route('/getword')
def getword():
	pos = random.randint(0, len(wordlist)-1)
	return {'length': len(wordlist[pos]), 'position': pos}

@app.route('/check_attempt')
def check_attempt():
	letter = request.args.get('letter').upper()
	positions = []
	index = int(request.args.get("index"))
	word = wordlist[index]

	for i in range(len(word)):
		if word[i] == letter:
			positions.append(i)

	return {'letter': letter, 'positions': positions}
# =======================================


# =======================================
# Books Section
@app.route('/book')
def books():
    return render_template('books.html')

f = open('spacebat.txt', 'r')
contents = f.read()
actual_contents = contents[:]

contents = contents.replace('\n', ' ')
contents = contents.replace(',', '')
contents = contents.replace('.', '')
contents = contents.replace('!', '')
contents = contents.replace('"', '')
contents = contents.replace('?', '')
contents = contents.replace('*', '')
contents = contents.replace('-', ' ')
contents = contents.replace('--', ' ')
contents = contents.replace('_', '')
contents = contents.replace(']', '')
contents = contents.replace('[', '')

f.close()

@app.route('/book_contents')
def book_contents():
	return {'contents': actual_contents}

@app.route('/stats')
def stats():
	words = contents.split(' ')
	items = contents.split(' ')
	longest = ""
	frequencies = {}

	# finds word count
	word_count = len(words)

	# finds most frequent word
	for i in range(len(items)):
		theWord = items[i].upper()
		if theWord != "":
			if theWord in frequencies:
				frequencies[theWord] = frequencies[theWord] + 1
			else:
				frequencies[theWord] = 1
	max = 0
	word = ""
	for i in frequencies:
		if frequencies[i] > max:
			max = frequencies[i]
			word = i

	# finds longest word
	for i in range(len(items)):
		if len(items[i]) > len(longest):
			longest = items[i]
			shortest = longest
	
	# finds shortest word
	shortest = items[0]
	for i in range(len(items)):
		if items[i] != "":
			if len(items[i]) < len(shortest):
				shortest = items[i]

	return {'word_count': word_count, 'frequencies': frequencies, 'most_frequent_word': word, "occurrences": max, "longest_word": longest, "shortest_word": shortest}


# =======================================


# =======================================
# Address Book Section

# Render Address Book Page
@app.route('/addressbook')
def addressbook():
    return render_template('addressbook.html')


# Returns pretty looking contacts
@app.route('/contacts')
def contacts_func():
	# Reads contacts.csv
	f = open('contacts.csv', 'r')
	contacts_data = f.readlines()
	f.close()

	# Removes \n
	for i in range(len(contacts_data)):
		contacts_data[i] = contacts_data[i].strip()

	# Turns contacts into readable json
	pretty_contacts = []

	for i in range(len(contacts_data)):
		row = contacts_data[i]
		items = row.split(',')
		first_name = items[0]
		last_name = items[1]
		address = items[2]
		city = items[3]
		state = items[4]
		zipcode = items[5]
		phone1 = items[6]
		phone = items[7]
		email = items[8]

		pretty_row = {'first_name': first_name, 'last_name': last_name, 'address': address, 'city': city, 'state': state, 'zipcode': zipcode, 'phone1': phone1, 'phone': phone, 'email': email}
		pretty_contacts.append(pretty_row)

	pretty_contacts.pop(0)
	return {'contacts': pretty_contacts}

@app.route('/contact_btn')
def contact_btn():
	final_string = request.args.get("final_string")

	f = open('contacts.csv', 'a')
	f.writelines(['\n', final_string])
	f.close()

	return ""

# Search function
@app.route('/search')
def search_func():
	# Reads contacts.csv
	f = open('contacts.csv', 'r')
	contacts_data = f.readlines()
	f.close()

	# Removes \n
	for i in range(len(contacts_data)):
		contacts_data[i] = contacts_data[i].strip()

	# Turns contacts into readable json
	pretty_contacts = []

	for i in range(len(contacts_data)):
		row = contacts_data[i]
		items = row.split(',')
		first_name = items[0]
		last_name = items[1]
		address = items[2]
		city = items[3]
		state = items[4]
		zipcode = items[5]
		phone1 = items[6]
		phone = items[7]
		email = items[8]

		pretty_row = {'first_name': first_name, 'last_name': last_name, 'address': address, 'city': city, 'state': state, 'zipcode': zipcode, 'phone1': phone1, 'phone': phone, 'email': email}
		pretty_contacts.append(pretty_row)

	pretty_contacts.pop(0)

	query = request.args.get("q")
	result = []

	for i in range(len(pretty_contacts)):
		if query.upper() == pretty_contacts[i]['first_name'].upper()[:len(query)]:
			result.append(pretty_contacts[i])

		elif query.upper() == pretty_contacts[i]['last_name'].upper()[:len(query)]:
			result.append(pretty_contacts[i])
	
		elif query.upper() == pretty_contacts[i]['address'].upper()[:len(query)]:
			result.append(pretty_contacts[i])	

		elif query.upper() == pretty_contacts[i]['city'].upper()[:len(query)]:
			result.append(pretty_contacts[i])

		elif query.upper() == pretty_contacts[i]['email'].upper()[:len(query)]:
			result.append(pretty_contacts[i])
	
		elif query.upper() == pretty_contacts[i]['phone'].upper()[:len(query)]:
			result.append(pretty_contacts[i])	
	
		elif query.upper() == pretty_contacts[i]['phone1'].upper()[:len(query)]:
			result.append(pretty_contacts[i])

		elif query.upper() == pretty_contacts[i]['state'].upper()[:len(query)]:
			result.append(pretty_contacts[i])
	
		elif query.upper() == pretty_contacts[i]['zipcode'].upper()[:len(query)]:
			result.append(pretty_contacts[i])	

	return {'result': result}
# =======================================

if __name__ == '__main__':
        app.run(debug=True, host="0.0.0.0", port=9000)

