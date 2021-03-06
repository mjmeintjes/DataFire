const datafire = require('datafire');
const fs = require('fs');
const github = datafire.Integration.new('github').as('default');

const flow = module.exports =
      new datafire.Flow('Get User', 'Copies the logged in user to a local file');

flow.step('user', {
  do: github.get('/user'),
  finish: data => {
    fs.writeFileSync('./user.json', JSON.stringify(data.user, null, 2));
  }
})
