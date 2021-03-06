'use strict'
require('css-modules-require-hook')({
  generateScopedName: '[path][name]'
})
require('babel-register')(require('./build/node-babel-config.json'))

var server = require('./src/server/server.js').default
var httpServer = server.listen(3000, function(err) {
  if (err) return console.log(err)
  console.log('Listening at http://%s:%d', 'localhost', '3000')
})

require('./src/server/middleware/hmr.js')

// // Do "hot-reloading of API stuff on the server"
// // Throw away the cached server modules and let them be re-required next time
var chokidar = require('chokidar')
var path = require('path')
var watcher = chokidar.watch(path.join(__dirname, './src/'));
watcher.on('ready', function() {
  watcher.on('change', function() {
    let restartServer = false
    Object.keys(require.cache).forEach(function(id) {
      if (id.includes('/server/') || id.includes('/shared/')) {
        delete require.cache[id]
      }
    })
    httpServer.close()
    httpServer = require('./src/server/server.js').default.listen(3000, function(err) {
      if (err) return console.log(err)
      restartServer = false
      console.log('Restarted server at http://%s:%d', 'localhost', '3000')
    })
  })
})

