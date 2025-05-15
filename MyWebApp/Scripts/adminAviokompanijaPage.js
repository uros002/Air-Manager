
$(document).ready(function () {

    loadAllCompanies();

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

    $('#table-div-aviokompanije').on('click', '#deleteButton', function (event) {
        event.preventDefault();
        let name = $(this).attr('name');
       
        $.ajax({
            url: "/api/companies/put/" + name,
            type: "PUT",
            success: function (data, status) {
                loadAllCompanies();
                alert("AirCompany is successfully deleted");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
                alert("Cannot delete AirCompany" + name + "!");
            }
        });


    });

   


    $('#table-div-aviokompanije').on('click', '#editButton', function (event) {
        event.preventDefault();
        let name = $(this).data('name');
        let address = $(this).data('address');
        let contact = $(this).data('contact');
        $('#AviokompanijaOldName').val(name);
        $("#AviokompanijaName").val(name);
        $("#AviokompanijaAddress").val(address);
        $("#AviokompanijaContact").val(contact);
        
    });

    $('#Clear').click(function (event) {
        event.preventDefault();
        $('#AviokompanijaOldName').val("");
        $("#AviokompanijaName").val("");
        $("#AviokompanijaAddress").val("");
        $("#AviokompanijaContact").val("");
    });



    $("#actionButton").click(function (event) {
        event.preventDefault();
        let oldName = $('#AviokompanijaOldName').val();
        let newName = $("#AviokompanijaName").val();
        let address = $("#AviokompanijaAddress").val();
        let contact = $("#AviokompanijaContact").val();
        $.ajax({
            url: "/api/companies/post/",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({OldName:oldName ,NewName: newName, Address: address, ContactInformation: contact }),
            success: function (data, status) {
                $('#AviokompanijaOldName').val("");
                $("#AviokompanijaName").val("");
                $("#AviokompanijaAddress").val("");
                $("#AviokompanijaContact").val("");
                loadAllCompanies();
                alert("AirCompany is added/edited successfully");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
            }
        });
    });

    $("#searchButton").click(function (event) {
        event.preventDefault();
        let name = $("#SearchName").val();
        let address = $("#SearchAddress").val();
        let contact = $("#SearchContact").val();

        $.ajax({
           url: "/api/companies/search" ,
            type: "GET",
            data: {'name':name,'address':address,'contact':contact},
            
            success: function (data, status) {
                

                let table = '<table class="table table-striped table - hover">';
                table += '<tr><th>Name</th ><th>Address</th><th>Contact</th><th>Number of flights</th><th></th><th></th> </tr>'


                for (element in data) {

                    if (data[element].IsDeleted === false) {

                        let company = '<td name="CompanyName">' + data[element].Name + '</td>';
                        company += '<td name="CompanyAddress">' + data[element].Address + '</td>';
                        company += '<td name="CompanyContact">' + data[element].ContactInformation + '</td>';
                        company += '<td name="CompanyFlightsNumber">' + data[element].Letovi.length + '</td>';


                        company += '<td><button type="submit" id="deleteButton" name="' + data[element].Name + '">Delete</button></td>';

                        company += '<td><button type="submit" id="editButton" data-name="' + data[element].Name + '" data-address="' + data[element].Address + '" data-contact="' + data[element].ContactInformation + '" >Edit</button></td>';

                        table += '<tr>' + company + '</tr>';
                    }
                }
                

                table += '</table>';
                $('#table-div-aviokompanije').html(table);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
            }
        });
    });
});


function loadAllCompanies() {
    $.get("/api/companies", function (data, status) {
        let table = '<table class="table table-striped table - hover">';
        table += '<tr><th>Name</th ><th>Address</th><th>Contact</th><th></th><th></th> </tr>'

       

        for (element in data) {
            if (data[element].IsDeleted === false) {

                let company = '<td name="CompanyName">' + data[element].Name + '</td>';
                company += '<td name="CompanyAddress">' + data[element].Address + '</td>';
                company += '<td name="CompanyContact">' + data[element].ContactInformation + '</td>';



                company += '<td><button type="submit" id="deleteButton" name="' + data[element].Name + '">Delete</button></td>';

                company += '<td><button type="submit" id="editButton" data-name="' + data[element].Name + '" data-address="' + data[element].Address + '" data-contact="' + data[element].ContactInformation + '" >Edit</button></td>';

                table += '<tr>' + company + '</tr>';
            }
        }

        table += '</table>';
        $('#table-div-aviokompanije').html(table);

    });


}