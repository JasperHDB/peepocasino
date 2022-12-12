const con = require("../database");

const logdonation = (result) => {
    if (result === undefined) return new Error("No result provided");

    const query = "INSERT INTO donations (donor, donee, amount) VALUES (?, ?, ?)";

    con.query(query, [
        result.donor,
        result.donee,
        result.amount,
    ], (err) => {
        return !err;
    });
}

module.exports = { logdonation };