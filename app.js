var express = require('express');
var expresshandlebar = require('express-handlebars')
var app = express();
var path = require('path')
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieparser = require('cookie-parser')
var Riders=[{Username: "Admin", password: "password"}];
var sql = require('./dbcon.js');
var sql2 = require('./dbcon.js');

app.engine('handlebars', expresshandlebar());

app.set('port', 7757); 
//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');

//Serve static files
app.use(express.static(path.join(__dirname, 'public')));

//Allows the use of sessions for a user who creates a login
app.use(session({secret:'SecretwordsHere'}));
app.use(cookieparser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function getUsers(res, sql, data, complete){
    sql.pool.query("SELECT rider_ID, user_Name, password FROM Riders", function(err,rows, fields){
        if(err){
        next(err);
        return;
        }
        data.users = rows;
        complete();
    });
}

function getRiders(res, sql, data, complete){
    sql.pool.query("SELECT * FROM Riders", function(err,rows, fields){
        if(err){
        next(err);
        return;
        }
        data.Riders = rows;
        complete();
    });
}

function getBikes(res, sql, data, complete) {  
  sql.pool.query("SELECT * FROM Bikes", function(err,rows,fields){
      if(err){
        next(err);
        return;
      }
      data.Bikes = rows;
      complete();
  });
}

function getGarage(res, sql, data, complete){
  sql.pool.query("SELECT * FROM Garage", function(err,rows,fields){
      if(err){
          next(err);
          return;
      }
      data.Garage = rows;
      complete();
  });
}

function getAdminTerrains(res, sql, data, complete){
  sql.pool.query("SELECT * FROM Terrains", function(err,rows,fields){
      if(err){
          next(err);
          return;
      }
      data.Terrains = rows;
      complete();
  });
}


function getRoutes(res, sql, data, complete){
  sql.pool.query("SELECT * FROM Routes", function(err,rows,fields){
      if(err){
          next(err);
          return;
      }
      data.Routes = rows;
      complete();
  });
}

function getAdminTours(res, sql, data, complete){
  sql.pool.query("SELECT * FROM Tours", function(err,rows,fields){
      if(err){
          next(err);
          return;
      }
      data.Tours = rows;
      complete();
  });
}

function getFindARide(res, sql, data, complete){
    sql.pool.query("SELECT Routes.route_Name, Terrains.terrain_Description, Routes.location, Routes.difficulty, Routes.miles FROM Routes JOIN Terrains ON Routes.terrain = Terrains.terrain_ID", function(err,rows,fields){
        if(err){
            next(err);
            return;
        }
        data.Routes = rows;
        complete();
    });
  }

function filterFindARide(res, sql, data, id, complete){
    sql.pool.query("SELECT Routes.route_Name, Terrains.terrain_Description, Routes.location, Routes.difficulty, Routes.miles FROM Routes JOIN Terrains ON Routes.terrain = Terrains.terrain_ID WHERE Terrains.terrain_Type= ?", [id], function(err,rows,fields){
        if(err){
            next(err);
            return;
        }
        data.Routes = rows;
        complete();
    });
}

function getRiderBikes(res, sql, data, complete){
    sql.pool.query("SELECT Bikes.bike_ID, Bikes.make AS make, Bikes.model AS model, Bikes.year AS year FROM Bikes JOIN Garage ON Bikes.bike_ID=Garage.bike JOIN Riders ON Riders.rider_ID=Garage.rider WHERE Riders.user_Name=?", [data.rider.user_Name], function(err,rows,fields){
        if(err){
            next(err);
            return;
        }
        data.Bikes = rows;
        complete();
    });
}

function getTours(res, sql, data, complete){
    sql.pool.query("SELECT Tours.tour_ID, Routes.route_Name, Routes.miles, Routes.difficulty, Routes.location, Terrains.terrain_Type FROM Routes JOIN Tours ON Routes.route_ID=Tours.route JOIN Riders ON Riders.rider_ID=Tours.rider JOIN Terrains ON Terrains.terrain_ID = Routes.terrain WHERE Riders.user_Name=?", [data.rider.user_Name], function(err,rows,fields){
        if(err){
            next(err);
            return;
        }
        data.Tours = rows;
        complete();
    });
}


/*Drop down Terrain type search*/
function getTerrainType(res, sql, data, complete){
    sql.pool.query("SELECT DISTINCT terrain_Type FROM Terrains", function(err,rows,fields){
        if(err){
            next(err);
            return;
        }
        data.terrain_Type = rows;
        complete();
    });
  }

  function getTerrainTypes(res, sql, data, complete){
    sql.pool.query("SELECT DISTINCT terrain_Type, terrain_ID FROM Terrains", function(err,rows,fields){
        if(err){
            next(err);
            return;
        }
        data.Terrains = rows;
        complete();
    });
  }



//Serves the body of the page (main.hbs) to the container (index.hbs)

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/home', function(req, res) {
    res.render('home');
});

app.post('/addRider', function(req, res){
    var complete={};
    sql.pool.query("INSERT INTO Riders (`user_Name`,`password`,`first_name`, `last_name`, `dob`, `email`, `city`, `state`, `zip`) VALUES (?,?,?,?,?,?,?,?,?)",
    [req.body.user_Name, req.body.password, req.body.first_name, req.body.last_name, req.body.dob, req.body.email, req.body.city, req.body.state, req.body.zip], function(err, result){
     if(err){
       next(err);
       return;
   
     }
     complete.message = "Added Rider Successfully";
     res.render('redirect', complete)
    });

});


app.post('/addBike', function(req, res){
    var complete={};
    sql.pool.query("INSERT INTO Bikes (`make`, `model`, `year`) VALUES (?,?,?)",
    [req.body.make, req.body.model, req.body.year], function(err, result){
     if(err){
       next(err);
       return;
     }
     var IID = result.insertId;
     var UID = req.session.rider.user_Name;
     sql2.pool.query("INSERT INTO Garage (`bike`, `rider`) VALUES (?, (SELECT rider_ID from Riders WHERE user_Name = ?))",
     [IID, UID], function(err, result){
      if(err){
        next(err);
        return;
      }
     complete.message = "Added Bike Successfully";
     res.render('redirect', complete)
    });
    });
});


app.post('/addRoute', function(req, res){
    var complete={};
    sql.pool.query("INSERT INTO Routes (`route_Name`, `terrain`, `miles`, `difficulty`, `location`, `tour`) VALUES (?,?,?,?,?,?)",
    [req.body.name, req.body.terrain, req.body.miles, req.body.difficulty, req.body.location, req.body.tour], function(err, result){
     if(err){
       next(err);
       return;
   
     }
     var IID = result.insertId;
     var UID = req.session.rider.user_Name;
     sql2.pool.query("INSERT INTO Tours (`route`, `rider`) VALUES (?, (SELECT rider_ID from Riders WHERE user_Name = ?))",
     [IID, UID], function(err, result){
      if(err){
        next(err);
        return;
      }
     complete.message = "Added Route Successfully";
     res.render('redirect', complete)
    });
    });

});

app.post('/addTerrain', function(req, res){
    var complete={};
    sql.pool.query("INSERT INTO Terrains (`terrain_Type`, `terrain_Description`) VALUES (?,?)",
    [req.body.terrain_Type, req.body.terrain_Description], function(err, result){
     if(err){
       next(err);
       return;
   
     }
     complete.message = "Added Terrain Successfully";
     res.render('redirect', complete)
    });

});

app.post('/delete', function(req, res, next){
    sql.pool.query("DELETE FROM ?? WHERE ??= ?",[req.body.table, req.body.field, req.body.id], 
    function(err,result){
      if(err){
        next(err);
        return;
  
      }
     res.redirect('profile')
    });

});

app.post('/adminDelete', function(req, res, next){
    sql.pool.query("DELETE FROM ?? WHERE ??= ?",[req.body.table, req.body.field, req.body.id], 
    function(err,result){
      if(err){
        next(err);
        return;
  
      }
     res.redirect('admin')
    });

});

app.post('/update', function(req, res, next){
    var complete={};
    if(req.body.table==="Riders"){
        sql.pool.query("UPDATE Riders SET first_Name=?, last_Name=?, dob=?, email=?, city=?, state=?, zip=? WHERE rider_ID = ?;",
        [req.body.first_name, req.body.last_name, req.body.dob, req.body.email, req.body.city, req.body.state, req.body.zip, req.body.id], 
        function(err,result){
          if(err){
            next(err);
            return;
      
          }
         complete.message = "Updated Rider Successfully";
         res.render('redirect', complete)
        });
    }else if(req.body.table==="Bikes"){
        sql.pool.query("UPDATE Bikes SET make=?, model=?, year=? WHERE bike_ID = ?;",
        [req.body.make, req.body.model, req.body.year, req.body.terrain, req.body.id], 
        function(err,result){
        if(err){
            next(err);
            return;
    
        }
        complete.message = "Updated Bike Successfully";
        res.render('redirect', complete)
        }); 
    } else if (req.body.table === "Garage"){
        sql.pool.query("UPDATE Garage SET rider=?, bike=? WHERE bike_PIN = ?;",
        [req.body.rider, req.body.bike, req.body.bike_PIN], 
        function(err,result){
        if(err){
            next(err);
            return;
    
        }
        complete.message = "Updated Garage Successfully";
        res.render('redirect', complete)
        });
    } else if (req.body.table === "Routes"){
        sql.pool.query("UPDATE Routes SET route_Name=?, terrain=?, miles=?, difficulty=?, location=?, tour=? WHERE route_ID=?;",
        [req.body.route_Name, req.body.terrain, req.body.miles, req.body.difficulty, req.body.location, req.body.tour, req.body.route_ID], 
        function(err,result){
        if(err){
            next(err);
            return;
    
        }
        complete.message = "Updated Route Successfully";
        res.render('redirect', complete)
        });
    } else if (req.body.table === "Tours"){
        sql.pool.query("UPDATE Tours SET route=?, rider=?, date_Of_Ride=? WHERE tour_ID=?;",
        [req.body.route, req.body.rider, req.body.date_Of_Ride, req.body.tour_ID], 
        function(err,result){
        if(err){
            next(err);
            return;
    
        }
        complete.message = "Updated Tour Successfully";
        res.render('redirect', complete)
        });
    } else if (req.body.table === "Terrains"){
        sql.pool.query("UPDATE Terrains SET terrain_Type=?, terrain_Description=? WHERE terrain_ID=?;",
        [req.body.terrain_Type, req.body.terrain_Description, req.body.terrain_ID], 
        function(err,result){
        if(err){
            next(err);
            return;
    
        }
        complete.message = "Updated Terrain Successfully";
        res.render('redirect', complete)
        });
    }
});

app.get('/admin',function(req, res) {
    if(req.session.rider){
        if(req.session.rider.user_Name==="Admin"){
            var data = {};
            var callbackCount=0;
            getBikes(res, sql, data, complete);
            getGarage(res, sql, data, complete);
            getRiders(res, sql, data, complete);
            getRoutes(res, sql, data, complete);
            getAdminTerrains(res, sql, data, complete);
            getAdminTours(res, sql, data, complete);
            function complete(){
                callbackCount++;
                if(callbackCount>=6){
                    res.render('admin', data);
                }
            }
        }else{
            var adminRestrict={};
            adminRestrict.message="You must log in as admin to access the Admin functions";
            res.render('login', adminRestrict);
        }
    } else{
        var adminRestrict={};
        adminRestrict.message="You must log in as admin to access the Admin functions";
        res.render('login', adminRestrict);
    }

});

app.get('/login', function(req, res) {
    res.render('login');
});

app.post('/login', function(req, res) {
    if(!req.body.Username||!req.body.password){
        var error={};
        error.message="Invalid Rider ID or Password";
        res.render('login', error);
    } else {
        var data={};
        var callbackCount=0;
        getUsers(res, sql, data, complete)
        function complete(){
            callbackCount++;
            if(callbackCount>=1){
                var check  = data.users.find(users => {return users.user_Name===req.body.Username && users.password===req.body.password});
                if(check){
                    req.session.rider = check;
                    return res.redirect('profile');
                }
                var error={};
                error.message="Invalid Rider ID or Password";
                res.render('login',error);
            }
        }
    }
});

app.get('/newUser',function(req, res) {
    res.render('newUser');
});

app.get('/pwRecovery',function(req, res) {
    res.render('newUser');
});

app.get('/logout',function(req, res) {
    req.session.destroy();
    var loggedOut={};
    loggedOut.message="You have successfully logged out";
    res.render('redirect', loggedOut);
});

app.post('/newUser',function(req, res) {
    if(!req.body.password || !req.body.user_Name){
        var error={};
        error.message="Please provide Rider Username and Password";
        res.render('newUser', error);
    }else if(!(req.body.password === req.body.confirmpassword)){
        var error={};
        error.message="Password confirmation missmatch - Please submit matching password confirmation";
        res.render('newUser', error);
    }else {
        var data={};
        var callbackCount=0;
        getUsers(res, sql, data, complete)
        function complete(){
            callbackCount++;
            if(callbackCount>=1){
                var check  = data.users.find(users => {return users.user_Name===req.body.user_Name && users.password===req.body.password});
                if(check){
                    var error={};
                    error.message="Rider name taken! Please log in or select new Rider name";
                    return res.render('newUser', error);
                }
                sql.pool.query("INSERT INTO Riders (`user_Name`,`password`,`first_name`, `last_name`, `dob`, `email`, `city`, `state`, `zip`) VALUES (?,?,?,?,?,?,?,?,?)",
                [req.body.user_Name, req.body.password, req.body.first_name, req.body.last_name, req.body.dob, req.body.email, req.body.city, req.body.state, req.body.zip], function(err, result){
                 if(err){
                   next(err);
                   return;
               
                 }
                res.redirect('login');
                });
            }
        }
    }
});


app.get('/profile',function(req, res) {
    if(req.session.rider){
        callbackCount=0;
        var data = {};
        getTerrainTypes(res, sql, data, complete);
        data.rider = req.session.rider;
        getRiderBikes(res, sql, data, complete);
        getTours(res, sql, data, complete);
        function complete(){
            callbackCount++;
            if(callbackCount>=3){
                res.render('profile', data);
            }
        }
    } else{
        res.redirect('login');
    }
});

app.get('/findRide',function(req, res) {
    data={};
    var callbackCount=0;
    getFindARide(res, sql, data, complete);
    getTerrainType(res, sql, data, complete);
    function complete(){
        callbackCount++;
        if(callbackCount>=2){
            res.render('findRide',data);
        }
    }
});

app.get('/findRide&:id',function(req, res){
    data={};
    var callbackCount=0;
    filterFindARide(res, sql, data, req.params.id, complete);
    getTerrainType(res, sql, data, complete);
    function complete(){
        callbackCount++;
        if(callbackCount>=2){
            res.render('findRide',data);
        }
    }
});

app.get('/profile&:id',function(req, res){
    data={};
    var callbackCount=0;
    getTerrainType(res, sql, data, complete);
    function complete(){
        callbackCount++;
        if(callbackCount>=1){
            res.render('profile',data);
        }
    }
});

app.listen(app.get('port'), function(){
  console.log(`Express started on http://${process.env.HOSTNAME}:${app.get('port')}; press Ctrl-C to terminate.`);
});
