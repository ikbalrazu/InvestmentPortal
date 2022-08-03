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

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
// app.use(fileupload());
app.use(bodyParser.json());



const port = process.env.PORT || 5000;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "iqbalraju451@gmail.com",
    pass: "pvrwwlqbhletegfv"
  }
})


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

  let access_token_getdata;
  axios
    .post(
      `https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
    )
    .then(function (response) {
      access_token_getdata = response.data.access_token;
    })
    .then(function (data) {
      console.log("access token created for get Record: ", access_token_getdata);
      axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Users`, {
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





//Add Records
app.post("/addrecord", (req, res) => {
  const { firstname, lastname, email, password, date } = req.body;
  // let requestBody = JSON.stringify({ data: [req.body] });
  // console.log(requestBody);
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
          Date_Created: date,
          Email: email,
          Password: password,
          UserStatus: "Pending",
          Name: {
            first_name: firstname,
            last_name: lastname
          }
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
app.post("/getrecordbyid", (req, res) => {
  const { id } = req.body;
  //GetRecordAccessToken(id);

  let access_token_getdata;
  axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
    .then(function (response) {
      access_token_getdata = response.data.access_token;
    })
    .then(function (data) {
      console.log("access token created for get Record: ", access_token_getdata);
      axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Users/${id}`, {
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

app.post("/deleterecord", (req, res) => {

})

app.post("/updaterecord", (req, res) => {

})

app.post("/sendemail", (req, res) => {
  const { email, id } = req.body;
  var mailOptions = {
    from: ' "Reset Your Password" <iqbalraju451@gmail.com>',
    to: email,
    subject: 'Reset Password Link - Investment Portal',
    html: `<h2>Your email: ${email}! </h2><p>You requested for reset password, kindly use this <a href="https://investmentportal.netlify.app/confirmforgotpassword">Open Link</a> to reset your password</p>`
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.json(error.message);
      console.log(email);
    } else {

      res.json({ message: "send email successfully" });
      console.log('Email sent: ' + info.response);

    }
  });
})

app.post("/sendOTPVerificationEmail",(req,res)=>{
  const {email,otpPin} = req.body;
  console.log("OTP: ",otpPin);
  var mailOptions = {
    from: ' "Verify Account" <iqbalraju451@gmail.com>',
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


//get documents data by id
app.post("/getdocuments",(req,res)=>{
  const {id} = req.body;
  let access_token_getdata;
  axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
    .then(function (response) {
      access_token_getdata = response.data.access_token;
    })
    .then(function (data) {
      console.log("access token created for get Record: ", access_token_getdata);
      axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Documents/${id}`, {
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
app.post("/getalldeals",(req,res)=>{
  let access_token_getdata;
  axios.post(`https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
    .then(function (response) {
      access_token_getdata = response.data.access_token;
    })
    .then(function (data) {
      console.log("access token created for get Record: ", access_token_getdata);
      axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Deals`, {
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



app.listen(port, function (error) {
  if (error) {
    console.log("server failed");
  } else {
    console.log("server success");
  }
})