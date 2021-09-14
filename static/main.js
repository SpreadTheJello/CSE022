$(document).ready(function () {
	
/*
======================= Hangman Game =======================
*/
	let wrongAttempts = 0;
	let wrongGuess = "";
	let correctGuess = 0;
	let wordIndex = 0;
	let wordLength = 0;
	let guessWord = "";

	// only allows 1 character input
	$("#input_guess").keypress(function(){
		let value = $("#input_guess").val();
		if (value.length > 0){
			$("#input_guess").val("");
		}
	});

	// gets word's index and length and adds necessary _'s
	$.get("/getword", {}, function(response){
		wordLength = response['length']
		wordIndex = response['position']
		for (let i=0; i < wordLength; i++){
			$("#jtron").append(`<span id="letter${i}" class="spaceside">_ </span>`)
		}
	})

	// main game execution
	$("#guess_btn").click(function(){
		let guess = $("#input_guess").val()

		// checks if letter's already guessed or empty
		if(guess == ''){
			alert("Enter a letter into the text box");
			return;
		}
		else{
			if(guessWord.includes(guess)){
				alert("Letter already entered");
				return;
			}
			else{
				guessWord += guess;
			}
		}

		/* 
		returns to the user if input is correct or wrong.
		if its correct, add to the _'s
		if its inccorect, add to the list of attempted letters
		*/
		$.get('/check_attempt', {"letter": guess, 'index': wordIndex}, function(response){
			let positions = response["positions"]
			let letter = response["letter"]

			if (positions[0] === undefined){
				wrongAttempts++;
				$("#wrongGuesses").append("<span>" + letter + ", " + "</span>")
			}

			// checks if user wins
			for (let i=0; i < positions.length; i++){
				//let item = "#letter" + positions[i];
				$("#letter" + positions[i]).html(letter);
				correctGuess++
				if(correctGuess >= wordLength){
					$("#win_msg").html("<h5>You Win!</h5>")
					$("#win_img").removeClass("hidden")
					$("#wrongGuesses").addClass("hidden")
					$("#guess_btn").addClass("hidden")
					$("#reload_btn").removeClass("hidden")
					$("#win_link").removeClass("hidden")
				}
			}

			// checks if user enters wrong letter
			if (wrongAttempts == 1){
				$("#head").removeClass("hidden")
			}
			if (wrongAttempts == 2){
				$("#body").removeClass("hidden")
			}
			if (wrongAttempts == 3){
				$("#left-arm").removeClass("hidden")
			}
			if (wrongAttempts == 4){
				$("#right-arm").removeClass("hidden")
			}
			if (wrongAttempts == 5){
				$("#left-leg").removeClass("hidden")
			}
			if (wrongAttempts == 6){
				$("#right-leg").removeClass("hidden")
				$("#input_guess").addClass("hidden")
				$("#guess_btn").addClass("hidden")
				$("#wrongGuesses").addClass("hidden")
				$("#lose_msg").html("<h5>You Lost!</h5>")
				$("#lost_img").removeClass("hidden")
				$("#reload_btn").removeClass("hidden")
			}
		})
	})

	// reloads page if user clicks "Play Again"
	$("#reload_btn").click(function(){
		location.reload();
		return false;
	})
/*
=========================================================
*/


/*
======================= Comment Section =======================
*/
	// sends comments to HTML to be displayed
	$.get('/getcomments', {}, function(response){
		let comments = response['comments']

		for (let i = 0; i < comments.length; i++){
			let name = comments[i]['name']
			let message = comments[i]['message']

			message = message.replaceAll("<", "&lt");
			message = message.replaceAll(">", "&gt");

			$("#comment_section").prepend(`<b>${name}</b><br>${message}<br><br>`)
		}
	})
	
	$("#comment_btn").click(function(){
		let name = $("#inputname").val();
		let message = $("#inputmessage").val();
		
		$.get('/savecomment', {"name": name, "message": message}, function(response){
			$.get('/getcomments', {}, function(response){
				$("#comment_section").html("")

				let comments = response['comments']

				for (let i = 0; i < comments.length; i++){
					let name = comments[i]['name']
					let message = comments[i]['message']

					message = message.replaceAll("<", "&lt");
					message = message.replaceAll(">", "&gt");

					$("#comment_section").prepend(`<b>${name}</b><br>${message}<br><br>`)
				}
			});
		})
	});
/*
=========================================================
*/


/*
======================= Login Section =======================
*/

	// Creates an account and checks if username already exists or if passwords dont match
	$("#account_btn").click(function(){
		let username = $("#username").val();
		let password = $("#password").val();
		let repeated_password = $("#repeated_password").val();

		if (username.includes(" ")){
			$("#username_check").removeClass("hidden")
		}
		else{
			$.get("/verifyusername", {username: username}, function(response){
			if (response == "Correct"){
				$("#account_exists").removeClass("hidden")
				$("#account_exists_msg").removeClass("hidden")
				$("#username_check").addClass("hidden")
				$("#password_check").addClass("hidden")
			}
			else{
				if (repeated_password == password){
				$.get("/saveaccount", {username: username, password: password}, function(response){
				if (response == "Correct"){
					$("#account_success").removeClass("hidden")
					$("#account_msg").removeClass("hidden")
					$("#username").addClass("hidden")
					$("#password").addClass("hidden")
					$("#repeated_password").addClass("hidden")
					$("#user").addClass("hidden")
					$("#pass").addClass("hidden")
					$("#account_btn").addClass("hidden")
					$("#account_exists").addClass("hidden")
					$("#account_exists_msg").addClass("hidden")
					$("#password_check").addClass("hidden")
					$("#username_check").addClass("hidden")
				}
			})}
				else{
					$("#password_check").removeClass("hidden")
					$("#username_check").addClass("hidden")
				}
			}
		})
		}
	})

	// Logs into an account
	$("#login_btn").click(function(){
		let username = $("#username").val();
		let password = $("#password").val();

		$.get("/verify", {username: username, password: password}, function(response){
			if (response == "Correct"){
				$("#login_required").removeClass("hidden")
				$("#login_required2").removeClass("hidden")
				$("#login_area").addClass("hidden")
				$("#login_area2").addClass("hidden")
			}
			else{
				$("#invalid_login").removeClass("hidden")
			}
		})

	})
/*
=========================================================
*/


/*
======================= Books Section =======================
*/
	$.get("/book_contents", {}, function(response){
		let text = response['contents'];
		
		$("#book").html(text);
	});
	
	$.get("/stats", {}, function(response){
		let word_count = response['word_count'];
		let most_frequent_word = response['most_frequent_word']
		let occurrences = response['occurrences']
		let longest = response['longest_word']
		let shortest = response['shortest_word']

		$("#word_count").append(word_count);
		$("#most_frequent_word").html("Most frequent word: \"" + most_frequent_word + "\", " + occurrences);
		$("#longest").html("Longest word: \"" + longest + "\"");
		$("#shortest").html("Shortest word: \"" + shortest + "\"");
	});
	
	$("#book_btn").click(function(){
		$("#book").removeClass("hidden")
		$("#book_btn").addClass("hidden")
		$("#book_btn2").removeClass("hidden")
		$("#book_img1").removeClass("hidden")
		$("#book_img2").removeClass("hidden")
	});

	$("#book_btn2").click(function(){
		$("#book").addClass("hidden")
		$("#book_btn").removeClass("hidden")
		$("#book_btn2").addClass("hidden")
		$("#book_img1").addClass("hidden")
		$("#book_img2").addClass("hidden")
	});
		//return {'word_count': word_count, 'frequencies': frequencies, 'most_frequent_word': word, "occurrences": max}

/*
=========================================================
*/

	// adds the user's selected rating
	$("#star1").click(function(){

		$("#star1").addClass("btn btn-warning");
		$("#star1").html("★");
		$("#star2").removeClass("btn-warning");
		$("#star2").html("☆");
		$("#star3").removeClass("btn-warning");
		$("#star3").html("☆");
		$("#star4").removeClass("btn-warning");
		$("#star4").html("☆");
		$("#star5").removeClass("btn-warning");
		$("#star5").html("☆");
	})
	$("#star2").click(function(){

		$("#star1").addClass("btn btn-warning");
		$("#star1").html("★");
		$("#star2").addClass("btn btn-warning");
		$("#star2").html("★");
		$("#star3").removeClass("btn-warning");
		$("#star3").html("☆");
		$("#star4").removeClass("btn-warning");
		$("#star4").html("☆");
		$("#star5").removeClass("btn-warning");
		$("#star5").html("☆");
	})
	$("#star3").click(function(){

		$("#star1").addClass("btn btn-warning");
		$("#star1").html("★");
		$("#star2").addClass("btn btn-warning");
		$("#star2").html("★");
		$("#star3").addClass("btn btn-warning");
		$("#star3").html("★");
		$("#star4").removeClass("btn-warning");
		$("#star4").html("☆");
		$("#star5").removeClass("btn-warning");
		$("#star5").html("☆");
	})
	$("#star4").click(function(){

		$("#star1").addClass("btn btn-warning");
		$("#star1").html("★");
		$("#star2").addClass("btn btn-warning");
		$("#star2").html("★");
		$("#star3").addClass("btn btn-warning");
		$("#star3").html("★");
		$("#star4").addClass("btn btn-warning");
		$("#star4").html("★");
		$("#star5").removeClass("btn-warning");
		$("#star5").html("☆");
	})
	$("#star5").click(function(){

		$("#star1").addClass("btn btn-warning");
		$("#star1").html("★");
		$("#star2").addClass("btn btn-warning");
		$("#star2").html("★");
		$("#star3").addClass("btn btn-warning");
		$("#star3").html("★");
		$("#star4").addClass("btn btn-warning");
		$("#star4").html("★");
		$("#star5").addClass("btn btn-warning");
		$("#star5").html("★");
	})
});


