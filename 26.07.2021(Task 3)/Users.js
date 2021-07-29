const fetch = require('node-fetch');

export default class Users {
  constructor(N) {
    this.url = 'https://randomuser.me/api/';
    this.users = [];
    this.amountOfUsers = N;
  }

  async getUsers() {
    let results = [];
    let jsons = [];
    for (let i = 0; i < this.amountOfUsers; i += 1) {
      results.push(fetch(this.url));
    }
    results = await Promise.all(results);
    jsons = results.map((item) => item.json());
    jsons = await Promise.all(jsons);
    jsons.forEach((item) => {
      this.users.push(item);
    });
    this.showInfo();
  }

  showInfo() {
    this.users.forEach((user) => {
      Object.entries(user.results[0]).forEach((i) => {
        if (i[1] instanceof Object) {
          console.log(`${i[0]} : `);
          Object.entries(i[1]).forEach((j) => {
            if (j[1] instanceof Object) {
              console.log(`${j[0]} : `);
              Object.entries(j[1]).forEach((k) => {
                console.log(`${k[0]} : ${k[1]} , `);
              });
            } else {
              console.log(`${j[0]} : ${j[1]} , `);
            }
          });
        } else {
          console.log(`${i[0]} : ${i[1]}`);
        }
      });
    });
  }
}
