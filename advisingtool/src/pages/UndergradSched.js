import React from 'react';
import { humanities, degrees, year, schedule } from './utils.js';
import { useNavigate } from "react-router-dom";

function UndergradSched() {
    let navigate = useNavigate();
    const routeChange = (path) => {
        navigate(path);
    }
    function GetRequest() {
        let degree = document.querySelector("#degreeselect").value;
        let year = document.querySelector("#yearselect").value;
        let humanity = document.querySelector("#humanityselect").value;
        let bsms = document.querySelector("#bsms").value;
        let iqp = document.querySelector("#iqpoption").value;
        let result = {
            "humanities": humanity,
            "year": year,
            "degree": degree,
            "bsms": bsms,
            "iqpoption": iqp
        }
        return result;
    }
    let bsms = "BS / MS";
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="../src/App.css" />
                <link rel="stylesheet" href="./css/undergrad.css" />
                <link rel="icon" href="./favicon.ico" />
            </head>
            <body>
                <div className="scheduling">
                    <strong>Area of Study</strong><br />
                    {degrees()}
                    <strong>Student Year</strong><br />
                    {year()}
                    <strong>Humanities / HUA</strong><br />
                    {humanities()}
                    <strong>{bsms}</strong><br />
                    <select id="bsms">
                        <option>BS</option>
                        <option>MS</option>
                        <option>4 Year BS/MS</option>
                    </select>
                    <strong>IQP Type</strong><br />
                    <select id="iqpoption">
                        <option>Off Campus</option>
                        <option>On Campus</option>
                    </select>
                    <button className="scheduleview" onClick={() => {
                        localStorage.setItem("req", JSON.stringify(schedule));
                        routeChange("/schedule-view");
                    }}>Get Schedule</button>
                </div>
                <div className="schedules">
                </div>
            </body>
        </html>
    )
};

export default UndergradSched;