# Protea-Meetup
MVD token staked event leveraging Makoto's NoBlockNoParty contracts as a basis. 

While not the final UI, core functionality is available for users to create & publish events using an early version of Protea Token.

## Front end
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.3.

## AWS ElasticBeanstalk Deployment

The Protea Meetup web app is deployed using a Docker container to AWS ElasticBeanstalk.

### Initialize Protea Application

`eb init protea --profile eb-cli-linumlabs -p docker`

### Create Protea-Meetup Environment

`eb create protea-meetup --profile eb-cli-linumlabs`

### Deploy Application

`eb deploy`

### Check Application Status

`eb status`