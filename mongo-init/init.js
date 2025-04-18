db = db.getSiblingDB('familytree');
db.people.insertMany([
  {
    "_id": ObjectId("54f758f3f6a4810a19c3b258"),
    "lastName": "Skywalker",
    "firstName": "Anakin",
    "gender": "M",
    "avatarUrl": "http://pixel.nymag.com/imgs/daily/vulture/2015/12/28/28-hayden-christensen-anakin.w960.h960.jpg",
    "menuTab": true
  },
  {
    "_id": ObjectId("54f759141138b91019e18e45"),
    "lastName": "Amidala",
    "maidenName": "Amidala",
    "firstName": "Padmé",
    "gender": "F",
    "spousesIds": ["54f758f3f6a4810a19c3b258"],
    "avatarUrl": "https://phantom-marca.unidadeditorial.es/ab0c520d9ab57f41d4bf38916b89d666/resize/828/f/jpg/assets/multimedia/imagenes/2025/01/22/17375497663734.jpg"
  },
  {
    "_id": ObjectId("54f759141138b91019e18e46"),
    "lastName": "Skywalker",
    "firstName": "Luke",
    "gender": "M",
    "fatherId": "54f758f3f6a4810a19c3b258",
    "motherId": "54f759141138b91019e18e45",
    "avatarUrl": "https://anniversaire-celebrite.com/upload/250x333/luke-skywalker-250.jpg"
  },
  {
    "_id": ObjectId("54f759141138b91019e18e47"),
    "lastName": "Solo",
    "maidenName": "Organa",
    "firstName": "Leia",
    "gender": "F",
    "fatherId": "54f758f3f6a4810a19c3b258",
    "motherId": "54f759141138b91019e18e45",
    "spousesIds": ["54f759141138b91019e18e48"],
    "avatarUrl": "http://3.bp.blogspot.com/-29FEw7dAn3E/UE40fFnYgGI/AAAAAAAAFyY/DVjFE7BxpNc/s200/princess-leia-2.jpg"
  },
  {
    "_id": ObjectId("54f759141138b91019e18e48"),
    "lastName": "Solo",
    "firstName": "Han",
    "gender": "M",
    "avatarUrl": "http://img1.wikia.nocookie.net/__cb20100806150756/starwars/images/b/b7/HanSolo-Headshot-New.jpg"
  },
  {
    "_id": ObjectId("54f759141138b91019e18e49"),
    "lastName": "Skywalker",
    "maidenName": "Jade",
    "firstName": "Mara Jade",
    "gender": "F",
    "avatarUrl": "http://img2.wikia.nocookie.net/__cb20061129193816/es.starwars/images/d/de/Survivorsquest.jpg"
  },
  {
    "_id": ObjectId("54f759141138b91019e18e50"),
    "lastName": "Skywalker",
    "firstName": "Ben ",
    "gender": "M",
    "fatherId": "54f759141138b91019e18e46",
    "motherId": "54f759141138b91019e18e49",
    "avatarUrl": "http://img2.wikia.nocookie.net/__cb20090820055233/starwars/images/6/66/BenSkywalker_Atlas.jpg"
  }
]);
