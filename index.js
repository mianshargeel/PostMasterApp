console.log('We are creating here Postman App to create GET/POST requests');

//Utility Functions
//1. function to get DOM element from string
function getElementFromString(str) {
    let div = document.createElement("div");
    div.innerHTML = str;
    return div.firstElementChild;
}


let addParamCount = 0; //using this variable to increase numbers in Parmeter 1 

//when in Content type user select Json this parameterBox wil be hide
let parameterBox = document.getElementById("parameterBox");
parameterBox.style.display = "none";

//if user click on Custom Parameter box(parameter 1 will apear) then Json box (Json Request box)  will be hide
let paramRadio = document.getElementById("paramRadio");
paramRadio.addEventListener("click", () => {
    document.getElementById("requestJsonBox").style.display = "none";
    parameterBox.style.display = "block";
})

//if uer click on Json box (Json Request box will apear)then Custom Parameter box (parameter 1 ) will be hide
let jsonRadio = document.getElementById("jsonRadio");
jsonRadio.addEventListener("click", () => {
    document.getElementById("requestJsonBox").style.display = "block";
    parameterBox.style.display = "none";
})

//if user click on + Button adding more Parameter1
let addParameters = document.getElementById("addParameters"); //taking + button from parameterBox
addParameters.addEventListener("click", () => {
    let params = document.getElementById("params"); //grabing this div in which we will show new added Parameters 
    // console.log('The Parameter div is:', params);
    //to add more Parameters like Parameter 1 through + button grabing whole div with both key and value inputs in sting variable
    let string = ` <div class="row my-2">
                <label for="parameter" class="form-label">Parameter ${addParamCount + 2}</label>
                <div class="col-5">
                    <input type="text" class="form-control" id="parameterKey${addParamCount + 2}" placeholder="Enter Parameter ${addParamCount + 2} key..." aria-label="First name">
                </div>
                <div class="col-5">
                    <input type="text" class="form-control" id="parameterValue${addParamCount + 2}" placeholder="Enter Parameter ${addParamCount + 2} value..." aria-label="Last name">
                </div>
                <button  type="button" class="btn btn-primary col-2 deleteParam"> - </button>
            </div>`;
    // NOTE in above - button we use class=deleteParam becouse this class will apllies on sevral divs to delete Parameters here we can't use Id
    //converting string element to DOM element
    let paramElement = getElementFromString(string);
    // console.log(paramElement);
    params.appendChild(paramElement);
    //Adding event listener to - button to delete paramerters

    let deleteParam = document.getElementsByClassName("deleteParam");
    // console.log(deleteParam);
    for (let item of deleteParam) { //array of parameters
        item.addEventListener("click", (e) => { //e.target will target that element which we want to delete
            e.target.parentElement.remove();
            // confirm(`Do you want to delete Parameter ${addParamCount + 1} ?`) ? e.target.parentElement.remove() : "";
            //used ternary operater for alert(confirm) before deletion
        });
    }
    addParamCount++; //at every click it will increase value
});

//if user click on Submit-Request button 
let submit = document.getElementById("submit");
submit.addEventListener("click", () => {
    //showing message into Response-Box to user please wait till response will ready from server
    // document.getElementById("responseJsonText").value = "Please wait... Fetching Response from Server...";
    document.getElementById("prismJsonResponse").innerHTML = "Please wait... Fetching Response from Server..."; //we are using prism(library)

    //Fetching all values which user has entered
    let urlField = document.getElementById("urlField").value;
    let requestType = document.querySelector("input[name = 'requestType']:checked").value; //we have two values GET/POST which one will be checked we will recieve
    let contentType = document.querySelector("input[name = 'contentType']:checked").value; //we have two values JSON/Custom-Parameter which one will be checked we will recieve

    // logs all values in console for debugging
    console.log(urlField);
    console.log(requestType);
    console.log(contentType);

    //if user select option Paremeters instead of JSON then collect all parameters in an Object
    if (contentType == "Custom Parameter") { //name and value(in .html see in fieldset-tag)
        data = {};
        for (i = 0; i < addParamCount + 1; i++) { // addParamCount+1 becouse default value is addParamCount = 0 and (imagine if we have only one parameter then for-loop can run even one time)
            if (document.getElementById("parameterKey" + (i + 1)) != undefined) { //means we will collect object only when value of Parameter is not undefined
                let key = document.getElementById("parameterKey" + (i + 1)).value; //value of key will increase as user added new Paramerters anf loop will run
                let value = document.getElementById("parameterValue" + (i + 1)).value;
                data[key] = value; //created an object 
            }
        }
        data = JSON.stringify(data); //converting object into Json String
    } else {
        data = document.getElementById("requestJsonText").value;
    }
    console.log("data is", data);

    //if the request is GET, invoke the fetch api to create a post request
    if (requestType == "GET") {
        //let urlField = document.getElementById("urlField").value;
        fetch(urlField, {
                method: 'GET'
            }).then(response => response.text())
            .then((result) => {
                console.log(result);
                // document.getElementById("responseJsonText").value = result;
                document.getElementById("prismJsonResponse").innerHTML = result; //we are using prism(library)
                Prism.highlightAll(); //this function highlight all font apearence of prism library

            }).catch(error => console.log("Sorry Request Rejected", error));
    } else {
        // NOTE in POST request we have to pass only Json-string formate data into box to get response
        fetch(urlField, {
                method: 'POST',
                body: data, //we have already converted above object(data) into json string in(contentType)
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(response => response.text())
            .then((result) => {
                console.log(result);
                // document.getElementById("responseJsonText").value = result;
                document.getElementById("prismJsonResponse").innerHTML = result; //we are using prism(library)
                Prism.highlightAll(); //this function highlight all font apearence of prism library

            }).catch(error => console.log("Sorry Request Rejected", error));
    }


}); //END OF SUBMIT EVENT LISTENER