const image_form = document.getElementById("image_uploading_form")
//const image_form = document.querySelector("#image_uploading_form")
image_form.addEventListener("submit", HandleImageSubmitForm)
image_form.addEventListener("rotate_left", HandleRotationLeft)
image_form.addEventListener("rotate_right", HandleRotationRight)

function ShowParticularImage(name){
    console.log(name);
    document.getElementById("display_image").style.height = "300px";
    document.getElementById("display_image").style.width = "100%";
    document.getElementById("display_image").style.marginLeft = "0px";
    document.getElementById("display_image").style.marginTop = "150px";
    document.getElementById("display_image").src = '/static_file?f_name=' + name;

}

function HandleImageSubmitForm(event){
    event.preventDefault()
    //alert("Submitted Successfully!!");
    const form_data = new FormData(event.target)
    fetch('/image_submit', {method: 'POST', body: form_data})
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert(data["message"])
      //document.getElementById("demo").innerHTML = data['data'];
      const names = data['fname'];
      const type_ls = data['type_ls'];
      const size_ls = data['size_ls'];
      const type = data['ftype'];
      console.log(type);
      if (type == "zip"){
        let len = names.length;
        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        table.appendChild(thead);
        table.appendChild(tbody);
        document.getElementById("demo2").appendChild(table);
        let row_1 = document.createElement('tr');
        let heading_1 = document.createElement('th');
        heading_1.innerHTML = "Name";
        let heading_2 = document.createElement('th');
        heading_2.innerHTML = "Size";
        let heading_3 = document.createElement('th');
        heading_3.innerHTML = "Type";
        row_1.appendChild(heading_1);
        row_1.appendChild(heading_2);
        row_1.appendChild(heading_3);
        thead.appendChild(row_1);
        let i=0;
        for (let name of names) {
            console.log(name);
            let row = document.createElement('tr');
            let name_data = document.createElement('td');
            name_data.innerHTML = `<a href="#" onclick="ShowParticularImage('${name}');">${name}</a>`
            let size_data = document.createElement('td');
            size_data.innerHTML = size_ls[i];
            let type_data = document.createElement('td');
            type_data.innerHTML = type_ls[i];
            row.appendChild(name_data);
            row.appendChild(size_data);
            row.appendChild(type_data);
            tbody.appendChild(row);
            i=i+1;
            //document.getElementById("display_image").src = '/static_file?f_name=' + name;
        }

      }

    })
}

let ang = 0;
function HandleRotationRight(){
    ang = ang + 45;
    var b = `${ang}`;
    b = "rotate(" + b + "deg)";
    console.log(b);
   document.querySelector("#display_image").style.transform = b;

}
const angle_input = document.getElementById("angle_value");
angle_input.addEventListener("angle", HandleAngleSubmit);
function HandleAngleSubmit(){
    let ang = angle_input.value;
    var b = `${ang}`;
    b = "rotate(" + b + "deg)";
    document.querySelector("#display_image").style.transform = b;
}

function HandleRotationLeft(){
    ang = ang - 45;
    var b = `${ang}`;
    b = "rotate(" + b + "deg)";
    console.log(b);
//   document.getElementById("display_image").style.maxHeight = "60px";
//   document.getElementById("display_image").style.marginLeft = "40px";
   document.querySelector("#display_image").style.transform = b;

}

//var Rotation = document.getElementById('rotation');
//var Shift = document.getElementById('shift');
//var Flip = document.getElementById('flip');
//var Shear = document.getElementById('shear');
//var Zoom = document.getElementById('zoom');
//Rotation.addEventListener("rotation", editing_operation);
function editing_operation(){
    var Rotation = document.getElementById('rotation');
    var Shift = document.getElementById('shift');
    var Flip = document.getElementById('flip');
    var Shear = document.getElementById('shear');
    var Zoom = document.getElementById('zoom');
    var Grayscale = document.getElementById('grayscale');
    var Resize = document.getElementById('resize');
    var Width = document.getElementById('width').value;
    var Height = document.getElementById('height').value;
    console.log(Rotation.checked);
    console.log(Shift.checked);
    console.log(Flip.checked);
    console.log(Shear.checked);
    console.log(Zoom.checked);
    console.log(Grayscale.checked);
    console.log(Resize.checked);
    console.log(Width)
    console.log(Height)
    if(Rotation.checked==false && Shift.checked==false && Flip.checked==false && Shear.checked==false && Zoom.checked==false && Grayscale.checked==false && Resize.checked==false){
        alert("Please Select One Image Option!!!");
    }
    else{
        document.querySelector('#generate_button').innerHTML = "<i class='fa fa-spinner fa-spin'></i> Gen...."
        const form_data = new FormData()
        form_data.append("rotation", Rotation.checked)
        form_data.append("shift", Shift.checked)
        form_data.append("flip", Flip.checked)
        form_data.append("shear", Shear.checked)
        form_data.append("zoom", zoom.checked)
        form_data.append("grayscale", Grayscale.checked)
        form_data.append("resize", Resize.checked)
        form_data.append("width", Width)
        form_data.append("height", Height)
        fetch('/image_generation', {method: 'POST', body: form_data})
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            document.querySelector('#generate_button').innerHTML = "Generate";
            alert(data);
        })
    }


}

function func(){
  var x = document.getElementsByName("image_file");
  var txt = "";
  var file = x[0].files[0];
  txt += "Name: " + file.name + "<br>";
  s = file.size;
  s = s/1024;
  txt += "Size: " + s.toFixed(2) + " KB <br>";
  txt += "Type: " + file.type + "<br>";
  document.getElementById("demo").innerHTML = txt;
}

function PushToStorage(){
    const form_data = new FormData()
    var blob_name = document.getElementById("blob_name").value
    console.log(blob_name)
    form_data.append("Blob", blob_name)
    fetch('/push_to_db', {method: 'POST', body: form_data})
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            alert(data)
        })
}

function download_images(){
//    document.querySelector('#download_button').innerHTML = "<i class='fa fa-download fa-download'></i> Down..."
    var a = document.createElement('a');
    a.href = '/download_zip';
    try{
    a.click()}
    catch{
    alert("Please Generate Image!!")
    }

//    document.querySelector('#download_button').innerHTML = "Download"
//    fetch('/download_zip', {method: 'GET'})
//        .then((response) => response.json())
//        .then((data) => {
//            console.log(data['msg']);
//            alert(data['msg'])
//            document.querySelector('#download_button').innerHTML = "Download"
//        })
}







// function callFileUpload(){
//     $("# HandleImageSubmitForm").click();
// }

// function readURL(this); func() {
//     debugger;

//     var a = document.getElementById(' HandleImageSubmitForm');
//     if(a.value == "")
//     {
//         $("#fileLabel").innerHTML = "No File Selected";
//     }
//     else{
//         var theSplit = a.value.split('\\');
//         $("#fileLabel").html(theSplit[theSplit.length-1]);
//     }
// }