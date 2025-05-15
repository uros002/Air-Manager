var selectedValueSort = 0;

$(document).ready(function () {
    loadUser();


    loadAllUsers();

    $("#logout").click(function () {
        $.ajax({
            url: "/api/users/logout",
            type: "GET",
            success: function (data, status) {
                
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
            }
        });
    });

    //$('#dob').change(function (event) {
    //    event.preventDefault();
    //    var selectedDate = new Date($('#dob').val());
    //    var formattedDate = selectedDate.toLocaleDateString('en-GB'); // Postavite 'en-GB' za format dd/mm/yyyy
    //    $('#dob').val(formattedDate);
    //});

    $('#statusFilter').change(function (event) {
        event.preventDefault();
        selectedValueSort = $(this).val();
        
        loadUsersSearch();
    });

    $('#searchButton').click(function (event) {
        event.preventDefault();
        let name = $('#Name').val();
        let surname = $('#Surname').val();
        let date1 = $('#first-date').val();
        let date2 = $('#second-date').val();

        $.ajax({
            url: "/api/users/searchUsers",
            type: "get",
            data: {
                Name: name, Surname: surname, FirstDate: date1, SeccondDate: date2, sort: selectedValueSort
            },
            success: function (data, status) {
                let table = '<table class="table table-striped table - hover">';
                table += '<tr><th>Name</th ><th>Surname</th><th>Username</th> <th>Date of Birth</th><th>Role</th></tr>'

                var Roles = {
                    0: "Passenger",
                    1:"Administrator"
                }

                for (element in data) {


                    let user = '<td>' + data[element].Name + '</td>';
                    user += '<td>' + data[element].Surname + '</td>';
                    user += '<td>' + data[element].Username + '</td>';
                    user += '<td>' + formatDate(data[element].DateOfBirth) + '</td>';
                    user += '<td>' + Roles[data[element].Type] + '</td>';

                    table += '<tr>' + user + '</tr>';

                }

                table += '</table>';
                $('#table-div-users').html(table);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
            }
        });
    });

    $("#editUser").click(function (event) {
        event.preventDefault();
        let firstName = $("#first-name").val();
        let lastName = $("#last-name").val();
        let email = $('#email').val();
        let username = $('#username').val();
        let password = $('#password').val();
        let dob = $('#dob').val();
        let gender = $('#gender').val();
        let date = new Date(1, 1, 1);
        if (dob !== "" && dob !== null) {
            var parts = dob.split('-');
            date = new Date(Date.UTC(parts[0], parts[1], parts[2]));
        }


        $.ajax({
            url: "/api/users/izmena",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({
                ID: null, // Pretpostavljamo da ID nije poznat u trenutku kreiranja
                Username: username,
                Password: password,
                Name: firstName,
                Surname: lastName,
                Email: email,
                DateOfBirth: date,
                Gender: gender,
                Type: null, // Podrazumevano je Putnik
                Rezervacije: []// Prazna lista rezervacija
            }),
            success: function (data, status) {
                window.location.href = "Login.html";

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
            }
        });


    });

    
});



//$("#editUser").click(function (event) {
//    event.preventDefault();
//    let firstName = $("#first-name").val();
//    let lastName = $("#last-name").val();
//    let email = $('#email').val();
//    let username = $('#username').val();
//    let password = $('#password').val();
//    let dob = $('#dob').val();
//    let gender = $('#gender').val();
//    let date = new Date(1, 1, 1);
//    if (dob !== "" && dob !== null) {
//        var parts = dob.split('-');
//        date = new Date(parts[0], parts[1] + 1, parts[2]);
//    }


//    $.ajax({
//        url: "/api/users/izmena",
//        type: "PUT",
//        contentType: "application/json",
//        data: JSON.stringify({
//            ID: null, // Pretpostavljamo da ID nije poznat u trenutku kreiranja
//            Username: username,
//            Password: password,
//            Name: firstName,
//            Surname: lastName,
//            Email: email,
//            DateOfBirth: date,
//            Gender: gender,
//            Type: null, // Podrazumevano je Putnik
//            Rezervacije: []// Prazna lista rezervacija
//        }),
//        success: function (data, status) {
//            window.location.href = "Login.html";

//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//            console.error("Request failed: " + textStatus + ", " + errorThrown);
//        }
//    });


//});


function loadUsersSearch() {
    let name = $('#Name').val();
    let surname = $('#Surname').val();
    let date1 = $('#first-date').val();
    let date2 = $('#second-date').val();

    $.ajax({
        url: "/api/users/searchUsers",
        type: "get",
        data: {
            Name: name, Surname: surname, FirstDate: date1, SeccondDate: date2,sort:selectedValueSort
        },
        success: function (data, status) {
            let table = '<table class="table table-striped table - hover">';
            table += '<tr><th>Name</th ><th>Surname</th><th>Username</th> <th>Date of Birth</th><th>Role</th></tr>'

            var Roles = {
                0: "Passenger",
                1: "Administrator"
            }

            for (element in data) {


                let user = '<td>' + data[element].Name + '</td>';
                user += '<td>' + data[element].Surname + '</td>';
                user += '<td>' + data[element].Username + '</td>';
                user += '<td>' + formatDate(data[element].DateOfBirth) + '</td>';
                user += '<td>' + Roles[data[element].Type] + '</td>';

                table += '<tr>' + user + '</tr>';

            }

            table += '</table>';
            $('#table-div-users').html(table);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Request failed: " + textStatus + ", " + errorThrown);
        }
    });
}

function loadUser() {
    $.ajax({
        url: "/api/users/profile",
        type: "get",
        success: function (data, status) {
            $("#first-name").val(data.Name);
            $("#last-name").val(data.Surname);
            $('#email').val(data.Email);
            $('#username').val(data.Username);
            $('#password').val(data.Password);
            var date = data.DateOfBirth.toString("yyyy/mm/dd");
            var onlyDate = date.split('T')[0];
            var year = onlyDate.split('-')[0];
            var month = onlyDate.split('-')[1];
            var day = onlyDate.split('-')[2];
            let number = parseInt(month, 10);
            //number = number - 1;
            //month = String(number).padStart(2, '0');

            var formatedDate = year + '-' + month + '-' + day;
            $('#dob').val(formatedDate);
            $('#gender').prop('selectedIndex', data.Gender);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Request failed: " + textStatus + ", " + errorThrown);
        }
    });
}

function loadAllUsers() {
    $.get("/api/users/all", function (data, status) {
        let table = '<table class="table table-striped table - hover">';
        table += '<tr><th>Name</th ><th>Surname</th><th>Username</th> <th>Date of Birth</th><th>Role</th></tr>'

        var Roles = {
            0: "Passenger",
            1: "Administrator"
        }

        for (element in data) {


            let user = '<td>' + data[element].Name + '</td>';
            user += '<td>' + data[element].Surname + '</td>';
            user += '<td>' + data[element].Username + '</td>';
            user += '<td>' + formatDate(data[element].DateOfBirth) + '</td>';
            user += '<td>' + Roles[data[element].Type] + '</td>';
            
            table += '<tr>' + user + '</tr>';
            
        }

        table += '</table>';
        $('#table-div-users').html(table);

    });


}

function formatDate(dateString) {
    let date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0'); // dan
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // mesec (0-based, zato +1)
    const year = date.getFullYear(); // godina

    return `${day}/${month}/${year}`;
}
