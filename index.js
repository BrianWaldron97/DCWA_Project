var express = require('express')
var sqlDAO = require('./sqlDAO') // sql
var mongoDAO = require('./mongoDAO') // mongo
var bodyParser = require('body-parser') // body parser
const { body, validationResult, check } = require('express-validator'); // express validator

var app = express();

app.use(express.static(__dirname)); // for static files - css

app.set('view engine', 'ejs') // install ejs

// Parse - urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Home Page - Links to other pages
app.get('/', (req, res) => {
    res.write("<a href=/listCountries>List Countries<br></a>")
    res.write("<a href=/listCities>List Cities<br></a>")
    res.write("<a href=/listHeadsOfState>List Heads of State</a>")
})

// List Countries
app.get('/listCountries', (req, res) => {
    sqlDAO.getCountries()
        .then((result) => {
            res.render('countries', {countries:result})
        })
        .catch((error) => {
            res.send(error)
        })
})

// List Cities
app.get('/listCities', (req, res) => {
    sqlDAO.getCities()
        .then((result) => {
            res.render('cities', {cities:result})
        })
        .catch((error) => {
            res.send(error)
        })
})

// post of allDetails
app.post('/allDetails/:city', (req, res) => {
    res.render('allDetails/:city')
})

// All Details
app.get('/allDetails/:city', (req, res) => {
    sqlDAO.getCities(req.params.city)
        .then((result) => {
            //res.send(result)
            res.render("cityDetails", {cty_code:req.body.cty_code,cty_name:req.body.cty_name,population:req.body.population,isCoastal:req.body.isCoastal,areaKM:req.body.areaKM})
        })
        .catch((error) => {
            res.send(error)
        })
})


// Add Country
app.get('/addCountry', (req,res) => {
    res.render('addCountry', {errors: undefined})
})
 // post Add Country
app.post('/addCountry', 
[
    // Checking for errors
    check('co_code.').isLength({min: 1, max: 3}).withMessage("Country Code must not exceed 3 characters or less than 1 character"),  
    check('co_name').isLength({min: 3}).withMessage("Coutnry Name must be at least 3 characters"),
    check('co_code')
        .exists()
        .custom(async co_code => {
        const data = await sqlDAO.checkCountryCode(co_code); // await used in async function to pause code until promise is fulfilled
        if(data) {
            throw new Error('Error: ' + co_code + ' already exists')
        }
    })
],
(req, res) => {
    var errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.render('addCountry', {errors:errors.errors})
    } else {
        sqlDAO.addCountry(req.body.co_code, req.body.co_name, req.body.co_details)
        res.redirect('/listCountries')
    }
})

// Heads of State
app.get('/listHeadsOfState', (req, res) => {
    mongoDAO.getHeads()
        .then((documents) => {
            res.render('headsofstate', {states:documents})
        })
        .catch((error) => {
            res.send(error)
        })
})

// Add Head of State
app.get('/addHeadOfState', (req, res) => {
    res.render('addHeadOfState')
})

// post Head of State 
app.post('/addHeadOfState', (req, res) => {
    mongoDAO.addHeadOfState(req.body._id, req.body.headOfState)
        .then((result) => {
            res.redirect('/listHeadsOfState')
        })
        .catch((error) => {
            res.send(error)
        })
})


app.listen(3004, () => {
    console.log("Listening on port 3004")
})