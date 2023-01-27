import './App.css';
import Home from "./pages/Home";
import UndergradSched from "./pages/UndergradSched";
import ScheduleView from "./pages/ScheduleView";
import CourseView from "./pages/CourseView";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function clickMenu() {
    var sidebar = document.querySelector("#sidemenu");
    var sidebtns = sidebar.querySelectorAll(".sidebtn");
    sidebtns.forEach((div) => {
        div.classList.toggle("active");
    });
    document.querySelector("#menutest").classList.toggle("active")
    document.querySelector("#sidemenu").classList.toggle("active")
}

function App() {
    return (
        <html>
            <head>
                <link rel="stylesheet" href="../src/App.css" />
            </head>
            <header className="header">
                MENU
                <button className="menubutton" id="menutest" onClick={() => { clickMenu() }}>
                    <div className="bar1"></div>
                    <div className="bar2"></div>
                    <div className="bar3"></div>
                </button>
            </header>
            <body className="body">
                <div className="sidemenu" id="sidemenu">
                    <div className="sidebtn" onClick={() => { location.href = '/' }}>Homepage</div>
                </div>
                <BrowserRouter>
                    <Routes>
                        <Route exact path='/' element={<Home />}></Route>
                        <Route exact path='/undergraduate-scheduling' element={<UndergradSched />}></Route>
                        <Route exact path='/schedule-view' element={<ScheduleView />}></Route>
                        <Route exact path='/course-view' element={<CourseView />}></Route>
                    </Routes>
                </BrowserRouter>
            </body>
        </html>
    );
}

export default App;
