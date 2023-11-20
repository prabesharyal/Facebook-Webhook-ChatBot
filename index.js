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
function handlePostback(senderPsid, payload) {
   if (payload === 'ORDER_INFO') {
      // Gửi tin nhắn yêu cầu người dùng nhập thông tin đặt hàng
      sendOrderInfoRequest(senderPsid);
   }
}
function sendOrderInfoRequest(senderPsid) {
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
                     title: 'Nhập thông tin đặt hàng',
                     subtitle: 'Vui lòng điền đầy đủ thông tin bên dưới:',
                     buttons: [
                        {
                           type: 'web_url',
                           url: 'http://delimall.senvangsolutions.com/Deligift',
                           title: 'Điền thông tin',
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
                     title: 'Bánh Bao Xíu Mại Trứng Muối 50g (300g) (300g) Bánh Bao Xíu Mại',
                     image_url:
                        'http://delimall.senvangsolutions.com/Assets/images/gift1.png',
                     subtitle: 'Giá: 100,000đ',
                     buttons: [
                        {
                           type: 'web_url',
                           url: 'http://delimall.senvangsolutions.com/Restaurant',
                           title: 'Mua hàng',
                        },
                        {
                           type: 'postback',
                           title: 'Nhập thông tin đặt hàng',
                           payload: 'ORDER_INFO',
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
