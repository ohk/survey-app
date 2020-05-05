# Name

Survey App Backend

## Project Details

This project is the backend for a survey application. This is a university project (Yıldız Technical University - Computer Engineering).

## Documentation
[Documentation](https://documenter.getpostman.com/view/11038074/SzmZbfZC?version=latest)

## Features

-   The user can register to the system.
-   The user can create a survey in the system.
-   The survey may include multiple choice, elective, and fill in questions.
-   The user can answer the questionnaires in the system.
-   The user can determine how many people can answer for the survey.
-   The user can make the survey irreplaceable.
-   User can make the survey accessible only by link
-   The user can delete the poll.
-   The user can see a summary of the responses to the survey.
-   The user can extract the answers in the survey in xlsx or csv format.

## Prerequisites

Nodejs and mongodb are required for the project to work.
After downloading mongodb and nodejs, run the command `npm i` to load the project requirements.

## Usage

Once all the requirements are installed, we need to edit the .env file.
The template of the .env file is as follows

```
MONGODB_URI = DATABASE URL
PORT = PORT NUMBER
TOKEN_SECRET = SECRET KEY FOR HASH
```

After all, you can run the project by running the

```
npm run dev
```

command.

## Built With

-   [@hapi/joi](https://www.npmjs.com/package/@hapi/joi): "^17.1.1", For validate the request data
-   [bcryptjs](https://www.npmjs.com/package/bcryptjs): "^2.4.3", For hash the password
-   [dotenv](https://www.npmjs.com/package/dotenv): "^8.2.0", For control the environment
-   [express](https://www.npmjs.com/package/express): "^4.17.1", Express :)
-   [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): "^8.5.1", For tokenize the user
-   [mongoose](https://www.npmjs.com/package/mongoose): "^5.9.7", Control the mongoDB

## Deployment

It will be added soon

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Support

If you have any questions about the project, feel free to contact me.

> Email: hamidkamisli@icloud.com

> Social media: @ohkamisli

## Authors

-   **Ömer Hamid Kamışlı** - _Initial work_ - [ohkamisli](https://github.com/ohkamisli)

## TODOS

-   [x] User
-   [x] Survey
-   [x] Answer
-   [x] Result
-   [x] Export
-   [x] Documentation
