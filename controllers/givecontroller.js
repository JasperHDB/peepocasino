const con = require("../database");

const loggift = (packet) => {
    const query = "INSERT INTO gives (receiver, amount, reason) VALUES (?, ?, ?)";

    con.query(query, [
        packet.receiver,
        packet.amount,
        packet.reason ? packet.reason : "No reason provided"
    ], (err) => {
        return !err;
    });
}

module.exports = { loggift };