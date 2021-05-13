
var res;
var error=false;
var especificacion="";
var k=0;
var numlineas;
let variablesActivas = new Array ();


const input = document.querySelector('input[type="file"]');
input.addEventListener('change',function(e){
    console.log(input.files);
    const reader=new FileReader();
    reader.readAsText(input.files[0]);

    reader.onload=function(){
        console.log(reader.result);
        res = reader.result.split("\n"); // separa las lineas del txt por salto de linea
        

        debugger;
        //aqui va todo lo que hara el programa 
        var numlineas=res.length;
       



        if(error==true)
        {  
            document.getElementById("especificacion").innerHTML = especificacion;
        }
        else   
        document.getElementById("error").innerHTML ="No hay errores";

    
        console.log(isValid("1/1/2"));
           
    }
},false);