const nightmare = require('nightmare')();
const sendGridMail = require('@sendgrid/mail');

require('dotenv').config();

const args = process.argv.slice(2)
const url = args[0]
const minPrice = args[1]
console.log(process.env.SENDGRID_API_KEY)
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY) 

//'https://www.amazon.com/Oculus-Rift-PC-Powered-Gaming-Headset/dp/B07QLRRQB3';

checkPrice();

async function checkPrice(){
  try{
          //ssss
        const priceString = await nightmare.goto(url)
                .wait("#priceblock_ourprice")
                .evaluate(() => 
                  document.getElementById("priceblock_ourprice")
                  .innerText )
                .end()

        const priceNumber = parseFloat(priceString.replace('$', ''))
        if(priceNumber < minPrice){ 
          console.log('found match..')
          await sendmail('Price is Low!!', 
            `The price on ${url} has dropped below ${minPrice}`)
          console.log('done...')

        }
  }catch(err){
     sendmail('There was a error!!', 
            err.message);
    throw(err)
  }
}

function sendmail(_subject, _body){
  const email = {
    to: 'shayla4@litermssb.com',
    from: 'test@example.com',
    subject: _subject,
    text: _body,
    html: _body
  }
  console.log(email);
  return sendGridMail.send(email).then((response) => {
    console.log(response[0].statusCode)
    console.log(response[0].headers)
  })
  .catch((error) => {
    console.error(error)
  })
}