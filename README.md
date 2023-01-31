# Node.js Express & MongoDB: CRUD Rest APIs


# nodejs-vault-mongodb.   with vault. to secure connection 

1- cat policy_mongodb.hcl
path "secret/data/mongo/webapp" {   
  capabilities = ["read"]   
}

2- create policy
vault policy write policy_mongodb policy_mongodb.hcl

3- create credentials 
vault kv put kv-v1/nodejs/mongodb db_name="bezkoder_db" username="xxxxx" password="YYYYY"

4- create role
vault write auth/approle/role/node-app-role \
    token_ttl=1h \
     token_max_ttl=4h \
     token_policies=readonly-kv-backend
    
 5- get role-id
 vault read auth/approle/role/node-app-role/role-id
 Key        Value
---        -----
role_id    d7db7286-601a-23e5-ab79-757542418707

 export ROLE_ID=d7db7286-601a-23e5-ab79-757542418707
 
 6- get wrapped token for 30Min
 vault write -wrap-ttl=30m -force auth/approle/role/role-mongodb-nodejs/secret-id
Key                              Value
---                              -----
wrapping_token:                  hvs.CAESIBvmDl1JqqApA2XW_mnD61unzAnLZ7EN0lT9QwatwnqbGh4KHGh2cy43Q1pzODhacjFVazZVRGF1S2ZkWTROOVc


# Execute nodejs:  or we can export SECRET_ID={wrapper_token}
node server.js {wrapper_token}



