var selectedValueSort = 0;

$(document).ready(function () {
    loadUser();


    loadAllLetovi();

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

    $("#editUser").click(function (event) {
        event.preventDefault();
       let firstName = $("#first-name").val();
        let lastName = $("#last-name").val();
        let email =$('#email').val();
       let username = $('#username').val();
       let password = $('#password').val();
       let dob = $('#dob').val();
        let gender = $('#gender').val();
        let date = new Date(1,1,1);
        if (dob !== "" && dob !== null) {
            var parts = dob.split('-');
            date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
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
                Type:null, // Podrazumevano je Putnik
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

    //var dobInput = document.getElementById('dob');
    //dobInput.addEventListener('blur', function () {
    //    var enteredDate = dobInput.value;
    //    // Provera da li je uneta vrednost datuma u formatu dd/mm/yyyy
    //    if (isValidDate(enteredDate)) {
    //        // Ako je unet validan datum, možete ga konvertovati u format yyyy-mm-dd
    //        var formattedDate = formatToYYYYMMDD(enteredDate);
    //        dobInput.value = formattedDate; // Postavite formatiran datum natrag u polje
    //    } else {
    //        // Ako nije unet validan datum, možete prikazati poruku ili izvršiti neku drugu akciju
    //    //    alert('Unesite datum u formatu dd/mm/yyyy.');
    //        dobInput.focus(); // Fokusira se na polje datuma za ponovni unos
    //    }
    //});

    //$('#dob').change(function (event) {
    //    event.preventDefault();
    //    var selectedDate = new Date($('#dob').val());
    //    var formattedDate = selectedDate.toLocaleDateString('en-GB'); // Postavite 'en-GB' za format dd/mm/yyyy
    //    $('#dob').val(formattedDate);
    //});


    $('#statusFilter').change(function (event) {
        event.preventDefault();
        selectedValueSort = parseInt($('#statusFilter').val(), 10);
        loadAllLetovi();
    });


});

function loadUser() {

  
    $.ajax({
        url: "/api/users/profile",
        type: "GET",
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

function loadAllLetovi() {
    $.get("/api/letovi/users", function (data, status) {
        let table = '<table class="table table-striped table - hover">';
        table += '<tr><th> AirCompany</th ><th>Departure location</th><th>Arrival location</th> <th>Date of departure</th><th>Price(per ticket)</th></tr>'

        var passengers = $('#number-of-passengers').val();
        if (passengers == null) {
            passengers = 0;
        }
        var num = 1;

        for (element in data) {
            
            if (selectedValueSort === data[element].Status) {

                let lijet = '<td>' + data[element].Aviokompanija + '</td>';
                lijet += '<td>' + data[element].PolaznaDestinacija + '</td>';
                lijet += '<td>' + data[element].DolaznaDestinacija + '</td>';
                lijet += '<td>' + formatDate(data[element].DatumIVremePolaska) + '</td>';
                lijet += '<td> $' + data[element].Cena + '</td>';
                //lijet += '<td>' + passengers.toString() + '</td>';
               
                table += '<tr>' + lijet + '</tr>';
            }
            num = num + 1;
        }

        table += '</table>';
        $('#table-div').html(table);

    });


}

// Funkcija za proveru da li je uneti datum u formatu dd/mm/yyyy
function isValidDate(dateString) {
    var regexDate = /^\d{2}\/\d{2}\/\d{4}$/;
    return regexDate.test(dateString);
}

// Funkcija za formatiranje datuma u format yyyy-mm-dd
function formatToYYYYMMDD(dateString) {
    var parts = dateString.split('/');
    if (parts.length === 3) {
        var day = parts[0];
        var month = parts[1];
        var year = parts[2];
        return year + '-' + month + '-' + day;
    }
    return dateString; // Vraća originalni string ako ne može da ga formatira
}


function formatDate(dateString) {
    let date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0'); // dan
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // mesec (0-based, zato +1)
    const year = date.getFullYear(); // godina

    return `${day}/${month}/${year}`;
}
