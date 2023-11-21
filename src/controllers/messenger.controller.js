const { VERIFY_TOKEN, TELEGRAM_TOKEN, TELEGRAM_CHANNEL } = process.env;
const {
   sendProductResponse,
   handlePostback,
} = require('../helpers/messenger.helper');
const TelegramLogger = require('node-telegram-logger');
let tg = new TelegramLogger(TELEGRAM_TOKEN, TELEGRAM_CHANNEL);

const helloWebhook = (req, res) => {
   const resonseClient = {
      status: 'Webhook is running',
      author: 'KhangNguyen',
      msg: 'Hello world',
   };
   const jsonString = JSON.stringify(resonseClient);
   tg.sendMessage(jsonString, 'INFO');
   res.send(resonseClient);
};
const verifyWebhook = (req, res) => {
   let mode = req.query['hub.mode'];
   let token = req.query['hub.verify_token'];
   let challenge = req.query['hub.challenge'];
   tg.sendMessage(req.query, 'INFO');
   if (mode && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
   } else {
      res.sendStatus(403);
   }
};

const handleRequest = (req, res) => {
   const { body } = req;
   tg.sendMessage(body, 'INFO');
   // Kiểm tra xem tin nhắn đến có phải là từ người dùng hay không
   if (body.object === 'page') {
      body.entry.forEach((entry) => {
         const webhookEvent = entry.messaging[0];
         const senderPsid = webhookEvent.sender.id;

         // Kiểm tra nếu là postback event
         if (webhookEvent.postback) {
            const payload = webhookEvent.postback.payload;
            handlePostback(senderPsid, payload);
         } else if (
            (webhookEvent.message &&
               webhookEvent.message.text &&
               webhookEvent.message.text.toLowerCase() === 'hello') ||
            webhookEvent.message.text.toLowerCase() === 'mua' ||
            webhookEvent.message.text.toLowerCase() === 'start'
         ) {
            sendProductResponse(senderPsid);
         }
      });

      res.status(200).send('EVENT_RECEIVED');
   } else {
      res.sendStatus(404);
   }
};

module.exports = {
   helloWebhook,
   verifyWebhook,
   handleRequest,
};
