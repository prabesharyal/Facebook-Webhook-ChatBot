const { PAGE_ACCESS_TOKEN, META_API, TELEGRAM_TOKEN, TELEGRAM_CHANNEL } =
   process.env;

const TelegramLogger = require('node-telegram-logger');
let tg = new TelegramLogger(TELEGRAM_TOKEN, TELEGRAM_CHANNEL);
const request = require('request');
function sendProductResponse(senderPsid) {
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
         uri: META_API,
         qs: { access_token: PAGE_ACCESS_TOKEN },
         method: 'POST',
         json: requestBody,
      },
      (error, response) => {
         if (!error && response.statusCode === 200) {
            tg.sendMessage('Tin nhắn product đã được gửi!', 'INFO');
         } else {
            tg.sendMessage('Tin nhắn product gửi thất bại!', 'ERROR');
         }
      }
   );
}

function sendOrderInfoRespone(senderPsid) {
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
         uri: META_API,
         qs: { access_token: PAGE_ACCESS_TOKEN },
         method: 'POST',
         json: requestBody,
      },
      (error, response, body) => {
         if (!error && response.statusCode === 200) {
            tg.sendMessage('Tin nhắn order đã được gửi!', 'INFO');
         } else {
            tg.sendMessage('Tin nhắn order gửi thất bại!', 'ERROR');
         }
      }
   );
}

function sendTextResponse(senderPsid) {
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
         uri: META_API,
         qs: { access_token: PAGE_ACCESS_TOKEN },
         method: 'POST',
         json: requestBody,
      },
      (error, response) => {
         if (!error && response.statusCode === 200) {
            console.log('Tin nhắn đã được gửi!');
         } else {
            console.error('Lỗi khi gửi tin nhắn:', error);
         }
      }
   );
}

function handlePostback(senderPsid, payload) {
   if (payload === 'ORDER_INFO') {
      sendOrderInfoRespone(senderPsid);
   }
}

module.exports = {
   sendProductResponse,
   handlePostback,
};
