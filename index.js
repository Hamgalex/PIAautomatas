
var res;
var error=false;
var tipoerror="";
var especificacion="Se encontraron uno o más errores";
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
       
        //checa que no haya lineas en blanco 
        checarSaltosDeLinea(numlineas);

        //tenemos asegurado que no hay lineas en blanco
        if(error==false)checarPalabrasReservadas(numlineas);

        //tenemos asegurado que no hay lineas en blanco && que todas las lineas tienen palabras reservadas
        if(error==false)checarInstruccionesRepetidas(numlineas);

        //tenemos asegurado que todas las lineas de cabecera son válidas y no se repite el programa,iniciar ni terminar.
        if(error==false)checarEstructuraPrograma(numlineas);
    
        //-if(error==false)checarInstruccionesValidas(numlineas);   <----- creo que esto esta de mas

        // si llegamos aqui todo esta bien excepto las instrucciones que deben de esta en las lineas 2 hasta (numlineas-2)
        if(error==false)checarFormatoInstrucciones(numlineas);

        console.log(error);
        console.log(especificacion);
        console.log(tipoerror);
        console.log(variablesActivas);



        if(error==true)
        {
            document.getElementById("tipoerror").innerHTML = "Error de "+ tipoerror;    
            document.getElementById("especificacion").innerHTML = especificacion;
        }
        else   
        document.getElementById("error").innerHTML ="No hay errores";

    
        
           
    }
},false);

// creo que esta funcion esta de mas, aun asi no hay que borrarla x si se ocupa
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


// ahora se checan los tipos de instrucciones, dependiendo si es leer,imprimir o :=
//
function checarFormatoInstrucciones(numlineas)
{
    var i;
    var tamaño;
    for(i=2;i<=numlineas-2;i++)
    {
        if(res[i].match(/^(leer )/g)!=null)
        {
            tamaño=res[i].length;
            if(checarLectura(res[i])==true) // si es leer checamos si esta correcto con la funcion checarLectura, si es true entonces esta correcto y guardamos la variable en un arreglo
            {
                variablesActivas[k]=res[i].substr(5,tamaño-7); // pq queremos el nombre de la variable , entonces tenemos 6 caracteres en el de lectura que son l,e,e,r, ,;
                k++;
            }
        }
        if(res[i].match(/^(imprimir )/g)!=null) // si tiene imprimir
        {
            checarImpresion(res[i]);

        }
        if(res[i].match(/(:=)/g)!=null) // si tiene una asignación
        {

            checarAsignacion(res[i]);

        }
    }
}

function checarAsignacion(linea)
{
    var variableNuevaActiva;
    var expresion;
    var tamaño;
    var arreglodeexpresion;
    if(linea.match(/^([a-z])([0-9a-z]*)( := )/)==null || linea.match(/(;)(\r)$/)==null  ) // si el nombre de la variable no es valido o no tiene punto y coma
    {
        error=true;
        tipoerror="Sintaxis";
        especificacion+=", no se cumple con el formato de variable o asignación";

    }
    else //si tiene " := " y punto y coma con salto de linea.
    {

        var exporiginal=linea;
        
        for(i=0;i<k;i++)
        {
           // linea=linea.replace(variablesActivas[i],1);   
            linea=linea.replace(new RegExp(variablesActivas[i], 'g'),1); 
            console.log(linea);
        }

        console.log(linea);

    
        arreglodeexpresion=linea.split(" ");
        variableNuevaActiva=arreglodeexpresion[0];
        
        expresion=arreglodeexpresion[2];

        expresion=expresion.replace(/\^/g,"**");
        expresion=expresion.replace(/\+/g,"/");
        expresion=expresion.replace(/-/g,"/");
        if(linea.match(/^([a-z])([0-9a-z]*)( := )/)!=null && linea.match(/(;)(\r)$/)!=null && isValid(expresion)==true && expresion.match(/[a-zA-z]/i)==null && expresion.match(/( )/i)==null) // si es valida y tiene el formato
        {
         
            console.log("si es valida: "+expresion);
        }
        else

        {
            console.log("la expresion:"+expresion+":no es valida");
            error=true;
            tipoerror="Sintaxis";
            especificacion+=", error en la expresion aritmética: "+ exporiginal;

        }

        console.log(variableNuevaActiva);
        console.log(expresion);
        
        variablesActivas[k]=variableNuevaActiva;
        k++;
    }
}

//checar si la exp es valida con eval()
function isValid(origExp) {
	const exp = (' ' + origExp + ' ')
		.replace(/([^0-9])[0-9]([^0-9])/gi, '$11$2')
		.replace(/([^0-9])[0-9]([^0-9])/gi, '$11$2');

	try {
		return !isNaN(eval(exp));
	} catch (e) {
		return false;
	}
}

//no sirve de nada esto
function checarExpresionReemplazandoVariablesActivas(expresion)
{

    var i;
    console.log("tamaño del arreglo:" + k);

    console.log("aqui va lo de reemplazar las variables, expresion inicial: "+expresion);

    for(i=0;i<k;i++)
    {
        expresion=expresion.replace(variablesActivas[i],1);   
        console.log(expresion);
    }
    var expresionfinal=expresion;

    console.log("Expresionfinal:");
    console.log(expresionfinal);

    
     if(expresionfinal.match(/^((\d+|\(\g<1>\))([-+*\/^]\g<1>)?)(;)(\r)$/g)!=null)
    {
        console.log("si se pudo");
    }
    else
    {
        error=true;
        especificacion+="Error en la expresion aritmetica"+expresion;
        tipoerror="Sintaxis";
        console.log("no se pudo");
        console.log(expresionfinal.match(/^((\d+|\(\g<1>\))([-+*\/^]\g<1>)?)(\r)$/));
    }
   
    

}


// se checa que la impresion esté correcta
function checarImpresion(linea)
{
    if(linea.match(/^(imprimir )([a-z])([0-9a-z]*)(;)(\r)$/g)!=null) // si escribio la palabra programa y el nombre tiene formato
    {
            console.log("paso el test de la impresion de la variable");             
    }
    else
    {
        
        error=true;
        tipoerror="Sintaxis";
        especificacion+= ", no se cumple con el formato de impresion pedido";
        
            
    }
}

//se checa si es correcta la lectura con el formato de variable
function checarLectura(linea)
{
    if(linea.match(/^(leer )([a-z])([0-9a-z]*)(;)(\r)$/g)!=null) // si escribio la palabra programa y el nombre tiene formato
    {
            console.log("paso el test del nombre de la variable");  
            return true;      
    }
    else
    {
            error=true;
            tipoerror="Sintaxis";
            especificacion+= ", no se cumple con el formato de lectura pedido";
            return false;
    }
}

// funcion que checa que el nombre del programa sea valido y que tenga solamente "iniciar" y "terminar" en la 2da y ultima línea
// tengamos en cuenta que si llegamos a esta funcion entonces hay puras lineas con palabras reservadas
function checarEstructuraPrograma(numlineas)
{

    if(res[0].match(/^(programa )([a-z])([0-9a-z]*)(;)(\r)$/g)==null) // si no escribio la palabra programa y el nombre tiene formato
    {
        error=true;
        tipoerror="Sintaxis";
        especificacion+= ", la cebecera del programa no cumple con el formato pedido";
    }
    if(res[1].match(/^(iniciar)(\r)$/g)==null)
    {
        error=true;
        tipoerror="Sintaxis";
        especificacion+=", no se encuentra el inicio del programa";
    }
    if(res[numlineas-1].match(/^(terminar.)$/g)==null)
    {
        error=true;
        tipoerror="Sintaxis";
        especificacion+=", no se encuentra la terminación del programa";
    }
}

//funcion que checa que los comandos de cabecera: programa nombre;, iniciar y terminar. no se repitan
function checarInstruccionesRepetidas(numlineas)
{
    var i;
    for(i=2;i<=numlineas-2;i++)
    {
        if(res[i].match(/^(programa)/g)!=null || res[i].match(/^(iniciar)/g)!=null || res[i].match(/^(terminar)/g)!=null)
        {
            error=true;
            tipoerror="Sintaxis";
            especificacion+=", se repiten comandos de cabecera";
        }
    }
}


// funcion que checará que en cada linea del programa haya palabras reservadas, osea: programa ,iniciar,leer, := ,imprimir y terminar
// observemos que esta es la única manera que pueda haber un error léxico
function checarPalabrasReservadas(numlineas)
{
    var i;
    for(i=0;i<numlineas;i++)
    {
        if(res[i].match(/^(programa)/g)==null && res[i].match(/^(iniciar)/g)==null && res[i].match(/^(leer)/g)==null && res[i].match(/(:=)/g)==null && res[i].match(/^(imprimir)/g)==null && res[i].match(/^(terminar.)/g)==null )
        {
            error=true;
            tipoerror="Léxico";
            especificacion+=", Palabra mal escrita:"+res[i];
        }
    }



}


// funcion que checa que no haya lineas en blanco
function checarSaltosDeLinea(numlineas)
{
    var i;
    for(i=0;i<numlineas;i++)
    {
        if(res[i].match(/^\r$/g)!=null || res[i].match(/^$/g)!=null || res[i].match(/^( )+(\r)$/g)!=null) // si hay un \r o no hay nada o hay espacios en blanco manda error
        {
            error=true;
            especificacion+=", hay una línea en blanco";
            tipoerror="Sintaxis";
            return;
        }
    }
    return;
}
