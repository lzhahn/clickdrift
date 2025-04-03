interface Person {
  //A
  firstName: string; //B
  lastName: string; //C
}

function addItem(person: Person) {
  //D
  let greeter = "Hello, " + person.firstName + " " + person.lastName;
  let p = document.createElement("p");
  p.textContent = greeter;
  document.body.appendChild(p);
  p.scrollIntoView({ behavior: "smooth" });
  let padding = document.getElementById("myButton")!.style.padding;
  console.log(padding);
  if (padding.length === 0) {
    document.getElementById("myButton")!.style.padding = "10px 20px";
  } else {
    let array = padding.split(" ");
    let widthPadding = parseInt(array[0].replace("px", "")) + 5 + "px";
    let heightPadding = parseInt(array[1].replace("px", "")) + 5 + "px";
    document.getElementById("myButton")!.style.padding =
      widthPadding + " " + heightPadding;
  }
  console.log(padding);
}

let user = { firstName: "Lucas", lastName: "Hahn" };

document
  .getElementById("myButton")!
  .addEventListener("click", (e: any) => addItem(user));
