import { React } from 'react';
import { useNavigate } from "react-router-dom";
import { courseInfo } from './utils.js';

function CourseView() {
    let navigate = useNavigate();
    function getCourseInfo(t) {
        localStorage.setItem("coursereq", t);
        navigate('/course-view');
    }

    var coursereq = localStorage.getItem("coursereq"), course;
    courseInfo.forEach(t => {
        if (t.id === coursereq) {
            course = courseInfo.filter(t => { return t.id === coursereq; })[0];
        }
    })
    const courseHTML = (course) => {
        if (course == undefined) {
            course = {
                id: "ERROR",
                description: "ERROR",
                prereqs: ["ERROR"]
            }
        }
        const prereqs = course["prereqs"];
        const iddesc = (<>
            <div className="courseinfo">Course ID: {course["id"]}</div>
            <div className="courseinfo">Description: {course["description"]}</div>
        </>);
        const prereq = prereqs.length == 0 ? (<button class="prereq">None</button>) : prereqs.map(t => {
            return <button class="prereq" onClick={() => { getCourseInfo(t) }} key={t}>{t}</button>
        });
        return (<>
            {iddesc}
            <div className="courseinfo">Prerequisites: <br />{prereq}
            </div>
        </>)
    }
    return (
        <>
            <head>
                <link rel="stylesheet" href="./css/courseview.css" />
                <link rel="icon" href="./favicon.ico" />
            </head>
            <body className="body">
                <div className="course" id="course">
                    {courseHTML(course)}
                </div>
            </body>
        </>
    )
};

export default CourseView;