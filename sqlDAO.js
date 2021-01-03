var mysql = require('promise-mysql')

var pool

mysql.createPool({
    connectionLimit : 3,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'geography'
})
.then((result) => {
    pool = result
  })
  .catch((error) => {
    console.log(error)
  });

  // Get Countries
  var getCountries = function() {
      return new Promise((resolve, reject) => {
        pool.query('select * from country')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
      });
  }

  // Get Cities function
  var getCities = function() {
      return new Promise((resolve, reject) => {
        pool.query('select * from city')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
      })
  }

  // Add Country function
  var addCountry = function(co_code, co_name, co_details){
      return new Promise((resolve, reject) => {
          var myQuery = {
              sql: 'insert into country values (?, ?, ?)',
              values: [co_code, co_name, co_details]
          }
          pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
      })
  }

  // Check Country code function
  var checkCountryCode = function(co_code){
      return new Promise((resolve, reject) => {
          pool.query('select count(*) as total from country where co_code = ?',
            [co_code], function(error, result) {
                if(!error){
                    resolve(result[0].total > 0);
                } else {
                    reject(new Error('error'))
                }
            });  
      })
  }


  // exporting functions
  module.exports = { getCountries, getCities, addCountry, checkCountryCode }