import { React, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { schedule, courseInfo } from "./utils"

function ScheduleView() {
    let navigate = useNavigate();
    function getTerm(num) {
        switch (num) {
            case 0:
                return "A";
            case 1:
                return "B";
            case 2:
                return "C";
            case 3:
                return "D";
            default:
                return "?";
        }
    }
    function getYear(num) {
        switch (num) {
            case 1:
                return "Freshman";
            case 2:
                return "Sophomore";
            case 3:
                return "Junior";
            case 4:
                return "Senior";
            default:
                return "?";
        }
    }
    function getCourseInfo(t) {
        localStorage.setItem("coursereq", t);
        navigate('/course-view');
    }

    var coursereq = localStorage.getItem("coursereq"), coursequery;
    courseInfo.forEach(t => {
        if (t.id === coursereq) {
            coursequery = courseInfo.filter(t => { return t.id === coursereq; })[0];
        }
    });
    const course = (k) => {
        return k.map(j => {
            return <button class="course" onClick={() => { getCourseInfo(j) }}> {j}</button >;
        });
    }

    const term = (t) => {
        let i = 0;
        return t.map(k => {
            return (<div className="term">{getTerm(i++)}-Term {course(k)}</div>);
        })
    };
    function yearMap(year) {
        switch (year) {
            case 1:
                return 'fresh';
            case 2:
                return 'soph';
            case 3:
                return 'juni';
            case 4:
                return 'seni';
            default:
                return '?';
        }
    }
    const courseHTML = (schedule) => {
        let i = 0;
        return schedule["years"].map(t => {
            var init = i == 0 ? ' active' : '';
            i++;
            return (<div className={'year ' + yearMap(i) + init} >{getYear(i)} Year {term(t)}</div>);
        });
    }
    function showYear(year) {
        document.querySelectorAll(".cycle").forEach(t => { t.classList.remove('active'); });
        document.querySelectorAll(".year").forEach(t => { t.classList.remove('active'); });
        document.querySelector("." + year).classList.add('active');
        document.querySelector(".cycle" + year).classList.add('active');
    }
    
    return (
        <>
            <head>
                <link rel="stylesheet" href="./css/sched.css" />
                <link rel="icon" href="./favicon.ico" />
            </head>
            <body>
                <div className="schedule">
                    <div className="yearbtn">
                        <button className="cyclefresh cycle active" onClick={() => { showYear("fresh") }}>Freshman</button>
                        <button className="cyclesoph cycle" onClick={() => { showYear("soph") }}>Sophomore</button>
                        <button className="cyclejuni cycle" onClick={() => { showYear("juni") }}>Junior</button>
                        <button className="cycleseni cycle" onClick={() => { showYear("seni") }}>Senior</button>
                    </div>
                    <div>
                        {courseHTML(schedule)}<br />
                    </div>
                </div>
            </body>
        </>
    )
};

export default ScheduleView;