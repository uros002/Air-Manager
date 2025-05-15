
$(document).ready(function () {

    loadAllCompanies();

    $(document).on('click', '#previewCardButton', function (event) {
        event.preventDefault();
        
        let name = $(this).data('name');
        $.ajax({
            url: "/api/companies/" + name,
            type: "GET",

            success: function (data, status) {
                let companyInfo = createCompanyInfoHTML(data);
                $('#companyDivBottom').html(companyInfo);
                $('#companyDivBottom')[0].scrollIntoView({ behaviour: "smooth" });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed: " + textStatus + ", " + errorThrown);
            }
        });

       
        
        // Prikazujemo informacije o avio kompaniji i recenzije na stranici
       // document.getElementById('companyInfoContainer').innerHTML = createCompanyInfoHTML(aviokompanija);
        //document.getElementById('reviewsContainer').innerHTML = createReviewsTableHTML(aviokompanija.recenzije);

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

   
});


function loadAllCompanies() {
    $.get("/api/companies", function (data, status) {
        let table = '<table class="table table-striped table - hover">';
        table += '<tr><th>Name</th ><th>Address</th><th>Contact</th><th></th><th></th> </tr>'

        let card = '<div class="cards-div">';


        for (element in data) {
            if (data[element].IsDeleted === false) {

                let cardCompany = '<div class="card text-white bg-secondary mb-3 w-150"><div class="card-body" ><h5 class="card-title">' + data[element].Name +'</h5>'
                cardCompany += '<p class="card-text">' + data[element].Address + '</p>'
                cardCompany += '<p class="card-text">' + data[element].ContactInformation + '</p>'
                cardCompany += '<div class="button-container"><button type="submit" id="previewCardButton" data-name = "' + data[element].Name + '" data-address = "' + data[element].Address + '" data-contact = "' + data[element].ContactInformation + '">Preview</button></div>'
                let company = '<td class="airCompanyClass" name="CompanyName">' + data[element].Name + '</td>';
                company += '<td name="CompanyAddress">' + data[element].Address + '</td>';
                company += '<td name="CompanyContact">' + data[element].ContactInformation + '</td>';



                card += cardCompany;
                card += '</div></div>';

                table += '<tr>' + company + '</tr>';
            }
        }
        card += '</div>';
        
        table += '</table>';
        $('#table-div-aviokompanije').html(card);

    });


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
                        <p>AirCompany address: <span>${aviokompanija.Address}</span></p>
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
                        <td style="width: 250px; word-wrap: break-word; white-space: normal;">${recenzija.Sadrzaj}</td>
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


