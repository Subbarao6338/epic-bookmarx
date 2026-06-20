var image_form = document.getElementById("image_uploading_form")
image_form.addEventListener("submit", HandleImageSubmitForm);

var input_image_path

function HandleImageSubmitForm(e){
e.preventDefault()
const form_data = new FormData(e.target);
fetch('/image_anonymization_submit', {method: 'POST', body: form_data,})
.then((response) => response.json())
.then((data) => {
        console.log(data)
        input_image_path = data.file_path
        alert(data["message"])
})
}

function generate_image(){
    const form_data = new FormData();
    form_data.append('file_path',input_image_path)
    fetch('/image_anonymization_generate', {method: 'POST', body: form_data,})
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        alert("Anonymized Succcess")
    })
}

function preview_image(){
    $("#display_image").attr("src","/image_anonymization_preview");
}

function download_image(){
//    document.querySelector('#download_button').innerHTML = "<i class='fa fa-download fa-download'></i> Down..."
    var a = document.createElement('a');
    a.href = '/download_image';
    a.click();
    }

function HandleBack() {
window.history.go(-1);
}