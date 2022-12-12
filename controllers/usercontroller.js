const con = require("../database");
const moment = require("moment");

const dailyReward = 50;
const dailyRewardPoorPeople = 250;

const getAllUsers = async () => {
    const query = "SELECT * FROM users";
    return await new Promise((resolve, reject) => {
        con.query(query, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
};

const getUserById = async (discordId) => {
    if (discordId === undefined) return new Error("No discordId provided");
    const query = "SELECT * FROM users WHERE discordId = ?"
    const result = await new Promise((resolve, reject) => {
        con.query(query, [discordId], (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
    if (result.length !== 0) return result[0];
};

const isRegistered = async (discordId) => {
    if (discordId === undefined) return new Error("No discordId provided");

    const query = "SELECT * FROM users WHERE discordId = ?"
    const result = await new Promise((resolve, reject) => {
        con.query(query, [discordId], (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
    return result.length !== 0;
};

const register = async (interactionUser) => {
    if (interactionUser.id === undefined) return new Error("No discordId provided");
    if (await isRegistered(interactionUser.id)) return new Error("User is already registered");

    const query = "INSERT INTO users (discordId, username) VALUES (?, ?)";
    con.query(query, [interactionUser.id, interactionUser.username], (err) => {
        return !err;
    });
};

const getUserBalance = async (discordId) => {
    if (discordId === undefined) return new Error("No discordId provided");
    const query = "SELECT balance FROM users WHERE discordId = ?";
    return await new Promise((resolve, reject) => {
        con.query(query, [discordId], (err, res) => {
            if (err) reject(err);
            else resolve(res[0].balance);
        });
    });
};

const canClaimDaily = async (discordId) => {
    if (discordId === undefined || discordId === null) return new Error("No discordId provided");
    let query = "SELECT last_daily FROM users WHERE discordId = ?";
    const last_daily = await new Promise((resolve, reject) => {
        con.query(query, [discordId], (err, res) => {
            if (err) reject(err);
            else resolve(res[0].last_daily);
        });
    });
    return last_daily == null || last_daily !== new Date().toLocaleDateString('be-BE');
};

const claimDaily = async (discordId) => {
    if (discordId === undefined) return new Error("No discordId provided");

    const userBalance = await getUserBalance(discordId);

    if (userBalance < 500) await addToBalance(discordId, dailyRewardPoorPeople);
    else await addToBalance(discordId, dailyReward);

    const query = "UPDATE users SET last_daily = ? WHERE discordId = ?"
    await new Promise((resolve, reject) => {
        con.query(query, [new Date().toLocaleDateString('be-BE'), discordId], (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });

    return userBalance < 500 ? dailyRewardPoorPeople : dailyReward;
};

const addToBalance = async (discordId, amount) => {
    if (discordId === undefined) return new Error("No discordId provided");
    if (amount === undefined) return new Error("No amount provided");
    if (amount < 0) return new Error("Amount cannot be negative");

    let balance = await getUserBalance(discordId);
    balance += amount;

    const query = "UPDATE users SET balance = ? WHERE discordId = ?"
    await new Promise((resolve, reject) => {
        con.query(query, [balance, discordId], (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
};

const removeFromBalance = async (discordId, amount) => {
    if (discordId === undefined) return new Error("No discordId provided");
    if (amount === undefined) return new Error("No amount provided");
    if (amount < 0) return new Error("Amount cannot be negative");

    let balance = await getUserBalance(discordId);
    balance -= amount;

    const query = "UPDATE users SET balance = ? WHERE discordId = ?"
    await new Promise((resolve, reject) => {
        con.query(query, [balance, discordId], (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

const setBalance = async (discordId, amount) => {
    if (discordId === undefined) return new Error("No discordId provided");
    if (amount === undefined) return new Error("No amount provided");

    const query = "UPDATE users SET balance = ? WHERE discordId = ?"
    await new Promise((resolve, reject) => {
        con.query(query, [amount, discordId], (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

const getLeaderBoard = async () => {
    const query = "SELECT username, balance FROM users ORDER BY balance DESC LIMIT 5;"
    return await new Promise((resolve, reject) => {
        con.query(query, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

module.exports = {
    getAllUsers,
    getUserBalance,
    canClaimDaily,
    claimDaily,
    addToBalance,
    removeFromBalance,
    setBalance,
    getUserById,
    isRegistered,
    register,
    getLeaderBoard
};
