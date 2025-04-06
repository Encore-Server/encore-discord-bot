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
        return console.log(err);
    });

}
