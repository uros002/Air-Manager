var brMesta = 0;
var selectedValueSort = 0;
let lastClicked = 0;

$(document).ready(function () {
    loadAllLetoviEverything();

    $('#searchAllButton').click(function (event) {
        event.preventDefault();
        lastClicked = 0;
        loadAllLetoviEverything();
    });


    $('#searchButton').click(function (event) {
        event.preventDefault();
        lastClicked = 1;
        loadAllLetovi();
    });

    $('#statusFilter').change(function (event) {
        selectedValueSort = $(this).val();
        if (lastClicked === 1) {
            loadAllLetovi();
        } else {
            loadAllLetoviEverything();
        }

    });

    $('#table-div').on('click', '#reservationButton', function (event) {
        event.preventDefault();
        let id = $(this).attr('name');
        let num = $(this).data('brmesta');

        console.log(typeof (id))
        console.log(typeof (num));
        $.ajax({
            url: "/api/users/put",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ id: id, brMesta: num }),
            success: function (data, status) {
                loadAllLetovi();
                alert("Reservation is successfully made");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
            }
        });


    });

    $('#table-div').on('click', '#cancelReservationButton', function (event) {
        event.preventDefault();
        let id = $(this).attr('name');
        let num = $(this).data('brmesta');

        $.ajax({
            url: "/api/users/cancel",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ id: id, brMesta: num }),
            success: function (data, status) {
                loadAllLetovi();
                alert("Reservation is successfully canceled");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
            }
        });


    });

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

    $(document).on('click', '.aviokompanijaInfo', function (event) {
        let name = $(this).data('name');
        $.ajax({
            url: "/api/companies/" + name,
            type: "GET",

            success: function (data, status) {
                let companyInfo = createCompanyInfoHTML(data);
                $('#companyDivBottom').html(companyInfo);
                $('#companyDivBottom')[0].scrollIntoView({ behavior: "smooth" });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
            }
        });
    });

    //$('#departure-date').change(function () {

    //    var selectedDate = new Date($('#departure-date').val());
    //    var formattedDate = selectedDate.toLocaleDateString('en-GB'); // Postavite 'en-GB' za format dd/mm/yyyy
    //    $('#departure-date').val(formattedDate);
    //});

    //$('#return-date').change(function (event) {
    //    event.preventDefault();
    //    var selectedDate = new Date($('#return-date').val());
    //    var formattedDate = selectedDate.toLocaleDateString('en-GB'); // Postavite 'en-GB' za format dd/mm/yyyy
    //    $('#return-date').val(formattedDate);
    //});


});


function loadAllLetovi() {
    let departureLocation = $('#departure-location').val();
    let arrivalLocation = $("#arrival-location").val();
    let departureDate = $('#departure-date').val();
    //if (departureDate !== null && departureDate !== "") {
    //    departureDate = new Date(departureDate);
    //} else {
    //    departureDate = null;
    //}
    let returnDate = $('#return-date').val();
    //if (returnDate !== null && returnDate !== "") {
    //    returnDate = new Date(returnDate);
    //} else {
    //    returnDate = null;
    //}
    
    let numberOfPassengers = $('#number-of-passengers').val();
    if (numberOfPassengers === null || numberOfPassengers === 0 || numberOfPassengers == "") {
        numberOfPassengers = 1;
    }
    
    $.ajax({
        url: "/api/letovi/getLetovi",
        type: "GET",
        
        data: {
            departureLocation: departureLocation,
            arrivalLocation: arrivalLocation,
            numberOfPassengers: numberOfPassengers,
            sort: selectedValueSort,
            departureDate: departureDate,
            arrivalDate:returnDate
        
        },
        success: function (data, status) {
            
            //if (selectedValueSort === 0) {
            //    data.sort((a, b) => a.Cena - b.Cena);
            //} else if (selectedValueSort === 1) {
            //    data.sort((a, b) => b.Cena - a.Cena);
            //}

            let table = '<table id="table-letovi" class="table table-striped table-hover">';
            table += '<tr><th> AirCompany</th ><th>Departure</th><th>Arrival</th> <th>Date of departure</th><th>Price(per ticket)</th><th>Num of tickets</th></tr>'

            var passengers = $('#number-of-passengers').val();
            if (passengers === null || passengers === 0 || passengers == "") {
                passengers = 1;
            }

            var deferreds = [];

            data.forEach(function (element) {
                
               
                    let id = element.ID;
                let lijet = '<td class="aviokompanijaInfo" data-name=  "' + element.Aviokompanija + '" >' + element.Aviokompanija + '</td>';
                    lijet += '<td>' + element.PolaznaDestinacija + '</td>';
                    lijet += '<td>' + element.DolaznaDestinacija + '</td>';
                    lijet += '<td>' + formatDate(element.DatumIVremePolaska) + '</td>';
                    lijet += '<td> $' + element.Cena + '</td>';
                    lijet += '<td>' + passengers + '</td>';

                    let deferred = $.Deferred();

                    $.ajax({
                        url: "/api/rezervacija/find/" + id,
                        type: "GET",
                        success: function (data, status) {
                            if (data !== null) {
                                if (data.Status === 0 || data.Status === 1) {
                                    lijet += '<td><button type="submit" id="cancelReservationButton" name="' + data.ID + '" data-brmesta = "' + passengers + '" style="background-color: red; color: white;">Cancel</button></td>';
                                } else if (data.Status === 2) {
                                    lijet += '<td><label style=" color: red;">Canceled</label>';
                                } else if (data.Status === 3) {
                                    lijet += '<td><label style=" color: red;">Finished</label>';
                                }
                                deferred.resolve(lijet, true);
                            } else {
                                deferred.resolve(lijet, false);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error("Request failed: " + textStatus + ", " + errorThrown);
                            deferred.resolve(lijet, false);
                        }
                    });

                    deferreds.push(deferred.promise());
                
            });

            $.when.apply($, deferreds).then(function () {
                let results;
                if (arguments.length == 0) {
                    results = Array.from(arguments);
                }
                else if (arguments.length === 1) {
                    results = arguments[0];
                } else {
                    if (typeof arguments[1] === 'boolean') {
                        temp = Array.from(arguments);
                        results = new Array();
                        results[0] =  temp;
                    } else {


                        results = Array.from(arguments);
                    }
                }
                if (results.length > 0) {

                    if (results[0].length === 0) {
                        // Ako nema rezultata, možete manipulisati ili prikazati odgovarajuću poruku
                        console.log("Nema rezultata za prikaz.");
                        table += '</table>';
                        $('#table-div').html(table);
                        return;
                    }
                }

                results.forEach(function (result, index) {
                    let lijet = result[0];
                    let flag = result[1];

                    if (!flag) {
                        lijet += '<td><button type="submit" id="reservationButton" name="' + data[index].ID + '" data-brmesta = "' + passengers + '">Reserve</button></td>';
                    }

                    table += '<tr>' + lijet + '</tr>';
                });

                table += '</table>';
                $('#table-div').html(table);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Request failed: " + textStatus + ", " + errorThrown);
        }
    });
}




function loadAllLetoviEverything() {

    let startLocation = $('#departure-location').val();
    let endLocation = $("#arrival-location").val();

    $.get("/api/letovi/all", { 'departureLocation': startLocation, 'arrivalLocation': endLocation, 'sort': selectedValueSort }, function (data, status) {

        //if (selectedValueSort === 0) {
        //    data.sort((a, b) => a.Cena - b.Cena);
        //} else if (selectedValueSort === 1) {
        //    data.sort((a, b) => b.Cena - a.Cena);
        //}

        let table = '<table class="table table-striped table - hover">';
        table += '<tr><th> AirCompany</th ><th>Departure</th><th>Arrival</th> <th>Date of departure</th><th>Price(per ticket)</th><th>Free seats</th></tr>'

        for (element in data) {


            let lijet = '<td class="aviokompanijaInfo" data-name=  "' + data[element].Aviokompanija + '" >' + data[element].Aviokompanija + '</td>';
            lijet += '<td>' + data[element].PolaznaDestinacija + '</td>';
            lijet += '<td>' + data[element].DolaznaDestinacija + '</td>';
            lijet += '<td>' + formatDate(data[element].DatumIVremePolaska) + '</td>';
            lijet += '<td> $' + data[element].Cena + '</td>';
            lijet += '<td>' + data[element].BrSlobodnihMesta + '</td>';

            table += '<tr>' + lijet + '</tr>';
            console.log(data[element].PolaznaDestinacija)
        }

        table += '</table>';
        $('#table-div').html(table);

    });


}




//function loadAllLetovi() {

//    let startLocation = $('#departure-location').val();
//    let endLocation = $("#arrival-location").val();

//    $.get("/api/letovi", { 'PolaznaDestinacija': startLocation, 'DolaznaDestinacija': endLocation }, function (data, status) {
//        let table = '<table class="table table-striped table - hover">';
//        table += '<tr><th> Naziv agencije leta</th ><th>Lokacija odakle se kreće</th><th>Lokacija gde se sleće</th> <th>Datum polaska</th></tr>'
//        console.log('Authorization Header:', xhr.getAllResponseHeaders());
//        for (element in data) {


//            let lijet = '<td>' + data[element].Aviokompanija.Name + '</td>';
//            lijet += '<td>' + data[element].PolaznaDestinacija + '</td>';
//            lijet += '<td>' + data[element].DolaznaDestinacija + '</td>';
//            lijet += '<td>' + data[element].DatumIVremePolaska + '</td>';

//            table += '<tr>' + lijet + '</tr>';
//            console.log(data[element].PolaznaDestinacija)
//        }

//        table += '</table>';
//        $('#table-div').html(table);

//    });


//}


    //function loadAllLetovi() {

    //    let startLocation = $('#departure-location').val();
    //    let endLocation = $("#arrival-location").val();

    //    //$.get("/api/letovi", { 'PolaznaDestinacija': startLocation, 'DolaznaDestinacija': endLocation }, function (data, status) {
    //    //    let table = '<table class="table table-striped table - hover">';
    //    //    table += '<tr><th> Naziv agencije leta</th ><th>Lokacija odakle se kreće</th><th>Lokacija gde se sleće</th> <th>Datum polaska</th><th>Broj putnika</th></tr>'



    //    //    var passengers = $('#number-of-passengers').val();
    //    //    if (passengers === null || passengers === 0) {
    //    //        passengers = 0;
    //    //    }
    //    //    var num = 1;

    //    //    for (element in data) {


    //    //        let lijet = '<td>' + data[element].Aviokompanija.Name + '</td>';
    //    //        lijet += '<td>' + data[element].PolaznaDestinacija + '</td>';
    //    //        lijet += '<td>' + data[element].DolaznaDestinacija + '</td>';
    //    //        lijet += '<td>' + data[element].DatumIVremePolaska + '</td>';
    //    //        lijet += '<td>' + passengers + '</td>';
    //    //        if (num === 2) {
    //    //            lijet += '<td><button type="submit" style="background-color: red; color: white;" id="cancelReservationButton">Cancel</button></td>';
    //    //        } else {
    //    //            lijet += '<td><button type="submit" id="reserveButton">Reserve</button></td>';
    //    //        }
    //    //        table += '<tr>' + lijet + '</tr>';
    //    //        num = num + 1;
    //    //    }

    //    //    table += '</table>';
    //    //    $('#table-div').html(table);

    //    //});

    //    $.ajax({
    //        url: "/api/letovi",
    //        type: "GET",
    //        data: { 'PolaznaDestinacija': startLocation, 'DolaznaDestinacija': endLocation },
    //        beforeSend: function (xhr) {
    //            // Logovanje svih zaglavlja pre slanja zahteva
    //            console.log('Before sending request, all headers:', xhr.getAllResponseHeaders());
    //        },
    //        success: function (data, status) {
    //            let table = '<table id="table-letovi" class="table table-striped table-hover">';
    //            table += '<tr><th>Naziv agencije leta</th><th>Lokacija odakle se kreće</th><th>Lokacija gde se sleće</th><th>Datum polaska</th><th>Broj putnika</th></tr>';

    //            var passengers = $('#number-of-passengers').val();
    //            if (passengers === null || passengers === 0) {
    //                passengers = 0;
    //            }
    //            var num = 1;
    //            brMesta = passengers;
               
                

    //            for (element in data) {
    //                let id = data[element].ID;

    //                let lijet = '<td>' + data[element].Aviokompanija.Name + '</td>';
    //                lijet += '<td>' + data[element].PolaznaDestinacija + '</td>';
    //                lijet += '<td>' + data[element].DolaznaDestinacija + '</td>';
    //                lijet += '<td>' + data[element].DatumIVremePolaska + '</td>';
    //                lijet += '<td>' + passengers + '</td>';
    //                let flag = false;
    //                $.ajax({
    //                    url: "/api/rezervacija/find/" + id,
    //                    type: "GET",
    //                    success: function (data, status) {

    //                        if (data !== null) {
    //                            if (data.Status === 0 || data.Status === 1) {
    //                                lijet += '<td><button type="submit" id="cancelReservationButton" name="' + data.ID + '" data-brMesta = "' + passengers + '" style="background-color: red; color: white;">Cancel</button></td>';
    //                                flag = true;
    //                            } else if (data.Status === 2) {
    //                                lijet += '<td><label style="background-color: red; color: white;">Canceled</label>'
    //                                flag = true;

    //                            } else if (data.Status === 3) {
    //                                lijet += '<td><label style="background-color: white; color: red;">Finished</label>'
    //                                flag = true;
    //                            }
    //                        }
    //                    },
    //                    error: function (jqXHR, textStatus, errorThrown) {
    //                        console.error("Request failed: " + textStatus + ", " + errorThrown);
    //                    }
    //                });
    //                if (flag === false) {
    //                    lijet += '<td><button type="submit" id="reservationButton" name="' + data[element].ID + '" data-brMesta = "' + passengers + '">Reserve</button></td>';
    //                }
                  
    //                // lijet += '<td><button type="submit" id="reservationButton" name="' + data[element].ID + '">Reserve</button></td>';
    //                //if (num === 2) {
    //                //    lijet += '<td><button type="submit" style="background-color: red; color: white;" id="reservationButton" name="' + data[element].ID + '">Cancel</button></td>';
    //                //} else {
    //                //    lijet += '<td><button type="submit" id="reservationButton" name="' + data[element].ID + '">Reserve</button></td>';
    //                //}
    //                table += '<tr>' + lijet + '</tr>';
    //                num = num + 1;
    //            }

    //            table += '</table>';
    //            $('#table-div').html(table);
    //        },
    //        error: function (jqXHR, textStatus, errorThrown) {
    //            console.error("Request failed: " + textStatus + ", " + errorThrown);
    //        }
    //    });


    //}


function formatDate(dateString) {
    let date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0'); // dan
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // mesec (0-based, zato +1)
    const year = date.getFullYear(); // godina

    return `${day}/${month}/${year}`;
}


// Funkcija za kreiranje HTML-a za informacije o avio kompaniji
function createCompanyInfoHTML(aviokompanija) {
    let companyInfoHTML = `
                <div class="body-div">
            <div class="company-info" id="company-info">
            
                    <div class="form-row">
                        <h2>${aviokompanija.Name}</h2>
                    </div>
                    <div class="form-row">
                        <p>AirCompany Address: <span>${aviokompanija.Address}</span></p>
                        <p>Contact: <span>${aviokompanija.ContactInformation}</span></p>
                    </div>
                    <div class="form-row">
                        <p>Total flights: <span>${aviokompanija.Letovi.length}</span></p>
                    </div>
               
            `;
    companyInfoHTML += createReviewsTableHTML(aviokompanija.Recenzije);
    return companyInfoHTML;
}

// Funkcija za kreiranje HTML-a za tabelu recenzija
function createReviewsTableHTML(recenzije) {
    let reviewsHTML = `
                <div class="reviews-table">
                    <h3>Users reviews</h3>
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>User</th>
                                <th>Title</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

    recenzije.forEach(recenzija => {

        if (recenzija.Status === 1) {
            let imageSrc = recenzija.ImagePath ? recenzija.ImagePath : '\\Images\\noImage.jpg';
            reviewsHTML += `
                    <tr>
                        <td><img src="${imageSrc}"  style="width: 100px; height: 100px;"></td>
                        <td>${recenzija.Recezent.Username}</td>
                        <td>${recenzija.Naslov}</td>
                        <td>${recenzija.Sadrzaj}</td>
                    </tr>
                `;
        }
    });

    reviewsHTML += `
                        </tbody>
                    </table>
                </div></div>
        </div>
            `;
    return reviewsHTML;
}
