
function updateSpecial() {
    var retString = "";
    var input = document.querySelector(".specialinput");
    var sects = document.querySelectorAll(".specialsect");
    var sect = document.querySelector(".specialsection");
    if (sects.length == 0) {
        input.value = "";
        return;
    }
    retString = `{ "NUM" : ${sect.querySelector('input').value}, "OPTIONS" : [`;
    for (var sect of sects) {
        retString += `{"NAME" : "${sect.querySelector('.nameinput').value}", "CREDITS" : ${sect.querySelector('.creditinput').value}, "COURSES" : [`;
        var courseGroups = sect.querySelectorAll(".coursegroup");
        for (var group of courseGroups) {
            var courses = group.querySelectorAll(".course");
            retString += "[";
            for (var course of courses) {
                var split = course.value.split("-");
                retString += `{"AREA" : "${split[0]}","ID" : "${split[1]}"}`
                if (course !== courses[courses.length - 1]) {
                    retString += ",";
                }
            }
            retString += "]";
            if (group !== courseGroups[courseGroups.length - 1]) {
                retString += ",";
            }
        }
        retString += "]}";
        if (sect !== sects[sects.length - 1]) {
            retString += ",";
        }
    }
    retString += "]}";
    input.value = retString;
}

//===================================================================================================//

function removeSpecialArea() {
    var arr = document.querySelectorAll(".specialsect");
    if (arr.length > 0) {
        arr[arr.length - 1].remove();
    }
}

//===================================================================================================//

function addSpecialArea() {
    var parent = document.querySelector(".specialtysects");

    var specialSect = document.createElement("div");
    specialSect.classList.add("specialsect");

    var vertinputs = document.createElement("div");
    vertinputs.classList.add("vertinputs");

    var nameinput = document.createElement("input");
    nameinput.setAttribute("autocapitalize", "true");
    nameinput.classList.add("nameinput");
    nameinput.placeholder = "Enter section name...";
    nameinput.type = "text";
    vertinputs.appendChild(nameinput);

    var creditinput = document.createElement("input");
    creditinput.classList.add("creditinput");
    creditinput.placeholder = "Enter credits for this section...";
    creditinput.type = "number";
    vertinputs.appendChild(creditinput);

    specialSect.appendChild(vertinputs);

    var buttons = document.createElement("div");
    buttons.classList.add("buttons");

    var removegroup = document.createElement("button");
    removegroup.type = "button";
    removegroup.setAttribute("onclick", "removeGroup(this)");
    removegroup.innerHTML = "Remove Grouping";

    var addgroup = document.createElement("button");
    addgroup.type = "button";
    addgroup.setAttribute("onclick", "addGroup(this)");
    addgroup.innerHTML = "Add Grouping";

    buttons.appendChild(addgroup);
    buttons.appendChild(removegroup);

    specialSect.appendChild(buttons);

    parent.appendChild(specialSect);
}

//===================================================================================================//

function updateDepth() {
    var options = document.querySelectorAll(".depthoption");
    var input = document.querySelector(".depthinput");
    var depthStr = "[";
    if (options.length == 0) {
        input.value = "";
        return;
    }
    for (var option of options) {
        var groups = option.querySelectorAll(".coursegroup");
        var nameval = option.querySelector(".nameinput").value;
        var creditval = option.querySelector(".creditinput").value;
        depthStr += '{ "NAME" : "' + nameval + '", "CREDITS" : "' + (creditval == "" || creditval == null ? 0 : creditval) + '", "OPTIONS" : [';
        for (var group of groups) {
            var courses = group.querySelectorAll(".course");
            depthStr += "[";
            for (var course of courses) {
                var split = course.value.split("-");
                depthStr += '{"AREA" : "' + split[0] + '", "ID" : "' + split[1] + '"}'
                if (course !== courses[courses.length - 1]) {
                    depthStr += ",";
                }
            }
            depthStr += "]";
            if (group !== groups[groups.length - 1]) {
                depthStr += ",";
            }
        }
        depthStr += "]}";
        if (option !== options[options.length - 1]) {
            depthStr += ",";
        }
    }
    depthStr += "]";
    input.value = depthStr;
}

//===================================================================================================//

function removeDepthOption() {
    var arr = document.querySelectorAll(".depthoption");
    if (arr.length > 0) {
        arr[arr.length - 1].remove();
    }
}

//===================================================================================================//

function addDepthOption() {
    var parent = document.querySelector(".depthsects");

    var option = document.createElement("div");
    option.classList.add("depthoption");

    var vertinputs = document.createElement("div");
    vertinputs.classList.add("vertinputs");

    var nameinput = document.createElement("input");
    nameinput.setAttribute("autocapitalize", "true");
    nameinput.classList.add("nameinput");
    nameinput.placeholder = "Enter section name...";
    nameinput.type = "text";
    vertinputs.appendChild(nameinput);

    var creditinput = document.createElement("input");
    creditinput.classList.add("creditinput");
    creditinput.placeholder = "Enter credits for this section...";
    creditinput.type = "number";
    vertinputs.appendChild(creditinput);

    option.appendChild(vertinputs);

    var buttons = document.createElement("div");
    buttons.classList.add("buttons");

    var removegroup = document.createElement("button");
    removegroup.type = "button";
    removegroup.setAttribute("onclick", "removeGroup(this)");
    removegroup.innerHTML = "Remove Grouping";

    var addgroup = document.createElement("button");
    addgroup.type = "button";
    addgroup.setAttribute("onclick", "addGroup(this)");
    addgroup.innerHTML = "Add Grouping";

    buttons.appendChild(addgroup);
    buttons.appendChild(removegroup);

    option.appendChild(buttons);

    parent.appendChild(option);
}

//===================================================================================================//

function updateFocusInput() {
    var focusInput = document.querySelector(".focusinput");
    var ret = "[";
    var focusSects = document.querySelectorAll(".focussect");
    if (focusSects.length === 0 || focusSects === undefined) {
        focusInput.value = "";
        return;
    }
    for (var sect of focusSects) {
        ret += '{"CREDIT" : ' + sect.querySelector(".credits").value + ', "AREAS": [';
        var sectAreas = sect.querySelectorAll(".area");
        for (var area of sectAreas) {
            ret += '"' + area.value + '"';
            if (area !== sectAreas[sectAreas.length - 1]) {
                ret += ",";
            }
        }
        ret += "]}";
        if (sect !== focusSects[focusSects.length - 1]) {
            ret += ",";
        }
    }
    ret += "]";
    focusInput.value = ret;
}

//===================================================================================================//

function removeFocus(element) {
    var elmt = element.parentElement.parentElement.lastChild;
    if (elmt.classList.contains("areadiv")) {
        elmt.remove();
    }
}

//===================================================================================================//

function addFocus(element) {
    var parent = element.parentElement.parentElement;

    var area = document.createElement("div");
    area.classList.add("areadiv");

    var buttons = document.createElement("div");
    buttons.classList.add("buttons");

    var areaname = document.createElement("input");
    areaname.setAttribute("autocapitalize", "true");
    areaname.classList.add("area")
    areaname.type = "text";
    areaname.placeholder = "Area e.g. AE, MA, etc.";
    area.appendChild(areaname);

    parent.appendChild(area);
}

//===================================================================================================//

function removeFocusArea() {
    var arr = document.querySelectorAll(".focussect");
    if (arr.length > 0) {
        arr[arr.length - 1].remove();
    }
}

//===================================================================================================//

function addFocusArea() {
    var sects = document.querySelector(".focussects");

    var sect = document.createElement("div");
    sect.classList.add("focussect");

    var buttons = document.createElement("div");
    buttons.classList.add("buttons")

    var addfocus = document.createElement("button");
    addfocus.classList.add("addfocus");
    addfocus.setAttribute("onclick", "addFocus(this)");
    addfocus.type = "button";
    addfocus.innerHTML = "Add Focus";
    buttons.appendChild(addfocus);

    var removefocus = document.createElement("button");
    removefocus.classList.add("removefocus");
    removefocus.setAttribute("onclick", "removeFocus(this)");
    removefocus.type = "button";
    removefocus.innerHTML = "Remove Focus";
    buttons.appendChild(removefocus);

    var credits = document.createElement("input");
    credits.classList.add("credits");
    credits.type = "number";
    credits.placeholder = "# of credits"
    sect.appendChild(buttons);

    sect.appendChild(credits);

    sects.appendChild(sect);
}

//===================================================================================================//

function updateCourses() {
    var sections = document.querySelector(".coursessect").querySelectorAll(".coursesect");
    var courseString = "[";
    if (sections.length == 0) {
        return "";
    }
    for (var section of sections) {
        var groups = section.querySelectorAll(".coursegroup");
        var nameval = section.querySelector(".nameinput").value;
        var creditval = section.querySelector(".creditinput").value;
        courseString += '{"AREA" : "' + nameval + '", "CREDITS" : "' + (creditval == "" || creditval == null ? 0 : creditval) + '", "OPTIONS" : [';
        for (var group of groups) {
            var courses = group.querySelectorAll(".course");
            courseString += "[";
            for (var course of courses) {
                var split = course.value.split("-");
                courseString += '{"AREA" : "' + split[0] + '", "ID" : "' + split[1] + '"}'
                if (course !== courses[courses.length - 1]) {
                    courseString += ",";
                }
            }
            courseString += "]";
            if (group !== groups[groups.length - 1]) {
                courseString += ",";
            }
        }
        courseString += "]}";
        if (section !== sections[sections.length - 1]) {
            courseString += ",";
        }
    }
    courseString += "]";
    document.querySelector(".coursesinput").value = courseString;
}

//===================================================================================================//

function addFinalCourse(element) {
    var finalcourse = document.createElement("div");
    finalcourse.classList.add("finalcourse");

    var input = document.createElement("input");
    input.placeholder = "e.g. AE-1234";
    input.type = "text";
    input.classList.add("input");

    var minmax = document.createElement("div");
    var min = document.createElement("input");
    min.classList.add("min");
    min.type = "number";

    var max = document.createElement("input");
    max.classList.add("max");
    max.type = "number";

    minmax.appendChild(min);
    minmax.appendChild(max);
    finalcourse.appendChild(minmax);
    finalcourse.appendChild(input);

    element.parentElement.parentElement.appendChild(finalcourse);
}

//===================================================================================================//

function removeFinalCourse(element) {
    var elmt = element.parentElement.parentElement.lastChild;
    if (elmt.classList.contains("finalcourse")) {
        elmt.remove();
    }
}

//===================================================================================================//

function updateFinal() {
    var finalOptions = document.querySelectorAll(".finaloption");
    var finalinput = document.querySelector(".finalinput");
    if (finalOptions.length === 0) {
        finalinput.value = "";
        return;
    }
    var final = "[";
    for (var option of finalOptions) {
        final += "{";
        var finalName = option.querySelector(".nameinput");
        final += `"NAME" : "${finalName.value}", "SECTIONS" : [`;
        var finalsects = option.querySelectorAll(".finalsect");
        for (var sect of finalsects) {
            final += "{";
            var min = sect.querySelector(".mincredits");
            var max = sect.querySelector(".maxcredits");
            var num = sect.querySelector(".numcredits");
            min.setAttribute("min", 0);
            min.setAttribute("max", (max.value == null || max.value == "" ? 0 : max.value));
            max.setAttribute("min", (min.value == null || min.value == "" ? 0 : min.value));
            if (num.value == null || num.value.trim() == "" || num.value.trim() == 0) {
                final += '"MAX" : ' + (max.value == null || max.value == "" ? 0 : max.value) + ",";
                final += '"MIN" : ' + (min.value == null || min.value == "" ? 0 : min.value) + ",";
                final += '"NUM" : ' + 0 + ",";
            } else {
                final += '"MAX" : ' + 0 + ",";
                final += '"MIN" : ' + 0 + ",";
                final += '"NUM" : ' + num.value + ",";
            }
            final += '"COURSES" : [';
            var groups = sect.querySelectorAll(".finalcoursegroup");
            for (var group of groups) {
                final += "[";
                var courses = group.querySelectorAll(".finalcourse");
                for (var course of courses) {
                    var split = course.querySelector(".input").value.split("-");
                    var minVal = course.querySelector(".min").value;
                    var maxVal = course.querySelector(".max").value;
                    final += '{ "AREA" : "' + split[0] + '", "ID" : "' + split[1] + '", "MIN" : "' + (minVal == null || minVal == "" ? 0 : minVal) + '", "MAX" : "' + (maxVal == null || maxVal == "" ? 0 : maxVal) + '" }'
                    if (course !== courses[courses.length - 1]) {
                        final += ",";
                    }
                }
                final += "]";
                if (group !== groups[groups.length - 1]) {
                    final += ",";
                }
            }
            final += "]}";
            if (sect !== finalsects[finalsects.length - 1]) {
                final += ",";
            }
        }
        final += "]}";
        if (option !== finalOptions[finalOptions.length - 1]) {
            final += ",";
        }
    }
    final += ']';
    finalinput.value = final;
}


//===================================================================================================//

function switchCreditType(element) {
    var elmt1 = element.parentElement.querySelector(".mincredits");
    var elmt2 = element.parentElement.querySelector(".maxcredits");
    var elmt3 = element.parentElement.querySelector(".numcredits");
    elmt1.hidden ^= true;
    elmt2.hidden ^= true;
    elmt3.hidden ^= true;
    elmt1.value = elmt1.hidden ? 0 : elmt1.value;
    elmt2.value = elmt2.hidden ? 0 : elmt2.value;
    elmt3.value = elmt3.hidden ? 0 : elmt3.value;
}

//===================================================================================================//

function removeFinalOption() {
    var options = document.querySelectorAll(".finaloption");
    if (options.length > 0) {
        options[options.length - 1].remove();
    }
}


//===================================================================================================//

function addFinalOption() {
    var finalSects = document.querySelector(".finalsects");

    var finalOption = document.createElement("div");
    finalOption.classList.add("finaloption");

    var nameinput = document.createElement("input");
    nameinput.setAttribute("autocapitalize", "true");
    nameinput.classList.add("nameinput");
    nameinput.type = "text";
    nameinput.placeholder = "Degree type e.g. 'Thesis-Based'";

    finalOption.appendChild(nameinput);

    var buttons = document.createElement("div");
    buttons.classList.add("buttons");

    var addoption = document.createElement("button");
    addoption.innerHTML = "Add Group";
    addoption.type = "button";
    addoption.setAttribute("onclick", "addFinalSection(this)");
    buttons.appendChild(addoption);

    var removeoption = document.createElement("button");
    removeoption.innerHTML = "Remove Group";
    removeoption.type = "button";
    removeoption.setAttribute("onclick", "removeFinalSection(this)");
    buttons.appendChild(removeoption);

    finalOption.appendChild(buttons);
    finalSects.appendChild(finalOption);
}

//===================================================================================================//

function addFinalSection(element) {
    var parent = element.parentElement.parentElement;

    var finalSect = document.createElement("div");
    finalSect.classList.add("finalsect");

    var swapType = document.createElement("button");
    swapType.classList.add("swaptype");
    swapType.innerHTML = "Swap Credit Type";
    swapType.type = "button";
    swapType.setAttribute("onclick", "switchCreditType(this)");
    finalSect.appendChild(swapType);

    var minMax = document.createElement("div");
    var min = document.createElement("input");
    min.type = "number";
    min.hidden = true;
    min.placeholder = "Enter min credits...";
    min.classList.add("mincredits");
    minMax.appendChild(min);

    var max = document.createElement("input");
    max.type = "number";
    max.classList.add("maxcredits");
    max.hidden = true;
    max.placeholder = "Enter max credits...";
    minMax.appendChild(max);
    finalSect.appendChild(minMax);

    var num = document.createElement("input");
    num.type = "number";
    num.placeholder = "Enter # times taken...";
    num.classList.add("numcredits");
    finalSect.appendChild(num);

    var buttons = document.createElement("div");
    buttons.classList.add("buttons");

    var addGroup = document.createElement("button");
    addGroup.innerHTML = "Add Group";
    addGroup.type = "button";
    addGroup.setAttribute("onclick", "addFinalCourseGroup(this)");
    buttons.appendChild(addGroup);

    var removeGroup = document.createElement("button");
    removeGroup.innerHTML = "Remove Group";
    removeGroup.type = "button";
    removeGroup.setAttribute("onclick", "removeFinalCourseGroup(this)");
    buttons.appendChild(removeGroup);

    finalSect.appendChild(buttons);

    parent.appendChild(finalSect);
}

//===================================================================================================//

function removeFinalSection(element) {
    var arr = element.parentElement.parentElement.querySelectorAll(".finalsect");
    if (arr.length > 0) {
        arr[arr.length - 1].remove();
    }
}

//===================================================================================================//

function addFinalCourseGroup(element) {
    var finalGroup = document.createElement("div");
    finalGroup.classList.add("finalcoursegroup");

    var buttons = document.createElement("div");
    buttons.classList.add("buttons");

    var addCourse = document.createElement("button");
    addCourse.innerHTML = "Add Course";
    addCourse.type = "button";
    addCourse.setAttribute("onclick", "addFinalCourse(this)");
    buttons.appendChild(addCourse);

    var removeCourse = document.createElement("button");
    removeCourse.innerHTML = "Remove Course";
    removeCourse.type = "button";
    removeCourse.setAttribute("onclick", "removeFinalCourse(this)");
    buttons.appendChild(removeCourse);

    finalGroup.appendChild(buttons);
    element.parentElement.parentElement.appendChild(finalGroup);
}

//===================================================================================================//

function removeFinalCourseGroup(element) {
    var arr = element.parentElement.parentElement.querySelectorAll(".finalcoursegroup");
    if (arr.length > 0) {
        arr[arr.length - 1].remove();
    }
}

//===================================================================================================//

function addCoursesSection() {
    var parent = document.querySelector(".coursesections");

    var courseSect = document.createElement("div");
    courseSect.classList.add("coursesect");

    var buttons = document.createElement("div");
    buttons.classList.add("buttons");

    var nameinput = document.createElement("input");
    nameinput.setAttribute("autocapitalize", "true");
    nameinput.classList.add("nameinput");
    nameinput.placeholder = "Enter section name...";
    nameinput.type = "text";
    courseSect.appendChild(nameinput);

    var creditinput = document.createElement("input");
    creditinput.classList.add("creditinput");
    creditinput.placeholder = "Enter credits for this section...";
    creditinput.type = "number";
    courseSect.appendChild(creditinput);

    var removegroup = document.createElement("button");
    removegroup.type = "button";
    removegroup.setAttribute("onclick", "removeGroup(this)");
    removegroup.innerHTML = "Remove Grouping";

    var addgroup = document.createElement("button");
    addgroup.type = "button";
    addgroup.setAttribute("onclick", "addGroup(this)");
    addgroup.innerHTML = "Add Grouping";

    buttons.appendChild(addgroup);
    buttons.appendChild(removegroup);

    courseSect.appendChild(buttons);

    parent.appendChild(courseSect);
}

//===================================================================================================//

function removeCoursesSection() {
    var arr = document.querySelectorAll(".coursesect");
    if (arr.length > 0) {
        arr[arr.length - 1].remove();
    }
}

//===================================================================================================//

function addGroup(element) {
    var coursegroup = document.createElement("div");
    coursegroup.classList.add("coursegroup");

    var buttons = document.createElement("div");
    buttons.classList.add("buttons");

    var addbutton = document.createElement("button");
    addbutton.type = "button";
    addbutton.innerHTML = "Add Course";
    addbutton.setAttribute("onclick", "addCourse(this)");
    buttons.appendChild(addbutton);

    var removebutton = document.createElement("button");
    removebutton.type = "button";
    removebutton.innerHTML = "Remove Course";
    removebutton.setAttribute("onclick", "removeCourse(this)");
    buttons.appendChild(removebutton);

    coursegroup.appendChild(buttons);

    element.parentElement.parentElement.appendChild(coursegroup);
}

//===================================================================================================//

function removeGroup(element) {
    try {
        if (element.parentElement.parentElement.lastChild.classList.contains("coursegroup")) {
            element.parentElement.parentElement.lastChild.remove();
        }
    }
    catch (err) {
        //ignore error for now
    }
}

//===================================================================================================//

function removeParent(element) {
    element.parentElement.remove();
}

//===================================================================================================//

function addCourse(element) {
    var course = document.createElement("input");
    course.type = "text";
    course.classList.add("course");
    element.parentElement.parentElement.appendChild(course);
}

//===================================================================================================//

function removeCourse(element) {
    var elmt = element.parentElement.parentElement.lastChild;
    if (elmt.classList.contains("course")) {
        elmt.remove();
    }
}

//===================================================================================================//

function setElective() {
    var free = document.querySelector(".FREE").value;
    var related = document.querySelector(".RELATED").value;
    var approved = document.querySelector(".APPROVED").value;
    if (free === "") {
        free = "0";
    }
    if (related === "") {
        related = "0";
    }
    if (approved === "") {
        approved = "0";
    }
    var value = `{"FREE" : "${free}","RELATED" : "${related}","APPROVED" : "${approved}"}`;
    console.log(value);
    document.querySelector(".ELECTIVE").value = value;
}