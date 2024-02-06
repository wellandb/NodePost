//Initiallising node modules
var express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();
const path = require('path');
var form = require('multer');
const { json } = require("body-parser");
app.set( 'views', path.join(__dirname,'views'));
app.set('view engine','pug');
const ip='127.0.0.1';
const port='4040';

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));
var urlencodedParser = bodyParser.urlencoded({ extended:false});
app.use(bodyParser.text({ type:'text/html'}));
app.use(cors(
{
    origin:"*",
    methods: ['GET','POST']
}));
app.use(express.urlencoded(
{
    extended:true
}));

//CORS Middleware
app.use(function(req, res, next) 
{
    //Enabling CORS
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With,contentType,Content-Type, Accept, Authorization");
    next();
});
//Setting up server
var server = app.listen(process.env.PORT ||4040,function() 
{
    var port = server.address().port;
    console.log("App now running on port", port);
    console.log(`server running at http://${ip}:${port}/`);
});
//Initialising connection string
var dbConfig = 
{
    user:"bob",
    password:"bob",
    server:"DESKTOP-8J3SARA",
    database:"Node",
    synchronize:true,
    trustServerCertificate:true,
    port:1433,
    dialectOptions:
    {
        instanceName:"SQLExpress"
    }
};
var items = [];
var item = [];
var items2 = [];
var item2 = [];
//Function to connect to database and execute query
//GET ALL ACTIVE USERS FOR PATHWAYS
app.get("/",function(req, res)
{
    var query ="select * from Studentinfo";
    sql.connect(dbConfig,function(err)
    {
        if(err) console.log(err);
        // create Request object
        var request =new sql.Request();
        // query to the database and get the records
        request.query(query,function(err, recordset)
        {
            if(err) console.log(err)
            for(let[key, value]of Object.entries(recordset))
            {
                //console.log('key: ' + key.json);
                if(key ==="recordset"){
                    items = [];
                    for(var i=0; i<value.length; i++)
                    {
                        item = [];
                        //console.log('id: ' + value[i].ID + 'name: ' + value[i].Name +'age: ' + value[i].Age );
                        item['id'] = value[i].ID;
                        item['name'] = value[i].Name;
                        item['age'] = value[i].Age;
                        items.push(item) ;
                    }
                }
                else
                {
                //console.log('not a record');
                }
            }
            console.log('--------------------');
            res.render('index', {title:'items',items: items});
            res.end;
        });
    });
});
//POST API
app.post("/user",function(req, res)
{
    console.log(req.body["dropDown"]);
    userid = req.body["dropDown"];
    //------------------------------------------
    var query = "select * from Studentinfo where ID = "+"'"+ userid[0] +"'";
    //console.log("QUERY: " + query);
    sql.connect(dbConfig,function(err)
    {
        if(err) console.log(err);
        // create Request object
        var request =new sql.Request();
        // query to the database and get the records
        request.query(query,function(err, recordset)
        {
            if(err) console.log(err)
            for(let[key, value]of Object.entries(recordset))
            {
                if(key ==="recordset")
                {
                    items = [];
                    for(var i=0; i<value.length; i++)
                    {
                        item = [];
                        //console.log('id: ' + value[i].ID + 'name: ' + value[i].Name + 'age: '+ value[i].Age );
                        item['id'] = value[i].ID;
                        item['name'] = value[i].Name;
                        item['age'] = value[i].Age;
                        items.push(item) ;
                    }
                }
                else
                {
                    //console.log('not a record');
                }
            }
            if(items.length >0)
            {
                //console.log("length greater than 0");
            }
            else
            {
                //console.log("length equal 0");
            }
            res.render('table', {title:'items',items: items});
            res.end;
        });
    });
});
//PUT API
app.put("/user", function(req , res){
    
    userid = req.body["dropDown1"];
    console.log('Updating ' + userid);
    //var query = "UPDATE [user] SET Name=" + req.body.Name +", Age=" + req.body.Age + " WHERE Id=" + userid[0];
    //executeQuery (res, query);
    
    console.log(req.body["dropDown1"]);
    userid = req.body["dropDown1"];
    //------------------------------------------
    var query = "select * from Studentinfo where ID = "+"'"+ userid[0] +"'";
    //console.log("QUERY: " + query);
    sql.connect(dbConfig,function(err)
    {
        if(err) console.log(err);
        // create Request object
        var request =new sql.Request();
        // query to the database and get the records
        request.query(query,function(err, recordset)
        {
            if(err) console.log(err)
            for(let[key, value]of Object.entries(recordset))
            {
                if(key ==="recordset")
                {
                    items = [];
                    for(var i=0; i<value.length; i++)
                    {
                        item = [];
                        //console.log('id: ' + value[i].ID + 'name: ' + value[i].Name + 'age: '+ value[i].Age );
                        item['id'] = value[i].ID;
                        item['name'] = value[i].Name;
                        item['age'] = value[i].Age;
                        items.push(item) ;
                    }
                }
                else
                {
                    //console.log('not a record');
                }
            }
            if(items.length >0)
            {
                //console.log("length greater than 0");
            }
            else
            {
                //console.log("length equal 0");
            }
            res.render('table', {title:'items',items: items});
            res.end;
        });
    });
});
// DELETE API
app.delete("/api/", function(req , res){
    
    console.log('Deleting ' + req.body.item.name);
    userid = req.body["dropDown2"];
    var query = "DELETE FROM [user] WHERE Id=" + req.body.item.id;
    executeQuery (res, query);
});