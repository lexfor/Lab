/* eslint-disable no-await-in-loop */
const fetch = require('node-fetch');

export default class Users {
  constructor(N) {
    this.url = 'https://randomuser.me/api/';
    this.users = [];
    this.amountOfUsers = N;
  }

  async getUsers() {
    for (let i = 0; i < this.amountOfUsers; i += 1) {
      const response = await fetch(this.url);
      const json = await response.json();
      const parser = JSON.stringify(json);
      this.users.push(JSON.parse(parser));
      this.showInfo(this.users[i]);
    }
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
