# Maplecodex2 (Spring boot implementation)
## Dark Mode Preview
![dark-mode](/dark.jpg)

## Light Mode Preview
![light-mode](/light.jpg)

## Description
### Here I re-coded the website project with spring boot and added some of new features, such as filter by type and slot, add item to favourite and so on. 
## Set Up
### First you'll need to parse data with original Maplecodex2 version(see here: https://github.com/Sparkymod/Maplecodex2) and import "ms2codex.sql"  
### Then you have several options to set in `/src/main/resources/application.properties`: 
```
server.port=80                                                            // refer to which port to launch the site
storage.iconLocation=F:\\MapleStory2\\Maplecodex2\\Maplecodex2\\wwwroot   // refer to where icon folder is
spring.datasource.url=jdbc:mysql://192.168.0.120:3306/ms2codex            // refer to your mysql db IP and database name
spring.datasource.username=root                                           // refer to db user name
spring.datasource.password=123456                                         // refer to db user password
```
## Last, make sure you have JDK version above or equal to 11 installed on your local machine.