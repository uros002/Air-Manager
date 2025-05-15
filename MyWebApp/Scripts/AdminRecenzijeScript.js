$(document).ready(function () {


    loadAllRecenzije();

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

    $('#table-div-reviews').on('click', '#acceptButton', function (event) {
        event.preventDefault();
        let id = $(this).data('id');

        $.ajax({
            url: "/api/recenzija/accept/" + id,
            type: "PUT",

            beforeSend: function (xhr) {
                // Logovanje svih zaglavlja pre slanja zahteva
                console.log('Before sending request, all headers:', xhr.getAllResponseHeaders());
            },
            success: function (data, status) {
                loadAllRecenzije();
                alert("Review is successfully accepted");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
            }
        });

    });

    $('#table-div-reviews').on('click', '#declineButton', function (event) {
        event.preventDefault();
        let id = $(this).data('id');
        $.ajax({
            url: "/api/recenzija/decline/" + id,
            type: "PUT",

            beforeSend: function (xhr) {
                // Logovanje svih zaglavlja pre slanja zahteva
                console.log('Before sending request, all headers:', xhr.getAllResponseHeaders());
            },
            success: function (data, status) {
                loadAllRecenzije();
                alert("Review is successfully declined");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
            }
        });
    });


});


function loadAllRecenzije() {
    const StatusEnum = {
        0: "Created",
        1: "Confirmed",
        2: "Cancelled",
    };


    $.ajax({
        url: "/api/recenzija",
        type: "GET",

        beforeSend: function (xhr) {
            // Logovanje svih zaglavlja pre slanja zahteva
            console.log('Before sending request, all headers:', xhr.getAllResponseHeaders());
        },
        success: function (data, status) {
            let table = '<table id="table-recenzije" class="table table-striped table-hover">';
            table += '<tr><th>User</th><th>AirCompany</th><th>Title</th><th>Description</th><th>Image</th><th>State</th><th></th></tr>';



            for (element in data) {

                let rezervacija = '<td>' + data[element].Recezent.Username + '</td>';
                rezervacija += '<td>' + data[element].Aviokompanija + '</td>';
                rezervacija += '<td>' + data[element].Naslov + '</td>';
                rezervacija += '<td style="width: 250px; word-wrap: break-word; white-space: normal;">' + data[element].Sadrzaj + '</td>';
                //rezervacija += '<td>' + data[element].Image +
                '</td>';
                let imageSrc = data[element].ImagePath ? data[element].ImagePath : '\\Images\\noImage.jpg';
                rezervacija += '<td><img src="' +imageSrc+'" style="width:100px; height: 100px;"></td>';


                if (data[element].Status === 0) {

                    rezervacija += '<td><button type="submit" id="acceptButton" data-id="' + data[element].ID + '" style="background-color: green; color: white;" >Accept</button></td>';

                    rezervacija += '<td><button type="submit" id="declineButton" data-id="' + data[element].ID + '" style="background-color: red; color: white;">Decline</button></td>';
                } else {
                    if (data[element].Status === 1) {
                        rezervacija += '<td style = "color:green">' + StatusEnum[data[element].Status] +
                            '</td>';
                    } else if (data[element].Status === 2) {
                        rezervacija += '<td style = "color:red">' + StatusEnum[data[element].Status] +
                            '</td>';
                    }
                }



                table += '<tr>' + rezervacija + '</tr>';

            }

            table += '</table>';
            $('#table-div-reviews').html(table);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Request failed: " + textStatus + ", " + errorThrown);
        }
    });
}