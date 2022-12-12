const con = require("../database");

const logcommand = (result) => {
    if (result === undefined) return new Error("No result provided");

    const query = "INSERT INTO commands (user, command) VALUES (?, ?)";

    con.query(query, [
        result.user,
        result.command
    ], (err) => {
        return !err;
    });
}

module.exports = { logcommand };