
function removeWaiveOption() {
    var options = document.querySelectorAll(".waiveoption");
    if (options.length > 0) {
        options[options.length - 1].remove();
    }
}

function addWaiveOption() {
    var parent = document.querySelector(".waiveoptions");
    var newoption = document.createElement("div");
    newoption.classList.add("waiveoption");

    var nameinput = document.createElement("input");
    nameinput.classList.add("nameinput");
    nameinput.type = "text";
    nameinput.required = true;

    var typeinput = document.createElement("select");
    typeinput.classList.add("typeinput");

    var option1 = document.createElement("option");
    option1.textContent = "Waive course";
    option1.value = "WAIVE";

    var option2 = document.createElement("option");
    option2.textContent = "Take at same time";
    option2.value = "SAMETIME";
    typeinput.appendChild(option1);
    typeinput.appendChild(option2);

    var addcourse = document.createElement("button");
    addcourse.type = "button";
    addcourse.textContent = "Add Course";
    addcourse.addEventListener("click", function () {
        addCourse2(this);
    });

    var removecourse = document.createElement("button");
    removecourse.textContent = "Remove Course";
    removecourse.type = "button";
    removecourse.addEventListener("click", function () {
        removeCourse2(this);
    });

    newoption.appendChild(nameinput);
    newoption.appendChild(typeinput);
    newoption.appendChild(addcourse);
    newoption.appendChild(removecourse);

    parent.appendChild(newoption);

    function addCourse2(element) {
        var course = document.createElement("input");
        course.type = "text";
        course.classList.add("course");
        element.parentElement.appendChild(course);
    }

    function removeCourse2(element) {
        var elmt = element.parentElement.lastChild;
        if (elmt.classList.contains("course")) {
            elmt.remove();
        }
    }
}

function updateWaive() {
    var waiveoptions = document.querySelector(".waiveoptions").querySelectorAll(".waiveoption");
    var options = [];
    for (var option of waiveoptions) {
        var nameval = option.querySelector(".nameinput").value;
        var typeval = option.querySelector(".typeinput").options[option.querySelector(".typeinput").selectedIndex].value;
        var courses = [];
        for (var course of option.querySelectorAll(".course")) {
            var split = course.value.split("-");
            var area = split[0];
            var id = split[1];
            courses.push(`{"AREA" : "${area}", "ID" : "${id}"}`)
        }
        courseval = courses.join(",")
        var value = `{"NAME" : "${nameval}", "TYPE" : "${typeval}", "COURSE" : [${courseval}]}`;
        options.push(value);
    }
    document.querySelector(".waiveinput").value = "[" + options.join(", ") + "]";
}

function toggleCrange(checked) {
    document.querySelector("#minval").required = checked;
    document.querySelector("#maxval").required = checked;
    document.querySelector("#minval").disabled = !checked;
    document.querySelector("#maxval").disabled = !checked;
    if (!checked) {
        document.querySelector(".crangeinput").value = "";
        document.querySelector("#minval").value = "";
        document.querySelector("#maxval").value = "";
    } else {
        document.querySelector("#minval").disabled = false;
        document.querySelector("#maxval").disabled = false;
        updateCrange();
    }
}
function updateCrange() {
    var min = document.querySelector("#minval").value;
    var max = document.querySelector("#maxval").value;
    document.querySelector(".crangeinput").value = `${min}-${max}`;
}

function toggleHref() {
    var checked = document.querySelector(".waivecheck").checked;
    var waivehref = document.querySelector(".waivehref");
    waivehref.disabled = !checked;
    waivehref.required = checked;
    if (!checked) {
        waivehref.value = "";
    }
}

function removeRecGroup(element) {
    var elmt = element.parentElement.parentElement.lastChild;
    if (elmt) {
        if (elmt.classList.contains("recgroup")) {
            elmt.remove();
        }
    }
}

function addRecGroup(element) {
    var newgroup = document.createElement("div");
    newgroup.classList.add("recgroup");
    var buttons = document.createElement("div");
    buttons.classList.add("buttons");
    var removecourse = document.createElement("button");
    removecourse.type = "button";
    removecourse.setAttribute("onclick", "removeCourse(this)");
    removecourse.innerHTML = "Remove";
    var addcourse = document.createElement("button");
    addcourse.type = "button";
    addcourse.setAttribute("onclick", "addCourse(this)");
    addcourse.innerHTML = "Add";
    buttons.appendChild(addcourse);
    buttons.appendChild(removecourse);
    newgroup.appendChild(buttons);

    element.parentElement.parentElement.appendChild(newgroup);
}
function removePrereqGroup(element) {
    var elmt = element.parentElement.parentElement.lastChild;
    if (elmt) {
        if (elmt.classList.contains("prereqgroup")) {
            elmt.remove();
        }
    }
}

function addPrereqGroup(element) {
    var newgroup = document.createElement("div");
    newgroup.classList.add("prereqgroup");
    var buttons = document.createElement("div");
    buttons.classList.add("buttons");
    var removecourse = document.createElement("button");
    removecourse.type = "button";
    removecourse.setAttribute("onclick", "removeCourse(this)");
    removecourse.innerHTML = "Remove";
    var addcourse = document.createElement("button");
    addcourse.type = "button";
    addcourse.setAttribute("onclick", "addCourse(this)");
    addcourse.innerHTML = "Add";
    buttons.appendChild(addcourse);
    buttons.appendChild(removecourse);
    newgroup.appendChild(buttons);

    element.parentElement.parentElement.appendChild(newgroup);
}

function addCourse(element) {
    var course = document.createElement("input");
    course.type = "text";
    course.classList.add("course");
    element.parentElement.parentElement.appendChild(course);
}

function removeCourse(element) {
    var elmt = element.parentElement.parentElement.lastChild;
    if (elmt.classList.contains("course")) {
        elmt.remove();
    }
}

function removeParent(element) {
    element.parentElement.remove();
}

function clickHidden() {
    function generateJsonPrereq() {
        var arr = "[";
        var groups = document.querySelectorAll(".prereqgroup");
        for (let i = 0; i < groups.length; i++) {
            var group = groups[i].querySelectorAll(".course");
            if (group.length === 0) {
                continue;
            } else {
                arr += "[";
                for (let j = 0; j < group.length; j++) {
                    var course = group[j];
                    if (course.value.includes("-")) {
                        var split = course.value.split("-");
                        console.log(split)
                        if (j === group.length - 1) {
                            arr += '{"AREA" : "' + split[0] + '", "ID" : "' + split[1] + '"}';
                            break;
                        } else {
                            arr += '{"AREA" : "' + split[0] + '", "ID" : "' + split[1] + '"},';
                        }
                    }
                }
                if (i === groups.length - 1) {
                    arr += "]";
                } else {
                    arr += "],";
                }
            }
        }
        arr += "]";
        if (arr === "[]") {
            return "";
        }
        return arr;
    }
    function generateJsonRec() {
        var arr = "[";
        var groups = document.querySelectorAll(".recgroup");
        for (let i = 0; i < groups.length; i++) {
            var group = groups[i].querySelectorAll(".course");
            if (group.length === 0) {
                continue;
            } else {
                arr += "[";
                for (let j = 0; j < group.length; j++) {
                    var course = group[j];
                    if (course.value.includes("-")) {
                        var split = course.value.split("-");
                        console.log(split)
                        if (j === group.length - 1) {
                            arr += '{"AREA" : "' + split[0] + '", "ID" : "' + split[1] + '"}';
                            break;
                        } else {
                            arr += '{"AREA" : "' + split[0] + '", "ID" : "' + split[1] + '"},';
                        }
                    }
                }
                if (i === groups.length - 1) {
                    arr += "]";
                } else {
                    arr += "],";
                }
            }
        }
        arr += "]";
        if (arr === "[]") {
            return "";
        }
        return arr;
    }

    document.querySelector(".prereqinput").value = generateJsonPrereq();
    document.querySelector(".recinput").value = generateJsonRec();
    document.querySelector(".hiddenbutton").click();
}