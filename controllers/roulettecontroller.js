const con = require("../database");

const roll = () => {
    const reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

    let rollObject = {
        value: 0,
        colour: "",
    };

    const roll = Math.floor(Math.random() * 37);

    if (roll === 0) {
        rollObject.value = roll;
        rollObject.colour = "green";
    } else {
        rollObject.value = roll;
        if (reds.includes(roll)) {
            rollObject.colour = "red";
        } else {
            rollObject.colour = "black";
        }
    }

    console.log(`Roll is a ${rollObject.colour} ${rollObject.value}`);

    return rollObject;
}

const checkWin = (type, result) => {
    switch (type) {
        case "red":
            return result.colour === "red";
        case "black":
            return result.colour === "black";
        case "green":
            return result.colour === "green";
        case "even":
            return result.value % 2 === 0 && result.value !== 0;
        default:
            return result.value % 2 !== 0;
    }
}

const getRollGif = () => {
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

const log = async (bet, won, multiplier) => {
    if (bet === undefined) return new Error("No bet provided");
    if (won === undefined) return new Error("No win provided");
    if (multiplier === undefined) return new Error("No multiplier provided");

    const query = "INSERT INTO roulette_rolls (bet, input, output) VALUES (?, ?, ?)";

    if (won !== 0) {
        con.query(query, [bet, 0, (bet * multiplier)], (err) => {
            return !err;
        });
    } else {
        con.query(query, [bet, bet, 0], (err) => {
            return !err;
        });
    }
}

module.exports = { roll, checkWin, getRollGif, getLosingGif, getWinningGif, log };