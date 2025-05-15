var filterSelected = 0;

let aviokompanija = null;
$(document).ready(function () {

    loadAllReservations();

    $(document).on('click','#reviewButton', function (event) {
        aviokompanija = $(this).data('aviokompanija');

        var formHtml = `
          <div class="reviewDivBottomContent" id="reviewDivBottomContent">
        <h1>Review</h1>
        <form id="review-form" >
            <div class="form-row">
                <div class="form-group">
                    <label for="title">Title:</label>
                    <input type="text" id="title" name="title" class="form-control">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea id="description" name="description" class="form-control" rows="4"></textarea>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="imageInput" class="form-label">Choose an image</label>
                    <input class="form-control" type="file" id="imageInput" name="image" accept="image/*">
                </div>
            </div>
            <div class="form-group button-container">
                <button type="submit" id="giveReview" >Send</button>
            </div>
        </form>
</div>
    
        `;

        $('#reviewDivBottom').html(formHtml);
        $('#reviewDivBottom')[0].scrollIntoView({ behavior: "smooth" });


        //$(document).on('change', '#imageInput', function (event) {
        //    var tmppath = URL.createObjectURL(event.target.files[0]);
        //    var tt = this.files[0].mozFullPath;
        //    console.log(tt);
        //    console.log(tmppath)
        //});

    });

    $(document).on('click', '#giveReview', function (event) {
        event.preventDefault();

        let title = $('#title').val();
        let description = $('#description').val();
        let image = $('#imageInput').val();

        $.ajax({
            url: "api/recenzija/post",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify({
                Recezent: null,
                Aviokompanija: aviokompanija,
                Naslov: title,
                Sadrzaj: description,
                ImagePath: image,
                Image: null,
                Status: 0

            }),
            success: function (response) {
                
                $('#title').val("");
                 $('#description').val("");
                $('#imageInput').val("");

                $('#reviewDivBottom').empty();
                $('#table-div-reservations')[0].scrollIntoView({behavior: "smooth"});

            },
            error: function (response) {
                alert('You have already gave review on this flight');
                
                $('#title').val("");
                $('#description').val("");
                $('#imageInput').val("");

                $('#reviewDivBottom').empty();
                $('#table-div-reservations')[0].scrollIntoView({ behavior: "smooth" });
            }
        });
    });



    
    

    $('#statusFilter').change(function (event) {
        event.preventDefault();
        filterSelected = $(this).val();
        loadAllReservations();
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



    function loadAllReservations() {
        const StatusEnum = {
            0: "Created",
            1: "Confirmed",
            2: "Cancelled",
            3: "Finished"
        };

        let filter = parseInt($('#statusFilter').val(), 10);


        $.ajax({
            url: "/api/rezervacija/user",
            type: "GET",


            beforeSend: function (xhr) {
                // Logovanje svih zaglavlja pre slanja zahteva
                console.log('Before sending request, all headers:', xhr.getAllResponseHeaders());
            },
            success: function (data, status) {
                let table = '<table id="table-rezervacije" class="table table-striped table-hover">';
                table += '<tr><th>AirCompany</th><th>Departure</th><th>Arrival</th><th>Departure date</th><th>Num of tickets</th><th>Total price</th><th>State</th><th></th></tr>';



                for (element in data) {
                    if (data[element].Status === filter) {

                        let rezervacija = '<td>' + data[element].Aviokompanija + '</td>';
                        rezervacija += '<td>' + data[element].Let.PolaznaDestinacija + '</td>';
                        rezervacija += '<td>' + data[element].Let.DolaznaDestinacija + '</td>';
                        rezervacija += '<td>' + formatDate(data[element].Let.DatumIVremePolaska) + '</td>';
                        rezervacija += '<td>' + data[element].BrPutnika +
                            '</td>';
                        rezervacija += '<td> $' + data[element].UkupnaCena +
                            '</td>';


                        if (data[element].Status === 0) {

                            rezervacija += '<td>' + StatusEnum[data[element].Status] +
                                '</td>';
                        } else {
                            if (data[element].Status === 1) {
                                rezervacija += '<td style = "color:green">' + StatusEnum[data[element].Status] +
                                    '</td>';
                            } else if (data[element].Status === 2) {
                                rezervacija += '<td style = "color:red">' + StatusEnum[data[element].Status] +
                                    '</td>';
                            } else {
                                rezervacija += '<td><button type="submit" id="reviewButton" data-aviokompanija= "' + data[element].Aviokompanija + '">Review</button></td>';
                            }
                        }



                        table += '<tr>' + rezervacija + '</tr>';

                    }
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