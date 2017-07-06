// calender for add post page only





// Dom effects
$(document).ready(function() {

    $('.alert').hide(2000);
    $('header').fadeTo(1000, 1);
    $('.jumbotron').fadeTo(2000, 1);
    $('#blogheading').fadeTo(1000, 1);
});



$('#datepicker input').datepicker({
    maxViewMode: 3,
    todayBtn: true,
    clearBtn: true,
    autoclose: true,
    todayHighlight: true
});

// for the wysiwig editor
$(document).ready(function() {
    $('#summernote').summernote({
        height: 300,
        minheight: null,
        focus: true,

    });

    $('#summernote2').summernote({
        height: 500,
        minheight: null,
        focus: true

    });

    $('#dashboardform').hide();

});

function slugify(text) {

    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

// smooth scrolling function when the link is in the web page
$(function() {
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
});

$('#showLinkForm').click(function() {

    $('#dashboardform').show();

});

$('#hideLinkForm').click(function() {

    $('#dashboardform').hide();

});

// 
// Add New Link
//  
$('form').on('click', '#addlink', function() {
    $.ajax({
        cache: false,
        timeout: 0,
        url: "/user/addlink",
        type: "POST",
        data: $("form").serialize(),
        success: function(response) {

            // Simply reload the page after success. 
            location.reload();

        },
        error: function(jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connected.\n Verify Network connection.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.log(msg);
        },
    });
});

// new catogory addition
$('#newCategory').click(function() {
    $('#newCategory').hide();
    $('#editCategory').hide();
    $('#addNewCategory').append("<div class='form-group' id='removeCat'><input type='text' class='form-control' id='addNewCat' name='category' placeholder='New Category'><button type='button' id='submitCategory' class='btn btn-sm btn-primary'>Add</button>&nbsp;<button type='button' id='cancelCategory' class='btn btn-sm btn-warning'>Cancel</button></div>");
    $('#categoryFormList').hide();

});

$('#addNewCategory').on('click', '#submitCategory', function() {
    // Check if the name is null
    var catName = $('#addNewCat').val();

    if (!catName) {
        console.log("name is empty");
        return;
    }
    $.ajax({
        cache: false,
        timeout: 0,
        url: "/user/addcategory",
        type: "POST",
        data: $("form").serialize(),
        success: function(response) {
            console.log("new category added.");
            // append to categoryform and edit lists
            $('#categoryFormList').append("<option id='" + response._id + "'>" + response.name + "</option>");
            // have the server send back updates to the page.
            console.log($('#editCategoryBlock').find('tbody'));
            $('#editCategoryBlock').find('tbody').append("<tr><td class='hidden'>" + response._id + "</td><td class='categoryName'>" + response.name + "</td><td><button type='button' class='btn btn-info btn-sm' id='modifyCategory'>Edit</button></td><td><button type='button' class='btn btn-danger btn-sm' id='removeCategory'>Delete</button>&nbsp;</td></tr>");
            /*
            <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4">
            <h2 align="center" id='{{name}}'>{{name}}</h2></div>
        <div class="col-md-4"></div>
    </div>
    */
        },
        error: function(jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connected.\n Verify Network connection.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.log(msg);
        },
    });

    $('#removeCat').remove();
    $('#newCategory').show();
    $('#editCategory').show();
    $('#categoryFormList').show();

});

$('#addNewCategory').on('click', '#cancelCategory', function() {
    $('#removeCat').remove();
    $('#newCategory').show();
    $('#editCategory').show();
    $('#categoryFormList').show();

});

$('form').on('click', '#editCategory', function() {
    $('#newCategory').hide();
    $('#categoryFormList').hide();
    $('#editCategory').hide();
    $('#editCategoryBlock').show();
    //$('#addLink').hide();
});

// global variables to retain edit text box entry 
var prevNameField;
var prevName;
var editButtonHTML = "<button type='button' class='btn btn-info btn-sm' id='modifyCategory'>Edit</button>";

$('form').on('click', '#cancelEdit', function() {
    // logic to remove edit options
    if (prevName) {
        $(prevNameField).html(prevName);
    }
    $('#cancelEdit').remove();
    $('#submitChange').closest('td').html(editButtonHTML);
});

$('form').on('click', '#modifyCategory', function() {

    $('#newCategory').hide();

    // logic to remove edit options
    if (prevName) {
        $(prevNameField).html(prevName);
    }
    $('#cancelEdit').remove();
    $('#submitChange').closest('td').html(editButtonHTML);

    id = $(this).closest('td').prev('td').prev('td').text(),
        name = $(this).closest('td').prev('td').text(),
        nameField = $(this).closest('td').prev('td'),
        cancelEdit = $(this).closest('td').next('td'),
        submitButton = $(this).closest('td'),
        submitButtonHTML = $(this).closest('td').html();

    prevNameField = nameField;
    prevName = name;

    $(nameField).html("").append("<input type='text' class='form-control' name='category' placeholder='" + name + "'>");
    $(submitButton).html("").append("<button type='button' class='btn btn-sm btn-success' id='submitChange'>Submit</button>");
    $(cancelEdit).append("<button type='button' class='btn btn-sm btn-warning' id='cancelEdit'>Cancel</button>");
    // global variable to access previous edits to restore

    $('form').on('click', '#submitChange', function() {

        var name = $(this).closest('td').prev('td').children().val();
        if (name === '') {
            console.log("name is null, enter a value.")
            return;
        }

        $.ajax({
            cache: false,
            timeout: 0,
            url: "/user/updatecategory",
            type: "PUT",
            data: { name: name, id: id },
            success: function(response) {
                //maybe show a flash message saying updated
                $('#cancelEdit').remove();
                $(nameField).html(name);
                $('#submitChange').closest('td').html(editButtonHTML);
                prevName = null;

            },
            error: function(jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connected.\n Verify Network connection.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                console.log(msg);
            },
        });
    });
});


$('form').on('click', '#removeCategory', function() {
    id = $(this).closest('td').prev('td').prev('td').prev('td').text();
    row = $(this).closest('tr');
    console.log(id);
    $.ajax({
        cache: false,
        timeout: 0,
        url: "/user/deletecategory",
        type: "PUT",
        data: { id: id },
        success: function(response) {

            $(row).remove();
            $('#' + id).remove();

        },
        error: function(jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connected.\n Verify Network connection.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.log(msg);
        },
    });
});

$('form').on('click', '#cancelModifyCategory', function() {
    $('#editCategoryBlock').hide();
    $('#newCategory').show();
    $('#categoryFormList').show();
    $('#editCategory').show();

});


// Category Ends here
