module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '3.6.1',
      skipMD5: true
    },
    instance: {
      dbName: 'jest'
    },
    autoStart: false
  }
}
