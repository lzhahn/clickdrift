"use strict";
function addItem(person) {
    //D
    var greeter = "Hello, " + person.firstName + " " + person.lastName;
    var p = document.createElement("p");
    p.textContent = greeter;
    document.body.appendChild(p);
    p.scrollIntoView({ behavior: "smooth" });
    var padding = document.getElementById("myButton").style.padding;
    console.log(padding);
    if (padding.length === 0) {
        document.getElementById("myButton").style.padding = "10px 20px";
    }
    else {
        var array = padding.split(" ");
        var widthPadding = parseInt(array[0].replace("px", "")) + 5 + "px";
        var heightPadding = parseInt(array[1].replace("px", "")) + 5 + "px";
        document.getElementById("myButton").style.padding =
            widthPadding + " " + heightPadding;
    }
    console.log(padding);
}
var user = { firstName: "Lucas", lastName: "Hahn" };
document
    .getElementById("myButton")
    .addEventListener("click", function (e) { return addItem(user); });
