$(document).on("click", "#scrape-button", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
    window.location.replace("/scrape");
});

//Delete an article
$(document).on("click", ".delete-article", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "DELETE",
            url: "/saved/" + thisId
        })
        .then(function(data) {
            // Log the response
            // console.log(data);
            location.reload();
        });
});

//Save an article
$(document).on("click", ".save-article", function() {
    var thisId = $(this).attr("data-id");
    $(this).hide();
    var data = {}
    data.title = $("#title-" + thisId).text();
    data.link = $("#link-" + thisId).text();
    data.excerpt = $("#excerpt-" + thisId).text();
    $.ajax({
        method: "POST",
        dataType: "json",
        url: "/api/saved",
        data: data
    })
});

//Go to the notes page for a particular article
$(document).on("click", ".note-comment", function() {
    let thisId = $(this).attr("data-id");
    // console.log(thisId);
    // $.ajax({
    //         method: "GET",
    //         url: "/articles/" + thisId
    //     })
    window.location.replace("/articles/" + thisId);
});

// Note
$(document).on("click", "#submit-note", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                title: $("#title-note").val(),
                body: $("#note-description").val()
            }
        })
        .then(function(data) {
            // console.log(data);
            window.location.replace("/articles/" + data._id);
        });

    $("#title-note").val("");
    $("#note-description").val("");
});

//delete a note
$(document).on("click", ".delete-note", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "DELETE",
            url: "/articles/" + thisId
        })
        .then(function(data) {
            // console.log(data);
            location.reload();
        });
});