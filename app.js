const express = require('express');
const bodyParser = require('body-parser');
const got = require('got');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', function(req, res){
    
    res.sendFile(`${__dirname}/signup.html`);
    
});

app.post('/', function(req, res){
    
    const name = req.body.name;
    const lastname = req.body.lastname;
    const mail = req.body.mail;

    let data = {
        
                email_address:mail,
                status: 'subscribed',
                merge_fields: {
                    FNAME: name,
                    LNAME: lastname
                }
            
    };

    let jsonData = JSON.stringify(data);
    //console.log(jsonData); TESTING
    const url = "https://us1.api.mailchimp.com/3.0/lists/ca5e67a29d/members";
    const options = {
        method: 'POST',
        body: data,
        auth: 'rolfikv:d4c5e9826944210084bb628610dd36db-us1'
        
    };
    
    const request = https.request(url, options, function(response) {
        response.on('data', function(data){
            console.log(JSON.parse(data));
            console.log(response.statusCode);
            if (response.statusCode === 200) {
                res.sendFile(`${__dirname}/success.html`);
            } else if (response.statusCode === 400) {
                res.sendFile(`${__dirname}/failure.html`);
            }
        })
    });



    request.write(jsonData);
    request.end();
});

app.post('/failure', function(req, res){
    res.redirect(`/`);
});


app.listen(process.env.PORT || 3000, function() {
    console.log(`Server is up and running at heroku port ${process.env.PORT} or at 3000 localhost`);
});





