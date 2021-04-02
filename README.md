# mongo_node
Task related to job offer at Walter Code

# Requirements
- Docker desktop (if Windwos user)
- Some code editor (VS code)
- Node js
- Run it in dev mode or in docker containers with docker-compose

## Run it in dev mode
- Clone repository mongo_node.git 
- Hit npm i in this repository
- Copy this command: 
```docker run -d -p 27017-27019:27017-27019 -v /data/db:/data/db --name mongodb mongo:latest``` into your bash 
- Now we have our DB, so lets return to the project
- Hit node app.js and there you go 
- Now you can change the code and test different things and see how things work. 

## Run it in docker
- Simple ``docker-compose`` up will do the trick 

Thanks for attention. 