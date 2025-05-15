$(document).ready(function () {


    $("#btnLogin").click(function (event) {
        event.preventDefault();
        let username = $("#Username").val();
        let password = $("#Password").val();

        $.ajax({
            url: "/api/login",
            type: "GET",
            data: {
                Username: username,
                Password: password
            },
            headers: {
                'Authorization' : 'Basic ' + username + ':' + password
            },
            success: function (data, status) {
                // Obrada uspešnog odgovora
                $.ajaxSetup({

                    beforeSend: function (xhr) {

                        xhr.setRequestHeader('Authorization', 'Basic ' + username + ':' + password );

                    }

                });
                
                console.log(status);
                console.log(username);
                console.log(password);
                if (data !== null) {
                    if (data.Type === 0) {
                        window.location.href = "HomePagePutnik.html";
                    } else {
                        window.location.href = "AdministratorProfilePage.html";
                    }
                } else {
                    alert("Invalid data or empty fields. Please try again.");
                }

                $("#Username").val('');
                $("#Password").val('');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Obrada greške
                console.error("Request failed: " + textStatus + ", " + errorThrown);
                alert("Invalid data or empty fields. Please try again.");
            }
        });

    });

});