const con = require("../database");

const calculate = ({username, betAmount, betType}) => {
    const roll = 1 + Math.floor(Math.random() * 6);

    const result = {
        value: roll,
        betType: betType,
        betAmount: betAmount,
        username: username,
        winner: betType === roll ? "user" : "house"
    };

    logroll(result)

    return result;
}

const logroll = (result) => {
    if (result === undefined) return new Error("No result provided");

    const query = "INSERT INTO dicerolls (user, bet, bet_type, result, winner, houseprofit) VALUES (?, ?, ?, ?, ?, ?)";

    con.query(query, [
        result.username,
        result.betAmount,
        result.betType,
        result.value,
        result.winner,
        result.winner === "house" ? result.betAmount : result.betAmount * -1
    ], (err) => {
        return !err;
    });
}

module.exports = { calculate };