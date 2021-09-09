// Copyright IBM Corp. 2016,2019. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const loopback = require('loopback');
const boot = require('loopback-boot');
const moment = require('moment');
const format = require('../utils/format');
const Handlebars = require('handlebars');
const app = module.exports = loopback();
const {ToWords} = require('to-words');

app.start = function() {
  Handlebars.registerHelper('formatDate', (value) => {
    const m = moment(value);
    if (m.isValid()) {
      return m.format('DD/MM/YYYY');
    }
    return '';
  });

  Handlebars.registerHelper('formatMonth', (value) => {
    const m = moment(value);
    if (m.isValid()) {
      return m.format('MM/YYYY');
    }
    return '';
  });

  Handlebars.registerHelper('formatNumber', (value) => {
    if (isNaN(value)) {
      return value;
    }
    return format.number(value);
  });
  Handlebars.registerHelper('Plus', (value) => {
    return format.number(++value);
  });
  Handlebars.registerHelper('toWords', (value) => {
    if (typeof value === 'number') {
      let wordNumber = VNnum2words(Number(value));

      return wordNumber.charAt(0).toUpperCase() + wordNumber.slice(1) + ' đồng';
    }

    return value;
    // return wordNumber.charAt(0).toUpperCase() + wordNumber.slice(1);
  });
  Handlebars.registerHelper('toWordsUs', (value) => {
    const toWords = new ToWords({
      localeCode: 'en-US',
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
      },
    });
    if (typeof value === 'number') {
      let wordNumber = toWords.convert(Number(value));

      return wordNumber.charAt(0).toUpperCase() + wordNumber.slice(1);
    }

    return value;
    // return wordNumber.charAt(0).toUpperCase() + wordNumber.slice(1);
  });
  // start the web server
  return app.listen(function() {
    app.emit('started');
    const baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
