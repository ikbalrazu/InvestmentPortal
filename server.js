const axios = require('axios');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());



const port = process.env.PORT || 5000;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
      user:"iqbalraju451@gmail.com",
      pass:"pvrwwlqbhletegfv"
  }
})

//get access token for get record
// 
// axios
//   .post(
//     `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
//   )
//   .then(function (response) {
//     access_token_getdata = response.data.access_token;
//   })
//   .then(function(data){
//       console.log("access token created for get Record: ",access_token_getdata);
//   })
//   .catch(function (error) {
//     access_token_getdata = error;
//   });


// const GetRecordAccessToken = (id,res) =>{
//   let access_token_getdata;
//   axios.post(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
//   .then(function (response) {
//     access_token_getdata = response.data.access_token;
//   })
//   .then(function(data){
//       console.log("access token created for get Record: ",access_token_getdata);
//       axios.get(`https://creator.zoho.com/api/v2/zoho_user12867/investment-portal/report/All_Users/${id}`,{
//         headers: {
//             Authorization: `Zoho-oauthtoken ${access_token_getdata}`
//         },
//       })
//       .then(function(response){
//         console.log(response);
//         res.status(200).json(response.data);
//       })
//       .catch(function(error){
//           console.log(error);
//       })
//   })
//   .catch(function (error) {
//     access_token_getdata = error;
//   });
// }


//get access token for create Record
// let access_token_postdata;
// axios
//   .post(
//     `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_postdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
//   )
//   .then(function (response) {
//     access_token_postdata = response.data.access_token;
//   })
//   .then(function(data){
//       console.log("access token created for post Record: ",access_token_postdata);
//   })
//   .catch(function (error) {
//     access_token_postdata = error;
//   });


//get access token for create Record
let access_token_updatedata;
axios
  .post(
    `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_updatedata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
  )
  .then(function (response) {
    access_token_updatedata = response.data.access_token;
  })
  .then(function(data){
      console.log("access token created for update Record: ",access_token_updatedata);
  })
  .catch(function (error) {
    access_token_updatedata = error;
  });

app.get("/",(req,res)=>{
  res.send("Investment Portal");
})

//Get Record - Detail View
app.get("/getrecord",(req,res)=>{

  let access_token_getdata;
  axios
    .post(
      `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
    )
    .then(function (response) {
      access_token_getdata = response.data.access_token;
    })
    .then(function(data){
        console.log("access token created for get Record: ",access_token_getdata);
        axios.get(`https://creator.zoho.com/api/v2/zoho_user12867/investment-portal/report/All_Users`,{
        headers: {
            Authorization: `Zoho-oauthtoken ${access_token_getdata}`
        },
    })
    .then(function(response){
        console.log(response);
        res.status(200).json(response.data);
    })
    .catch(function(error){
        console.log(error);
    })
    })
    .catch(function (error) {
      access_token_getdata = error;
    });

    
})

 



//Add Records
app.post("/addrecord",(req,res)=>{
  const {firstname,lastname,email,password,date} = req.body;
  // let requestBody = JSON.stringify({ data: [req.body] });
  // console.log(requestBody);
  let access_token_postdata;
axios
  .post(
    `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_postdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
  )
  .then(function (response) {
    access_token_postdata = response.data.access_token;
  })
  .then(function(data){
      console.log("access token created for post Record: ",access_token_postdata);
      axios.post(`https://creator.zoho.com/api/v2/zoho_user12867/investment-portal/form/User`,{
    data:{
      Date_Created: date,
      Email: email,
      Password: password,
      Name:{
        first_name: firstname,
        last_name: lastname
      }
    }
  },{
        headers: {
            Authorization: `Zoho-oauthtoken ${access_token_postdata}`
        },
    })
    .then(function(response){
        console.log(response);
        res.status(200).json(response.data);
    })
    .catch(function(error){
        console.log(error);
        res.json(error.message);
    })
  })
  .catch(function (error) {
    access_token_postdata = error;
  });
  

})

//get data by specific id
app.post("/getrecordbyid",(req,res)=>{
  const {id} = req.body;
  //GetRecordAccessToken(id);

  let access_token_getdata;
  axios.post(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
  .then(function (response) {
    access_token_getdata = response.data.access_token;
  })
  .then(function(data){
      console.log("access token created for get Record: ",access_token_getdata);
      axios.get(`https://creator.zoho.com/api/v2/zoho_user12867/investment-portal/report/All_Users/${id}`,{
        headers: {
            Authorization: `Zoho-oauthtoken ${access_token_getdata}`
        },
      })
      .then(function(response){
        console.log(response);
        res.status(200).json(response.data);
      })
      .catch(function(error){
          console.log(error);
      })
  })
  .catch(function (error) {
    access_token_getdata = error;
  });

})

app.post("/deleterecord",(req,res)=>{

})

app.post("/updaterecord",(req,res)=>{

})

app.post("/sendemail",(req,res)=>{
  const {email} = req.body;
  var mailOptions = {
    from:' "Reset Your Password" <iqbalraju451@gmail.com>',
    to: email,
    subject: 'Reset Password Link - Investment Portal',
    html:`<h2>Your email: ${email}! </h2><p>You requested for reset password, kindly use this <a href="http://localhost:4000/reset-password?token=' + token + '">link</a> to reset your password</p>`
  }

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.json(error.message);
        console.log(email);
      } else {

        res.json({message:"send email successfully"});
        console.log('Email sent: ' + info.response);
        
      }
  });
})

app.put("/reset-password",(req,res)=>{
  const {id,password} = req.body;
  let access_token_updatedata;
  axios
    .post(
      `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_updatedata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
    )
    .then(function (response) {
      access_token_updatedata = response.data.access_token;
    })
    .then(function(data){
        console.log("access token created for update Record: ",access_token_updatedata);
        axios.put(`https://creator.zoho.com/api/v2/zoho_user12867/investment-portal/report/All_Users/${id}`,{
        data:{
          Password: password
        }
        },{
            headers: {
                Authorization: `Zoho-oauthtoken ${access_token_updatedata}`
            },
        })
        .then(function(response){
            console.log(response);
            res.status(200).json(response.data);
        })
        .catch(function(error){
            console.log(error);
            res.json(error.message);
        })
      })
      .catch(function (error) {
        access_token_updatedata = error;
      });
  

})

app.listen(port,function(error){
    if(error){
        console.log("server failed");
    }else{
        console.log("server success");
    }
})