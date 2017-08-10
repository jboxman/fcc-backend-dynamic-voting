# Using the API directly

In development mode it's possible to use the API directly.
This is possible because the authentication is mocked.

First, authenticate.

```
curl -c cookies.txt http://localhost:4000/users/auth/github/callback
```

Then, make API calls as normal.

```
curl -b cookies.txt \
  -H 'Content-Type: application/json' -X POST \
  -T test/fixtures/json/create-poll.json \
  http://localhost:4000/polls/create
```

Enjoy.
