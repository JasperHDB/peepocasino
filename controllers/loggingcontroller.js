const con = require("../database");

const logmessage = (packet) => {
    let content = packet.interaction.commandName;

    for (let i = 0; i < packet.options.length; i++) {
        const option = packet.options[i];
        switch (option.type) {
            case 6: content += ` ${option.user.username}`;
                    break;
            default: content += ` ${option.value}`;
        }
    }

    const query = "INSERT INTO messages (guild, channel, author, content) VALUES (?, ?, ?, ?)";

    con.query(query, [
        packet.interaction.guild.name ? packet.interaction.guild.name : null,
        packet.interaction.channel.name ? packet.interaction.channel.name : null,
        packet.interaction.user.username,
        content
    ], (err) => {
        return !err;
    });
}

module.exports = { logmessage };