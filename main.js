let dataTable;
let dataTableIsInitialized = false;
 const $cargando = document.getElementById("cargando");
 const $espera= document.getElementById("espera");
//let url="http://localhost:3000/api"
let url="https://despliege-de-api.onrender.com/api"
const modalarticulo=new bootstrap.Modal(document.getElementById('modalarticulos'))
const formArticulo=document.querySelector("form")
let operacion =false

btnCrear.addEventListener("click",()=>{
    nombre.value=""
    logo.value=""
    modalarticulo.show()
    opcion="crear"
  })

        ////////   funcion para evaluar boton ////////////
        const on=(element, event,selector,handler) =>{
            element.addEventListener(event,e=>{
            if(e.target.closest(selector)){
               handler(e)
             }
       }) 
   } 
  //  procedimiento borrar 

   on(document,"click", ".btnBorrar", e=>{
          const fila=e.target.parentNode.parentNode
          const id= fila.firstElementChild.innerHTML
      
            alertify.confirm("Atencion","Confirma eliminar?",
               function(){
                console.log(id)
                alertify.success('Ok');
                fetch(url+"/"+id,{method:"delete"})
                 .then(res=> res.json())
                 .then(()=>location.reload())
                
                },
               function(){
                alertify.error('Cancel');
             });
  })

    // prodedimiento editor
    let idform=0
    on(document,"click", ".btnEditar", e=>{
    const fila=e.target.parentNode.parentNode
    idform= fila.children[0].innerHTML //otra forma para capturar el id 
    const nombreform=fila.children[1].innerHTML
    const logoform=fila.children[2].innerHTML
    opcion="editar" 
    nombre.value=nombreform
     logo.value=logoform
     
    
     modalarticulo.show()
    })
// prcedimiento para crear y editar
formArticulo.addEventListener("submit",(e)=>{
    e.preventDefault()
    if(opcion==="crear")
    {
      
        console.log("crear")
      fetch(url, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
   
      body: JSON.stringify({nombre:nombre.value, logo:logo.value})
         })
          .then(res => res.json())
          .then(res=> {console.log(res)})
           .then(()=>location.reload())
                   
          //.then(()=>location.reload())
          .catch(error => alert(error));
          operacion=true
          
          
                  
    }
    if(opcion=="editar")
          {
            console.log("editar22")
            fetch(url+"/"+idform, {
              method: 'PUT',
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({nombre:nombre.value, logo:logo.value})
                 })
                  .then(res => res.json())
                  .then(res=> {console.log(res);})
                  .then(()=>location.reload())




          }
    modalarticulo.hide()
   
    
   if (operacion){
         alert("ingreso Satifactorio")
         operacion=false
   }
  })





const dataTableOptions = {
    //scrollX: "2000px",
    lengthMenu: [5, 10, 15, 20, 100, 200, 500],
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3 ] },
        { orderable: false, targets: [0] }// no ordena por x la columna 0
       // { searchable: false, targets: [1] }
        //{ width: "50%", targets: [0] }
    ],
    pageLength: 5,
    destroy: true,
    language: {
         lengthMenu: "Mostrar registros por página _MENU_",
        zeroRecords: "Ningún usuario encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuario encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};

const initDataTable = async () => {
    if (dataTableIsInitialized) {
        dataTable.destroy();
    }

    await listUsers();

    dataTable = $("#datatable_users").DataTable(dataTableOptions);

    dataTableIsInitialized = true;
};

const listUsers = async () => {
    try {
        const response = await fetch(url);
       // http://localhost:3000/api
       //https://jsonplaceholder.typicode.com/users
        const users = await response.json();
         $cargando.style.display = 'none'
         $espera.style.display='none';
        let content = ``;
        users.forEach((user) => {
            content += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.nombre}</td>
                    <td>${user.logo}</td>
                                     
                    <td><a class="btnEditar btn btn-primary"> Editar</a>
                   
                    <a class="btnBorrar btn btn-danger"> Borrar</a>
                    </td> 
                    
                </tr>`;
        });
        //<button class="btn btn-sm btn-primary"><i class="fa-solid fa-pencil"></i></button>
        //<button class="btn btn-sm btn-danger"><i class="fa-solid fa-trash-can"></i></button>
        //<a class="btnBorrar btn btn-danger"> Borrar</a>
        tableBody_users.innerHTML = content;
    } catch (ex) {
        alert(ex);
    }
};

window.addEventListener("load", async () => {
    await initDataTable();
});
