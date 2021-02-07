--SQL Queries for MotoRideMatch
--Authors: Brittany Legget & Mike McDonald
--Group: 58

--Get Users Information for login and Profile page
SELECT rider_ID, user_Name, password FROM Riders

--Display Unfiltered Routes on the Find A ride Page
SELECT Routes.route_Name, Terrains.terrain_Description, Routes.location, Routes.difficulty, Routes.miles 
FROM Routes JOIN Terrains ON Routes.terrain = Terrains.terrain_ID;

--Display filtered Routes on the Find A ride Page
SELECT Routes.route_Name, Terrains.terrain_Description, Routes.location, Routes.difficulty, Routes.miles 
FROM Routes JOIN Terrains ON Routes.terrain = Terrains.terrain_ID WHERE Terrains.terrain_Type= :terrain_Type;

--Display Rider bikes on Profile Page
SELECT Bikes.bike_ID, Bikes.make AS make, Bikes.model AS model, Bikes.year AS year 
FROM Bikes JOIN Garage ON Bikes.bike_ID=Garage.bike JOIN Riders ON Riders.rider_ID=Garage.rider WHERE Riders.user_Name=:user_Name_from_session;

--Display Completed Rides (tours) on the profile page
SELECT Routes.route_Name, Routes.miles, Routes.difficulty, Routes.location, Terrains.terrain_Type 
FROM Routes JOIN Tours ON Routes.route_ID=Tours.route JOIN Riders ON Riders.rider_ID=Tours.rider JOIN Terrains ON Terrains.terrain_ID = Routes.terrain WHERE Riders.user_Name=:user_Name_from_session;

--Display distinct terrain types for drop down filter on find a ride page
SELECT DISTINCT terrain_Type, terrain_ID FROM Terrains;

--Display all riders on the Admin Page
SELECT * FROM Riders;

--Display all Garages (User bikes M:M) on the Admin Page
SELECT * FROM Garage;

--Display all Bikes on the Admin Page
SELECT * FROM Bikes;

--Display all Routes on the Admin Page
SELECT * FROM Routes;

--Display all Tours (Completed Rides M:M) on the Admin Page
SELECT * FROM Tours;

--Display all Terrains on the Admin Page
SELECT * FROM Terrains;

--Update a rider on the Admin Page
UPDATE Riders SET user_Name=:user_Name_Input, password=:password_Input, first_Name=:fNameInput, last_Name=:lNameInput, dob=:dobInput, email=:emailInput, city=:cityInput, state=:Stateinput, zip=:zipInput WHERE rider_id = :riderID_from_update_row;

--Update a Bike on the Admin Page
UPDATE Bikes SET make=:makeInput, model=:modelInput, year=:yearInput WHERE bike_ID = :bike_ID_from_update_row;

--Update a Route on the Admin Page
UPDATE Routes SET route_Name=:route_name_input, terrain=:terrainInput, miles=:milesInput, difficulty=:difficultyInput, location=:locationInput WHERE route_ID=:routeID_from_Update_row;

--Update a Terrain on the Admin Page
UPDATE Terrains SET terrain_type=:terrainTypeInput, terrain_Description=:terrainDescriptionInput WHERE terrain_ID=:terrain_ID_from_Update_row;

--Delete a rider on the Admin Page
DELETE FROM Riders WHERE rider_id = :riderID_from_Delete_row;

--Delete a Bike on the Admin Page
DELETE FROM Bikes WHERE bike_ID = :bike_ID_from_Delete_row;

--Delete a Route on the Admin Page
DELETE FROM Routes WHERE route_ID=:routeID_from_Delete_row;

--Delete a Terrain on the Admin Page
DELETE FROM Terrains WHERE terrain_ID=:terrain_ID_from_delete_row;

--Add a rider on the Admin Page
INSERT INTO Riders (user_Name, password, first_Name, last_Name, dob, email, city, state, zip) VALUES (:user_Name_Input, :password_Input, :first_Name_Input, :last_Name_Input, :dob_Input, :email_Input, :city_Input, :state_input, :zip_input);

--Add a Garage (User bikes M:M) on the Admin Page
INSERT INTO Garage (bike, rider) VALUES (:Bike_ID_AutoIncremented_In_Bikes_on_Insert, (SELECT rider_ID from Riders WHERE user_Name =:user_Name_From_session);

--Add a Bike on the Admin Page
INSERT INTO Bikes (make, model, year) VALUES (:makeInputFromForm, :modelInputFromForm, :yearInputFromForm);

--Add a Route on the Admin Page
INSERT INTO Routes (route_Name, terrain, miles, difficulty, location) VALUES (:route_Name_Input, :terrain_Input, :miles_Input, :difficulty_Input, :location_Input);

--Add a Tour (Completed Rides M:M) on the Admin Page
INSERT INTO Tours (route, rider) VALUES (:Route_ID_AutoIncremented_In_Routes_on_Insert, (SELECT rider_ID from Riders WHERE user_Name =:user_Name_from_session);

--Add a Terrain on the Admin Page
INSERT INTO Terrains (terrain_Type, terrain_Description) VALUES (:terrain_Type_Input, :terrain_Description_Input);
