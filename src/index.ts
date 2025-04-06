import {BotClient} from './bot-client';
// const ByondImport = require('./ByondImport.js');

const start = () => {
  new BotClient().init().then((bot) => {
    // if (config.byondImport.enabled) new ByondImport(config.byondImport.port, bot);
  });
};

start();
