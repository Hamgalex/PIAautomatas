// regex
var regexNombrePrograma = "([a-z])([0-9a-z]*)";
var regexNombreIdentificador= "([a-z])([0-9a-z]*)";
var regexNumero = "([0-9]*)";
var regexMinusculaONumero = "([a-z0-9])";
var res;

var error=false;
var tipoerror="";
var especificacion="Se encontraron varios errores";
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
        

        //aqui va todo lo que hara el programa 
        var numlineas=res.length;
        console.log(res);
       
        checarSaltosDeLinea(numlineas);

        checarEstructuraPrograma(numlineas);

        checarInstruccionesRepetidas(numlineas);
    
        checarInstruccionesValidas(numlineas);

        checarFormatoInstrucciones(numlineas);
        console.log(error);
        console.log(especificacion);
        console.log(tipoerror);
        console.log(variablesActivas);

    

        if(error==true)
        {
            document.getElementById("error").innerHTML = error;
            document.getElementById("tipoerror").innerHTML = tipoerror;    
            document.getElementById("especificacion").innerHTML = especificacion;
        }
        else   
        document.getElementById("error").innerHTML ="No hay errores";

        
           
    }
},false);

function checarInstruccionesValidas(numlineas){

    var i;
    for(i=2;i<=numlineas-2;i++)
    {
        if(res[i].match(/( := )/g)==null && res[i].match(/^(leer )/g)==null && res[i].match(/^(imprimir )/g)==null && res[i].match(/^(programa )/g)==null && res[i].match(/^(iniciar)/g)==null  && res[i].match(/^(terminar)/g)==null)
        {
            error=true;
            tipoerror="";
            especificacion+=", No se reconoce el comando en linea "+(i+1)+":"+res[i];

        }
    }
}

function checarInstruccionesRepetidas(numlineas)
{
    var i;
    for(i=2;i<=numlineas-2;i++)
    {
        if(res[i].match(/^(programa)/g)!=null || res[i].match(/^(iniciar)/g)!=null || res[i].match(/^(terminar)/g)!=null)
        {
            error=true;
            tipoerror="";
            especificacion+=", se repiten comandos de cabecera";
        }
    }
}

function checarFormatoInstrucciones(numlineas)
{
    var i;
    var tamaño;
    for(i=2;i<=numlineas-2;i++)
    {
        if(res[i].match(/^(leer )/g)!=null)
        {
            tamaño=res[i].length;
            if(checarLectura(res[i])==true)
            {
                variablesActivas[k]=res[i].substr(5,tamaño-7); // pq queremos el nombre de la variable , entonces tenemos 6 caracteres en el de lectura que son l,e,e,r, ,;
                k++;
            }
        }
        if(res[i].match(/^(imprimir )/g)!=null)
        {
            checarImpresion(res[i]);

        }
        if(res[i].match(/( := )/g)!=null)
        {

            checarAsignacion(res[i]);

        }
    }
}

function checarLectura(linea)
{

    
    if(linea.match(/^(leer )([a-z])([0-9a-z]*)(;)(\r)$/g)!=null) // si escribio la palabra programa y el nombre tiene formato
    {
            console.log("paso el test del nombre de la variable");  
            return true;      
    }
    else
    {
        if(linea.match(/([a-z])([0-9a-z]*)(;)(\r)$/)==null) // el nombre no tiene formato
        {
                error=true;
                tipoerror="";
                especificacion+= ", no se cumple con el formato de lectura pedido";
                return false;
        }
            
    }
}


function checarImpresion(linea)
{

    if(linea.match(/^(imprimir )([a-z])([0-9a-z]*)(;)(\r)$/g)!=null) // si escribio la palabra programa y el nombre tiene formato
    {
            console.log("paso el test de la impresion de la variable");             
    }
    else
    {
        if(linea.match(/([a-z])([0-9a-z]*)(;)(\r)$/)==null) // el nombre no tiene formato
        {
                error=true;
                tipoerror="";
                especificacion+= ", no se cumple con el formato de impresion pedido";
        }
            
    }
}

function checarAsignacion(linea)
{
    var variableNuevaActiva;
    var expresion;
    var tamaño;
    var arreglodeexpresion;
    if(linea.match(/^([a-z])([0-9a-z]*)( := )/)==null || linea.match(/(;)(\r)$/)==null  )
    {
        error=true;
        tipoerror="";
        especificacion+=", no se cumple con el formato de variable";

    }
    else
    {
        arreglodeexpresion=linea.split(" ");
        variableNuevaActiva=arreglodeexpresion[0];
        
        expresion=arreglodeexpresion[2];
        expresion=expresion.replace(";",'');
        console.log(variableNuevaActiva);
        console.log(expresion);
        
        checarExpresionReemplazandoVariablesActivas(expresion)
        

        variablesActivas[k]=variableNuevaActiva;
        k++;
    }
}

function checarExpresionReemplazandoVariablesActivas(expresion)
{

    var i;
    var tamañoarreglo=variablesActivas.lenght;
    console.log("tamaño del arreglo:" + k);
    var stringaux;

    console.log("aqui va lo de reemplazar las variables");

    for(i=0;i<k;i++)
    {
        expresion=expresion.replace(variablesActivas[i],4);   
        console.log(expresion);
    }
    var expresionfinal=expresion;
    console.log("Expresionfinal:");
    console.log(expresionfinal);

    expresionfinal=expresionfinal.replace(/\+/g,"+");
    expresionfinal=expresionfinal.replace(/^/g,"+");
    expresionfinal=expresionfinal.replace(/\-/g,"+");
    expresionfinal=expresionfinal.replace(/\*/g,"+");
    expresionfinal=expresionfinal.replace(/\//g,"+");
    
     if(expresionfinal.match(/((\d+|\(\g<1>\))([-+*\/^]\g<1>)?)(\r)$/g)!=null)
    {
        console.log("si se pudo");
    }
    else
    {
        error=true;
        especificacion+="Error en la expresion aritmetica";
        tipoerror="";
        console.log("no se pudo");
        console.log(expresionfinal.match(/^((\d+|\(\g<1>\))([-+*\/^]\g<1>)?)(\r)$/));
    }
   
    

}

function checarSaltosDeLinea(numlineas)
{
    var i;
    for(i=0;i<numlineas;i++)
    {
        if(res[i].match(/^\r$/g)!=null || res[i].match(/^$/g)!=null) // si hay un \r o no hay nada manda error
        {
            error=true;
            especificacion+=", hay una línea en blanco";
            tipoerror="";
            return;
        }
    }
    return;
}

function checarEstructuraPrograma(numlineas)
{


    if(res[0].match(/^(programa )/)==null) // sino escribio la palabra programa
    {
        error=true;
        tipoerror="";
        especificacion+=", no se encuentra el nombre del programa";
    }
    else
    {
        if(res[0].match(/^(programa )([a-z])([0-9a-z]*)(;)(\r)$/g)!=null) // si escribio la palabra programa y el nombre tiene formato
        {
            console.log("paso el test del nombre del programa");        
        }
        else
        {
            if(res[0].match(/([a-z])([0-9a-z]*)(;)(\r)$/)==null) // el nombre no tiene formato
            {
                error=true;
                tipoerror="";
                especificacion+= ", la cebecera del programa no cumple con el formato pedido";
            }
            
        }
    }
    if(res[1].match(/^(iniciar)(\r)$/g)==null)
    {
        error=true;
        tipoerror="";
        especificacion+=", no se encuentra el inicio del programa";
    }
    if(res[numlineas-1].match(/^(terminar.)$/g)==null)
    {
        error=true;
        tipoerror="";
        especificacion+=", no se encuentra la terminación del programa";
    }
}





