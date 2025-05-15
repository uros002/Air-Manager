let selectedValueSort = 0;
let lastClicked = 0;
$(document).ready(function () {

    loadAllLetoviEverything();
    //loadAllLetovi();
    $('#searchAllButton').click(function (event) {
        event.preventDefault();
        lastClicked = 0;
        loadAllLetoviEverything();
    });

    $('#statusFilter').change(function (event) {
        selectedValueSort = $(this).val();
        if (lastClicked === 1) {
            loadAllLetovi();
        } else {
            loadAllLetoviEverything();
        }
    });

    $('#searchButton').click(function (event) {
        event.preventDefault();
        const startLocation = $('#departure-location').val();
        const endLocation = $("#arrival-location").val();
        lastClicked = 1;

// if (startLocation.length === 0 && endLocation.length === 0) {
            loadAllLetovi();
            
       // } else {

          //  loadSearchedLetovi(startLocation,endLocation);
            //$.ajax({
            //    type: "GET",
            //    url: "http://localhost:53577/api/letovi",
            //    data: { PolaznaDestinacija, startLocation },
            //    dataType: 'json',
            //    success: function (data) {
            //        let table = '<table class="table table-striped table-hover">';
            //        table += '<tr><th>Naziv agencije leta</th><th>Lokacija odakle se kreće</th><th>Lokacija gde se sleće</th><th>Datum polaska</th></tr>';
            //        $.each(data, function (index, val) {
            //            let lijet = '<td>' + val.Aviokompanija.Name + '</td>';
            //            lijet += '<td>' + val.PolaznaDestinacija + '</td>';
            //            lijet += '<td>' + val.DolaznaDestinacija + '</td>';
            //            lijet += '<td>' + val.DatumIVremePolaska + '</td>';

            //            table += '<tr>' + lijet + '</tr>';
            //        });
            //        table += '</table>';
            //        $('#table-div').html(table);
            //    }
            //});
      //  }
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
    //$('#table-letovi ').on('click','td.aviokompanijaInfo', function (event) {
    //    let name = $(this).data('name');
    //    $.ajax({
    //        url: "/api/companies/" + name,
    //        type: "GET",

    //        success: function (data, status) {
    //            let companyInfo = createCompanyInfoHTML(data);
    //            $('#companyDivBottom').html(companyInfo);
    //            $('#companyDivBottom')[0].scrollIntoView({ behavior: "smooth" });
    //        },
    //        error: function (jqXHR, textStatus, errorThrown) {
    //            console.error("Request failed: " + textStatus + ", " + errorThrown);
    //        }
    //    });
    //});
    

    ////// Background script
    //chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //    console.log("Received message:", request);
    //    if (request.greeting === "hello") {
    //        sendResponse({ farewell: "goodbye" });
    //    }
    //    return true; // Neophodno za asinkroni sendResponse
    //});

    //// Content script
    //console.log("Sending message...");
    //chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
    //    if (chrome.runtime.lastError) {
    //        console.error(chrome.runtime.lastError.message);
    //    } else {
    //        console.log("Received response:", response);
    //    }
    //});
});

//function loadSearchedLetovi(startLocation, endLocation) {
//    $.get("/api/letovi" ,{'PolaznaDestinacija' : startLocation,'DolaznaDestinacija' : endLocation } ,function (data, status) {
//        if (status === "success") {
//            let table = '<table class="table table-striped table-hover">';
//            table += '<tr><th>Naziv agencije leta</th><th>Lokacija odakle se kreće</th><th>Lokacija gde se sleće</th><th>Datum polaska</th></tr>';
//            for (element in data) {


//                let lijet = '<td>' + data[element].Aviokompanija.Name + '</td>';
//                lijet += '<td>' + data[element].PolaznaDestinacija + '</td>';
//                lijet += '<td>' + data[element].DolaznaDestinacija + '</td>';
//                lijet += '<td>' + data[element].DatumIVremePolaska + '</td>';

//                table += '<tr>' + lijet + '</tr>';

//            }

//            table += '</table>';
//            $('#table-div').html(table);
//        } else {
//            console.error("Error fetching flights data");
//        }
//    }).fail(function (jqXHR, textStatus, errorThrown) {
//        console.error("Request failed: " + textStatus + ", " + errorThrown);
//    });
//}



function loadAllLetovi() {

    let departureLocation = $('#departure-location').val();
    let arrivalLocation = $("#arrival-location").val();
    let departureDate = $('#departure-date').val();
   
    
    let arrivalDate = $('#return-date').val();
    

    $.ajax({
        url: "/api/letovi/getLetovi",
        type: "GET",

        data: {
            departureLocation: departureLocation,
            arrivalLocation: arrivalLocation,
            numberOfPassengers: 0,
            sort: selectedValueSort,
            departureDate: departureDate,
            arrivalDate: arrivalDate

        },
        success: function (data, status) {

            //if (selectedValueSort === 0) {
            //    data.sort((a, b) => a.Cena - b.Cena);
            //} else if (selectedValueSort === 1) {
            //    data.sort((a, b) => b.Cena - a.Cena);
            //}

            let table = '<table class="table table-striped table - hover" id="table-letovi">';
            table += '<tr><th> Naziv agencije leta</th ><th>Lokacija odakle se kreće</th><th>Lokacija gde se sleće</th> <th>Datum polaska</th><th>Cena</th><th>Broj slobodnih mesta</th></tr>'

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
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Request failed: " + textStatus + ", " + errorThrown);
        }
    });


}


function loadAllLetoviEverything() {

    let startLocation = $('#departure-location').val();
    let endLocation = $("#arrival-location").val();

    $.get("/api/letovi/all", { 'departureLocation': startLocation, 'arrivalLocation': endLocation, 'sort':selectedValueSort }, function (data, status) {

        //if (selectedValueSort === 0) {
        //    data.sort((a, b) => a.Cena - b.Cena);
        //} else if (selectedValueSort === 1) {
        //    data.sort((a, b) => b.Cena - a.Cena);
        //}

        let table = '<table class="table table-striped table - hover" id="table-letovi">';
        table += '<tr><th> AirCompany</th ><th>From:</th><th>To:</th> <th>Date of departure</th><th>Price(per ticket)</th><th>Free seats</th></tr>'

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
