const getAll = async () => {
  //fetch
  let JSONData = await fetch("http://localhost:8080/api/recipes");
  let data = await JSONData.json();
  
  //display
}

getAll();

const handleSubmit = async () => {

}

const submitButton = document.getElementById("recipe-form-submit");
submitButton.addEventListener("click", handleSubmit);