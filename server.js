const axios = require("axios");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fileupload = require("express-fileupload");
const FormData = require("form-data");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");
const https = require("https");
const myCache = new NodeCache({ stdTTL: 3000 });
const path = require("path");

const mime = require("mime");

dotenv.config();
const app = express();

app.use(express.json());
// const corsOptions ={
//   origin:'http://localhost:3000',
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200
// }
app.use(cors());
// app.use(fileupload());
app.use(bodyParser.json());

//user: "iqbalraju451@gmail.com",
//pass: "pvrwwlqbhletegfv"

const port = process.env.PORT || 5000;

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "amalinvestorportal@gmail.com",
    pass: "mnixqgtazsqeiftl",
  },
});

const UPLOADS_FOLDER = "./uploads/";
//define the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

app.get("/", (req, res) => {
  res.send("Investment Portal");
});

//Get Record - Detail View
app.get("/w3s/v1/getrecord", async (req, res) => {
  const access_token = await AccessToken();
  await axios
    .get(
      `https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Users`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

//Add Records
app.post("/w3s/v1/addrecord", async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    phone,
    company,
    dealsaccess,
    companyrole,
    jobrole,
  } = req.body;

  const access_token = await AccessToken();
  await axios
    .post(
      `https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/form/User`,
      {
        data: {
          Email: email,
          UserStatus: "Pending",
          Name: {
            first_name: firstname,
            last_name: lastname,
          },
          Phone_Number: phone,
          Company: company,
          Deals_need_access_to: dealsaccess,
          Company_Role: companyrole,
          Role: jobrole,
        },
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.json(error.message);
    });
});

//Get Data from URL in NodeJS
app.get("/w3s/v1/setuserpassword", function (req, res) {
  var id = req.query.id;
  var email = req.query.email;
  const jwtToken = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  console.log(jwtToken);
  console.log(id);
  console.log(email);
  var mailOptions = {
    from: ' "Set Your Password" <amalinvestorportal@gmail.com>',
    to: email,
    subject: "Set Password Link - Investment Portal",
    html: `<p>Your email: ${email}! </p> <p>Your user id: ${id}! </p><p>You requested for Set password, kindly use this <a href="https://investmentportal.netlify.app/setuserpassword/${id}/${jwtToken}">Link</a> to set your password</p>`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.json(error.message);
      //console.log(email);
    } else {
      res.json({ message: "send email successfully" });
      console.log("Email sent: " + info.response);
    }
  });
});

//create desk ticket
app.post("/w3s/v1/createdeskticket", async (req, res) => {
  const { firstname, lastname, email, userid } = req.body;
  const access_token = await AccessToken();

  await axios
    .post(
      `https://desk.zoho.com/api/v1/tickets`,
      {
        departmentId: "589572000000006907",
        subject: "Hello w3scloud",
        email: email,
        accountId: userid,
        contact: {
          firstName: firstname,
          lastName: lastname,
          email: email,
          phone: "01622869685",
        },
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.json(error.message);
    });
});

//get desk ticket by specific id
app.post("/w3s/v1/getticketbyid", (req, res) => {
  let access_token_desktoken;
  axios
    .post(
      `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdesktokenby_id}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
    )
    .then(function (data) {
      access_token_desktoken = response.data.access_token;
    });
});

//get data by specific id
app.post("/w3s/v1/getrecordbyid", async (req, res) => {
  const { id } = req.body;

  const access_token = await AccessToken();

  await axios
    .get(
      `https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Users/${id}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/w3s/v1/deleterecord", (req, res) => {});

app.post("/w3s/v1/updaterecord", (req, res) => {});

app.post("/w3s/v1/sendForgotPasswordMail", (req, res) => {
  const { email, id } = req.body;
  const jwtToken = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  console.log(jwtToken);
  console.log(id);
  console.log(email);
  var mailOptions = {
    from: ' "Reset Your Password" <amalinvestorportal@gmail.com>',
    to: email,
    subject: "Reset Password Link - Investment Portal",
    html: `<p>Your email: ${email}! </p> <p>Your user id: ${id}! </p><p>You requested for reset password, kindly use this <a href="https://investmentportal.netlify.app/resetpassword/${id}/${jwtToken}">Link</a> to reset your password</p>`,
  };

  //<a href="https://investmentportal.netlify.app/resetpassword/${id}/${jwtToken}">Link</a>

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.json(error.message);
      //console.log(email);
    } else {
      res.json({ message: "send email successfully" });
      console.log("Email sent: " + info.response);
    }
  });
});

app.post("/w3s/v1/verifyForgotMail", (req, res) => {
  const { token } = req.body;
  jwt.verify(token, process.env.JWT_SECRET, function (err, token) {
    if (err) {
      res.json({ result: "Link expired" });
    }
    res.json({ result: "Valid Link" });
  });
});

app.post("/w3s/v1/sendOTPVerificationEmail", (req, res) => {
  const { email, otpPin } = req.body;
  console.log("OTP: ", otpPin);
  var mailOptions = {
    from: ' "Verify Account" <amalinvestorportal@gmail.com>',
    to: email,
    subject: "Two Factor Authentication - Investment Portal",
    html: `<p>Your email: ${email}! </p><p>Your PIN</p><h1>${otpPin}</h1>`,
  };

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
});

//get deals data by id

//get documents data by id
app.post("/w3s/v1/getdocumentsbyid", async (req, res) => {
  const { id } = req.body;
  const access_token = await AccessToken();

  await axios
    .get(
      `https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Documents/${id}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});
// file get

//get all documents
app.post("/w3s/v1/getalldocuments", async (req, res) => {
  const access_token = await AccessToken();
  await axios
    .get(
      `https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Documents`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token_getdata}`,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

//get all deals data
app.post("/w3s/v1/getdealsbyid", async (req, res) => {
  const access_token = await AccessToken();

  await axios
    .get(
      `https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Deals/${dealid}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/w3s/v1/alldocdownload", async (req, res) => {
  const access_token = await AccessToken();
  const id = req.query.id;
  const filename = req.query.filename;

  const file = fs.createWriteStream(filename);

  const request = https.get(
    `https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Documents/${id}/Documents/download`,
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`,
      },
    },

    function (response) {
      response.pipe(file);

      // after download completed close filestream
      file.on("finish", () => {
        file.close();
        res
          .status(200)
          .json("http://localhost:5000/download?filename=" + filename);
      });
    }
  );
});

app.get("/download", function (req, res) {
  const name = req.query.filename;

  var file = __dirname + "/" + name;
  // res.status(200).json(file);

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader("Content-disposition", "attachment; filename=" + filename);
  res.setHeader("Content-type", mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
});

//allglobaldocuments
app.get("/w3s/v1/allglobaldocuments", async (req, res) => {
  const access_token = await AccessToken();

  await axios
    .get(
      `https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Documents?Access_Type=Global`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

//
app.get("/w3s/v1/getalldeals", async (req, res) => {
  const access_token = await AccessToken();

  await axios
    .get(
      `https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Deals`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/w3s/v1/documentswithdealsid",async(req,res)=>{
  const {dealid} = req.body;
  console.log(dealid);
  const access_token = await AccessToken();
   await axios.get(`https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Documents?criteria=Deals.ID=${dealid}`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`
      },
    })
    .then(function (response) {
    console.log(response);
    res.status(200).json(response.data);
    })
    .catch(function (error) {
    //console.log(error);
    })

})

app.get("/w3s/v1/memorycache", async (req, res) => {
  const access_token = await AccessToken();

  res.status(200).json(access_token);
  await axios
    .get(
      `https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Deals`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

async function AccessToken() {
  //  return "hsasa;lsdkjf;alsdkjf;";
  if (myCache.has("accesstoken")) {
    return myCache.get("accesstoken");
  } else {
    await axios
      .post(
        `https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
      )
      .then(function (response) {
        access_token_getdata = response.data.access_token;
        myCache.set("accesstoken", access_token_getdata);
        return access_token_getdata;
      });
    // myCache.set("accesstoken", ";ja;lsdkjf;alskdjf;laksjdf;lkj");
    return myCache.get("accesstoken");
  }
}
//post documents
app.post("/w3s/v1/postdocuments", async (req, res) => {
  const access_token = await AccessToken();
  await axios
    .post(
      `https://creator.zoho.com/api/v2/zoho_user12867/investment-portal/form/Documents`,
      {
        data: {
          DocumentName: "w3scloud",
          Users_Id: "123456",
        },
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      res.status(200).json(response.data);
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.json(error.message);
    });
});

app.post("/w3s/v1/dealswithuserid", async (req, res) => {
  const { dealid } = req.body;
  console.log(dealid);
  let access_token;

  if (myCache.has("accesstoken")) {
    console.log("from cache");
    access_token = myCache.get("accesstoken");
  } else {
    await axios
      .post(
        `https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
      )
      .then(function (response) {
        access_token_getdata = response.data.access_token;
        console.log("without cache");
        myCache.set("accesstoken", access_token_getdata);
        access_token = myCache.get("accesstoken");
      });
  }

  await axios
    .get(
      `https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Deals?criteria=ID=[${dealid}]`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    )
    .then(function (response) {
      //console.log(response);
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

//upload file
app.post(
  "/w3s/v1/uploadfile",
  upload.single("featuredImage"),
  (req, res, next) => {
    const {
      file,
      body: { id },
    } = req;
    console.log(file);
    const filename = req.file.filename;
    const filepath = file.path;
    console.log("document id: ", id);
    let access_token_uploadfile;
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filepath));
    const formHeaders = formData.getHeaders();
    axios
      .post(
        `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_uploadfile}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
      )
      .then(function (response) {
        //console.log("Form data: ",formData);
        access_token_uploadfile = response.data.access_token;
        console.log("Access token for upload file - ", access_token_uploadfile);
      })
      .then(function (response) {
        axios
          .post(
            `https://creator.zoho.com/api/v2/zoho_user12867/investment-portal/report/All_Documents/${id}/Documents/upload`,
            formData,
            {
              headers: {
                Authorization: `Zoho-oauthtoken ${access_token_uploadfile}`,
                ...formHeaders,
              },
            }
          )
          .then(function (data) {
            // console.log(data);
            // res.status(200).json(data);
            res.send("File Uploaded Successfully");
          })
          .catch(function (error) {
            console.log(error.message);
            res.send("File upload failed");
          });
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }
);

app.put("/w3s/v1/reset-password", (req, res) => {
  const { id, password } = req.body;
  console.log("Password: ", password);
  let access_token_updatedata;
  axios
    .post(
      `https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_updatedata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
    )
    .then(function (response) {
      access_token_updatedata = response.data.access_token;
    })
    .then(function (data) {
      console.log(
        "access token created for update Record: ",
        access_token_updatedata
      );
      axios
        .put(
          `https://creator.zoho.com.au/api/v2/nickprocterau_amaltrustees2/investment-portal/report/All_Users/${id}`,
          {
            data: {
              Password: password,
            },
          },
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${access_token_updatedata}`,
            },
          }
        )
        .then(function (response) {
          console.log(response);
          res.status(200).json(response.data);
        })
        .catch(function (error) {
          console.log(error);
          res.json(error.message);
        });
    })
    .catch(function (error) {
      access_token_updatedata = error;
    });
});

const GetToken = () => {
  const token = sessionStorage.getItem("access_token");
  const tokenl = JSON.parse(token);
  //console.log(tokenl.data);
  // console.log(tokenl.exp);
  let expirationDate = new Date(tokenl.exp);
  //console.log(expirationDate);
  if (expirationDate > new Date()) {
    console.log("not expire", tokenl.data);
    return tokenl.data;
  } else {
    console.log("expired");
    StoreToken();
  }
};

const StoreToken = async () => {
  //console.log(token?.data);
  var extratime = new Date(new Date().getTime() + 60000 * 2);
  const accesstoken = await axios
    .post(
      `https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_getdata}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
    )
    .then(function (response) {
      //access_token_getdata = response.data.access_token;
      sessionStorage.setItem(
        "access_token",
        JSON.stringify({ exp: extratime, data: response.data.access_token })
      );
      return response.data.access_token;
    });
  //console.log(accesstoken.data);
  // sessionStorage.setItem('access_token',JSON.stringify({exp: extratime,data: accesstoken.data}))
  // return accesstoken.data;
};

app.listen(port, function (error) {
  if (error) {
    console.log("server failed");
  } else {
    console.log("server success");
  }
});
