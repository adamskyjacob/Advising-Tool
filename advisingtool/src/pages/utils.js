
export const schedule = {
    years: [
        [
            ["CS101", "CS202", "CS303"],
            ["CS404", "CS505", "CS606"],
            ["CS101", "CS202", "CS303"],
            ["CS404", "CS505", "CS606"]
        ], [
            ["CS1101", "CS1202", "CS1303"],
            ["CS1404", "CS1505", "CS1606"],
            ["CS1101", "CS1202", "CS1303"],
            ["CS1404", "CS1505", "CS1606"]
        ], [
            ["CS2101", "CS2202", "CS2303"],
            ["CS2404", "CS2505", "CS2606"],
            ["CS2101", "CS2202", "CS2303"],
            ["CS2404", "CS2505", "CS2606"]
        ], [
            ["CS3101", "CS3202", "CS3303"],
            ["CS3404", "CS3505", "CS3606"],
            ["CS3101", "CS3202", "CS3303"],
            ["CS3404", "CS3505", "CS3606"]
        ]
    ]
}

export const courseInfo = [
    {
        id: 'CS101',
        description: "This is a course 1",
        prereqs: []
    },
    {
        id: 'CS202',
        description: "This is a course 1",
        prereqs: ["CS101"]
    },
    {
        id: 'CS303',
        description: "This is a course 1",
        prereqs: ["CS202", "CS101"]
    },
    {
        id: 'CS404',
        description: "This is a course 1",
        prereqs: ["CS303", "CS202", "CS101"]
    },
    {
        id: 'CS505',
        description: "This is a course 1",
        prereqs: ["CS404", "CS303", "CS202", "CS101"]
    },
    {
        id: 'CS606',
        description: "This is a course 1",
        prereqs: ["CS505", "CS404", "CS303", "CS202", "CS101"]
    }
]

export const degrees = () => {
    var Data = ["Aerospace Engineering", "Applied Mathematics", "Applied Physics", "Applied Statistics",
        "Biochemistry", "Bioinformatics & Computational Biology", "Biology & Biotechnology", "Biomedical Engineering",
        "Bioscience Management"],
        MakeItem = function (X) {
            return <option key={X}>{X}</option>;
        };
    return <select id="degreeselect">{Data.map(MakeItem)}</select>;
}

export const year = () => {
    var Data = [2023, 2024, 2025, 2026],
        MakeItem = function (X) {
            return <option key={X}>{X}</option>;
        };
    return <select id="yearselect">{Data.map(MakeItem)}</select>;
}

export const humanities = () => {
    var Data = ["Art", "English/Theatre", "Music", "Arabic", "Chinese", "English",
        "German", "Spanish", "Writing", "Rhetoric", "History", "Philosophy",
        "Religion", "International/Global Studies", "Humanities and Arts"],
        MakeItem = function (X) {
            return <option key={X}>{X}</option>;
        };
    return <select id="humanityselect">{Data.map(MakeItem)}</select>;
}