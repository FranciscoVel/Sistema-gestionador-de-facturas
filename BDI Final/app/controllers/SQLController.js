module.exports =class SQLController{    

    
    async executeSQL(sql,binds,autoCommit){
        let DB = require('../../config/config.js');

        let result = await  DB.Open(sql,binds,autoCommit);
    
        return result;
    }

}
