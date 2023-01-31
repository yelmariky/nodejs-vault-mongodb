
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

         // return vault_return;

      });
    });
  }).catch(console.error); 

  module.exports = vault_return;
 // return vault_return;
//}

//module.exports = maFonction;
  
  /**const roleId = process.env.ROLE_ID;
  const secretId = process.env.SECRET_ID;
  
  const run = async () => {
    const result = await vault.approleLogin({
      role_id: roleId,
      secret_id: secretId,
    });
  
    vault.token = result.auth.client_token; // Add token to vault object for subsequent requests.
  
    const { data } = await vault.read("secret/data/mongo/webapp"); // Retrieve the secret stored in previous steps.
  
//export ROLE_ID=d7db7286-601a-23e5-ab79-757542418707
 //export SECRET_ID=6ef1fa2f-9957-909c-977e-9a93204c4b8a


};**/