import {ActivityOptions, Client, Events, MessageFlagsString } from 'discord.js';
import {registerCommands} from "./register-commands";
import config from './config.json';

export class BotClient {
  client: Client;
  commands: {[name: string]: any};

  constructor() {
    this.client = new Client({
      intents: [
      ]
    });
  }

  onReady() {
    return () => {
      console.log(`Client ready logged in as ${this.client.user.tag} (${this.client.user.id}).`);
      //this.client.user.setAFK(true);
      this.client.user.setStatus('online');
      this.client.user.setActivity({name: 'Domotan', type: 0} as ActivityOptions);
    };
  }

  onDisconnect() {
    return () => {
      console.warn('Disconnected!');
    };
  }

  onReconnect() {
    return () => {
      console.warn('Reconnecting...');
    };
  }

  onCmdErr() {
    return (cmd, err) => {
      console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    };
  }

  onCmdBlock() {
    return (msg, reason) => {
      console.log(`Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''} blocked; ${reason}`);
    };
  }

  onCmdStatusChange() {
    return (guild, command, enabled) => {
      console.log(`Command ${command.groupID}:${command.memberName} ${enabled ? 'enabled' : 'disabled'} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
    };
  }

  onGroupStatusChange() {
    return (guild, group, enabled) => {
      console.log(`Group ${group.id} ${enabled ? 'enabled' : 'disabled'} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
    };
  }

  onMessage() {
    // nothing here yet
    return (msg) => {
    };
  }

  sendMessage(channel, message) {
    this.client.guilds[0].channels.get(channel).send(message);
  }


  removeRole(role) {
    this.client.guilds[0].members.fetch().then((mCollect) => {
      mCollect.forEach((element) => {
        if(element.roles.has(role)) {
          element.roles.remove(role).catch(console.error);
        }
      });
    }).catch(console.error);
  }


  async handleInteractionCommand(interaction) {
    if (!interaction.isChatInputCommand()) return;
    const command = this.commands[interaction.commandName];

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', flags: 64 });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', flags: 64 });
      }
    }
  }

  async init() {
    this.commands = await registerCommands();
    return new Promise((resolve, reject) => {
      // register our events
      this.client
      .once(Events.ClientReady, this.onReady())

      .on('error', console.error)
      .on('warn', console.warn)
      //.on('debug', console.log)
      .on('disconnect', this.onDisconnect())
      .on('reconnecting', this.onReconnect())
      .on('commandError', this.onCmdErr())
      .on('commandBlocked', this.onCmdBlock())
      .on('commandStatusChange', this.onCmdStatusChange())
      .on('groupStatusChange', this.onGroupStatusChange())
      .on('message', this.onMessage())
      .on(Events.InteractionCreate, (interaction) => this.handleInteractionCommand(interaction));

      // login with client and bot token
      this.client.login(config.token).then().catch((reason) => {reject(reason)});
    });
  }

}


