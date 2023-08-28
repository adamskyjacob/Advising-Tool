
window.addEventListener("load", function () {
    var width = 0;
    document.querySelector(".search").querySelector(".searchoptions").querySelectorAll(".option").forEach(option => {
        var labelwidth = option.clientWidth;
        if (labelwidth > width) {
            width = labelwidth;
        }
    });
    document.querySelector(".search").querySelector(".searchoptions").querySelectorAll(".option").forEach(option => {
        var padding = width - option.clientWidth;
        option.setAttribute("style", `margin-left: ${padding}px !important;`);
    });
});