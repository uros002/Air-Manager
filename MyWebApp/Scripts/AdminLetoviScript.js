let id = null;
$(document).ready(function () {
    createAddContainer();

    loadAllLetovi();

    $('#searchButton').click(function (event) {
        event.preventDefault();

        loadAllLetovi();
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

    $('#table-div-flights').on('click', '#deleteButton', function (event) {
        event.preventDefault();
        let id = $(this).attr('name');
        let name = $(this).data('flight');
        $.ajax({
            url: "/api/letovi/delete/" + id,
            type: "DELETE",
            success: function (data, status) {
                loadAllLetovi();
                alert("Flight " + name + " is successfully deleted");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
                alert("Cannot delete Flight" + name + "!");
            }
            
        });
    });

        $('#Apply').click(function (event) {
            event.preventDefault();
            
            let aviokompanijaName = $("#aviokompanija").val();
            /*let aviokompanija = { Name: aviokompanijaName, Address: "", ContactInformation: "" };*/
            let polaznaLokacija = $("#polaznaLokacija").val();
            let dolaznaLokacija = $("#dolaznaLokacija").val();
            let datumPoletanja =  $("#datumPoletanja").val();
            let datumPovratka = $("#datumPovratka").val();
            let cenaKarte = $("#cenaKarte").val();
            let brojMesta = $("#brojMesta").val();

            let satPoletanja = $('#satPoletanja').val();
            let minPoletanja = $('#minutiPoletanja').val();
            let satSletanja = $('#satSletanja').val();
            let minSletanja = $('#minutiSletanja').val();

            if (datumPoletanja == "") {
                datumPoletanja = "1-1-1";
            }
            if (datumPovratka == "") {
                datumPovratka = "1-1-1";
            }

            var parts = datumPoletanja.split('-');
            let date1 = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], satPoletanja, minPoletanja));

            parts = datumPovratka.split('-');
            let date2 = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], satSletanja, minSletanja));

            $.ajax({
                url: "/api/letovi/post/",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    ID:id,
                    Aviokompanija: aviokompanijaName,
                    PolaznaDestinacija: polaznaLokacija,
                    DolaznaDestinacija: dolaznaLokacija,
                    DatumIVremePolaska:date1,
                    DatumIVremeDolaska: date2,
                    Cena: cenaKarte,
                    BrZauzetihMesta: 0,
                    BrSlobodnihMesta: brojMesta}),
                success: function (data, status) {
                    $("#aviokompanija").val("");
                    $("#polaznaLokacija").val("");
                    $("#dolaznaLokacija").val("");
                    $("#datumPoletanja").val("");
                    $("#datumPovratka").val("");
                    $("#cenaKarte").val("");
                    $("#brojMesta").val("");
                    $('#satPoletanja').val("");
                   $('#minutiPoletanja').val("");
                    $('#satSletanja').val("");
                   $('#minutiSletanja').val("");
                    id = null;
                    loadAllLetovi();

                    alert("Flight is added/edited successfuly");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Request failed: " + textStatus + ", " + errorThrown);
                    alert("Don not use Add button if Editing flight");
                }
            });


        });

    $('#Edit').click(function (event) {
        let aviokompanijaName = $("#aviokompanija").val();
        /*let aviokompanija = { Name: aviokompanijaName, Address: "", ContactInformation: "" };*/
        let polaznaLokacija = $("#polaznaLokacija").val();
        let dolaznaLokacija = $("#dolaznaLokacija").val();
        let datumPoletanja = $("#datumPoletanja").val();
        let datumPovratka = $("#datumPovratka").val();
        let cenaKarte = $("#cenaKarte").val();
        let brojMesta = $("#brojMesta").val();

        let satPoletanja = $('#satPoletanja').val();
        let minPoletanja = $('#minutiPoletanja').val();
        let satSletanja = $('#satSletanja').val();
        let minSletanja = $('#minutiSletanja').val();

        if (datumPoletanja == "") {
            datumPoletanja = "1-1-1";
        }
        if (datumPovratka == "") {
            datumPovratka = "1-1-1";
        }

        var parts = datumPoletanja.split('-');
        let date1 = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], satPoletanja, minPoletanja));

        parts = datumPovratka.split('-');
        let date2 = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], satSletanja, minSletanja));
        let flag = false;
        if (satPoletanja < 0 || satPoletanja > 23 || satSletanja < 0 || satSletanja >23 || minPoletanja < 0 || minPoletanja > 59 || minSletanja < 0 || minSletanja > 59) {
            flag = true;
        }
        if (flag === false) {
            $.ajax({
                url: "/api/letovi/put/izmena",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    ID: -1,
                    Aviokompanija: aviokompanijaName,
                    PolaznaDestinacija: polaznaLokacija,
                    DolaznaDestinacija: dolaznaLokacija,
                    DatumIVremePolaska: date1,
                    DatumIVremeDolaska: date2,
                    Cena: cenaKarte,
                    BrZauzetihMesta: 0,
                    BrSlobodnihMesta: brojMesta
                }),
                success: function (data, status) {
                    $("#aviokompanija").val("");
                    $("#polaznaLokacija").val("");
                    $("#dolaznaLokacija").val("");
                    $("#datumPoletanja").val("");
                    $("#datumpovratka").val("");
                    $("#cenaKarte").val("");
                    $("#brojMesta").val("");
                    $('#satPoletanja').val("");
                    $('#minutiPoletanja').val("");
                    $('#satSletanja').val("");
                    $('#minutiSletanja').val("");
                    id = null;
                    loadAllLetovi();

                    alert("Flight is added/edited successfuly");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Request failed: " + textStatus + ", " + errorThrown);
                    alert("Don not use Edit button if adding flight");
                }
            });
        } else {
            alert("Put correct values for hours and minutes");
        }




    });

    $('#table-div-flights').on('click', '#editButton', function (event) {
        event.preventDefault();
        id = $(this).data('id');
        
        $.ajax({
            url: "/api/letovi/"+id,
            type: "GET",
            success: function (data, status) {
                
                $("#aviokompanija").val(data.Aviokompanija);
                $("#polaznaLokacija").val(data.PolaznaDestinacija);
                $("#dolaznaLokacija").val(data.DolaznaDestinacija);
               // $("#datumPoletanja").val(data.DatumIVremePolaska);
                //$("#datumpovratka").val(data.DatumIVremeDolaska);
                $("#cenaKarte").val(data.Cena);
                $("#brojMesta").val(data.BrSlobodnihMesta)

                var date = data.DatumIVremePolaska.toString("yyyy/mm/dd");
                var onlyDate = date.split('T')[0];
                var onlyHours = date.split('T')[1];
                var year = onlyDate.split('-')[0];
                var month = onlyDate.split('-')[1];
                var day = onlyDate.split('-')[2];
                var hour = onlyHours.split(':')[0];
                var hourNum = parseInt(hour, 10);
                var min = onlyHours.split(':')[1];
                var minNum = parseInt(min, 10);

                let number = parseInt(month, 10);

                //number = number - 1;
                //month = String(number).padStart(2, '0');

                var formatedDate = year + '-' + month + '-' + day;
                $('#datumPoletanja').val(formatedDate);
                $('#satPoletanja').val(hourNum);
                $('#minutiPoletanja').val(minNum);


                 date = data.DatumIVremeDolaska.toString("yyyy/mm/dd");
                 onlyDate = date.split('T')[0];
                 onlyHours = date.split('T')[1];
                 year = onlyDate.split('-')[0];
                 month = onlyDate.split('-')[1];
                 day = onlyDate.split('-')[2];
                 hour = onlyHours.split(':')[0];
                 hourNum = parseInt(hour, 10);
                 min = onlyHours.split(':')[1];
                 minNum = parseInt(min, 10);

                 number = parseInt(month, 10);

               // number = number - 1;
                //month = String(number).padStart(2, '0');

                 formatedDate = year + '-' + month + '-' + day;
                $('#datumPovratka').val(formatedDate);
                $('#satSletanja').val(hourNum);
                $('#minutiSletanja').val(minNum);


                $("#polaznaLokacija").attr('readonly',true);
                $("#dolaznaLokacija").attr('readonly', true);
                loadAllLetovi();

                $('#add-container')[0].scrollIntoView({behavior: "smooth"})
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
            }
        });


    });

    

});

function createAddContainer() {
    $.get("/api/companies", function (data, status) {
        let options = '';
        data.forEach(function (aviokompanija) {
            options += '<option value="' + aviokompanija.Name + '">' + aviokompanija.Name + '</option>';
        });
        $('#aviokompanija').html(options);  // Dodajemo opcije u select element
    });
}

function loadAllLetovi() {

    let departureLocation = $('#departure-location').val();
    let arrivalLocation = $("#arrival-location").val();
    let departureDate = $('#departure-date').val();
    
    $.ajax({
        url: "/api/letovi/allAdmin",
        type: "GET",
        data: {
            'departureLocation': departureLocation, 'arrivalLocation': arrivalLocation, "departureDate": departureDate
        },
        beforeSend: function (xhr) {
            // Logovanje svih zaglavlja pre slanja zahteva
            console.log('Before sending request, all headers:', xhr.getAllResponseHeaders());
        },
        success: function (data, status) {
            let table = '<table id="table-letovi" class="table table-striped table-hover">';
            table += '<tr><th>AirCompany</th><th>From</th><th>To</th><th>Date of departure</th><th>Free seats</th><th>State</th></tr>';
            var StatusLeta = {
                0: "Active",
                1: "Canceled",
                2: "Finished"
            };


            for (element in data) {

                

                let lijet = '<td>' + data[element].Aviokompanija + '</td>';
                lijet += '<td>' + data[element].PolaznaDestinacija + '</td>';
                lijet += '<td>' + data[element].DolaznaDestinacija + '</td>';
                lijet += '<td>' + formatDate(data[element].DatumIVremePolaska) + '</td>';
                lijet += '<td>' + data[element].BrSlobodnihMesta +
                    '</td>';
                lijet += '<td>' + StatusLeta[data[element].Status] + '<td>';

                if (data[element].Status == 0) {

                    lijet += '<td><button type="submit" id="deleteButton" name="' + data[element].ID + '"  data-flight="' + data[element].Name + '" style="background-color: red; color: white;">Delete</button></td>';
                    lijet += '<td><button type="submit" id="editButton" data-id="' + data[element].ID + '"  >Edit</button></td>';
                } else {
                    lijet += '<td><button type="submit" id="deleteButton" name="' + data[element].ID + '"  data-flight="' + data[element].Name + '" style="background-color: red; color: #8B0000;" disabled>Delete</button></td>';
                    lijet += '<td><button type="submit" id="editButton" data-id="' + data[element].ID + '" style="background-color: #0056b3; color: #00008B;" disabled  >Edit</button></td>';
                }
                

            table += '<tr>' + lijet + '</tr>';

            }

            table += '</table>';
            $('#table-div-flights').html(table);
        
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
