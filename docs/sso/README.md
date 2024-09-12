# Single Sign On


## Frontend process

The user sign in using his GitHub account, and we receive the GitHub token with his information as email, name, username, image, etc., after we send the email, username, GitHub token, and a secret to identify the application which is sending the request is our frontend nor other one trying to sign in using our CKAN, after that receiving the response we use the API token to communicate with CKAN identifying him.

## Backend process 

In CKAN we receive the data sent by the front and validate first the secret to check if the stored secret in CKAN matches the received one, after that we verify the token to check if it's a token generated from GitHub.

If the user's email isn't registered we create an account using his email and username, generate an API token for this created user, and return it to the frontend use.

If the user email is already registered we generate an API token for this user and return it to the frontend use.