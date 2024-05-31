# family tree

## install

```
npm i
```

## start dev server

```
docker compose up
npm start

// example with env vars
ACCESS_USERS="myuser:mypassword:5b47c1eb252696382be9daae;otheruser:otherpassword:" DB_URL="mongodb://localhost:27017" DB_NAME=familytree npm start
```

## build prod files

```
npm run build
```

## troubleshooting

During `npm i`, if an error is faced about "ModuleNotFoundError: No module named 'distutils'" (node-sass setup), let's run `brew install python-setuptools`.
