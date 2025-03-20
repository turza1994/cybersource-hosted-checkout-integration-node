const crypto = require('crypto')

/**
 * Generate HTTP Signature Token for Cybersource
 * @param {string} method - HTTP method (e.g., GET, POST)
 * @param {string} targetPath - API endpoint path
 * @param {string} host - API host (e.g., apitest.cybersource.com)
 * @param {string} secretKey - Your shared secret key
 * @param {string} keyId - Your API Key ID
 * @returns {string} - Authorization header value
 */
function generateToken(method, targetPath, host, secretKey, keyId) {
  const date = new Date().toUTCString() // RFC 7231 date format
  const stringToSign = `${method} ${targetPath} HTTP/1.1\nhost: ${host}\ndate: ${date}`

  // Generate HMAC-SHA256 signature
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(stringToSign)
    .digest('base64')

  // Construct the Authorization header
  return `Signature keyid="${keyId}", algorithm="HmacSHA256", headers="host date", signature="${signature}"`
}

// Example usage
const method = 'GET'
const targetPath = '/tss/v2/transactions/7369220967986599303006'
const host = 'apitest.cybersource.com'
const secretKey =
  'cbe78a3c02c04648ad097d256231c57237f86fa500bb4fecb4122aeb7b9b445a21dfa10fad254078aecb4edcb2ca4410d0c10cd5a96b4a7cbb1a938415cd326e36e5eb20ff734717a810a70c09a6be178427db7bff594f7cbc91533ca2a5df92cb95ab970e1640a6a698d955aa09a6cad02b6c32bdbc45c4b6655996b93e970a'
const keyId = '1900429862053313bc5df172286d77d5'

const token = generateToken(method, targetPath, host, secretKey, keyId)
console.log('Authorization:', token)
