# Project Description

Web application that provides a phonebook.

The application handles a set of entries, that contain a first name, last name, and a telephone number.

The application consists of the following pages:

1. Home page
    - Contains a text field that allows to search through all the entries by name or number. When I enter text in the field, the page will be reloaded with a table containing all the entries that match the text I entered.
    - The page contains a link to the "add new entry" page.
    - When an entry is displayed, it contains a link to the "edit this entry" page.
![alt text](https://github.com/joangerard/agenda/blob/master/screenshots/all.png)
2. Add new contact
    - Contains a form for entering a new entry.

![alt text](https://github.com/joangerard/agenda/blob/master/screenshots/save.png)

3. Edit entry page
    - Contains a form for modifying an existing entry.

# Technologies

An API was created using NodeJS, MongoDB and Mongoose. The project can be found in the `agenda-server` directory.
A client that consumes the API was created using Angular 9. The project can be found in the `agenda-cli` directory.

An overview of the architecture used is shown below:

![alt text](https://github.com/joangerard/agenda/blob/master/screenshots/architecture-overview.png)

# Installation Guide

## Prerequisites:
You need to have installed MongoDB on your local machine. Follow this guide if you do not have it installed: https://docs.mongodb.com/manual/installation/

You need to have `npm` + `node.js` installed on your local machine. More info: https://www.npmjs.com/get-npm.


## Install Data Base

Usually the projects should use migrations in order to add/update/edit new collections but this project contains only one collection 
and thus the database will be exported manually through command line.


First import the database from `agenda-server/db` directory executing the following command into a terminal.

    cd agenda-server
    mongoimport --db agenda --collection contacts \
       --authenticationDatabase admin --username <user> --password <password> \
       --drop --file db/contacts.json
       
Replace `<user>` and `<password>` by your own local user and password. In the case that your local DB does not have configured authentication execute the following command:

    mongoimport --db agenda --collection contacts \
       --drop --file db/contacts.json

Once the commands were executed the brand new data base should appear on the list of your databases with a collection called contacts that contains some
documents already.

Then open the agenda-server directory and create a file called `.env` with the following text:

    DATABASE=mongodb://localhost:<port>/agenda
    
Replace `<port>` by the port number in which MongoDB is running. The default one is 27017. Thus the command would be:

    DATABASE=mongodb://localhost:27017/agenda
    

## Run the server

First install all the project dependencies. Execute the following command:

    cd agenda-server
    npm install
    
Run the server:

    npm run watch
    
The server should run under the address: `http://localhost:3000`. To verify if it is running open your browser and type `http://localhost:3000/api/v1/contact/all`. You should see all the contacts that are in the database in JSON format.
    
Run tests:

    npm test
    
In order to test the API a postman file can be found in `agenda-server/agenda.postman_collection.json`. This file can be easily imported in Postman.

## Run the client

First install all the project dependencies. Execute the following command:

    cd agenda-cli
    npm install
    
Run the client:

    ng serve --proxy-config proxy.config.json

In order to verify if it is working open your browser and type: `http://localhost:4200`. You should see a list of all your contacts.

Run tests: 

    ng test
    
A code coverage complete report will be created under the `agenda-cli/coverage` directory.


# Future improvements and some remarks

Usually the Repositories (in server) should transform the DbModel into a BusinessModel and viceversa. This is because sometimes the DbModels contains some data that we do not need to pass to the clients (like encrypted passwords) but since the project is small enough this mapping work was avoided.

The API does not have any authentication mechanism and thus everybody can consume the data. Usually in PRO projects an authentication mechanism is highly recommended to avoid attacks (using OAuth for ex.).

The API is not Full Rest API since when we get the contacts we should make a `GET /api/v1/contacts/` insted of `GET /api/v1/contact/all`. (We should correct it for future versions :) )

No log mechanism was implemented: this is VERY important tool when we need to debugg server side production applications. For instance, external services are used ex. DATALOG. 

There are no integration nor E2E tests.

Some patterns were applied while programming. Dependency Injection throught the `OrchestratorDi` class and Single Responsability (as much as possible).

The code should be self explanatory in most of the cases and if it is not it should have a comment. Usually in PRO applications all the classes and methods should be commented in order to generate the documentation files automatically (using JSDoc for example).

If the contact list one day is big enough, retrieving ALL this data from the server can take a while so a better implementation would be to use pagination and retrieve the data in small batches.

The contact list could be ordered by name.
