# simple-node-rest-api
Simple project of dockerized REST service implemented with node.js and express.

## App
### Installing Dependencies
```shell
$ npm install
```
### Running Tests
```shell
$ npm test
```
### Run the App
```shell
$ npm start
```
The app will be running on http://localhost:8080

## Docker
### Dockerize the app
```shell
$ docker build -t pfari/simple-node-rest-api .
```
### Run the image
```shell
$ docker run -p 49160:8080 -d pfari/simple-node-rest-api
```
### Get container ID
```shell
$ docker ps
```
### Print app output
```shell
$ docker logs <container id>
```
### Enter the container
```shell
$ docker exec -it <container id> /bin/bash
```
