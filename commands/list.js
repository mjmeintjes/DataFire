const fs = require('fs');
const path = require('path');
const request = require('request');
const chalk = require('chalk');
const datafire = require('../index');
const logger = require('../lib/logger');

const INTEGRATION_LOCATIONS = require('../lib/locations').integrations;

const INTEGRATION_LIST_URL = "https://raw.githubusercontent.com/DataFire/Integrations/master/list.json";
const getAllIntegrations =  (callback) => {
  if (process.env.DATAFIRE_REGISTRY_DIR) {
    let list = require(process.env.DATAFIRE_REGISTRY_DIR + '/list.json');
    callback(null, list);
  } else {
    request.get(INTEGRATION_LIST_URL, {json: true}, (err, resp, body) => {
      callback(err, body);
    })
  }
}

module.exports = (args) => {
  if (args.all) {
    getAllIntegrations((err, list) => {
      if (err) throw err;
      let keys = Object.keys(list);
      keys.forEach(k => {
        let api = list[k];
        if (args.query && !integrationMatchesQuery(k, api, args.query)) return;
        logger.logIntegration(k, {info: api});
        logger.log();
      });
    });
  } else {
    INTEGRATION_LOCATIONS.forEach(dir => {
      fs.readdir(dir, (err, dirs) => {
        if (err) {
          if (err.code === 'ENOENT') return;
          throw err;
        }
        dirs.forEach(name => {
          logger.log(chalk.magenta(name));
        })
      })
    });
  }
}

const integrationMatchesQuery = (name, info, query) => {
  let searchText = name;
  if (info.title) searchText += info.title;
  if (info.description) searchText += info.description;
  searchText = searchText.toLowerCase();
  query = query.toLowerCase();
  return searchText.indexOf(query) !== -1;
}
