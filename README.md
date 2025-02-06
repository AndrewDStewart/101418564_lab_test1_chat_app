Lab Test 1

The way I set up the app was by initially using Node.js with Express to create a web server. From there, I used Socket.io for real-time communication between the server and clients. I added the use of MongoDB to store user information and chat messages. 
This is where I added User Authentication. Users can sign up witha first name, last name, and password, along with being able to pick their username. They can login with their username and password, and only once they are logged in can they chat. 
The app has predefined chat rooms(devops, cloud computing, covid19, sports and nodeJS) and when a user joins a room, they're added to that room's Socket.io channel. 
Users can send messages to one another within their current room. When a message is sent, it's saved to the MongoDB databsed and then broadcast to all the users in the room. 
The frontend is built with HTML, CSS and JavaScript (with jQuery for DOM manipulation)
It has separate pages for login, signup and the main chat interface.
The UI updates in real-time. 
User Actions (ie. sending a message) trigger events on the client side. These events are sent to the server via Socket.io.

Thank you for reading my summary of this chat app, I've attached screenshots on the functionality in a pdf and put them in a folder in this project, but I've also submitted them (the instructions were slightly unclear as to where the screenshots should go specifically)
