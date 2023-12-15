const oracledb = require('oracledb');

db = {
    user: 'FINALBASES1',
    password: 'FINALBASES1',
    connectString: '192.168.56.1:1521'
    //user: 'BD182',
    //password: 'BD182',
    //connectString: 'localhost:1521'

}

async function open(sql, binds, autoCommit){
    let con = await oracledb.getConnection(db);
    let result = await con.execute(sql,binds,{autoCommit});
    con.release();
    return result;
}

exports.Open = open;