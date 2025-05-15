$(document).ready(function () {


    $("#btnSignUp").click(function (event) {
        event.preventDefault();
        let firstName = $('#first-name').val();
        let lastName = $('#last-name').val();
        let email = $('#email').val();
        let username = $('#username').val();
        let password = $('#password').val();
        let dob = $('#dob').val();
        let date = new Date(1, 1, 1);
        if (dob !== "" && dob !== null) {
            var parts = dob.split('-');
            date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
        }
        
        let gender = $('#gender').val();

        // Kreiranje objekta User
       

        $.ajax({
            url: "/api/users/register/",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify({
                Username: username,
                Password:password,
                Name: firstName,
                Surname: lastName,
                Email: email,
                DateOfBirth: date,
                Gender: gender,
                Type: null,
                Rezervacije: []
            }),
            headers: {
                'Authorization': 'Basic ' + username + ':' + password
            },
            success: function (data, status) {
                // Obrada uspešnog odgovora

                $.ajaxSetup({

                    beforeSend: function (xhr) {

                        xhr.setRequestHeader('Authorization', 'Basic ' + username + ':' + password);

                    }

                });

                console.log(status);
                console.log(username);
                console.log(password);
               
                window.location.href = "HomePagePutnik.html";
                  
                $('#registration-form')[0].reset();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Obrada greške
                console.error("Request failed: " + textStatus + ", " + errorThrown);
                alert("Please enter all fields with valid data!");
            }
        });

    });

});