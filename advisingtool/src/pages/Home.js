import { Link } from "react-router-dom";

export default function Home() {
    function clickMenu() {
        document.querySelector("#menutest").classList.toggle("active")
        document.querySelector("#wpilink").classList.toggle("active")
    }

    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="./css/home.css" />
                <link rel="icon" href="./favicon.ico" />
            </head>
            <body>
                <div class="undervsgrad">
                    <button onClick={() => { location.href = '/graduate-scheduling' }}>Graduate</button>
                    <div class="gradspacer"></div>
                    <button onClick={() => { location.href = '/undergraduate-scheduling' }}>Undergraduate</button>
                </div>
            </body>
        </html>
    )
}