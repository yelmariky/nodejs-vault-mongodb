const db = require("./app/models");
const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

var wrap_token = process.argv[2];

let vault_return = {};
 
if(!wrap_token){
    console.error("No wrap token, enter token as argument");
    process.exit();
}
 
var options = {
    apiVersion: 'v1', // default
    endpoint: 'http://127.0.0.1:8200',
    token: wrap_token //wrap token
  };
 
console.log("Token being used " + process.argv[2]);
   
// get new instance of the client
var vault = require("node-vault")(options);

  const roleId = process.env.ROLE_ID;
  console.log('roleId: '+roleId);

  const vaultm = require('node-vault')();

  //const maFonction = () => {
    //const vault_return = {};
  vault.unwrap().then((result) => {
    

    var secretId = result.data.secret_id;
    console.log("Your secret id is " + result.data.secret_id);

    //login with approleLogin
    vault.approleLogin({ role_id: roleId, secret_id: secretId }).then((login_result) => {       
      var client_token = login_result.auth.client_token;
      console.log("Using client token to login " + client_token);
      var client_options = {
          apiVersion: 'v1', // default
          endpoint: 'http://127.0.0.1:8200',
          token: client_token //client token
      };

     

      var client_vault = require("node-vault")(client_options);
      
      client_vault.read('kv-v1/nodejs/mongodb').then((read_result) => {
         console.log('****++++++ vault: +++++++++');
          //db_vault=read_result.data;
         // console.log(read_result.data);
          //console.log('younes: ' +db_vault);

         vault_return= read_result.data;
         console.log(vault_return);
         const databaseName = vault_return.db_name;
        const username = vault_return.username;
        const password = vault_return.password;
         
        const hostName='localhost';
        const portName=27017;
        const mongoURL='mongodb://'+username+':'+password+'@'+hostName+':'+portName+'/'+databaseName;

          db.mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });


         // return vault_return;

      });
    });
  }).catch(console.error); 



// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/turorial.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
