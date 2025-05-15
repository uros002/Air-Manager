$(document).ready(function () {

 
    loadAllReservations();

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

    $('#table-div-reservations').on('click', '#acceptButton', function (event) {
        event.preventDefault();
        let id = $(this).data('id');

        $.ajax({
            url: "/api/rezervacija/accept/" + id,
            type: "PUT",

            beforeSend: function (xhr) {
                // Logovanje svih zaglavlja pre slanja zahteva
                console.log('Before sending request, all headers:', xhr.getAllResponseHeaders());
            },
            success: function (data, status) {
                loadAllReservations();
                alert("Reservation is successfully accepted");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
            }
        });

    });

    $('#table-div-reservations').on('click', '#declineButton', function (event) {
        event.preventDefault();
        let id = $(this).data('id');
        $.ajax({
            url: "/api/rezervacija/decline/" + id,
            type: "PUT",

            beforeSend: function (xhr) {
                // Logovanje svih zaglavlja pre slanja zahteva
                console.log('Before sending request, all headers:', xhr.getAllResponseHeaders());
            },
            success: function (data, status) {
                loadAllReservations();
                alert("Reservation is successfully declined");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
            }
        });
    });


});


function loadAllReservations() {
    const StatusEnum = {
        0: "Created",
        1: "Confirmed",
        2: "Cancelled",
        3: "Finished"
    };

    
    $.ajax({
        url: "/api/rezervacija",
        type: "GET",
        
        beforeSend: function (xhr) {
            // Logovanje svih zaglavlja pre slanja zahteva
            console.log('Before sending request, all headers:', xhr.getAllResponseHeaders());
        },
        success: function (data, status) {
            let table = '<table id="table-rezervacije" class="table table-striped table-hover">';
            table += '<tr><th>AirCompany</th><th>Departure</th><th>Arrival</th><th>Date of departure</th><th>Num of tickets</th><th>Total price</th><th>State</th><th></th></tr>';



            for (element in data) {

                let rezervacija = '<td>' + data[element].Aviokompanija + '</td>';
                rezervacija += '<td>' + data[element].Let.PolaznaDestinacija + '</td>';
                rezervacija += '<td>' + data[element].Let.DolaznaDestinacija + '</td>';
                rezervacija += '<td>' + formatDate(data[element].Let.DatumIVremePolaska) + '</td>';
                rezervacija += '<td>' + data[element].BrPutnika +
                    '</td>';
                rezervacija += '<td>$' + data[element].UkupnaCena +
                    '</td>';
                

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
                    } else {
                        rezervacija += '<td >' + StatusEnum[data[element].Status] +
                            '</td>';
                    }
                }

                

                table += '<tr>' + rezervacija + '</tr>';

            }

            table += '</table>';
            $('#table-div-reservations').html(table);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Request failed: " + textStatus + ", " + errorThrown);
        }
    });
}


function formatDate(dateString) {
    let date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0'); // dan
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // mesec (0-based, zato +1)
    const year = date.getFullYear(); // godina

    return `${day}/${month}/${year}`;
}