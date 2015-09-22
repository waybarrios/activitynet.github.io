var serverurl = "http://ec2-52-11-203-1.us-west-2.compute.amazonaws.com/evaluation_server";
var login_data;
var EMAIL;
var PASSWORD;
var TASKID;
$(function() {

  $('#signup-button').on('click', function() {
    var newemail = $("#newemail").val();
    var newpassword = $("#newpassword").val();
    var newfirstname = $("#newfirstname").val();
    var newlastname = $("#newlastname").val();
    $.ajax({
      url:serverurl + "/logging.php",
      type:"POST",
      data:{action: "adduser", email: newemail, password: newpassword,
            firstname: newfirstname, lastname: newlastname},
      success: function(data) {
        var email = JSON.parse(data)[0];
        var password = JSON.parse(data)[1];
        
        if (email) { 
          $('#email').val(email);
          $('#password').val(password);
          $('#login-button').click();
        }
        else {
          $("#warning-register").hide();
          $("#warning-register").html('</br><span class="help-inline">Email address already taken</span>');
          $("#warning-register").fadeIn('slow');
        }
      }
    });
  });


  $('#login-button').on('click', function() {
    var email = $('#email').val();
    var password = $('#password').val();
    $.ajax({
      url:serverurl + "/logging.php",
      type:"POST",
      data:{action: "validate_login", email: email, password: password},
      success: function(data) {
        login_data = data;
        EMAIL = JSON.parse(login_data)[2];
        PASSWORD = JSON.parse(login_data)[3];
        var firstname = JSON.parse(login_data)[0];
        var lastname = JSON.parse(login_data)[1];
        if (firstname) {
          localStorage.setItem("EMAIL_CACHED", EMAIL);
          localStorage.setItem("PASSWORD_CACHED", PASSWORD);
          view_as_logged();
        }
        else {
          $("#warning-message").hide();
          $("#warning-message").html('<span class="help-inline">Invalid username or password</span>');
          $("#warning-message").fadeIn('slow');
        }
      }
    });
  });

  

  if (localStorage.getItem("EMAIL_CACHED") && localStorage.getItem("PASSWORD_CACHED")) {
    $('#email').val(localStorage.getItem("EMAIL_CACHED"));
    $('#password').val(localStorage.getItem("PASSWORD_CACHED"));
    $('#login-button').click();
  }
});

function view_as_logged() {
  $.ajax({
    url:serverurl + "/logged.html",
    type:"POST",
    success: function(html) {
      var firstname = JSON.parse(login_data)[0];
      var lastname = JSON.parse(login_data)[1];
      var homepage = sprintf(html, firstname, lastname);
      $('.homepage').html(homepage);
      $(function() {
        fill_logged_content();
      });
    }
  });
}

function print_home_content() {
  var html = "<h1>Home</h1> Fill your content here... ";
  $("#evaluation-page").html(html);
}

function print_classification_content() {
  TASKID = 1;
  var html = "<h2>Classification</h2> Classification task description... ";
  html += "<div> <h4>Upload your results</h4>" +
'<label class="control-label">Select File</label>' + 
'<input id="file_to_upload" name="file_to_upload" type="file" multiple=false class="file-loading">' +
'<div id="kv-success-2" class="alert alert-success fade in" style="margin-top:10px;display:none"></div><div>';
  $("#evaluation-page").html(html);
    $("#file_to_upload").fileinput({
        maxFileCount: 1,
        uploadAsync: false,
        uploadUrl:serverurl + "/upload.php",
        mainClass: "input-group-lg",
        allowedFileExtensions: ["json"],
        uploadExtraData: function() {
            return {
                email: EMAIL,
                taskid: TASKID
            };
        }
    }).on('filebatchpreupload', function(event, data, id, index) {
      $('#kv-success-2').html('<h4>Upload Status</h4><ul></ul>').hide();
    }).on('filebatchuploadsuccess', function(event, data) {
      var out = '';
      var result_url = data.response[0];
      var accuracy = data.response[1];
      $.each(data.files, function(key, file) {
        var fname = file.name;
<<<<<<< HEAD
        out = out + '<li>' + 'Uploaded file: ' +  fname + ' successfully.' + '</li><li>Download your results <a href="' + result_url + '" download>click here!&nbsp <i class="fa fa-download"></i></a></li>';
=======
        out = out + '<li>' + 'Uploaded file: ' +  fname + ' successfully.' + '</li><li>Download your results <a href="' + result_url + '" download>click here!</a></li>';
>>>>>>> origin/master
       });
      $('#kv-success-2 ul').append(out);
      $('#kv-success-2').fadeIn('slow');
    });

    $('#file_to_upload').on('filebrowse', function(event) {
      $('#kv-success-2').hide();
    });

    $('#file_to_upload').on('fileclear', function(event) {
      $('#kv-success-2').hide();
    });


}

function print_detection_content() {
  var html = "<h2>Detection</h2> Coming soon...";
  $("#evaluation-page").html(html);
}

function fill_logged_content() {
  print_home_content();
  $("#home-btn").on("click", function() {
    print_home_content();
  });
  $("#classification-btn").on("click", function() {
    print_classification_content();
  });
  $("#detection-btn").on("click", function() {
    print_detection_content();
  });
  $("#signout-btn").on("click", function() {
    localStorage.clear();
    location.reload();
  });
}