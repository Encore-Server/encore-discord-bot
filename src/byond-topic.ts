const net = require('net');
import config from './config.json';

export class ByondTopic {
   socket = new net.Socket();
   port = config.byondTopic.port;
   host = config.byondTopic.host;

   connect() {
      this.socket.connect(this.port, this.host, () => {
         console.log(`Client connected to: ${this.host}:${this.port}`);
      });

      this.socket.on('close', () => {
         console.log(`Client closed`);
      });
   }

   sendTopic(T) {
      if(!this.socket.connected) {
         this.connect();
      }
      return new Promise((resolve, reject) => {
         this.socket.write(this.buildMessageBuffer(T));

         this.socket.on('data', (data) => {
            resolve(data.toString('ascii').substr(5));
            this.socket.destroy();
         });

         this.socket.on('error', (err) => {
            reject(err.message);
         });
      });
   }

   buildMessageBuffer(T) {
      if (!T.startsWith('?')) T = '?' + T;
      let message = Buffer.from(T, 'ascii');
      let sendingBytes = Buffer.alloc(9);
      sendingBytes.writeUInt8(0x83, 1);
      sendingBytes.writeInt16BE(message.byteLength + 6, 2);
      sendingBytes = Buffer.concat([sendingBytes, message, Buffer.from([0x00])]);
      return sendingBytes;
   }
}
