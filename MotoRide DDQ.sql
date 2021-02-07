-- MySQL dump 10.16  Distrib 10.1.37-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: bsg
-- ------------------------------------------------------
-- Server version	10.1.37-MariaDB


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;



--
-- Table structure for table `Riders`
--

DROP TABLE IF EXISTS `Riders`;
CREATE TABLE `Riders` (
    `rider_ID` int(11) NOT NULL AUTO_INCREMENT,
    `user_Name` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `first_Name` varchar(255) NOT NULL,
    `last_Name` varchar(255) NOT NULL,
    `dob` DATE NOT NULL,
    `email` varchar(255) NOT NULL,
    `city` varchar(255) NOT NULL,
    `state` varchar(255) NOT NULL,
    `zip` varchar(255) NOT NULL,
  PRIMARY KEY (`rider_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Riders`
--


INSERT INTO `Riders` (`user_Name`, `password`,`first_Name`, `last_Name`, `dob`,`email`, `city`, `state`, `zip`) VALUES
('Admin','password','Admin', 'None', '1970-01-01', 'Admin@Admin.com', 'Seattle', 'WA', '98121'),
('ChappellShow','password','Dave', 'Chappel', '1970-08-08', 'fakeEmail1@hotmail.com', 'Seattle', 'WA', '98121'),
('Larry1951','password','Larry', 'David', '1951-01-01', 'fakeEmail2@hotmail.com', 'Los Angeles', 'CA', '90027'),
('WildBill','password','Bill', 'Gates', '1951-09-09', 'fakeEmail2@hotmail.com', 'Los Angeles', 'CA', '90027'),
('DaRock','password','Dwayne', 'Johnson', '1973-02-02', 'fakeEmail54@hotmail.com', 'New York', 'NY', '01234'); 


--
-- Table structure for table `Bikes`
--

DROP TABLE IF EXISTS `Bikes`;
CREATE TABLE `Bikes` (
    `bike_ID` int(11) NOT NULL AUTO_INCREMENT,
    `make` varchar(255) NOT NULL,
    `model` varchar(255) NOT NULL,
    `year` int(11) NOT NULL ,
    PRIMARY KEY (`bike_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Bikes`
--


INSERT INTO `Bikes` (`make`, `model`, `year`) VALUES
('Indian', 'Scout Bobber', '2019'),
('Harley Davidson', 'VRod', '2014'),
('Royal Enfield', 'Himalayan', '2019');


--
-- Table structure for table `Garage`
--

DROP TABLE IF EXISTS `Garage`;
CREATE TABLE `Garage` (
  `bike_PIN` int(11) UNIQUE NOT NULL AUTO_INCREMENT,
  `bike` int(11) NOT NULL,
  `rider`  int(11) NOT NULL,
  PRIMARY KEY (`bike_PIN`),
  KEY `bike` (`bike`),
  KEY `rider` (`rider`),
  CONSTRAINT `fk_bike` FOREIGN KEY (`bike`) REFERENCES `Bikes` (`bike_ID`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_rider` FOREIGN KEY (`rider`) REFERENCES `Riders` (`rider_ID`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Garage`
--


INSERT INTO `Garage` (`bike`, `rider`) VALUES
(1, 1),
(2, 2),
(3, 3);

--
-- Table structure for table `Terrains`
--

DROP TABLE IF EXISTS `Terrains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Terrains` (
  `terrain_ID` int(11) NOT NULL AUTO_INCREMENT,
  `terrain_Type` varchar(255) NOT NULL,
  `terrain_Description` varchar(255),
  PRIMARY KEY (`terrain_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `Terrains`
--

LOCK TABLES `Terrains` WRITE;
/*!40000 ALTER TABLE `Terrains` DISABLE KEYS */;
INSERT INTO `Terrains` VALUES (1,'On-Road Maintained','Paved, well-maintained, roadway'),(2,'Forest Service Maintained', 'Maintained unpaved road of dirt, gravel, or sand'),(3,'Mixed roadway','Mix of paved, gravel, sand, and/or dirt');
/*!40000 ALTER TABLE `Terrains` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `Routes`
--

DROP TABLE IF EXISTS `Routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Routes` (
`route_ID` INT(11) NOT NULL AUTO_INCREMENT,
`route_Name` VARCHAR(255),
`terrain` INT(11),
`miles` INT(6) NOT NULL,
`difficulty` varchar(255) NOT NULL,
`location` varchar(255),
`tour` INT(11),
PRIMARY KEY (`route_ID`),
KEY `terrain` (`terrain`),
CONSTRAINT `Routes_ibfk_2` FOREIGN KEY (`terrain`) REFERENCES `Terrains` (`terrain_ID`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `Routes`
--

LOCK TABLES `Routes` WRITE;
/*!40000 ALTER TABLE `Routes` DISABLE KEYS */;
INSERT INTO `Routes` VALUES (1,'OBCDR Route 5', 3, 750, 'Hard', 'Oregon', 1),(2,'Greensprings', 1, 95, 'Easy', 'Southern Oregon', 2);
/*!40000 ALTER TABLE `Routes` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `Tours`
--

DROP TABLE IF EXISTS `Tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Tours` (
  `tour_ID` INT(11) NOT NULL AUTO_INCREMENT,
  `route` INT(11) NOT NULL,
  `rider` INT(11) NOT NULL,
  PRIMARY KEY (`tour_ID`),
  KEY `rider` (`rider`),
  KEY `route` (`route`),
  CONSTRAINT `Tours_ibfk_1` FOREIGN KEY (`rider`) REFERENCES `Riders` (`rider_ID`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `Tours_ibfk_2` FOREIGN KEY (`route`) REFERENCES `Routes` (`route_ID`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `Tours`
--

LOCK TABLES `Tours` WRITE;
/*!40000 ALTER TABLE `Tours` DISABLE KEYS */;
INSERT INTO `Tours` VALUES(1, 1, 1),(2,2,2);
/*!40000 ALTER TABLE `Tours` ENABLE KEYS */;
UNLOCK TABLES;




/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
