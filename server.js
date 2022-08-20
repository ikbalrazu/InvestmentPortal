const axios = require('axios');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fileupload = require("express-fileupload");
const FormData = require('form-data');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const NodeCache = require( "node-cache" );

const myCache = new NodeCache({stdTTL:3000});

dotenv.config();
const app = express();
app.use(express.json());
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));
// app.use(fileupload());
app.use(bodyParser.json());

//user: "iqbalraju451@gmail.com",
//pass: "pvrwwlqbhletegfv"

const port = process.env.PORT || 5000;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "amalinvestorportal@gmail.com",
    pass: "mnixqgtazsqeiftl"
  }
})

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: "iqbalraju451@gmail.com",
//     pass: "pvrwwlqbhletegfv"
//   }
// })


//image path
//limit: 5mb or 1mb
//filter: png, jpeg, jpg

// const storage = multer.diskStorage({
//   dest: UPLOADS_FOLDER
// })

//file upload folder
const UPLOADS_FOLDER = "./uploads/";

//define the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname)
  },
  
});

const upload = multer({
  storage: storage
})

//preapre the final multer upload object
// const upload = multer({
//   dest: UPLOADS_FOLDER,
//   limits: {
//     fileSize: 1000000, //1mb
//   },
//   fileFilter: (req,file,cb) => {
//     console.log(file);
//   },
// });

//single file
// app.post("/multerupload",upload.single("featuredImage"), (req,res)=>{
//   //const data = req.file;
//   console.log(req.file.path);
//   // console.log("File Name:",req.file.filename);
//   //const filename = req.file.filename;
//   uploadfile(req.file.filename);
//   // res.send("File upload successfully...");
// })

//multiple file
// app.post("/multerupload",upload.array("avatar",3), (req,res)=>{
//   res.send('Hello world');
// })


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
// let access_token_updatedata;
// axios
//   .post(
//     `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_updatedata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
//   )
//   .then(function (response) {
//     access_token_updatedata = response.data.access_token;
//   })
//   .then(function(data){
//       console.log("access token created for update Record: ",access_token_updatedata);
//   })
//   .catch(function (error) {
//     access_token_updatedata = error;
//   });

app.get("/", (req, res) => {
  res.send("Investment Portal");
})

//Get Record - Detail View
app.get("/getrecord", (req, res) => {

  // let access_token_getdata;
  // axios
  //   .post(
  //     `https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
  //   )
  //   .then(function (response) {
  //     access_token_getdata = response.data.access_token;
  //   })
  //   .then(function (data) {
  //     console.log("access token created for get Record: ", access_token_getdata);
  //     axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Users`, {
  //       headers: {
  //         Authorization: `Zoho-oauthtoken ${access_token_getdata}`
  //       },
  //     })
  //       .then(function (response) {
  //         console.log(response);
  //         res.status(200).json(response.data);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       })
  //   })
  //   .catch(function (error) {
  //     access_token_getdata = error;
  //   });

  let access_token;

  if(myCache.has("accesstoken")){
    console.log("from cache");
     access_token = myCache.get("accesstoken");
   }else{
    await axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
      .then(function (response) {
        access_token_getdata = response.data.access_token;
        console.log("without cache");
        myCache.set("accesstoken", access_token_getdata);
        access_token= myCache.get("accesstoken");;
      })
   }


   await axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Users`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`
      },
    })
    .then(function (response) {
    console.log(response);
    res.status(200).json(response.data);
    })
    .catch(function (error) {
    console.log(error);
    })


})





//Add Records
app.post("/addrecord", (req, res) => {
  const { firstname, lastname, email, phone, company, dealsaccess, companyrole, jobrole } = req.body;
  // let requestBody = JSON.stringify({ data: [req.body] });
  // console.log(requestBody);
  console.log(firstname, lastname, email, phone, company, dealsaccess, companyrole, jobrole);
  let access_token_postdata;

  axios
    .post(
      `https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_postdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
    )
    .then(function (response) {
      access_token_postdata = response.data.access_token;
    })
    .then(function (data) {
      console.log("access token created for post Record: ", access_token_postdata);
      axios.post(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/form/User`, {
        data: {
          Email: email,
          UserStatus: "Pending",
          Name: {
            first_name: firstname,
            last_name: lastname
          },
          Phone_Number: phone,
          Company: company,
          Deals_need_access_to: dealsaccess,
          Company_Role: companyrole,
          Role: jobrole
        }
      }, {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token_postdata}`
        },
      })
        .then(function (response) {
          console.log(response);
          res.status(200).json(response.data);
        })
        .catch(function (error) {
          console.log(error);
          res.json(error.message);
        })
    })
    .catch(function (error) {
      access_token_postdata = error;
    });

})

// app.post("/setuserpassword",(req,res)=>{
//   const {id, email} = req.body;
//   const jwtToken = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
//     expiresIn: "24h",
//   });
//   console.log(jwtToken);
//   console.log(id)
//   console.log(email);
//   var mailOptions = {
//     from: ' "Set Your Password" <amalinvestorportal@gmail.com>',
//     to: email,
//     subject: 'Set Password Link - Investment Portal',
//     html: `<p>Your email: ${email}! </p> <p>Your user id: ${id}! </p><p>You requested for reset password, kindly use this <a href="https://investmentportal.netlify.app/setuserpassword/${id}/${jwtToken}">Link</a> to reset your password</p>`
//   }

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//       res.json(error.message);
//       //console.log(email);
//     } else {

//       res.json({ message: "send email successfully" });
//       console.log('Email sent: ' + info.response);

//     }
//   });
// })

//Get Data from URL in NodeJS
app.get("/setuserpassword",function(req,res){
  var id = req.query.id;
  var email = req.query.email;
  const jwtToken = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  console.log(jwtToken);
  console.log(id)
  console.log(email);
  var mailOptions = {
    from: ' "Set Your Password" <amalinvestorportal@gmail.com>',
    to: email,
    subject: 'Set Password Link - Investment Portal',
    html: `<p>Your email: ${email}! </p> <p>Your user id: ${id}! </p><p>You requested for Set password, kindly use this <a href="https://investmentportal.netlify.app/setuserpassword/${id}/${jwtToken}">Link</a> to set your password</p>`
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.json(error.message);
      //console.log(email);
    } else {

      res.json({ message: "send email successfully" });
      console.log('Email sent: ' + info.response);

    }
  });
})

//create desk ticket
app.post("/createdeskticket", (req, res) => {
  const { firstname, lastname, email, userid } = req.body;
  let access_token_desktoken;
  axios.post(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_postdesktoken}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`).then(function (response) {
    access_token_desktoken = response.data.access_token;
  }).then(function (response) {
    console.log("access token created desk token: ", access_token_desktoken);
    axios.post(`https://desk.zoho.com/api/v1/tickets`, {
      departmentId: "589572000000006907",
      subject: "Hello w3scloud",
      email: email,
      accountId: userid,
      contact: {
        firstName: firstname,
        lastName: lastname,
        email: email,
        phone: "01622869685"
      }
    }, {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token_desktoken}`
      },
    }).then(function (response) {
      console.log(response);
      res.status(200).json(response.data);
    }).catch(function (error) {
      res.json(error.message);
    })
  })
})

//get desk ticket by specific id
app.post("/getticketbyid",(req,res)=>{
  let access_token_desktoken;
  axios.post(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdesktokenby_id}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`).then(function(data){
    access_token_desktoken = response.data.access_token;
  })
})

//get data by specific id
app.post("/getrecordbyid", async(req, res) => {
  const { id } = req.body;
  //const id = "9824000000163059";
  //GetRecordAccessToken(id);

  let access_token;

  if(myCache.has("accesstoken")){
    console.log("from cache");
     access_token = myCache.get("accesstoken");
   }else{
    await axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
      .then(function (response) {
        access_token_getdata = response.data.access_token;
        console.log("without cache");
        myCache.set("accesstoken", access_token_getdata);
        access_token= myCache.get("accesstoken");;
      })
   }


   await axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Users/${id}`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`
      },
    })
    .then(function (response) {
    console.log(response);
    res.status(200).json(response.data);
    })
    .catch(function (error) {
    console.log(error);
    })

  // let access_token_getdata;
  // axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
  //   .then(function (response) {
  //     access_token_getdata = response.data.access_token;
  //   })
  //   .then(function (data) {
  //     console.log("access token created for get Record: ", access_token_getdata);
  //     axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Users/${id}`, {
  //       headers: {
  //         Authorization: `Zoho-oauthtoken ${access_token_getdata}`
  //       },
  //     })
  //       .then(function (response) {
  //         console.log(response);
  //         res.status(200).json(response.data);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       })
  //   })
  //   .catch(function (error) {
  //     access_token_getdata = error;
  //   });

})

app.post("/deleterecord", (req, res) => {

})

app.post("/updaterecord", (req, res) => {

})

app.post("/sendForgotPasswordMail", (req, res) => {
  const { email,id} = req.body;
  const jwtToken = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  console.log(jwtToken);
  console.log(id)
  console.log(email);
  var mailOptions = {
    from: ' "Reset Your Password" <amalinvestorportal@gmail.com>',
    to: email,
    subject: 'Reset Password Link - Investment Portal',
    html: `<p>Your email: ${email}! </p> <p>Your user id: ${id}! </p><p>You requested for reset password, kindly use this <a href="https://investmentportal.netlify.app/resetpassword/${id}/${jwtToken}">Link</a> to reset your password</p>`
  }

  //<a href="https://investmentportal.netlify.app/resetpassword/${id}/${jwtToken}">Link</a>

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.json(error.message);
      //console.log(email);
    } else {

      res.json({ message: "send email successfully" });
      console.log('Email sent: ' + info.response);

    }
  });
})


app.post("/verifyForgotMail",(req,res)=>{
  const {token} = req.body;
  jwt.verify(token, process.env.JWT_SECRET, function(err,token){
    if(err){
      res.json({result:"Link expired"});
    }
    res.json({result:"Valid Link"});
  });
})

app.post("/sendOTPVerificationEmail",(req,res)=>{
  const {email,otpPin} = req.body;
  console.log("OTP: ",otpPin);
  var mailOptions = {
    from: ' "Verify Account" <amalinvestorportal@gmail.com>',
    to: email,
    subject: 'Two Factor Authentication - Investment Portal',
    html: `<p>Your email: ${email}! </p><p>Your PIN</p><h1>${otpPin}</h1>`
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.json(error.message);
      console.log(email);
    } else {

      res.json({ message: "send email successfully" });
      //console.log('Email sent: ' + info.response);

    }
  });
})

//get deals data by id


//get documents data by id
app.post("/getdocumentsbyid",async(req,res)=>{
  const {id} = req.body;
  console.log(id);
  // let access_token_getdata;
  // axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
  //   .then(function (response) {
  //     access_token_getdata = response.data.access_token;
  //   })
  //   .then(function (data) {
  //     console.log("access token created for get Record: ", access_token_getdata);
  //     axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Documents/${id}`, {
  //       headers: {
  //         Authorization: `Zoho-oauthtoken ${access_token_getdata}`
  //       },
  //     })
  //       .then(function (response) {
  //         console.log(response);
  //         res.status(200).json(response.data);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       })
  //   })
  //   .catch(function (error) {
  //     access_token_getdata = error;
  //   });
  
  let access_token;

  if(myCache.has("accesstoken")){
    console.log("from cache");
     access_token = myCache.get("accesstoken");
   }else{
    await axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
      .then(function (response) {
        access_token_getdata = response.data.access_token;
        console.log("without cache");
        myCache.set("accesstoken", access_token_getdata);
        access_token= myCache.get("accesstoken");;
      })
   }


   await axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Documents/${id}`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`
      },
    })
    .then(function (response) {
    console.log(response);
    res.status(200).json(response.data);
    })
    .catch(function (error) {
    console.log(error);
    })
    
})

//get all documents
app.post("/getalldocuments",(req,res)=>{
  let access_token_getdata;
  axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
    .then(function (response) {
      access_token_getdata = response.data.access_token;
    })
    .then(function (data) {
      console.log("access token created for get Record: ", access_token_getdata);
      axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Documents`, {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token_getdata}`
        },
      })
        .then(function (response) {
          console.log(response);
          res.status(200).json(response.data);
        })
        .catch(function (error) {
          console.log(error);
        })
    })
    .catch(function (error) {
      access_token_getdata = error;
    });
})

//get all deals data
app.post("/getdealsbyid",(req,res)=>{
  const {dealid} = req.body;
  let access_token_getdata;
  axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
    .then(function (response) {
      access_token_getdata = response.data.access_token;
    })
    .then(function (data) {
      console.log("access token created for get Record: ", access_token_getdata);
      axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Deals/${dealid}`, {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token_getdata}`
        },
      })
        .then(function (response) {
          console.log(response);
          res.status(200).json(response.data);
        })
        .catch(function (error) {
          console.log(error);
        })
    })
    .catch(function (error) {
      access_token_getdata = error;
    });
})

app.post("/accesstokendealsbyid",(req,res)=>{
  axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
    .then(function (response) {
      access_token_getdata = response.data.access_token;
      res.send(access_token_getdata);
    })
})

//get deals by id
// app.get("/getalldealsbyid",(req,res)=>{
//   const {dealid} = req.body;
//   let access_token_getdata;
//   //return GetToken();
//   axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
//     .then(function (response) {
//       access_token_getdata = response.data.access_token;
//     })
//     .then(function (data) {
//       console.log("access token created for get Record: ", access_token_getdata);
//       axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Deals/${dealid}`, {
//         headers: {
//           Authorization: `Zoho-oauthtoken ${access_token_getdata}`
//         },
//       })
//         .then(function (response) {
//           console.log(response);
//           res.status(200).json(response.data);
//         })
//         .catch(function (error) {
//           console.log(error);
//         })
//     })
//     .catch(function (error) {
//       access_token_getdata = error;
//     });

// })


//allglobaldocuments
app.get("/allglobaldocuments",async(req,res)=>{

  let access_token;

  if(myCache.has("accesstoken")){
    console.log("from cache");
     access_token = myCache.get("accesstoken");
   }else{
    await axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
      .then(function (response) {
        access_token_getdata = response.data.access_token;
        console.log("without cache");
        myCache.set("accesstoken", access_token_getdata);
        access_token= myCache.get("accesstoken");;
      })
   }


   await axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Documents?Access_Type=Global`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`
      },
    })
    .then(function (response) {
    console.log(response);
    res.status(200).json(response.data);
    })
    .catch(function (error) {
    console.log(error);
    })

})

//
app.get("/getalldeals",async (req,res)=>{
  console.log("hello world");
  let access_token;

  if(myCache.has("accesstoken")){
    console.log("from cache");
     access_token = myCache.get("accesstoken");
   }else{
    await axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
      .then(function (response) {
        access_token_getdata = response.data.access_token;
        console.log("without cache");
        myCache.set("accesstoken", access_token_getdata);
        access_token= myCache.get("accesstoken");;
      })
   }


   await axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Deals`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`
      },
    })
    .then(function (response) {
    console.log(response);
    res.status(200).json(response.data);
    })
    .catch(function (error) {
    console.log(error);
    })
 
})


app.get("/memorycache",(req,res)=>{
  //AccessToken();
  res.send(AccessToken())

})

async function AccessToken(){
  // return "hsasa;lsdkjf;alsdkjf;";
  if(myCache.has("accesstoken")){
    console.log("from cache");
    return myCache.get("accesstoken");
   }else{
    await axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
      .then(function (response) {
        access_token_getdata = response.data.access_token;
        console.log("without cache");
        myCache.set("accesstoken", access_token_getdata);
        return access_token_getdata;
      })

      myCache.set("accesstoken", ";ja;lsdkjf;alskdjf;laksjdf;lkj");
      return myCache.get("accesstoken");    
   }

}

//post documents
app.post("/postdocuments",(req,res)=>{
  

  let access_token_postdata;
  axios
    .post(
      `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_postdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
    )
    .then(function (response) {
      access_token_postdata = response.data.access_token;
    })
    .then(function (data) {
      console.log("access token created for post of documents: ", access_token_postdata);
      axios.post(`https://creator.zoho.com/api/v2/zoho_user12867/investment-portal/form/Documents`, {
        data: {
          DocumentName: "w3scloud",
          Users_Id: "123456",
        
        }
      }, {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token_postdata}`
        },
      })
        .then(function (response) {
          console.log(response);
          res.status(200).json(response.data);
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
          res.json(error.message);
        })
    })
    .catch(function (error) {
      access_token_postdata = error;
    });
})

//upload file
app.post("/uploadfile", upload.single("featuredImage"), (req, res, next) => {
  const {file,body:{id}} = req;
  console.log(file);
  const filename = req.file.filename;
  const filepath = file.path;
  // const userid = req.file.userid;
  console.log("document id: ",id);
  let access_token_uploadfile;
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filepath));
  const formHeaders = formData.getHeaders();
  axios.post(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_uploadfile}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
    .then(function (response) {
      //console.log("Form data: ",formData);
      access_token_uploadfile = response.data.access_token;
      console.log("Access token for upload file - ", access_token_uploadfile);
    }).then(function (response) {
      axios.post(`https://creator.zoho.com/api/v2/zoho_user12867/investment-portal/report/All_Documents/${id}/Documents/upload`, formData , {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token_uploadfile}`,
          ...formHeaders,
        },
      }).then(function (data) {
        // console.log(data);
        // res.status(200).json(data);
        res.send("File Uploaded Successfully");
      }).catch(function (error) {
        console.log(error.message);
        res.send("File upload failed");
      })
    }).catch(function (error) {
      console.log(error.message);
    })

})

// app.post("/filesupload",(req,res)=>{
//   const newpath = __dirname + "/files/";
//   const featuredImage = req.files.featuredImage;
//   console.log(featuredImage);
//   const filename = featuredImage.name;

//   featuredImage.mv(`${newpath}${filename}`, (err) => {
//     if (err) {
//       res.status(500).send({ message: "File upload failed", code: 200 });
//     }
//     //res.status(200).send({ message: "File Uploaded", code: 200 });
//     //uploadfile(filename);
//     let access_token_uploadfile;
//   axios.post(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_uploadfile}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
//   .then(function(response){
//     access_token_uploadfile = response.data.access_token;
//     console.log("Access token for upload file - ",access_token_uploadfile);
//   }).then(function(response){
//     axios.post(`https://creator.zoho.com/api/v2/zoho_user12867/investment-portal/report/All_Documents/3963856000000874007/Documents/upload`,{"file":filename},{
//       headers: {
//         Authorization: `Zoho-oauthtoken ${access_token_uploadfile}`,
//       },
//     })
//       .then(function(response){
//         console.log(response);
//         res.status(200).json(response);
//         //res.status(200).send({ message: "File Uploaded", code: 200 });
//       }).catch(function(error){
//         console.log(error);

//       })
//   }).catch(function(error){
//     console.log(error.message);
//     res.status(404).json(error);
//   })
//   });
// })

// const uploadfile = (filename) => {
//   console.log(filename);
//   let access_token_uploadfile;
//   axios.post(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_uploadfile}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
//   .then(function(response){
//     access_token_uploadfile = response.data.access_token;
//     console.log("Access token for upload file - ",access_token_uploadfile);
//   }).then(function(response){
//     axios.post(`https://creator.zoho.com/api/v2/zoho_user12867/investment-portal/report/All_Documents/3963856000000874007/Documents/upload`,{file:filename},{
//       headers: {
//         Authorization: `Zoho-oauthtoken ${access_token_uploadfile}`,
//       },
//     })
//       .then(function(response){
//         console.log(response);
//         // res.status(200).json(response);
//         res.status(200).send({ message: "File Uploaded", code: 200 });
//       }).catch(function(error){
//         console.log(error);

//       })
//   }).catch(function(error){
//     console.log(error.message);
//   })


// }

app.put("/reset-password", (req, res) => {
  const { id, password } = req.body;
  console.log("Password: ",password);
  let access_token_updatedata;
  axios
    .post(
      `https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_updatedata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
    )
    .then(function (response) {
      access_token_updatedata = response.data.access_token;
    })
    .then(function (data) {
      console.log("access token created for update Record: ", access_token_updatedata);
      axios.put(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Users/${id}`, {
        data: {
          Password: password
        }
      }, {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token_updatedata}`
        },
      })
        .then(function (response) {
          console.log(response);
          res.status(200).json(response.data);
        })
        .catch(function (error) {
          console.log(error);
          res.json(error.message);
        })
    })
    .catch(function (error) {
      access_token_updatedata = error;
    });


})


const GetToken = () => {
  const token = sessionStorage.getItem('access_token');
  const tokenl = JSON.parse(token)
  //console.log(tokenl.data);
  // console.log(tokenl.exp);
  let expirationDate = new Date(tokenl.exp);
  //console.log(expirationDate);
  if(expirationDate > new Date()){
    console.log("not expire",tokenl.data);
    return tokenl.data;
  }else{
    console.log("expired");
    StoreToken();


  }
}

const StoreToken = async() => {
  //console.log(token?.data);
  var extratime =  new Date(new Date().getTime() + (60000 * 2));
  const accesstoken = await axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
  .then(function (response) {
    //access_token_getdata = response.data.access_token;
    sessionStorage.setItem('access_token',JSON.stringify({exp: extratime,data: response.data.access_token}))
    return response.data.access_token;
  });
  //console.log(accesstoken.data);
  // sessionStorage.setItem('access_token',JSON.stringify({exp: extratime,data: accesstoken.data}))
  // return accesstoken.data;
}



app.listen(port, function (error) {
  if (error) {
    console.log("server failed");
  } else {
    console.log("server success");
  }
})