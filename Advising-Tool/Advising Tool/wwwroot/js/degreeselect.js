window.addEventListener("load", function () {
    document.querySelector("#aos").options[0].click();
    document.querySelector("#type").options[0].click();
}, false);

function switchDegree() {
    var area = document.querySelector("#aos");
    document.querySelector("#typeselectholder").innerHTML = '';

    var options = document.createElement("select");
    options.id = "type";
    options.name = "TYPE";

    var tempselect = document.querySelector("#tempselect");
    options.querySelectorAll("option").forEach(opt => {
        opt.remove();
    });
    for (var option of tempselect.querySelectorAll("option")) {
        if (option.dataset.area == area.value) {
            options.appendChild(option.cloneNode(true));
        }
    }
    options.options[0].selected = true;
    document.querySelector("#typeselectholder").appendChild(options);
}