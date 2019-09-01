// mock data
var user_data = [{'username':'user@gmail.com', 'password':'123456', 'role': 'admin'}];
var ums_data = [
    {id: "1", name: "Mounika", email: "mounika@gmail.com", class: "Btech", city: "Hyderabad", country:'India'},
    {id: "2", name: "durga", email: "durga@gmail.com", class: "Mtech", city: "Hyderabad", country:'India'}
];

function form_data_to_json(data){
    let o = {};
    $.each(data, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}

function setlogin_details(data) {
    if( data['login_name'] === user_data[0].username && data['login_password'] === user_data[0].password){
        localStorage.setItem('username', data['login_name']);
        localStorage.setItem('password', data['login_password']);
    }
}

function loginstatus(){
    let username = localStorage.getItem('username');
    let password = localStorage.getItem('password');
    if(username && password ){
        return true;
    }
    return false;
}

function toggle_login_register(status){
    if( status ){
        $('#umsregister').show();
        $('#umslogin').hide();
    }
    else{
        $('#umslogin').show();
        $('#umsregister').hide();
    }
}

function toggle_login_umstable(status){
    if( status ){
        $('.loginpage').hide();
        $('.umstable').show();
    }
    else{
        $('.loginpage').show();
        $('.umstable').hide();
    }
}

function check_user_exists(username){

    let status = false;
    $.each(JSON.parse(localStorage.getItem('userdata')), function () {
        if( username === this.username){
            status = true;
        }
    });
    return status;

}

function table_to_json(){
    var rows = [];
    $('table#umstable tr').each(function(i, n){
        var $row = $(n);
        rows.push({
            id: $row.find('td:eq(0)').text(),
            name:   $row.find('td:eq(1)').text(),
            email:    $row.find('td:eq(2)').text(),
            class:       $row.find('td:eq(3)').text(),
            city:         $row.find('td:eq(4)').text(),
            country:        $row.find('td:eq(5)').text()
        });
    });
    return rows;
}

function insert_rows(data){
    $.each(data, function( key, value ) {
        let row = '<tr id="row_'+ value.id +'" >' +
            '<td>'+ value.id +'</td>' +
            '<td>'+ value.name  +'</td>' +
            '<td>'+ value.email +'</td>' +
            '<td>'+ value.class +'</td>' +
            '<td>'+ value.city +'</td>' +
            '<td>'+ value.country +'</td>' +
            '<td><a href="#addEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons">&#xE254;</i></a>' +
            '<a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" >&#xE872;</i></a></td>' +
            '</tr>';
        $("#umstable").append(row);
    });
}


$(document).ready(function(){

    $.validate({
        modules : 'html5'
    });

    // set login page if user is not logged in
    toggle_login_umstable(loginstatus());
    toggle_login_register(loginstatus());
    // set user data
    localStorage.setItem('userdata', JSON.stringify(user_data));
    // set initial ums data
    if (! localStorage.getItem('ums_data')){
        localStorage.setItem('ums_data', JSON.stringify(ums_data));
    }
    // set data from session storage
    insert_rows(JSON.parse(localStorage.getItem('ums_data')));
    ums_data = JSON.parse(localStorage.getItem('ums_data'));
    // toggle between login and register
    $('#gotoregister').click(function(e)
    {
        e.preventDefault();
        toggle_login_register(true);
    });
    $('#gotoLogin').click(function(e)
    {
        e.preventDefault();
        toggle_login_register(false);
    });

    // login details
    $("#umslogin").submit(function (e) {
        let login_form = form_data_to_json($('#umslogin').serializeArray());
        setlogin_details(login_form);
        toggle_login_umstable(loginstatus());
        if(! loginstatus()){
            $("#error").html('Unable to login, user doesnt exists');
            $("#error").fadeTo(8000, 500).slideUp(500, function() {
                $("#error").slideUp(500);
            });
        }else{
            // create table data on login
            //insert_rows(JSON.parse(localStorage.getItem('ums_data')));

        }

        $('#umslogin')[0].reset();
        e.preventDefault();
    });

    //logout
    $("#umslogout").click(function (e) {
        e.preventDefault();
        //localStorage.clear();
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        toggle_login_umstable(loginstatus());
        toggle_login_register(loginstatus());
    });

    //register details
    $("#umsregister").submit(function (e) {
        let login_form = form_data_to_json($('#umsregister').serializeArray());
        //console.log(login_form);

        if( ! check_user_exists(login_form['username'])){
            user_data.push(login_form);
            localStorage.setItem('userdata', JSON.stringify(user_data));
            $("#success").html('New user registered successfully : ' + JSON.stringify(login_form['username']));
            $("#success").fadeTo(8000, 500).slideUp(500, function() {
                $("#success").slideUp(500);
            });
            $('#umsregister')[0].reset();

        }else{
            $("#error").html('Unable to register, user exists');
            $("#error").fadeTo(8000, 500).slideUp(500, function() {
                $("#error").slideUp(500);
            });
        }
        e.preventDefault();
    });

});


$(document).ready(function(){
     var add_edit_status = 'add';
     var update_index = 0;
    //add new row to table
    $('#table_add_row').submit(function (e) {
        if( add_edit_status === 'add'){
            let last_index = $('#umstable').find("tr").last().find("td").first().text();
            last_index = parseInt(last_index) + 1;
            let table_add_form = form_data_to_json($('#table_add_row').serializeArray());
            table_add_form.id = last_index;
            ums_data.push(table_add_form);
            localStorage.setItem('ums_data', JSON.stringify(ums_data));
            //insert row
            insert_rows([table_add_form]);
        }
        else{
            console.log($("#table_add_row input[name ='class']").val());
            const each_td = $('#row_' + (parseInt(update_index) + 1) ).children("td");
            let table_add_form = form_data_to_json($('#table_add_row').serializeArray());
            each_td[1].innerText = ums_data[update_index].name = table_add_form.name;
            each_td[2].innerText = ums_data[update_index].email = table_add_form.email;
            each_td[3].innerText = ums_data[update_index].class = table_add_form.class;
            each_td[4].innerText = ums_data[update_index].city = table_add_form.city;
            each_td[5].innerText = ums_data[update_index].country = table_add_form.country;
            add_edit_status = 'add';
            localStorage.setItem('ums_data',  JSON.stringify(ums_data));

        }

        $('#table_add_row')[0].reset();
        $('#addEmployeeModal').modal('toggle');
        e.preventDefault();
    });

    // Edit row on edit button click
    $(document).on("click", ".edit", function(){
         add_edit_status = 'edit';
         update_index = parseInt($(this).parents("tr").find("td").first().text()) - 1 ;
         const row_data = ums_data[update_index];
        $("#table_add_row input[name ='name']").val(row_data.name);
        $("#table_add_row input[name ='email']").val(row_data.email);
        $("#table_add_row input[name ='class']").val(row_data.class);
        $("#table_add_row input[name ='city']").val(row_data.city);
        $("#table_add_row input[name ='country']").val(row_data.country);
    });

    // Delete row on delete button click
    $(document).on("click", ".delete", function(){
        $(this).parents("tr").remove();
        $(".add-new").removeAttr("disabled");
        let new_data = table_to_json();
        new_data.shift();
        ums_data = new_data;
        localStorage.setItem('ums_data',  JSON.stringify(ums_data));
    });
});