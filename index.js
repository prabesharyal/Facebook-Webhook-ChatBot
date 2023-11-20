const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN =
   'EAADZCfJQGOlcBO4fASTlxmQgXgzkOcmejsh4XGXjaXH0bQHTUZAZCjuAk8cni5rZB4B02afl696rI9ul1fuZCWHguRPY8wy3YA8FsjV1SuSu7GVYg6ZAIxzSplZCIlwCi48ZCm0tFPfQMC7nBlZBqovA9jDOujZCFVGqBTZCksdBAY2xfLZBZBAsns5pkfSejUPzStrd4';

const verifyWebhook = (req, res) => {
   let VERIFY_TOKEN = 'pusher-bot';

   let mode = req.query['hub.mode'];
   let token = req.query['hub.verify_token'];
   let challenge = req.query['hub.challenge'];

   if (mode && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
   } else {
      res.sendStatus(403);
   }
};
app.get('/', (req, res) => {
   res.status(200).send({ msg: 'ok bro !!' });
});
app.get('/webhook', verifyWebhook);

// Xử lý webhook
app.post('/webhook', (req, res) => {
   const { body } = req;

   // Kiểm tra xem tin nhắn đến có phải là từ người dùng hay không
   if (body.object === 'page') {
      body.entry.forEach((entry) => {
         const webhookEvent = entry.messaging[0];
         const senderPsid = webhookEvent.sender.id;

         // Kiểm tra xem tin nhắn có chứa text "hello" hay không
         if (
            webhookEvent.message &&
            webhookEvent.message.text &&
            webhookEvent.message.text.toLowerCase() === 'hello'
         ) {
            sendResponse(senderPsid);
         }
      });

      res.status(200).send('EVENT_RECEIVED');
   } else {
      res.sendStatus(404);
   }
});

// Gửi tin nhắn phản hồi
function sendResponse(senderPsid) {
   const requestBody = {
      recipient: {
         id: senderPsid,
      },
      message: {
         attachment: {
            type: 'template',
            payload: {
               template_type: 'generic',
               elements: [
                  {
                     title: 'Sản phẩm',
                     image_url: 'https://example.com/product.jpg',
                     subtitle: 'Giá: $10',
                     buttons: [
                        {
                           type: 'web_url',
                           url: 'https://example.com',
                           title: 'Mua hàng',
                        },
                        {
                           type: 'postback',
                           title: 'Đã mua',
                           payload: 'PURCHASED',
                        },
                     ],
                  },
               ],
            },
         },
      },
   };

   request(
      {
         uri: 'https://graph.facebook.com/v18.0/me/messages',
         qs: { access_token: PAGE_ACCESS_TOKEN },
         method: 'POST',
         json: requestBody,
      },
      (error, response, body) => {
         if (!error && response.statusCode === 200) {
            console.log('Tin nhắn đã được gửi!');
         } else {
            console.error('Lỗi khi gửi tin nhắn:', error);
         }
      }
   );
}

// Khởi động server
app.listen(8080, () => {
   console.log('Server đang chạy trên cổng 8080!');
});
