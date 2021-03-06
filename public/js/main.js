var user_table;
// testing new branch test

$(document).ready(function () {
    
    $.extend($.fn.dataTable.defaults, {
        
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        responsive: true,
        "language": {
            "search": "Procurar:",
            "lengthMenu": "Mostrando _MENU_ registros por página",
            "emptyTable": "Nenhum usuário encontrado.",
            "zeroRecords": "Nenhum usuário encontrado.",
            "info": "Mostrando página _PAGE_ de _PAGES_",
            "infoEmpty": "Sem registros disponíveis",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "paginate":{
                "previous": "Anterior",
                "next": "Próxima",
            }
        }
    
    } );

    user_table = $('#user-table').DataTable();
});

$('.btn-success').click(function (e) { 
    e.preventDefault();
    $('.rotate').toggleClass('down');
});

$('#create-user-button').click(function (e) { 
    e.preventDefault();
    
    $('#create-user-modal').modal('show');
});

function populateUserTable(){
    
}

$('#user-form').submit(function (e) { 
    e.preventDefault();

    $.ajax({
        type: "POST",
        url: "/usuarios/store",
        data: $(this).serializeArray(),
        dataType: "JSON",
        success: function (response) {

            $('#create-user-modal').modal('hide');

            Swal.fire({
                
                title: response.username+' foi criado com sucesso!',
                text: 'Agora é possível realizar ações com este usuário na listagem.',
                icon: 'success',
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Beleza!',
                confirmButtonColor: '#22b538',
            }).then(() => {
                $('#user-table').DataTable().destroy();
                $('#user-table > tbody').append(
                    '<tr id="row-'+response.id+'">' +
                        '<td scope="col">'+response.username+'</td>' +
                        '<td scope="col">'+response.name+'</td>' +
                        '<td scope="col">' +
                            '<button class="btn btn-primary" type="button" id="edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar este usuário" onclick="editUser('+response.id+')"><i class="fa fa-edit"></i></button>'+
                            '<button class="btn btn-danger" type="button" id="delete-button" data-bs-toggle="tooltip" data-bs-placement="top" title="Deletar este usuário" onclick="deleteUser('+response.id+')"><i class="fa fa-trash"></i></button>'+
                        '</td>' +
                    '</tr>'
                );

                $('#user-table').DataTable().draw();
                $('#name').val('');
                $('#surname').val('');
                $('#username').val('');
                $('#password').val('');
            });
        
        }, error: function(jqXHR, exception){

            Swal.fire({

                title: 'Ocorreu um erro durante a criação',
                text: 'Perdoe o ocorrido. Tente novamente mais tarde.',
                icon: 'error',
            });
        }
    });
});

function deleteUser(user_id) { 

    Swal.fire({
      title: 'Tem certeza que deseja deletar este usuário?',
      text: "Para recuperá-lo terá que passar por um processo de avaliação da equipe!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, tenho certeza',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        
        $.ajax({
            type: "DELETE",
            url: "/usuarios/delete/"+user_id,
            headers:{
                'X-CSRF-TOKEN': $('#user-form > input[name="_token"]').val(),
            },
            dataType: "JSON",
            success: function (response) {
                
                Swal.fire(
                    'Usuário deletado com sucesso!',
                    'Caso queira recuperar usuário pesquise pelos registros apagados.',
                    'success'
                );

                $('#user-table').DataTable().destroy();
                $('#row-'+user_id).remove();
                $('#user-table').DataTable().draw();
            },error: function(jqXHR, exception){

                Swal.fire({
    
                    title: 'Ocorreu um erro ao deletar este usuário.',
                    text: 'Perdoe o ocorrido. Tente novamente mais tarde.',
                    icon: 'error',
                });
            }
        });

      } else if (
        
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Ação cancelada!',
          'Usuário continua salvo nos registros.',
          'info'
        );
      }
    });
}

var user_id_update;
function editUser(id_user){

    user_id_update = id_user;
    $.ajax({
        type: "GET",
        url: "usuarios/edit/"+id_user,
        headers:{
            'X-CSRF-TOKEN': $('#edit-user-form > input[name="_token"]').val(),
        },
        dataType: "JSON",
        success: function (response) {
            
            $('#user-name-modal-title').text(response.username);
            $('#edit-name').val(response.name);
            $('#edit-username').val(response.username);
            
            $('#edit-user-modal').modal('show');
        }, error: function(jqXHR, exception){

            Swal.fire({

                title: 'Ocorreu um erro durante a busca por este usuário.',
                text: 'Perdoe o ocorrido. Tente novamente mais tarde.',
                icon: 'error',
            });

        }
    });

}

$('#edit-user-form').submit(function (e) { 
    e.preventDefault();
    
    $.ajax({
        type: "PUT",
        url: "/usuarios/update/"+user_id_update,
        data: $(this).serializeArray(),
        dataType: "JSON",
        success: function (response) {
            
            $('#edit-user-modal').modal('hide');

            Swal.fire({
                title: 'Dados do usuário cadastrados com sucesso',
                icon: 'success',
            });

            $('#user-table').DataTable().destroy();
            $('#row-'+user_id_update+' > .name-col').text($('#edit-name').val());
            $('#row-'+user_id_update+' > .username-col').text($('#edit-username').val());
            $('#user-table').DataTable().draw();
        },error: function(jqXHR, exception){

            Swal.fire({

                title: 'Ocorreu um erro durante a atualização do usuário.',
                text: 'Perdoe o ocorrido. Tente novamente mais tarde.',
                icon: 'error',
            });
        }
    });
});