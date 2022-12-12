const con = require("../database");

const calculate = ({username, betAmount, betType}) => {
    let flip = Math.floor(Math.random() * 2) === 0 ? "heads" : "tails";

    const result = {
        value: flip,
        betType: betType,
        betAmount: betAmount,
        username: username,
        winner: betType === flip ? "user" : "house"
    };

    logflip(result)

    return result;
}

const logflip = (result) => {
    if (result === undefined) return new Error("No result provided");

    const query = "INSERT INTO coinflips (user, bet, bet_type, result, winner, houseprofit) VALUES (?, ?, ?, ?, ?, ?)";

    con.query(query, [
        result.username,
        result.betAmount,
        result.betType,
        result.value,
        result.winner,
        result.winner === "house" ? result.betAmount : (result.betAmount * -1)
    ], (err) => {
        return !err;
    });
}

const flip = () => {
    return Math.floor(Math.random() * 2);
}

const getFlipGif = () => {
    const roll = [
        "https://media.tenor.com/92nSRpL7ukkAAAAC/casino-gamble.gif",
        "https://media.tenor.com/U0TX_mV-dy4AAAAC/bookie-bet.gif"
    ]
    return roll[Math.floor(Math.random() * roll.length)];
}

const getLosingGif = () => {
    const lostgifs = [
        "https://media.tenor.com/UT6ESaPjyQYAAAAC/degenerate-matt-damon.gif",
        "https://media.tenor.com/mcs7yBlvnrMAAAAd/bankrupt-wheel-of-fortune.gif",
        "https://media.tenor.com/ciNDyf6AgH0AAAAd/disappointed-disappointed-fan.gif",
        "https://media.tenor.com/-d4FrVwQg6EAAAAd/blinking-guy.gif"
    ]
    return lostgifs[Math.floor(Math.random() * lostgifs.length)];
}

const getWinningGif = () => {
    const wingifs = [
        "https://media.tenor.com/v9D3tSq7PPIAAAAC/homero-simpson-ruleta.gif",
        "https://media.tenor.com/ky5YCC-obwwAAAAd/rush-hour-rush-hour2.gif",
        "https://media.tenor.com/TL6DWKrMXj0AAAAC/bookie-gamble.gif"
    ]
    return wingifs[Math.floor(Math.random() * wingifs.length)];
}

const getStatistics = async () => {
    let result = {
        totalFlips: 0,
        flipsWonByUsers: 0,
        flipsWonByHouse: 0,
        totalAmount: 0,
        amountWonByUsers: 0,
        amountWonByHouse: 0
    };

    let query = "SELECT count(*) FROM coinflips WHERE winner = 'user'";
    result.flipsWonByUsers = await new Promise((resolve, reject) => {
        con.query(query, (err, res) => {
            if (err) reject(err);
            else resolve(res[0]["count(*)"]);
        });
    });

    query = "SELECT count(*) FROM coinflips WHERE winner = 'house'";
    result.flipsWonByHouse = await new Promise((resolve, reject) => {
        con.query(query, (err, res) => {
            if (err) reject(err);
            else resolve(res[0]["count(*)"]);
        });
    });

    query = "SELECT ABS(SUM(houseprofit)) FROM coinflips where houseprofit < 0";
    result.amountWonByUsers = await new Promise((resolve, reject) => {
        con.query(query, (err, res) => {
            if (err) reject(err);
            else resolve(res[0]["count(*)"]);
        });
    });

    query = "SELECT ABS(SUM(houseprofit)) FROM coinflips where houseprofit > 0";
    result.amountWonByHouse = await new Promise((resolve, reject) => {
        con.query(query, (err, res) => {
            if (err) reject(err);
            else resolve(res[0]["count(*)"]);
        });
    });

    result.totalFlips = result.flipsWonByUsers + result.flipsWonByHouse;
    result.totalAmount = result.amountWonByUsers + result.amountWonByHouse;

    console.log(result);

    return result;
}

module.exports = { calculate, flip, getFlipGif, getLosingGif, getWinningGif, getStatistics };