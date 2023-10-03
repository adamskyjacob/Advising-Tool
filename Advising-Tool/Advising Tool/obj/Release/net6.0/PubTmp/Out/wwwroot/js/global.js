
function calculateFraction(fraction) {
    if (typeof fraction === "string") {
        if (fraction.includes("-")) {
            var split = fraction.split("-");
            return calcArrayFraction(split);
        } else if (fraction.includes("/")) {
            var split = fraction.split("/");
            return calcArrayFraction(split);
        } else {
            return Number(fraction);
        }
    }
    throw new Error(`calculateFraction expected input of type string but instead received input of type ${typeof fraction}`);

    function calcArrayFraction(val) {
        var numerator = Number(val[0]);
        var denominator = Number(val[1]);
        return numerator / denominator;
    }
}

function checkAllCourseSections(ug) {
    var groups = [];
    for (var t of document.querySelectorAll(".courses")) {
        groups.push(t);
    }

    if (ug == true) {
        for (var t of document.querySelectorAll(".areacourses")) {
            groups.push(t);
        }
        for (var t of document.querySelectorAll(".pblsection")) {
            groups.push(t.querySelector(".courses"));
        }
    } else {
        for (var t of document.querySelectorAll(".coursesarea")) {
            groups.push(t);
        }
    }
    var invalid = [];
    for (var courses of groups) {
        if (courses.dataset.credits) {
            var val = courses.dataset.current - courses.dataset.credits;
            if (val > 0 || val == 0) {
                continue;
            }
            if (Math.abs(val) < 0.0001) {
                continue;
            } else {
                invalid.push(courses);
            }
        } else {
            var val = courses.dataset.current - courses.dataset.credit;
            if (val > 0 || val == 0) {
                continue;
            }
            if (Math.abs(val) < 0.0001) {
                continue;
            } else {
                invalid.push(courses);
            }
        }
    }

    var sects = "";
    if (invalid.length > 0) {
        sects = "You are missing credits in the following sections:\n"
    }

    var finalValid = true;
    var finalOpt;
    var finalOpts = document.querySelectorAll(".finaloption");
    for (var final of finalOpts) {
        if (final.querySelector("input:checked")) {
            finalOpt = final;
        }
    }
    if (finalOpts.length !== 0) {
        if (typeof finalOpt === 'undefined') {
            sects += "- No final selection\n";
            finalValid = false;
        } else {
            let i = 0;
            for (var sect of finalOpt.querySelectorAll(".finalsection")) {
                i++;
                if (Number(sect.dataset.curnum) >= Number(sect.dataset.num) && Number(sect.dataset.num) != 0) {
                    continue;
                }
                else if (Number(sect.dataset.current) >= Number(sect.dataset.min) && Number(sect.dataset.min) != 0) {
                    continue;
                } else {
                    var nodecopy = document.createElement("div");
                    nodecopy.classList.add("finaloption");

                    var label = document.createElement("label");
                    label.classList.add("finaloptionlabel");
                    label.innerHTML = finalOpt.dataset.name + ` - Section ${i}`
                    finalValid = false;
                    nodecopy.appendChild(label);

                    invalid.push(nodecopy);
                }
            }
        }
    }
    if (!(document.querySelector(".courseoptions").lastChild instanceof HTMLElement)) {
        alert("You haven't selected any courses yet!");
        return;
    }
    for (var courses of invalid) {
        if (courses.classList.contains("coursesarea")) {
            var label = courses.querySelector(".arealabel").querySelector(".credits")?.cloneNode(true);
            if (label) {
                label.querySelectorAll("label").forEach(t => t.remove());
                sects += "- " + label.innerHTML.trim();
                sects += "\n";
            }
        } else if (courses.classList.contains("courses")) {
            if (courses.parentElement.classList.contains("focussubdiv")) {
                var label = courses.parentElement.querySelector("label").querySelector(".credits")?.cloneNode(true);
                if (label) {
                    label.querySelectorAll("label").forEach(t => t.remove());
                    sects += "- " + label.innerHTML.trim();
                    sects += "\n";
                }
            } else {
                var label = courses.parentElement.querySelector("label")?.cloneNode(true);
                if (label) {
                    label.querySelectorAll("label").forEach(t => t.remove());
                    sects += "- " + label.innerHTML.trim();
                    sects += "\n";
                }
            }
        } else if (courses.classList.contains("finaloption")) {
            var label = courses.querySelector(".finaloptionlabel")?.cloneNode(true);
            if (label) {
                sects += "- " + label.innerHTML.trim();
                sects += "\n";
            }
        } else if (courses.classList.contains("areacourses")) {
            var label = courses.parentElement.querySelector(".arealabel")?.cloneNode(true);
            if (label) {
                label.querySelector("label").remove();
                sects += "- " + label.innerHTML.trim();
                sects += "\n";
            }
        }
    }
    if (sects !== "") {
        alert(sects);
    }
    return invalid.length == 0 && finalValid;
}