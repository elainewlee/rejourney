var dogwalker_id_val=null;
var base_url="http://afternoon-ocean-9111.herokuapp.com";
// var base_url="http://192.168.1.13:5000";
$('#login_submit').live('click', function(){
	var url = base_url + "/m_authenticate";
	var email_val=document.getElementById('email').value;
	var password_val=document.getElementById('password').value;
	var data = { email: email_val, password: password_val };
	$.ajax({
		type:'POST',
		data: data,

		url: url,
		success: function(data){
			var str_data=JSON.stringify(data);
			dogwalker_stuff=JSON.parse(str_data);
			dogwalker_id_val=dogwalker_stuff.user_id;
			if (dogwalker_id_val=='error'){
				alert('There was an error with your email or password. Please try logging in again.');
			}
			else{
				window.location.href="#log";
			}
		},
		error: function(data){
			alert('There was an error connecting to the server. Please try logging in again.');
		}
	});
	return false;
});

$('#new_user').live('click', function(){
	var url = base_url + "/m_save_user";
	var first_name_val=document.getElementById('first_name').value;
	var last_name_val=document.getElementById('last_name').value;
	var company_name_val=document.getElementById('company_name').value;
	var phone_val=document.getElementById('phone').value;
	var email_val=document.getElementById('new_user_email').value;
	var password_val=document.getElementById('new_user_password').value;
	var data = {first_name: first_name_val, last_name: last_name_val, company_name: company_name_val,
				phone: phone_val, email: email_val, password: password_val};
	$.ajax({
		type:'POST',
		data: data,
		url: url,
		success: function(data){
			var str_data=JSON.stringify(data);
			window.location.href="#new_owner_page";
		},
		error: function(data){
			alert('There was an error. Please try again.');
		}
	});
	return false;
});

$('#owner_submit').live('click', function(){
	var url = base_url + "/m_save_owner";
	var owner_first_name_val=document.getElementById('owner_first_name').value;
	var owner_last_name_val=document.getElementById('owner_last_name').value;
	var owner_phone_val=document.getElementById('owner_phone').value;
	var owner_email_val=document.getElementById('owner_email').value;
	var emergency_contact_val=document.getElementById('emergency_contact').value;
	var contact_phone_val=document.getElementById('contact_phone').value;
	var vet_name_val=document.getElementById('vet_name').value;
	var vet_phone_val=document.getElementById('vet_phone').value;
	var data = {first_name: owner_first_name_val, last_name:owner_last_name_val, phone_number:owner_phone_val,
				email:owner_email_val, emergency_contact:emergency_contact_val, contact_phone:contact_phone_val,
				vet_name:vet_name_val, vet_phone:vet_phone_val};
	$.ajax({
		type:'POST',
		data: data,
		url: url,
		success: function(data){
			var str_data=JSON.stringify(data);
			window.location.href="#new_dog_page";
		},
		error: function(data){
			var str_data=JSON.stringify(data);
			alert('There was an error reg. you. Please try again.');
		}
	});
	return false;
});

$('#dog_submit').live('click', function(){
	var sex_val='didntwork';
	var url = base_url + "/m_save_dog";
	var dog_name_val=document.getElementById('dog_name').value;
	function getResults() {
	    var radios = document.getElementsByName("sex"); 
	    for (var i = 0; i < radios.length; i++) {       
	        if (radios[i].checked) {
	            sex_val=radios[i].value;
	            console.log(sex_val);
	            break;
	        }	
   		}
	}		
	getResults();
	var breed_val=document.getElementById('breed').value;
	var needs_val=document.getElementById('needs').value;
	var data = { dog_name: dog_name_val, sex: sex_val, breed: breed_val, needs: needs_val
			};
	$.ajax({

		type:'POST',
		data: data,
		url: url,
		success: function(data){
			console.log(data);
			var str_data=JSON.stringify(data);
			console.log(str_data);
			window.location.href="#log";
		},
		error: function(data){
			console.log(data);
			alert('There was an error. Please try again.');
		}
	});
	return false;
});


	 
	



