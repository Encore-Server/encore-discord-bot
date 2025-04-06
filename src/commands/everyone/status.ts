import {EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {ByondTopic} from "../../byond-topic";
export const data = new SlashCommandBuilder()
    .setName('status')
    .setDescription('Gets Round Status');

export const execute = async (interaction) => {
    let byond = new ByondTopic();
    await byond.sendTopic('status').then((response: any) => {
        console.log('response: ', response);
        let responseList = new URLSearchParams(response);
        let statusEmbed = new EmbedBuilder()
            .setTitle('Round Status')
            .setTimestamp(new Date())
            .setColor([128, 128, 0]);
        responseList.forEach((value, name) => {
            if (name !== 'host' && !name.match(/player[0-9]/g)) {
                const field: any[] = [{name: name, value: value, inline: true}];
                statusEmbed.addFields(field);
            }
        });
        return interaction.reply({embeds: [statusEmbed]});
    }).catch((err) => {
        console.log(err);
        let statusEmbed = new EmbedBuilder()
            .setTitle('Round Status')
            .setTimestamp(new Date())
            .setColor([128, 128, 0]);
        const fields: any[] = [
            { name: 'players', value: '0', inline: true },
            { name: 'roundtime', value: 'N/A', inline: true },
            { name: 'status', value: 'Offline', inline: true },
            { name: 'admins', value: '0', inline: true },
            { name: 'map_name', value: 'Domotan', inline: true },
        ];
        statusEmbed.addFields(fields);
        return interaction.reply({embeds: [statusEmbed]});
    });

}
