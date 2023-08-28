
window.sessionStorage.setItem("firstTime", "true");

window.addEventListener("load", function (e) {
    var index = 0;
    document.querySelectorAll(".course").forEach(course => {
        index++;
        if (index % 2 == 0) {
            course.style = "background: #989898; " + course.style;
        } else {
            course.style = "background: #cecece; " + course.style;
        }
    });
    document.querySelector(".selectionbutton").setAttribute("active", "true");
    document.querySelector(".selectionbutton").click();
}, false);

window.addEventListener("beforeunload", function (e) {
    window.localStorage.removeItem("query");
}, false);

window.addEventListener("load", function (e) {
    document.querySelectorAll(".courses").forEach(courses => {
        if (courses.dataset.credit !== undefined) {
            courses.dataset.credit = calculateFraction(courses.dataset.credit);
        }
    });
    document.querySelectorAll(".course").forEach(courses => {
        if (courses.dataset.credit !== undefined) {
            courses.dataset.credit = calculateFraction(courses.dataset.credit);
        }
    });
    document.querySelectorAll(".areacourses").forEach(courses => {
        if (courses.dataset.credit !== undefined) {
            courses.dataset.credit = calculateFraction(courses.dataset.credit);
        }
    });

    var count = 0;
    document.querySelectorAll(".butsel").forEach(button => {
        if (!button.hidden) {
            count++;
        }
    });

    var percent = 100 / count;
    document.querySelectorAll(".butsel").forEach(button => {
        button.style = `width: ${percent}%;`
    });

    var count2 = 0;
    document.querySelectorAll(".selectionbutton").forEach(button => {
        if (!button.hidden) {
            count2++;
        }
    });

    var percent2 = 100 / count2;
    document.querySelectorAll(".selectionbutton").forEach(button => {
        button.style = `width: ${percent2}%;`
    });

    document.querySelector(".butsel").click();
}, false);

//==================================================================//

function filterCourses(element) {
    var parent = element.parentElement;
    parent.querySelectorAll(".course").forEach(course => {
        if (!course.innerHTML.includes(element.value)) {
            course.hidden = true;
        } else {
            course.hidden = false;
        }
    });
}

//==================================================================//

function setCredit(element, val) {
    element.dataset.credit = calculateFraction(val);
}

//==================================================================//

function switchVisibleSection(value, element) {
    var thisElmt = document.querySelector(value);
    document.querySelectorAll('.subarea').forEach(area => {
        area.hidden = true;
    });
    document.querySelectorAll('.butsel').forEach(button => {
        button.setAttribute("active", "false");
    });
    thisElmt.hidden = false;
    element.setAttribute("active", "true");
}

//==================================================================//

function duplicateSelf(element) {
    var copy = element.parentElement.cloneNode(true);
    copy.querySelector(".removeprev").disabled = false;
    element.parentElement.parentElement.appendChild(copy);
}
function updateSelectedCourse(element) {
    document.querySelector(".courseoptions").querySelectorAll(".course").forEach(course => {
        course.setAttribute("active", "false");
    });
    element.setAttribute("active", "true");
}

//==================================================================//

function sendBackToOptions(element) {
    var semDiv = document.querySelectorAll(".semestercourses");
    var options = document.querySelector(".courseoptions");

    element.setAttribute("onclick", "updateSelectedCourse(this)");

    for (const semester of semDiv) {
        semester.querySelectorAll(".course").forEach(val => {
            if (!checkPrerequisite(val)) {
                val.setAttribute("onclick", "updateSelectedCourse(this)");
                options.appendChild(val);
            }
        });
    }
    element.setAttribute("active", "false");
    options.appendChild(element);
}

//==================================================================//

function hideDuplicate(element) {
    var course = element.parentElement.id;
    for (var other of document.querySelectorAll(".course")) {
        if (other.querySelector("input") == null) { continue; }
        if (element.checked) {
            if (other.id === course && other !== element.parentElement) {
                document.querySelector(".selectedcourses").querySelectorAll(".course").forEach(course => {
                    if (course.id === other.id) {
                        course.remove();
                    }
                });
                if (other.querySelector("input").checked) {
                    other.querySelector("input").click()
                }
                other.querySelector("input").hidden = true;
            }
        } else {
            if (other.id === course && !other.checked) {
                if (other.querySelector("input").checked) {
                    other.querySelector("input").click();
                }
                other.querySelector("input").hidden = false;
            }
        }
    }
}

//==================================================================//

function modifyCourseScheduling(element) {
    var parentCourse = element.parentElement;
    var courseOptions = document.querySelector(".courseoptions");

    if (element.checked) {
        var courseCopy = parentCourse.cloneNode(true);
        courseCopy.querySelector(".courselabel").innerHTML += " " + courseCopy.querySelector(".creditlabel").innerHTML;
        courseCopy.querySelector(".courselabel").setAttribute("onclick", "");
        courseCopy.querySelector(".courseinfo").remove();
        courseCopy.setAttribute("onclick", "updateSelectedCourse(this);");
        courseCopy.querySelector("input").remove();
        courseOptions.appendChild(courseCopy);
    } else {
        document.querySelector(".selectedcourses").querySelectorAll(".course").forEach(course => {
            if (course.id === parentCourse.id) {
                course.remove();
            }
        });
    }
}

//==================================================================//

function warningFunc() {
    alert("Consult your advisor about credits for this course as it either has no credits listed or is worth 0 credits.");
}

//==================================================================//

function removeYear(element) {
    element.parentElement.remove();
    list = document.querySelector(".scheduleyear").querySelectorAll(".year");
    list.forEach(year => {
        if (list.length === 1) {
            year.querySelector(".removeyear").hidden = true;
            year.querySelector(".addyear").hidden = false;
        } else {
            if (year === list[list.length - 1]) {
                year.querySelector(".removeyear").hidden = false;
                year.querySelector(".addyear").hidden = false;
            } else {
                year.querySelector(".removeyear").hidden = true;
                year.querySelector(".addyear").hidden = true;
            }
        }
    });
}

//==================================================================//

function addYear(element) {
    var clone = element.parentElement.cloneNode(true);
    clone.querySelectorAll(".course").forEach(course => {
        course.remove();
    });
    clone.querySelector(".yearlabel").innerHTML = "Year " + (document.querySelectorAll(".year").length + 1);
    clone.querySelector(".removeyear").hidden = false;
    element.parentElement.parentElement.appendChild(clone);
    element.parentElement.querySelector(".removeyear").hidden = true;
    element.hidden = true;
    list = document.querySelector(".scheduleyear").querySelectorAll(".year");
}

//==================================================================//

function updateCreditCount(element) {
    var counter = document.querySelector(".creditcounter");
    var parent = element.parentElement.parentElement.parentElement;
    if (parent.classList.contains("focussubdiv")) {
        parent = parent.querySelector(".courses");
    }
    if (parent.classList.contains("electivearea")) {
        parent = parent.querySelector(".courses");
    }
    if (parent.classList.contains(".pblsection")) {
        parent = parent.querySelector(".courses");
    }
    if (parent.querySelector("#huacourses")) {
        parent = parent.querySelector("#huacourses");
    }

    if (element.checked) {
        var current = Number(Number(parent.dataset.current) + Number(calculateFraction(element.parentElement.dataset.credit))).toFixed(5);
        if (Math.abs(Math.ceil(current) - current) < 0.01) {
            current = Math.ceil(current);
        }
        parent.dataset.current = String(current);
        var credits = Number(counter.dataset.credits) + Number(calculateFraction(element.parentElement.dataset.credit));
        if (Math.abs(Math.ceil(credits) - credits) < 0.01) {
            counter.dataset.credits = Math.ceil(credits);
        } else {
            counter.dataset.credits = String(credits);
        }
    } else {
        var current = Number(Number(parent.dataset.current) - Number(calculateFraction(element.parentElement.dataset.credit))).toFixed(5);
        if (Math.abs(Math.ceil(current) - current) < 0.01) {
            current = Math.ceil(current);
        }
        parent.dataset.current = String(current)
        var credits = Number(counter.dataset.credits) - Number(calculateFraction(element.parentElement.dataset.credit));
        if (Math.abs(Math.ceil(credits) - credits) < 0.01) {
            counter.dataset.credits = Math.ceil(credits);
        } else {
            counter.dataset.credits = String(credits);
        }
    }

    if (Number(counter.dataset.credits) < .01) {
        counter.innerHTML = "0 units";
    } else {
        counter.innerHTML = counter.dataset.credits.toString().slice(0, 5) + " units";
    }
}

//==================================================================//

function disableCourses(element) {
    var elmt = element.parentElement.parentElement;
    elmt.querySelectorAll(".course").forEach(course => {
        var num = Number(elmt.dataset.current) - Number(elmt.dataset.credit);
        course.querySelector("input").disabled = (Math.abs(num) < 0.0001 || num > 0);
        if (course.querySelector("input").checked) {
            course.querySelector("input").disabled = false;
        }
    });
}

//==================================================================//

function disableCoursesInGroup(element) {
    var elmt = element.parentElement.parentElement.parentElement;
    elmt.querySelectorAll(".course").forEach(course => {
        var num = Number(elmt.dataset.current) - Number(elmt.dataset.credit);
        course.querySelector("input").disabled = (Math.abs(num) < 0.0001 || num > 0);
        if (course.querySelector("input").checked) {
            course.querySelector("input").disabled = false;
        }
    });
    elmt.querySelectorAll(".coursegroup").forEach(group => {
        var checked = false
        group.querySelectorAll(".course").forEach(course => {
            if (course.querySelector("input").checked) {
                checked = true;
            }
        });
        if (checked) {
            group.querySelectorAll(".course").forEach(course => {
                var input = course.querySelector("input");
                if (!input.checked) {
                    input.disabled = true;
                } else {
                    input.disabled = false;
                }
            })
        }
    });
    element.disabled = false;
}

function disableCoursesInGroupTwo(element) {
    var num;
    if (document.querySelector("#IQP1").isEqualNode(element)) {
        num = 1;
    }
    else if (document.querySelector("#MQP1").isEqualNode(element)) {
        num = 2;
    }
    else {
        num = 3;
    }
    var parent = document.querySelector(`#PBL-${num}`);
    parent.querySelectorAll(".course").forEach(course => {
        var num = Number(parent.dataset.current) - Number(parent.dataset.credit);
        course.querySelector("input").disabled = (Math.abs(num) < 0.0001 || num > 0);
        if (course.querySelector("input").checked) {
            course.querySelector("input").disabled = false;
        }
    });
    parent.querySelectorAll(".coursegroup").forEach(group => {
        var checked = false
        group.querySelectorAll(".course").forEach(course => {
            if (course.querySelector("input").checked) {
                checked = true;
            }
        });
        if (checked) {
            group.querySelectorAll(".course").forEach(course => {
                var input = course.querySelector("input");
                if (!input.checked) {
                    input.disabled = true;
                } else {
                    input.disabled = false;
                }
            })
        }
    });
    element.disabled = false;
}
//==================================================================//

function removeParent(element, remove) {
    if (remove == true) {
        element.parentElement.remove();
    }
    var options = document.querySelector(".courseoptions");
    document.querySelector(".scheduleyear").querySelectorAll(".course").forEach(course => {
        if (!checkPrerequisite(course)) {
            course.setAttribute("onclick", "updateSelectedCourse(this)");
            options.appendChild(course);
        }
    });
}

//==================================================================//

function updateFinalOptions(element) {
    element.parentElement.querySelectorAll("input").forEach(input => {
        if (input !== element) {
            if (input.checked) {
                input.click();
            }
            input.disabled = false;
        }
    });
    element.checked = true;
    document.querySelector(".otherselections").querySelectorAll(".finaloption").forEach(option => {
        if (option == element.parentElement) {
            option.querySelectorAll(".finalcourse").forEach(course => {
                course.querySelector("input").disabled = false;
            });
        } else {
            option.querySelector("input").checked = false;
            option.querySelectorAll(".finalcourse").forEach(course => {
                if (course.querySelector("input").checked) {
                    course.querySelector("input").click();
                    removeCredit(course);
                }
                course.querySelector("input").disabled = true;
            });
        }
    });
}

//==================================================================//

function setFinalProj() {
    var parent = document.querySelector(".selectedfinal");
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    var options = document.querySelectorAll(".finaloption");
    for (var option of options) {
        var check = option.querySelector("input");
        if (check.checked) {
            var clone = option.cloneNode(true);
            clone.querySelector("input").remove();
            clone.querySelectorAll("input").forEach(input => {
                input.disabled = true;
            });
            parent.appendChild(clone);
            return;
        }
    }
}

//==================================================================//

function downloadSchedule() {
    let mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
    var globalcredits = document.querySelector(".creditcounter").innerHTML;
    mywindow.document.write(`<label style='font-size:20px;'>${globalcredits}</label><br />`);
    document.querySelectorAll(".year").forEach(year => {
        var yearlabel = year.querySelector('.yearlabel').innerHTML;
        mywindow.document.write(`<label style='font-size:20px;'>${yearlabel}</label><br />`);
        year.querySelectorAll(".semesterdiv").forEach(semester => {
            var semesterlabel = semester.querySelector(".semesterlabel").innerHTML;
            mywindow.document.write(`<label style='font-size:14px; margin-left:15px;'>${semesterlabel}</label>`);
            mywindow.document.write(`<div style="border:1px solid black; margin-left:25px; padding:5px;">`)
            semester.querySelectorAll(".course").forEach(course => {
                var id = course.id;
                var credit = course.dataset.credit;
                var courseinfo = `${id}: ${credit} credit(s)`
                mywindow.document.write(`<p style='text-indent:30px; font-size:10px; width:max-content;'>${courseinfo}</p>`);
            });
            mywindow.document.write(`</div>`)
        });
    });
    var option = document.querySelector(".selectedfinal").querySelector(".finaloption");
    var optionlabel;
    if (option) {
        optionlabel = option.querySelector(".finaloptionlabel").innerHTML;
        mywindow.document.write(`<br /><label style='font-size:20px;'>${optionlabel}</label><br />`);
    }
    var courses = document.querySelector(".selectedfinal").querySelectorAll(".course");
    if (courses.length > 0) {
        mywindow.document.write(`<label style='font-size:20px;'>Final Course Selections</label><br />`);
    }
    courses.forEach(course => {
        var clone = course.cloneNode(true);
        clone.querySelector("input").remove();
        var creditlabel = clone.querySelector(".creditlabel").innerHTML;
        clone.querySelector(".courseinfo").remove();
        mywindow.document.write(`<div class="course" style="border: 1px solid black; padding: 5px; margin:25px 0px;"> ${clone.innerHTML} - ${creditlabel}</div>`);
    });
    var i = 0;
    if (option) {
        option.querySelectorAll(".finalsection").forEach(section => {
            i++;
            if (section.dataset.num !== "0") {
                var num = section.dataset.num;
                mywindow.document.write(`<label style='font-size:18px;'>Section ${i}: ${num} times</label><br />`);
                section.querySelectorAll(".finalcoursegroup").forEach(group => {
                    mywindow.document.write(`<div style="border:1px solid black; margin-left:25px; padding:5px;">`)
                    for (var course of group.querySelectorAll(".finalcourse")) {
                        if (course.querySelector("input").checked == true) {
                            var clone = course.cloneNode(true);
                            clone.querySelector("input").remove();
                            clone.querySelector("br").remove();
                            mywindow.document.write(clone.innerHTML);
                        }
                        mywindow.document.write(`<br />`);
                    }
                    mywindow.document.write(`</div><br />`);
                });
            } else {
                if (section.dataset.min === section.dataset.max) {
                    var num = section.dataset.max;
                    mywindow.document.write(`<label style='font-size:18px;'>Section ${i}: ${num} credits</label><br />`);
                    section.querySelectorAll(".finalcoursegroup").forEach(group => {
                        mywindow.document.write(`<div style="border:1px solid black; margin-left:25px; padding:5px;">`)
                        for (var course of group.querySelectorAll(".finalcourse")) {
                            if (course.querySelector("input").checked == true) {
                                var clone = course.cloneNode(true);
                                clone.querySelector("input").remove();
                                clone.querySelector("br").remove();
                                mywindow.document.write(clone.innerHTML);
                                mywindow.document.write(`<br />`);
                            }
                        }
                        mywindow.document.write(`</div><br />`);
                    });
                } else {
                    var min = section.dataset.min;
                    var max = section.dataset.max;
                    mywindow.document.write(`<label style='font-size:18px;'>Section ${i}: ${min} - ${max} credits</label><br />`);
                    section.querySelectorAll(".finalcoursegroup").forEach(group => {
                        mywindow.document.write(`<div style="border:1px solid black; margin-left:25px; padding:5px;">`)
                        for (var course of group.querySelectorAll(".finalcourse")) {
                            if (course.querySelector("input").checked == true) {
                                var clone = course.cloneNode(true);
                                clone.querySelector("input").remove();
                                clone.querySelector("br").remove();
                                mywindow.document.write(clone.innerHTML);
                                mywindow.document.write(`<br />`);
                            }
                        }
                        mywindow.document.write(`</div><br />`);
                    });
                }
            }
        });
    }
    mywindow.document.close();
    mywindow.focus();
    mywindow.print();
    mywindow.close();
}

//==================================================================//

function addCourseToFinal(element) {
    var id = element.parentElement.id;
    if (element.checked) {
        var clone = element.parentElement.cloneNode(true);
        clone.id = clone.id + "-1";
        document.querySelector(".selectedfinal").appendChild(clone);
    } else {
        document.querySelector(".selectedfinal").querySelector(`#${id}-1`).remove();
    }
}

//==================================================================//

function switchVisibleSubsection(value, element) {
    document.querySelectorAll(".coursesubsect").forEach(subsect => {
        subsect.hidden = true;
    });
    document.querySelector(value).hidden = false;
    document.querySelectorAll(".selectionbutton").forEach(button => {
        button.setAttribute("active", "false");
    });
    element.setAttribute("active", "true");
}

//==================================================================//

function minimizeCoursesTwo(element) {
    var parent = element.parentElement.parentElement;
    if (element.innerHTML == "+") {
        element.innerHTML = "-";
    } else {
        element.innerHTML = "+";
    }
    parent.querySelector(".courses").hidden ^= true;
}

//==================================================================//

function addSelectedCourse(element) {
    var options = document.querySelector(".courseoptions");
    var semesterCourses = element.parentElement.querySelector('.semestercourses');
    var courses = [];
    options.querySelectorAll(".course").forEach(course => {
        var prevCourses = [];
        document.querySelectorAll(".prevcourse").forEach(prev => {
            prevCourses.push(prev.querySelector("input").value);
        });
        if (course.getAttribute("active") === "true") {
            if (course.dataset.prereq !== "" && course.dataset.prereq !== undefined) {
                var semDiv = document.querySelectorAll(".semestercourses");
                var prereq = JSON.parse(course.dataset.prereq);
                for (const semester of semDiv) {
                    if (semester == semesterCourses) {
                        break;
                    } else {
                        semester.querySelectorAll(".course").forEach(subcourse => {
                            courses.push(subcourse);
                        });
                    }
                }
                var missing = [];
                var validCourses = [];
                for (const courseGroup of prereq) {
                    var groupValid = false;
                    for (const subcourse of courseGroup) {
                        for (const val of courses) {
                            var str = (subcourse.AREA + subcourse.ID);
                            if (val.id == str) {
                                groupValid = true;
                                validCourses.push(val);
                                break;
                            }
                        }
                        if (prevCourses.includes(subcourse.AREA + subcourse.ID)) {
                            groupValid = true;
                            break;
                        }
                    }
                    if (groupValid === false) {
                        course.setAttribute("active", "false");
                        retVal = false;
                        missing.push(courseGroup);
                    } else {
                        continue;
                    }
                }
                if (missing.length > 0) {
                    var alertString = "You are missing the following prerequisites for this course:\n";
                    for (var sub of missing) {
                        var copyArr = [];
                        for (var val of sub) {
                            copyArr.push(val["AREA"] + val["ID"]);
                        }
                        alertString += "   - " + copyArr.join(" or ") + "\n";
                    }
                    alert(alertString);
                    return;
                } else {
                    course.setAttribute("onclick", "sendBackToOptions(this);");
                    course.setAttribute("active", false);
                    course.parentElement.removeChild(course);
                    semesterCourses.appendChild(course);
                }
                for (const val of validCourses) {
                    val.dataset.locked = "true";
                }
            }
            checkRecommended(course);
        }
    });
}

function checkPrerequisite(course) {
    var semesterCourses = course.parentElement;
    var courses = [];
    var prevCourses = [];
    document.querySelectorAll(".prevcourse").forEach(prev => {
        prevCourses.push(prev.querySelector("input").value);
    });

    if (course.dataset.prereq !== "" && course.dataset.prereq !== undefined) {
        var semDiv = document.querySelectorAll(".semestercourses");
        var prereq = JSON.parse(course.dataset.prereq);
        for (const semester of semDiv) {
            if (semester == semesterCourses) {
                break;
            } else {
                semester.querySelectorAll(".course").forEach(subcourse => {
                    courses.push(subcourse);
                });
            }
        }
        var retVal = true;
        var missing = [];
        var validCourses = [];
        for (const courseGroup of prereq) {
            var groupValid = false;
            for (const subcourse of courseGroup) {
                for (const val of courses) {
                    var str = (subcourse.AREA + subcourse.ID);
                    if (val.id == str) {
                        groupValid = true;
                        validCourses.push(val);
                        break;
                    }
                }
                if (prevCourses.includes(subcourse.AREA + subcourse.ID)) {
                    groupValid = true;
                    break;
                }
            }
            if (groupValid === false) {
                course.setAttribute("active", "false");
                retVal = false;
                missing.push(courseGroup);
            } else {
                continue;
            }
        }
        if (missing.length > 0) {
            var alertString = "You are missing the following prerequisites for this course:\n";
            for (var sub of missing) {
                var copyArr = [];
                for (var val of sub) {
                    copyArr.push(val["AREA"] + val["ID"]);
                }
                alertString += "   - " + copyArr.join(" or ") + "\n";
            }
            alert(alertString);
        }
    }
    return retVal;
}

function checkRecommended(course) {
    var semesterCourses = course.parentElement;
    var courses = [];
    if (course.dataset.rec !== "" && course.dataset.rec !== undefined) {
        var semDiv = document.querySelectorAll(".semestercourses");
        var rec = JSON.parse(course.dataset.rec);
        for (const semester of semDiv) {
            if (semester == semesterCourses) {
                break;
            } else {
                semester.querySelectorAll(".course").forEach(subcourse => {
                    courses.push(subcourse);
                });
            }
        }
        var missing = [];
        var validCourses = [];
        for (const courseGroup of rec) {
            var groupValid = false;
            for (const subcourse of courseGroup) {
                for (const val of courses) {
                    var str = (subcourse.AREA + subcourse.ID);
                    if (val.id == str) {
                        groupValid = true;
                        validCourses.push(val);
                        break;
                    }
                }
            }
            if (groupValid === false) {
                retVal = false;
                missing.push(courseGroup);
            } else {
                continue;
            }
        }
        if (missing.length > 0) {
            var alertString = "You are missing the following recommended for this course:\n";
            for (var sub of missing) {
                var copyArr = [];
                for (var val of sub) {
                    copyArr.push(val["AREA"] + val["ID"]);
                }
                alertString += "   - " + copyArr.join(" or ") + "\n";
            }
            alert(alertString);
        }
    }
}

function showCourses(area) {
    var huacourses = document.querySelector("#huacourses");
    huacourses.querySelectorAll(".course").forEach(course => {
        course.hidden = (course.dataset.area !== area);
        if (course.querySelector("input").checked) {
            course.querySelector("input").click();
        }
    });
}

//==================================================================//

function minimizeCourses(element) {
    element.parentElement.parentElement.querySelector(".areacourses").toggleAttribute("hidden");
    element.innerHTML = element.innerHTML == "-" ? "+" : "-";
    element.setAttribute("hidecourses", element.innerHTML == "-" ? "false" : "true");
}
