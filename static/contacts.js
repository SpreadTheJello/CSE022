$(document).ready(function () {
	$.get("/contacts", {}, function(response){
		let the_list = response['contacts']

		for (let i = 0; i < the_list.length; i++){
			let current = the_list[i];
			let first_name = current['first_name']
			let last_name = current['last_name']
			let address = current['address']
			let city = current['city']
			let email = current['email']
			let phone = current['phone']
			let phone1 = current['phone1']
			let state = current['state']
			let zipcode = current['zipcode']


			let line = `<tr><th scope="row">${i + 1}</th><td>${first_name}</td><td>${last_name}</td><td>${address}</td><td>${city}</td><td>${email}</td><td>${phone}</td><td>${phone1}</td><td>${state}</td><td>${zipcode}</td></tr>`

			$("#addressbook").append(line);
		}
	})


	// search function
	$("#searchbox").keyup(function(){
		let q = $("#searchbox").val()
		$.get("/search", {'q': q}, function(response){
			$("#addressbook").empty()
			let the_list = response['result']
			for (let i = 0; i < the_list.length; i++){
				let current = the_list[i];
				let first_name = current['first_name']
				let last_name = current['last_name']
				let address = current['address']
				let city = current['city']
				let email = current['email']
				let phone = current['phone']
				let phone1 = current['phone1']
				let state = current['state']
				let zipcode = current['zipcode']


				let line = `<tr><th scope="row">${i + 1}</th><td>${first_name}</td><td>${last_name}</td><td>${address}</td><td>${city}</td><td>${email}</td><td>${phone}</td><td>${phone1}</td><td>${state}</td><td>${zipcode}</td></tr>`

				$("#addressbook").append(line);
			}
		})
	})

	$("#add_contact_btn").click(function(){
		let final_string = ""
		let first_name = $("#first_name").val();
		let last_name = $("#last_name").val();
		let address = $("#address").val();
		let city = $("#city").val();
		let email = $("#email").val();
		let phone = $("#phone").val();
		let phone1 = $("#phone1").val();
		let state = $("#state").val();
		let zipcode = $("#zipcode").val();
		let status = true

		if(first_name == ""){
			status = false
			$("#first_name_fail").removeClass("hidden")
		}
		else{
			$("#first_name_fail").addClass("hidden")
		}
		if(last_name == ""){
			status = false
			$("#last_name_fail").removeClass("hidden")
		}
		else{
			$("#last_name_fail").addClass("hidden")
		}
		if(address == ""){
			status = false
			$("#address_fail").removeClass("hidden")
		}
		else{
			$("#address_fail").addClass("hidden")
		}
		if(city == ""){
			status = false
			$("#city_fail").removeClass("hidden")
		}
		else{
			$("#city_fail").addClass("hidden")
		}
		if(email == ""){
			status = false
			$("#email_fail").removeClass("hidden")
		}
		else{
			$("#email_fail").addClass("hidden")
		}
		if(phone == ""){
			status = false
			$("#phone_fail").removeClass("hidden")
		}
		else{
			$("#phone_fail").addClass("hidden")
		}
		if(phone1 == ""){
			status = false
			$("#phone1_fail").removeClass("hidden")
		}
		else{
			$("#phone1_fail").addClass("hidden")
		}
		if(state == ""){
			status = false
			$("#state_fail").removeClass("hidden")
		}
		else{
			$("#state_fail").addClass("hidden")
		}
		if(zipcode == ""){
			status = false
			$("#zipcode_fail").removeClass("hidden")
		}
		else{
			$("#zipcode_fail").addClass("hidden")
		}
		if(status == true){
			final_string = (first_name + "," + last_name + "," + address + "," + city + "," + state + "," + zipcode + "," + phone1 + "," + phone + "," + email);

			$.get('/contact_btn',{"final_string": final_string}, function(){
			})
			$("#contact_confirmation").removeClass("hidden")
		}
		else{
			$("#contact_confirmation").addClass("hidden")
		}
		
	})
});