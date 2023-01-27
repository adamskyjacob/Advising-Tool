var mysql = require('mysql');
let response, status;

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'advisingadmin',
    database: 'advising'
});

exports.handler = async (event) => {
    try {
        let updateFunds = () => {
            return new Promise((resolve, reject) => {
                con.query("INSERT INTO courses (course,id) VALUES (?,?)", ["abc", "123"], (error, rows) => {
                    if (error) {
                        status = 400;
                        return reject(error);
                    }
                    else {
                        status = 200;
                        return resolve(rows);
                    }
                });
            });
        };
        await updateFunds();
    }
    catch (err) {
        status = 400;
        console.log(err);
    }

    response = {
        'statusCode': status,
        'body': 'SUCCESS'
    };
    return response;
};
