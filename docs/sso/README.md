# Single Sign-on

## Frontend process

1) The user signs in using his GitHub account 
	
2) The frontend application receives the GitHub token with the user's information, such as email address, name, username, profile image, etc.
	 
3) Then, the front-end application sends a request to CKAN containing the user's email address, username, GitHub token, and a secret that allows CKAN to identify whether the application that is sending the request is the frontend application or not 
	
4) CKAN responds with an API token that can be used by the user

## Backend process 

1) CKAN receives the data sent by the frontend and validates first the secret to check if the stored secret in CKAN matches the received one ensuring that the application that is sending the request is the frontend application or not 

2) CKAN verifies the user's token to check if it's a token generated from GitHub.

3) If the user's email isn't registered it creates an account using the user's email and username, generates an API token for the created user, and return it to the frontend. If the user email is already registered it generates an API token for the user and return it to the frontend.
