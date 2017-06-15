# simple-node-rest-api
This is a simple project to try out to build REST APIs with node.js and dockerize them

Ref: https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai


#Dockerize the app
$ docker build -t pfari/simple-node-rest-api .

#Run the image
$ docker run -p 49160:8080 -d pfari/simple-node-rest-api

# Get container ID
$ docker ps

# Print app output
$ docker logs <container id>

# Example
Running on http://localhost:8080
If you need to go inside the container you can use the exec command:

# Enter the container
$ docker exec -it <container id> /bin/bash
