const con = require("../database");
const moment = require("moment");

const usercontroller = require("./usercontroller");

const max = 200;
const min = 10;
const delay = 4;

const jobs = [
    "You had a meeting behind the burger king ;)",
    "You played a bit of guitar at Leuven station",
    "You worked the cash register at the Colruyt",
    "You robbed some poor old lady at gunpoint",
    "You won a drinking bet at the pub",
    "You sold drugs to some kids",
    "You sold some feet pics on the internet",
    "You filled in some surveys on the internet",
    "You beat up some random kid and took their money",
    "You robbed a bank",
    "You engaged in prostitution for a night",
    "You sold some counterfeit goods",
    "You sold your grandparents",
    "You sold your kidneys",
    "You sold your firstborn"
];

const canWork = async (discordId) => {
    if (discordId === undefined || discordId === null) return new Error("No discordId provided");

    let query = "SELECT last_work FROM users WHERE discordId = ?";
    let last_work = await new Promise((resolve, reject) => {
        con.query(query, [discordId], (err, res) => {
            if (err) reject(err);
            else resolve(res[0].last_work);
        });
    });
    return last_work === null || moment.duration(moment().diff(moment(last_work, "HH:mm:ss DD/MM/YYYY"))).asHours() > 4;
};

const resetWork = async (discordId) => {
    if (discordId === undefined || discordId === null) return new Error("No discordId provided");

    let query = "UPDATE users SET last_work = ? WHERE discordId = ?";
    await new Promise((resolve, reject) => {
        con.query(query, [moment().format("HH:mm:ss DD/MM/YYYY"), discordId], (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
};

const getRemainingDuration = async (discordId) => {
    if (discordId === undefined || discordId === null) return new Error("No discordId provided");

    let query = "SELECT last_work FROM users WHERE discordId = ?";
    let last_work = await new Promise((resolve, reject) => {
        con.query(query, [discordId], (err, res) => {
            if (err) reject(err);
            else resolve(res[0].last_work);
        });
    });

    last_work = moment(last_work, "HH:mm:ss DD/MM/YYYY");

    return last_work.add(delay, 'hours').format("HH:mm");
};

const work = async (discordId) => {
    if (await canWork(discordId)) {
        const result = {
            success: true,
            job: jobs[Math.floor(Math.random() * jobs.length)],
            amount: Math.floor(Math.random() * (max - min) + min),
        };

        await usercontroller.addToBalance(discordId, result.amount);
        await resetWork(discordId);

        return result;
    } else {
        return {
            success: false
        };
    }

}

module.exports = { work, canWork, getRemainingDuration };