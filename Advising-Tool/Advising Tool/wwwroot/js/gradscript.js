
window.addEventListener("load", function () {
    var index = 0;
    document.querySelectorAll(".course").forEach(course => {
        index++;
        if (index % 2 == 0) {
            course.style = "background: #989898; " + course.style;
        } else {
            course.style = "background: #cecece; " + course.style;
        }
    });

    document.querySelector(".selectionbutton").click();

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

    dragElement(document.getElementById("mydiv"));
}, false);

window.addEventListener("beforeunload", function (e) {
    window.localStorage.removeItem("query");
}, false);


function filterFocusButton(element) {
    var courses = element.parentElement.parentElement.querySelectorAll(".course");
    var area = element.dataset.area;
    element.parentElement.querySelectorAll("button").forEach(button => {
        button.setAttribute("clicked", false);
    });
    element.setAttribute("clicked", true);
    if (area === "all") {
        element.parentElement.parentElement.querySelectorAll('.course').forEach(course => { course.hidden = false; })
    } else {
        for (var course of courses) {
            if (course.dataset.area !== area) {
                course.hidden = true;
            } else {
                course.hidden = false;
            }
        }
    }
}

//==================================================================//

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

//==================================================================//

function updateElectiveCredits(element) {
    if (element.checked) {
        if (element.parentElement.parentElement.dataset.parent == "Thesis-Based" && document.querySelector(".degreeinfo").dataset.area == "RBE") {
            document.querySelectorAll(".focussubdiv").forEach(subdiv => {
                if (JSON.parse(subdiv.dataset.areas).includes("RBE")) {
                    subdiv.querySelector(".courses").dataset.credit = 3;
                    subdiv.querySelector(".arealabel").querySelector(".credits").textContent = subdiv.querySelector(".arealabel").querySelector(".credits").textContent.replace("9", "3");
                    return;
                }
            });
        }
    } else {
        document.querySelectorAll(".focussubdiv").forEach(subdiv => {
            if (JSON.parse(subdiv.dataset.areas).includes("RBE")) {
                subdiv.querySelector(".courses").dataset.credit = 9;
                subdiv.querySelector(".arealabel").querySelector(".credits").textContent = subdiv.querySelector(".arealabel").querySelector(".credits").textContent.replace("3", "9");
                return;
            }
        });
    }
}

//==================================================================//

async function downloadSchedulePoSPDF() {
    if (document.querySelector(".degreeinfo").dataset.area === "RBE") {
        const url = "https://advisingtool20230426115233.azurewebsites.net/pospdfs/RBE_MS.pdf";
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

        const form = pdfDoc.getForm();

        const name = form.getTextField("Student Name");
        const id = form.getTextField("WPI ID");
        const email = form.getTextField("Email");
        const prevdeg = form.getTextField("Previous Degree");
        const entrydate = form.getTextField("Entry Date");
        const expcompdate = form.getTextField("Expected Completion Date 1");
        const program = form.getTextField("Program");
        const advisor = form.getTextField("Advisor");

        var fields = [name, id, email, prevdeg, entrydate, expcompdate, program, advisor];
        var form2 = document.querySelector("#mydiv").querySelector(".infoenterform");

        fields[0].setText(form2.querySelector("#infoentername").value);
        fields[1].setText(form2.querySelector("#infoenterid").value);
        fields[2].setText(form2.querySelector("#infoenteremail").value);
        fields[3].setText(form2.querySelector("#infoenterdegree").value);
        fields[4].setText(form2.querySelector("#infoenterentry").value);
        fields[5].setText(form2.querySelector("#infoentercomp").value);
        fields[6].setText(form2.querySelector("#infoenterprog").value);
        fields[7].setText(form2.querySelector("#infoenteradvisor").value);

        var finalselection = document.querySelector(".selectedfinal").querySelector(".finaloption");
        i = 0;
        let j = 0;
        for (var year of document.querySelectorAll(".year")) {
            j++;
            let k = 0;
            for (var semester of year.querySelectorAll(".semesterdiv")) {
                k++;
                for (var course of semester.querySelectorAll(".course")) {
                    i++;
                    const table = [form.getTextField(`Course NumberRow${i}`), form.getTextField(`Course TitleRow${i}`), form.getTextField(`SemesterRow${i}`), form.getTextField(`GradeRow${i}`), form.getTextField(`CreditsRow${i}`)];
                    table[0].setText(course.id);
                    table[1].setText(course.querySelector(".courselabel").textContent.split("-")[1]);
                    table[2].setText(`Y${j}-S0${k}`);
                    table[4].setText(course.dataset.credit);
                }
            }
        }
        if (finalselection) {
            if (String(finalselection.dataset.name).toLowerCase().includes("thesis")) {
                const thesis = form.getCheckBox("Thesis option 9credit");
                thesis.check();
            } else if (String(finalselection.dataset.name).toLowerCase().includes("capstone")) {
                const check = form.getCheckBox("Non Thesis option Elect a 3credit capstone from the following options");
                check.check();
                const capstone = form.getCheckBox("Capstone Project");
                capstone.check();
            } else if (String(finalselection.dataset.name).toLowerCase().includes("practicum")) {
                const check = form.getCheckBox("Non Thesis option Elect a 3credit capstone from the following options");
                check.check();
                const practicum = form.getCheckBox("Practicum");
                practicum.check();
            } else if (String(finalselection.dataset.name).toLowerCase().includes("directed")) {
                const check = form.getCheckBox("Non Thesis option Elect a 3credit capstone from the following options");
                check.check();
                const directed = form.getCheckBox("Directed Research");
                directed.check();
            }
        }

        const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
        download(pdfDataUri, "save.pdf", "application/pdf");
        document.getElementById("mydiv").setAttribute("hidden", "");
    }
}

//==================================================================//

function growText(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}

//==================================================================//

function generateMailtoHref() {
    var form = document.querySelector(".emailform");
    var href = `mailto:${form.querySelector("#email").value}?subject=${document.querySelector(".degreeinfo").dataset.longname}%20Degree%20Approval&body=${form.querySelector("#custommsg").value}%0D%0A%0D%0A${getScheduleForEmail()}`;
    form.querySelector(".sendemail").href = href;

    var emailpreview = form.querySelector(".emailpreview");
    emailpreview.innerHTML = `<br /><label><strong>Body Preview:</strong></label><br/><div class="emailprev">${form.querySelector("#custommsg").value}<br /><br />${getScheduleForEmailHTML()}</div>`;
}

//==================================================================//

function updateGlobal() {
    var relatedcoursesdiv = document.querySelector(".relatedelectives").querySelector(".courses");
    relatedcoursesdiv.querySelectorAll(".course").forEach(course5 => {
        course5.querySelector("input").disabled = (Number(relatedcoursesdiv.dataset.current) >= Number(relatedcoursesdiv.dataset.credit)) && !course5.querySelector("input").checked;
    });

    document.querySelectorAll(".focussubdiv").forEach(subdiv => {
        var subdivcourses = subdiv.querySelector(".courses");
        subdivcourses.querySelectorAll(".course").forEach(course6 => {
            course6.querySelector("input").disabled = (Number(subdivcourses.dataset.current) >= Number(subdivcourses.dataset.credit)) && !course6.querySelector("input").checked;
        });
    });
}

//==================================================================//

function crangeUpdateFunction(element) {
    var course = element.parentElement.parentElement;
    var creditlabel = course.querySelector('.creditlabel');
    var val = course.dataset.credit;
    creditlabel.textContent = creditlabel.textContent.replace(val, element.value);
    course.dataset.credit = element.value;
}

//==================================================================//

function toggleCrange(element) {
    if (element.parentElement.querySelector(".crange")) {
        element.parentElement.querySelector(".crange").disabled = element.checked;
    }
}

//==================================================================//

function waiveCourseUpdate(select) {
    var selected = select.options[select.selectedIndex];
    select.parentElement.parentElement.querySelector("input").hidden = false;
    var course = select.parentElement.parentElement;

    for (var option of select.options) {
        if (option.dataset.course) {
            var coursedata = JSON.parse(option.dataset.course);
            for (let i = 0; i < coursedata.length; i++) {
                var id = "#" + coursedata[i]["AREA"] + coursedata[i]["ID"];
                document.querySelectorAll(id).forEach(course8 => {
                    if (course8.querySelector("input")) {
                        if (course8.querySelector("input").checked) {
                            course8.querySelector("input").click();
                        }
                    }
                });
            }
        }
    }

    var tags = ["NONE", "WAIVE"];

    document.querySelector(".courseselection").querySelectorAll("#" + course.id).forEach(val => {
        if (val.querySelector("input").checked) {
            val.querySelector("input").click();
        }
        val.querySelector("input").hidden = false;
    });

    document.querySelectorAll(".course").forEach(course3 => {
        if (course3.dataset.sametime !== undefined) {
            var id = course.id;
            var arrSametime = JSON.parse(course3.dataset.sametime);
            if (arrSametime.includes(`#${id}`)) {
                var index = arrSametime.indexOf(`#${id}`);
                course3.dataset.sametime = JSON.stringify(arrSametime.splice(index, 1));
            }
        }
        if (course3.dataset.prereqcopy !== undefined) {
            course3.dataset.prereq = course3.dataset.prereqcopy;
        }
    });

    document.querySelectorAll(".electivearea").forEach(area => {
        var courses = area.querySelector(".courses");
        if (courses.dataset.creditdef) {
            area.querySelector(".arealabel").innerHTML = area.querySelector(".arealabel").innerHTML.replace(String(courses.dataset.credit), String(courses.dataset.creditdef));
            courses.dataset.credit = courses.dataset.creditdef;
        }
    });

    document.querySelectorAll(".coursesarea").forEach(area => {
        if (area.dataset.creditsdef) {
            area.querySelector(".arealabel").querySelector(".credits").textContent = area.querySelector(".arealabel").querySelector(".credits").textContent.replace(String(area.dataset.credits), String(area.dataset.creditsdef));
            area.dataset.credits = area.dataset.creditsdef;
        }
    });

    select.parentElement.parentElement.dataset.sametime = "[]";
    for (var option of select.options) {
        if (option.dataset.course) {
            var coursedata = JSON.parse(option.dataset.course);
            for (let i = 0; i < coursedata.length; i++) {
                var id = "#" + coursedata[i]["AREA"] + coursedata[i]["ID"];
                document.querySelectorAll(id).forEach(course8 => {
                    course8.dataset.prereq = course8.dataset.prereqcopy;
                    course8.dataset.sametime = "[]";
                });
            }
        }
    }
    if (selected.dataset.type === "WAIVE") {
        document.querySelectorAll("#" + course.id).forEach(val => {
            val.querySelector("input").hidden = true;
        });
        if (course.dataset.area === document.querySelector(".degreeinfo").dataset.area) {
            var parent = course.parentElement.parentElement.parentElement;
            if (parent.classList.contains("coursesarea")) {
                var relatedelectives = document.querySelector(".relatedelectives");
                var courses = relatedelectives.querySelector(".courses");
                var newval = Number(courses.dataset.credit) + Number(course.dataset.credit);
                var newval2 = Number(parent.dataset.credits) - Number(course.dataset.credit);
                relatedelectives.querySelector(".arealabel").innerHTML = relatedelectives.querySelector(".arealabel").innerHTML.replace(String(courses.dataset.credit), String(newval));
                parent.querySelector(".arealabel").querySelector(".credits").innerHTML = parent.querySelector(".arealabel").querySelector(".credits").innerHTML.replace(parent.dataset.credits, newval2);
                courses.dataset.credit = newval;
                parent.dataset.credits = String(newval2);
                if (course.querySelector("input").checked) {
                    course.querySelector("input").click();
                }
                course.querySelector("input").hidden = true;
            } else {
                var relatedelectives = document.querySelector(".relatedelectives");
                var courses = relatedelectives.querySelector(".courses");
                var newval = Number(courses.dataset.credit) + Number(course.dataset.credit);
                var newval2 = Number(parent.dataset.credit) - Number(course.dataset.credit);
                relatedelectives.querySelector(".arealabel").innerHTML = relatedelectives.querySelector(".arealabel").innerHTML.replace(String(courses.dataset.credit), String(newval2));
                parent.querySelector(".arealabel").textContent = parent.querySelector(".arealabel").textContent.replace(parent.dataset.credit, newval);
                courses.dataset.credit = newval;
                parent.dataset.credit = String(newval2);
                if (course.querySelector("input").checked) {
                    course.querySelector("input").click();
                }
                course.querySelector("input").hidden = true;
            }
        } else {
            alert("Invalid waive. Please submit a ticket to fix this issue.");
        }
        try {
            document.querySelectorAll(".course").forEach(course2 => {
                if (course2.dataset.prereq !== undefined && course2.dataset.prereq != "[]") {
                    var filteredprereq = JSON.parse(course2.dataset.prereq).filter(array => {
                        return !array.some(element => course.id === (element.AREA + element.ID));
                    });
                    if (filteredprereq == "") {
                        course2.dataset.prereq = "[]";
                    } else {
                        course2.dataset.prereq = JSON.stringify(filteredprereq);
                    }
                }
            });
        } catch (err) {
            console.log(err)
        }
    }
    else if (tags.indexOf(selected.dataset.type) == -1) {
        var option = select.options[select.selectedIndex];
        var coursedatas = JSON.parse(option.dataset.course);
        var remove = select.parentElement.parentElement;
        for (let i = 0; i < coursedatas.length; i++) {
            var coursedata = coursedatas[i];
            var query = "#" + coursedata.AREA + coursedata.ID;
            document.querySelectorAll(query).forEach(course2 => {
                if (course2.dataset.prereqcopy) {
                    var entries = JSON.parse(course2.dataset.prereq).entries();
                    for (var [, entry] of entries) {
                        for (var [, prcourse] of entry.entries()) {
                            if (remove.id === (prcourse.AREA + prcourse.ID)) {
                                var filteredprereq = JSON.parse(course2.dataset.prereq).filter(array => {
                                    return !array.some(element => select.parentElement.parentElement.id === (element.AREA + element.ID));
                                });
                                course2.dataset.prereq = JSON.stringify(filteredprereq);
                                break;
                            }
                        }
                    }
                }
            });
        }
        for (let i = 0; i < coursedatas.length; i++) {
            var coursedata = coursedatas[i];
            var query = "#" + coursedata.AREA + coursedata.ID;
            document.querySelectorAll(query).forEach(same => {
                if (same.dataset.sametime !== undefined) {
                    var id = select.parentElement.parentElement.id;
                    same.dataset.sametime = `["#${id}"]`
                }
            });
        }
    }

    if (selected.dataset.type !== "WAIVE") {
        if (course.parentElement.parentElement.parentElement.dataset.current < course.parentElement.parentElement.parentElement.dataset.credits) {
            course.querySelector("input").disabled = false;
            course.querySelector("input").click();
            course.querySelector("input").click();
        }
    }

    var related = document.querySelector(".relatedelectives");
    if (related) {
        related = related.querySelector(".courses");
    }

    var focusdivs = document.querySelectorAll(".focussubdiv");
    for (var subdiv of focusdivs) {
        var areas = JSON.parse(subdiv.dataset.areas);
        if (areas.indexOf(document.querySelector(".degreeinfo").dataset.area) != -1) {
            var subdivcourses = subdiv.querySelector(".courses");
            var total = 0;
            if (Number(related.dataset.current) > Number(related.dataset.credit)) {
                total += (Number(related.dataset.current) - Number(related.dataset.credit));
            }
            for (var course of subdiv.querySelectorAll(".course")) {
                if (course.querySelector("input").checked) {
                    total += course.credit;
                }
            }
            subdivcourses.dataset.current = total;
            break;
        }
    }
    updateGlobal();
}

//==================================================================//

function updateFinalCredits(element, checked) {
    var counter = element.parentElement.parentElement;
    if (counter.dataset.num !== "0") {
        if (checked) {
            counter.dataset.curnum = String(Number(counter.dataset.curnum) + Number(element.dataset.max));
        } else {
            counter.dataset.curnum = String(Number(counter.dataset.curnum) - Number(element.dataset.max));
        }
        counter.querySelectorAll("input").forEach(input => {
            input.disabled = !input.checked && (counter.dataset.curnum >= counter.dataset.max);
        });
    } else {
        if (checked) {
            counter.dataset.current = String(Number(counter.dataset.current) + Number(element.dataset.max));
        } else {
            counter.dataset.current = String(Number(counter.dataset.current) - Number(element.dataset.max));
        }
        counter.querySelectorAll("input").forEach(input => {
            input.disabled = !input.checked && (counter.dataset.current >= counter.dataset.max);
        });
    }
}

//==================================================================//

function filterCourses(element) {
    var parent = element.parentElement;
    parent.querySelectorAll(".course").forEach(course => {
        if (course.innerHTML.toLowerCase().includes(element.value.toLowerCase())) {
            course.hidden = false;
        } else {
            course.hidden = true;
        }
    });
}

//==================================================================//

function getScheduleForEmailHTML() {
    let emailStr = "";
    var globalcredits = document.querySelector(".creditcounter").innerHTML;
    window += `Total Credits: ${globalcredits}<br />`;
    document.querySelectorAll(".year").forEach(year => {
        var yearlabel = year.querySelector('.yearlabel').innerHTML;
        emailStr += `<strong>${yearlabel}:</strong> <br />`;
        year.querySelectorAll(".semesterdiv").forEach(semester => {
            var semesterlabel = semester.querySelector(".semesterlabel").innerHTML;
            emailStr += `<div style="text-indent:20px;"><strong>${semesterlabel}</strong><br /></div>`;
            semester.querySelectorAll(".course").forEach(course => {
                var id = course.id;
                var credit = course.dataset.credit;
                var courseinfo = `${id}: ${credit.trim()} credit(s)`
                emailStr += `<div style="text-indent:40px;">${courseinfo}<br /></div>`;
            });
            emailStr += "<br />";
        });
    });
    var option = document.querySelector(".selectedfinal").querySelector(".finaloption");
    var optionlabel;
    if (option) {
        optionlabel = option.querySelector(".finaloptionlabel").innerHTML;
        emailStr += `<strong>${optionlabel}</strong><br />`;
    }
    var i = 0;
    if (option) {
        option.querySelectorAll(".finalsection").forEach(section => {
            i++;
            if (section.dataset.num !== "0") {
                var num = section.dataset.num;
                emailStr += `<div style="text-indent:20px;">Section ${i}: ${num} times<br/></div >`;
                section.querySelectorAll(".finalcoursegroup").forEach(group => {
                    for (var course of group.querySelectorAll(".finalcourse")) {
                        if (course.querySelector("input").checked == true) {
                            var clone = course.cloneNode(true);
                            var label = clone.querySelector("b").textContent;
                            clone.querySelector("b").remove();
                            var clabel = clone.textContent;
                            emailStr += `<div style="text-indent:40px;"> ${label.trim()}: ${clabel.trim()}</div>`;
                        }
                        emailStr += "<br />";
                    }
                });
            } else if (section.dataset.min === section.dataset.max) {
                var num = section.dataset.max;
                emailStr += `<div style="text-indent:20px">Section ${i}: ${num} credits<br /></div>`;
                section.querySelectorAll(".finalcoursegroup").forEach(group => {
                    for (var course of group.querySelectorAll(".finalcourse")) {
                        var clone = course.cloneNode(true);
                        var label = clone.querySelector("b").textContent;
                        clone.querySelector("b").remove();
                        var clabel = clone.textContent;
                        emailStr += `<div style="text-indent:40px;">${label.trim()}: ${clabel.trim()}<br /></div>`;
                    }
                    emailStr += "<br />";
                });
            } else {
                var min = section.dataset.min;
                var max = section.dataset.max;
                emailStr += `<div style="text-indent:20px;">Section ${i}: ${min} - ${max} credits<br /></div>`;
                section.querySelectorAll(".finalcoursegroup").forEach(group => {
                    for (var course of group.querySelectorAll(".finalcourse")) {
                        var clone = course.cloneNode(true);
                        var label = clone.querySelector("b").textContent;
                        clone.querySelector("b").remove();
                        var clabel = clone.textContent;
                        emailStr += `<div style="text-indent:40px;">${label.trim()}: ${clabel.trim()}<br /></div>`;
                    }
                    emailStr += "<br />";
                });
            }
        });
    }
    return emailStr;
}

//==================================================================//

function getScheduleForEmail() {
    let emailStr = "";
    var globalcredits = document.querySelector(".creditcounter").innerHTML;
    window += `Total Credits: ${globalcredits}%0D%0A`;
    document.querySelectorAll(".year").forEach(year => {
        var yearlabel = year.querySelector('.yearlabel').innerHTML;
        emailStr += `${yearlabel}: %0D%0A`;
        year.querySelectorAll(".semesterdiv").forEach(semester => {
            var semesterlabel = semester.querySelector(".semesterlabel").innerHTML;
            emailStr += `%09${semesterlabel}%0D%0A`;
            semester.querySelectorAll(".course").forEach(course => {
                var id = course.id;
                var credit = course.dataset.credit;
                var courseinfo = `${id}: ${credit.trim()} credit(s)`
                emailStr += `%09%09${courseinfo}%0D%0A`;
            });
            emailStr += "%0D%0A";
        });
    });
    var option = document.querySelector(".selectedfinal").querySelector(".finaloption");
    var optionlabel;
    if (option) {
        optionlabel = option.querySelector(".finaloptionlabel").innerHTML;
        emailStr += `${optionlabel}%0D%0A`;
    }
    var i = 0;
    if (option) {
        option.querySelectorAll(".finalsection").forEach(section => {
            i++;
            if (section.dataset.num !== "0") {
                var num = section.dataset.num;
                emailStr += `%09Section ${i}: ${num} times%0D%0A`;
                section.querySelectorAll(".finalcoursegroup").forEach(group => {
                    for (var course of group.querySelectorAll(".finalcourse")) {
                        var clone = course.cloneNode(true);
                        var label = clone.querySelector("b").textContent;
                        clone.querySelector("b").remove();
                        var clabel = clone.textContent;
                        emailStr += `%09%09${label.trim()}: ${clabel.trim()}%0D%0A`;
                        emailStr += "%0D%0A";
                    }
                });
            } else {
                if (section.dataset.min === section.dataset.max) {
                    var num = section.dataset.max;
                    emailStr += `%09Section ${i}: ${num} credits%0D%0A`;
                    section.querySelectorAll(".finalcoursegroup").forEach(group => {
                        for (var course of group.querySelectorAll(".finalcourse")) {
                            var clone = course.cloneNode(true);
                            var label = clone.querySelector("b").textContent;
                            clone.querySelector("b").remove();
                            var clabel = clone.textContent;
                            emailStr += `%09%09${label.trim()}: ${clabel.trim()}%0D%0A`;
                        }
                        emailStr += "%0D%0A";
                    });
                } else {
                    var min = section.dataset.min;
                    var max = section.dataset.max;
                    emailStr += `%09Section ${i}: ${min} - ${max} credits%0D%0A`;
                    section.querySelectorAll(".finalcoursegroup").forEach(group => {
                        for (var course of group.querySelectorAll(".finalcourse")) {
                            if (course.querySelector("input").checked == true) {
                                var clone = course.cloneNode(true);
                                var label = clone.querySelector("b").textContent;
                                clone.querySelector("b").remove();
                                var clabel = clone.textContent;
                                emailStr += `%09%09${label.trim()}: ${clabel.trim()}%0D%0A`;
                            }
                        }
                        emailStr += "%0D%0A";
                    });
                }
            }
        });
    }
    return emailStr;
}

//==================================================================//

function updateGlobalCredits(element) {
    var counter = document.querySelector(".creditcounter");
    var course = element.parentElement;
    if (course.parentElement.parentElement.dataset.num == "0") {
        if (element == course.querySelector('input') && element.checked) {
            if (Math.round(Number(counter.dataset.credits)) - Number(counter.dataset.credits) < 0.00001) {
                counter.dataset.credits = String(Math.round(Number(counter.dataset.credits) + Number(course.dataset.max)));
            } else {
                counter.dataset.credits = String(Number(counter.dataset.credits) + Number(course.dataset.max));
            }
        } else if (element == course.querySelector('input') && !element.checked) {
            if (Math.round(Number(counter.dataset.credits)) - Number(counter.dataset.credits) < 0.00001) {
                counter.dataset.credits = String(Math.round(Number(counter.dataset.credits) - Number(course.dataset.max)));
            } else {
                counter.dataset.credits = String(Number(counter.dataset.credits) - Number(course.dataset.max));
            }
        }
    }
    counter.innerHTML = counter.dataset.credits + " credits";
}

//==================================================================//

function setFinalProj(element) {
    var parent = document.querySelector(".selectedfinal");
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
    var clone = element.parentElement.parentElement.parentElement.parentElement.cloneNode(true);
    clone.querySelectorAll("input").forEach(input => input.remove());
    parent.appendChild(clone);
}

//==================================================================//

function updateFinalOptions(element) {
    for (var option of document.querySelector(".finalproject").querySelectorAll(".finaloption")) {
        if (element != option.querySelector(".finalcheck")) {
            option.querySelectorAll(".finalcourse").forEach(fcourse => {
                if (fcourse.querySelector("input").checked) {
                    fcourse.querySelector("input").click();
                }
                fcourse.querySelector("input").setAttribute("disabled", '');
            });
            option.querySelector(".finalcheck").checked = false;
        } else {
            if (element.checked) {
                option.querySelectorAll(".finalcourse").forEach(fcourse => {
                    fcourse.querySelector("input").removeAttribute("disabled");
                });
            } else {
                option.querySelectorAll(".finalcourse").forEach(fcourse => {
                    if (fcourse.querySelector("input").checked) {
                        fcourse.querySelector("input").click();
                    }
                    fcourse.querySelector("input").setAttribute("disabled", '');
                });
                document.querySelector(".selectedfinal").innerHTML = '';
            }
        }
    }
    if (!element.checked) {
        element.parentElement.querySelectorAll("input").forEach(input => {
            if (!input.classList.contains("finalcheck")) {
                if (input.checked) {
                    input.click();
                }
                input.setAttribute("disabled", '');
            }
        });
    }
}

//==================================================================//

function updateCount(element) {
    var specialty = document.querySelector('.specialty');
    var count = Number(document.querySelector('.specialty').dataset.count);
    specialty.dataset.count = Number(count + (element.checked ? 1 : -1));
    if (element.checked) {
        if (specialty.dataset.count >= specialty.dataset.num) {
            document.querySelectorAll(".specialtyoption").forEach(sect => {
                if (!sect.querySelector('input').checked) {
                    sect.querySelector('input').disabled = true;
                    sect.querySelectorAll(".course").forEach(course => {
                        if (course.querySelector("input").checked) {
                            course.querySelector("input").click();
                        }
                        course.querySelector("input").disabled = true;
                    });
                }
            });
        } else {
            document.querySelectorAll(".specialtyoption").forEach(sect => {
                if (sect.dataset.credits > sect.dataset.current) {
                    sect.querySelector('input').disabled = false;
                }
            });
        }
        element.parentElement.parentElement.querySelectorAll(".course").forEach(course => {
            course.querySelector('input').disabled = false;
        });
    }
    else {
        element.parentElement.parentElement.querySelectorAll(".course").forEach(course => {
            if (course.querySelector('input').checked) {
                course.querySelector('input').click();
            }
            course.querySelector('input').disabled = true;
        });
    }
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

function minimizeCourses(element) {
    element.parentElement.parentElement.querySelector(".areacourses").toggleAttribute("hidden");
    element.innerHTML = element.innerHTML == "-" ? "+" : "-";
    element.setAttribute("hidecourses", element.innerHTML == "-" ? "false" : "true");
}

//==================================================================//

function modifyCourseScheduling(element) {
    var parentCourse = element.parentElement;
    var courseOptions = document.querySelector(".courseoptions");

    if (element.checked) {
        if (element.parentElement.parentElement.parentElement.classList.contains("focussubdiv") && element.parentElement.querySelector(".crangediv")) {
            var count;
            if (parentCourse.dataset.credit === undefined) {
                count = window.prompt("In how many semesters do you intend to complete these credits?", `1-${parentCourse.dataset.max}`);
            } else {
                count = window.prompt("In how many semesters do you intend to complete these credits?", `1-${parentCourse.dataset.credit}`);
            }
            if (isNaN(count) || Number(count) < 1) {
                element.checked = false;
                modifyCourseScheduling(element);
                return false;
            }
            if (count == null) {
                return false;
            }
            for (let i = 0; i < Number(count); i++) {
                var courseCopy = document.createElement("div");
                courseCopy.classList.add("course");

                if (parentCourse.querySelector(".crangediv")) {
                    var crangediv = document.createElement("div");
                    crangediv.classList.add("crangediv");
                    courseCopy.appendChild(crangediv);
                }

                courseCopy.setAttribute("onclick", "updateSelectedCourse(this)");
                courseCopy.dataset.prereq = parentCourse.dataset.prereq;
                courseCopy.dataset.sametime = parentCourse.dataset.sametime;
                courseCopy.dataset.srccredit = parentCourse.dataset.credit;
                courseCopy.dataset.credit = "1";
                courseCopy.id = parentCourse.id;

                var courselabel = document.createElement("label");
                courselabel.classList.add("courselabel");
                courselabel.textContent = parentCourse.querySelector(".courselabel").textContent.slice(0, parentCourse.querySelector(".courselabel").textContent.indexOf("("));

                courseCopy.appendChild(courselabel);

                var creditinput = document.createElement("input");
                creditinput.style.width = "min-content";
                creditinput.style.border = "none";
                creditinput.style.marginLeft = "5px";
                creditinput.type = "number";
                creditinput.min = 1;
                creditinput.value = 1;
                creditinput.max = (Number(parentCourse.dataset.credit) - count + 1);
                if (creditinput.max <= 0) {
                    element.checked = false;
                    modifyCourseScheduling(element);
                    return false;
                }
                creditinput.setAttribute("onchange", "creditInputUpdate(this)");
                creditinput.setAttribute("onclick", "event.stopPropagation()");

                courseCopy.querySelector(".courselabel").appendChild(creditinput);
                courseOptions.appendChild(courseCopy);
            }
            return true;
        } else {
            var id = `${parentCourse.dataset.area}${parentCourse.dataset.id}`;
            var clone = document.createElement("div");
            clone.classList.add("course");
            clone.setAttribute("onclick", "updateSelectedCourse(this)");
            clone.dataset.prereq = parentCourse.dataset.prereq;
            clone.dataset.sametime = parentCourse.dataset.sametime;
            clone.dataset.credit = parentCourse.dataset.credit;
            clone.id = parentCourse.id;

            var courselabel = document.createElement("label");
            courselabel.classList.add("courselabel");
            courselabel.textContent = parentCourse.querySelector(".courselabel").textContent.slice(0, parentCourse.querySelector(".courselabel").textContent.indexOf("("));

            clone.appendChild(courselabel);
            courseOptions.appendChild(clone);
            return true;
        }
    } else {
        document.querySelector(".selectedcourses").querySelectorAll(".course").forEach(course => {
            if (course.id === parentCourse.id) {
                if ((course.querySelector(".crangediv") && element.parentElement.querySelector(".crangediv")) || (!course.querySelector(".crangediv") && !element.parentElement.querySelector(".crangediv"))) {
                    course.remove();
                }
            }
        });
        return true;
    }
    return true;
}

//==================================================================//

function creditInputUpdate(element) {
    var course = element.parentElement.parentElement;
    if (Number(element.value) > element.max) {
        element.value = element.max;
    }
    if (Number(element.value) < element.min) {
        element.value = element.min;
    }

    course.dataset.credit = element.value;

    if (getCreditSum() > course.dataset.srccredit) {
        alert(`The amount of credits you have entered is greater than what you selected (${getCreditSum()} instead of ${course.dataset.srccredit}). Please re-enter the credits.`);
        while (getCreditSum() > course.dataset.srccredit) {
            course.dataset.credit = Number(course.dataset.credit) - 1;
            element.stepDown();
        }
    }

    function getCreditSum() {
        var creditsum = 0;
        document.querySelector(".courseoptions").querySelectorAll(".course").forEach(scourse => {
            if ((scourse.id == course.id) && (((scourse.querySelector(".crangediv") != undefined) == (course.querySelector(".crangediv") != undefined)) || scourse.classList.contains("nocrange"))) {
                creditsum += Number(scourse.dataset.credit);
            }
        });
        document.querySelector(".scheduleyear").querySelectorAll(".course").forEach(scourse => {
            if ((scourse.id == course.id) && (((scourse.querySelector(".crangediv") != undefined) == (course.querySelector(".crangediv") != undefined)) || scourse.classList.contains("nocrange"))) {
                creditsum += Number(scourse.dataset.credit);
            }
        });
        return creditsum;
    }
}

//==================================================================//

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

    element.setAttribute("onclick", "updateSelectedCourse(this);");
    element.setAttribute("active", "false");
    element.dataset.prereqbool = "false";
    options.appendChild(element);

    for (const semester of semDiv) {
        semester.querySelectorAll(".course").forEach(val => {
            if (!checkPrerequisite(val)) {
                if (confirm(`You are missing prerequisites for ${val.id}. Would you like to remove it from your schedule?`)) {
                    val.setAttribute("onclick", "updateSelectedCourse(this);");
                    val.dataset.prereqbool = "false";
                    options.appendChild(val);
                }
            }
            if (val.dataset.sametime) {
                var sametime = JSON.parse(val.dataset.sametime);
                if (sametime.includes("#" + element.id)) {
                    confirm(`You elected to take ${val.id} with ${element.id}. Would you like to remove ${val.id} from the current schedule?`);
                }
            }
        });
    }
    document.querySelector(".scheduleyear").querySelectorAll(".course").forEach(course => {
        course.dataset.prereqbool = !checkPrerequisite(course);
    });
}

//==================================================================//

function updateCreditCount(element) {
    var counter = document.querySelector(".creditcounter");
    var elmt = element.parentElement.parentElement.parentElement.parentElement;
    if (element.checked) {
        elmt.dataset.current = String(Number(elmt.dataset.current) + Number(element.parentElement.dataset.credit));
        counter.dataset.credits = String(Number(counter.dataset.credits) + Number(element.parentElement.dataset.credit));
    } else {
        elmt.dataset.current = String(Number(elmt.dataset.current) - Number(element.parentElement.dataset.credit));
        counter.dataset.credits = String(Number(counter.dataset.credits) - Number(element.parentElement.dataset.credit));
    }
    counter.innerHTML = counter.dataset.credits + " credits";
}

//==================================================================//

function updateCreditCountElectives(element) {
    var electiveParent = element.parentElement.parentElement;
    var counter = document.querySelector(".creditcounter");
    var course = element.parentElement;
    if (element.checked) {
        var newcurrent = Number(electiveParent.dataset.current) + Number(course.dataset.credit);
        electiveParent.dataset.current = String(newcurrent);
        var newcount = Number(counter.dataset.credits) + Number(element.parentElement.dataset.credit);
        counter.dataset.credits = String(newcount);
    } else {
        var newcurrent = Number(electiveParent.dataset.current) - Number(element.parentElement.dataset.credit);
        electiveParent.dataset.current = String(newcurrent);
        var newcount = Number(counter.dataset.credits) - Number(element.parentElement.dataset.credit);
        counter.dataset.credits = String(newcount);
    }
    counter.innerHTML = counter.dataset.credits + " credits";
    electiveParent.querySelectorAll(".course").forEach(course => {
        if (!course.querySelector("input").checked) {
            course.querySelector("input").disabled = Number(electiveParent.dataset.current) >= Number(electiveParent.dataset.credit);
        }
    });

}

//==================================================================//

function updateCreditCountOther(element) {
    var related = document.querySelector(".relatedelectives");
    if (related) {
        related = related.querySelector(".courses");
    }
    var focusdivs = document.querySelectorAll(".focussubdiv");
    var counter = document.querySelector(".creditcounter");
    var elmt = element.parentElement.parentElement;
    if (element.checked) {
        var newcurrent = Number(elmt.dataset.current) + Number(element.parentElement.dataset.credit);
        if (newcurrent > Number(related.dataset.credit)) {
            for (var subdiv of focusdivs) {
                var areas = JSON.parse(subdiv.dataset.areas);
                if (areas.indexOf(document.querySelector(".degreeinfo").dataset.area) != -1) {
                    var subdivcourses = subdiv.querySelector(".courses");
                    var temp2 = (newcurrent - Number(related.dataset.credit));
                    var temp = (Number(subdivcourses.dataset.current) + temp2)

                    subdivcourses.dataset.current = temp;
                    break;
                }
            }
        }
        elmt.dataset.current = String(newcurrent);
        var newcount = Number(counter.dataset.credits) + Number(element.parentElement.dataset.credit);
        counter.dataset.credits = String(newcount);
    } else {
        var newcurrent = Number(elmt.dataset.current) - Number(element.parentElement.dataset.credit);
        if (newcurrent < Number(related.dataset.credit)) {
            for (var subdiv of focusdivs) {
                var areas = JSON.parse(subdiv.dataset.areas);
                if (areas.indexOf(document.querySelector(".degreeinfo").dataset.area) != -1) {
                    var subdivcourses = subdiv.querySelector(".courses");
                    subdivcourses.dataset.current = (Number(subdivcourses.dataset.current) - (Number(related.dataset.current) - Number(related.dataset.credit)));
                    break;
                }
            }
        } else {
            for (var subdiv of focusdivs) {
                var areas = JSON.parse(subdiv.dataset.areas);
                if (areas.indexOf(document.querySelector(".degreeinfo").dataset.area) != -1) {
                    var subdivcourses = subdiv.querySelector(".courses");
                    subdivcourses.dataset.current = (Number(subdivcourses.dataset.current) - Number(element.parentElement.dataset.credit));
                    subdivcourses.querySelectorAll(".course").forEach(course4 => {
                        course4.querySelector("input").disabled = subdivcourses.dataset.current > subdivcourses.dataset.credit;
                    })
                    break;
                }
            }
        }
        elmt.dataset.current = String(newcurrent);
        var newcount = Number(counter.dataset.credits) - Number(element.parentElement.dataset.credit);
        counter.dataset.credits = String(newcount);
    }
    counter.innerHTML = counter.dataset.credits + " credits";
    elmt.querySelectorAll(".course").forEach(course => {
        if (!course.querySelector("input").checked) {
            course.querySelector("input").disabled = Number(elmt.dataset.current) >= Number(elmt.dataset.credit);
        }
    });
}

//==================================================================//

function disableCoursesInGroup(element) {
    var elmt = element.parentElement.parentElement.parentElement.parentElement;
    elmt.querySelectorAll(".course").forEach(course => {
        course.querySelector("input").disabled = (Number(elmt.dataset.current) >= elmt.dataset.credits)
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

//==================================================================//

function hideDuplicate(element) {
    var course = element.parentElement.id;
    for (var other of document.querySelectorAll(".course")) {
        if (other.querySelector("input[type=checkbox]") == null) {
            continue;
        }
        if (element.checked) {
            if (other.id === course && other !== element.parentElement && !other.querySelector(".crangediv")) {
                if (other.querySelector("input").checked) {
                    other.querySelector("input").click()
                }
                other.querySelector("input").hidden = true;
            }
        } else {
            if (other.id === course && !other.checked) {
                other.querySelector("input").hidden = false;
            }
        }
    }
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

function duplicateSelf(element) {
    var copy = element.parentElement.cloneNode(true);
    copy.querySelector(".removeprev").disabled = false;
    element.parentElement.parentElement.appendChild(copy);
}

//==================================================================//

function removeParent(element, remove) {
    if (remove == true) {
        element.parentElement.remove();
    }
    var options = document.querySelector(".courseoptions");
    document.querySelector(".scheduleyear").querySelectorAll(".course").forEach(course => {
        if (!checkPrerequisite(course)) {
            course.setAttribute("onclick", "updateSelectedCourse(this);");
            options.appendChild(course);
        }
    });
}

//==================================================================//

function toggleDepthOptions(element) {
    var parent = element.parentElement.parentElement;
    if (element.checked) {
        parent.querySelectorAll(".course").forEach(course => {
            course.querySelector("input").disabled = false;
        });
    } else {
        parent.querySelectorAll(".course").forEach(course => {
            if (course.querySelector("input").checked) {
                course.querySelector("input").click();
            }
            course.querySelector("input").disabled = true;
        });
    }
    document.querySelectorAll(".depthoption").forEach(option => {
        if (option != parent) {
            if (option.querySelector("input").checked) {
                option.querySelector("input").click();
            } else {
                element.click();
            }
            option.querySelectorAll("input").disabled = true;
            option.querySelector("input").checked = false;
        }
    });
}

//==================================================================//

function addFinalCourse(element) {
    var courseoptions = document.querySelector(".courseoptions");
    var course = element.parentElement;
    var courseid = (course.dataset.area + course.dataset.id);
    if (element.checked) {
        if (document.querySelector(".degreeinfo").dataset.area === "RBE") {
            var count;
            if (courseid === "RBE594") {
                count = 1;
            } else {
                if (course.dataset.credit === undefined) {
                    count = window.prompt("In how many semesters do you intend to complete these credits?", `1-${course.dataset.max}`);
                } else {
                    count = window.prompt("In how many semesters do you intend to complete these credits?", `1-${course.dataset.credit}`);
                }
                if (isNaN(count) || Number(count) < 1) {
                    element.checked = false;
                    addFinalCourse(element);
                    return false;
                }
                if (count == null) {
                    return false;
                }
            }
            for (let i = 0; i < Number(count); i++) {
                var newcourse = document.createElement("div");
                newcourse.classList.add("course");
                newcourse.classList.add("nocrange");

                newcourse.setAttribute("onclick", "updateSelectedCourse(this)");
                newcourse.dataset.prereq = "[]";
                newcourse.dataset.sametime = "[]";
                newcourse.dataset.credit = "0";
                if (courseid === "RBE594") {
                    newcourse.dataset.credit = course.dataset.max;
                }
                newcourse.dataset.srccredit = course.dataset.max;
                newcourse.id = courseid;

                var courselabel = document.createElement("label");
                courselabel.classList.add("courselabel");
                courselabel.textContent = course.querySelector("b").textContent;

                if (courseid !== "RBE594") {
                    var creditdiv = document.createElement("div");
                    creditdiv.style.fontWeight = "700";

                    var creditlabel = document.createElement("label");
                    creditlabel.textContent = "(Credits: ";
                    creditdiv.appendChild(creditlabel);

                    var creditinput = document.createElement("input");
                    creditinput.style.width = "min-content";
                    creditinput.style.border = "none";
                    creditinput.style.height = (Number(creditlabel.style.fontSize.replace("px", "")) - 4) + "px";
                    creditinput.style.marginLeft = "5px";
                    creditinput.type = "number";
                    creditinput.min = 1;
                    creditinput.textContent = 1
                    creditinput.max = (Number(course.dataset.max) - count + 1);
                    if (creditinput.max <= 0) {
                        element.checked = false;
                        addFinalCourse(element);
                        return false;
                    }
                    creditinput.setAttribute("onchange", "creditInputUpdate(this)");
                    creditinput.setAttribute("onclick", "event.stopPropagation()");
                    creditdiv.appendChild(creditinput);
                    creditdiv.innerHTML += ")";
                    newcourse.appendChild(courselabel.cloneNode(true));
                    newcourse.appendChild(creditdiv);
                } else {
                    newcourse.appendChild(courselabel.cloneNode(true));
                }

                courseoptions.appendChild(newcourse.cloneNode(true));
            }
        }
    } else {
        var matching = document.querySelector(".courseoptions").querySelectorAll(`#${courseid}`);
        for (var course of matching) {
            if (course.classList.contains("nocrange") || !course.querySelector(".crangediv")) {
                course.remove();
            }
        }
    }
    return true;
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
            if (semesterCourses.querySelector(`#${course.id}`) && ["RBE594", "RBE596", "RBE598"].includes(course.id)) {
                window.alert(`You already added a section of ${course.id} to this semester.`)
                return;
            }
            if (course.querySelector(".crange")) {
                if (course.dataset.credit === undefined) {
                    window.prompt("In how many semesters do you intend to complete these credits?", `1-${course.dataset.max}`);
                } else {
                    window.prompt("In how many semesters do you intend to complete these credits?", `1-${course.dataset.credit}`);
                }
            }
            if (course.dataset.sametime != "[]" && course.dataset.sametime != undefined) {
                var sametime = JSON.parse(course.dataset.sametime);
                var sametimeArr = [];
                var alertstr = "";
                for (let i = 0; i < sametime.length; i++) {
                    sametimeArr.push(sametime[i]);
                }
                var missingsametime = [];
                for (var sametimecourse of sametimeArr) {
                    var sametimereplace = sametimecourse.replace("#", "");
                    var sametimecourse2;
                    for (var idcourse of semesterCourses.querySelectorAll(".course")) {
                        if (idcourse.dataset.id === sametimereplace) {
                            sametimecourse2 = idcourse;
                        }
                    }
                    if (!semesterCourses.querySelector(sametimecourse) && sametimecourse2 == undefined) {
                        missingsametime.push(sametimecourse);
                    }
                }
                if (missingsametime.length > 0) {
                    alertstr += "You've elected to take this course at the same time as ";
                    alertstr += missingsametime.join(", and");
                    if (!confirm(alertstr)) {
                        return;
                    }
                }
            }
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
                        missing.push(courseGroup);
                    } else {
                        continue;
                    }
                }
                if (missing.length > 0) {
                    var alertString = `You are missing the following prerequisites for ${course.id}:\n`;
                    for (var sub of missing) {
                        var copyArr = [];
                        for (var val of sub) {
                            copyArr.push(val["AREA"] + val["ID"]);
                        }
                        alertString += "   - " + copyArr.join(" or ") + "\n";
                    }
                    if (confirm(alertString)) {
                        course.setAttribute("onclick", "sendBackToOptions(this);");
                        course.dataset.prereqbool = "false";
                        course.setAttribute("active", false);
                        course.parentElement.removeChild(course);
                        semesterCourses.appendChild(course);
                    }
                } else {
                    course.setAttribute("onclick", "sendBackToOptions(this);");
                    course.dataset.prereqbool = "false";
                    course.setAttribute("active", false);
                    course.parentElement.removeChild(course);
                    semesterCourses.appendChild(course);
                }
            }
            else {
                course.setAttribute("onclick", "sendBackToOptions(this);");
                course.dataset.prereqbool = "false";
                course.setAttribute("active", false);
                course.parentElement.removeChild(course);
                semesterCourses.appendChild(course);
            }
            checkRecommended(course);
        }
    });
    document.querySelector(".scheduleyear").querySelectorAll(".course").forEach(val => {
        val.dataset.prereqbool = !checkPrerequisite(val);
    });
}

//==================================================================//

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
    }
    return retVal;
}

//==================================================================//

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
            var alertString = "You are missing the following recommended background for this course:\n";
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