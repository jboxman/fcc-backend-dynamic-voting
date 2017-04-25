# TODO

- Split repo for server + React
- Use Mongoose populate to look up createdBy references
- Incorporate HMR setup from react-slingshot if possible
- Experiment with Chart.js & sample poll object
  ```
  { _id: 58ff3f455fc7288e85440b07,
  updatedAt: 2017-04-25T12:21:25.876Z,
  createdAt: 2017-04-25T12:21:25.814Z,
  question: 'What is your name?',
  createdBy: 58ff3f455fc7288e85440b06,
  __v: 0,
  answers:
   [ { createdBy: 58ff3f455fc7288e85440b06,
       text: 'Bob',
       _id: 58ff3f455fc7288e85440b0a,
       voteCount: 7 },
     { createdBy: 58ff3f455fc7288e85440b06,
       text: 'Frank',
       _id: 58ff3f455fc7288e85440b09,
       voteCount: 3 },
     { createdBy: 58ff3f455fc7288e85440b06,
       text: 'Jackie',
       _id: 58ff3f455fc7288e85440b08,
       voteCount: 15 } ],
  viewCount: 1 }
  ```
- Setup & test some kind of Passport authentication
- Add my-polls for authenticated user - display own user polls
- Wrap authenticated-only routes
