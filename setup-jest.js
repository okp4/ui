import 'web-streams-polyfill'

const nodeCrypto = require('crypto')
window.crypto = {
  getRandomValues: function (buffer) {
    return nodeCrypto.randomFillSync(buffer)
  }
}
