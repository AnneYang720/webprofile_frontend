'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://easy-mock.anneyang.me/mock/60e04f49e235063d5506456a/webprofile/"',
  BASE_API: '"http://127.0.0.1:5001"',
})
