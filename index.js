const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const cors = require('cors')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(cors())

//BRAC
// const PROFILE_ID = 'B5454FD4-3C23-4279-9461-82E6C01E658C'
// const ACCESS_KEY = 'ce1dccc4721630e6babce8f87faaf6d2'
// const SECRET_KEY =
//   '08afec21a5ae4fbea1cde52394d3e35e7e9e97f2e1fd4b65a9401c8bd67fd3e1ec6b3e3ea93348d3a68fb5b47ca57fb187c39526652b4460ab1e015089737db989754c6492fd4c9aa7bfd5836e20526aa6d3f4beb57c4d25b07f516bb11f1623cb70fd8d08b842f680217873922607646568c2a346194fc789ed6f8adf535128'

//EBL
const PROFILE_ID = '09894754-E691-4576-99C9-132B96768E7B'
const ACCESS_KEY = 'be0f3d8d89e83d2389d941c1b3302e0c'
const SECRET_KEY =
  '0f046a827d6d40748925093ff5c1574bfa9c6bcae43441efb4ab83f2ac2db69634fe6b4ddb2b48aa921b226031aa97d5d9a6e46b5cb74e00983d99e886e79e4c2b8619a94b5c41cbb44add314f5d91f6406324ab896c43fa926c67b8339a1c0a4cd2720e0423464eb058aea87988e78445a48d71b26948aebd29d6f7cfe5216a'

function generateSignature(fields, secretKey) {
  const signedFields = fields.signed_field_names.split(',')
  const dataToSign = signedFields
    .map((field) => `${field}=${fields[field]}`)
    .join(',')
  return crypto
    .createHmac('sha256', secretKey)
    .update(dataToSign)
    .digest('base64')
}

function convertToSignatureDate(d) {
  const [isoDate] = d.toISOString().split('.')

  return `${isoDate}Z`
}

app.get('/checkout', (req, res) => {
  const transaction_uuid = crypto.randomUUID()

  const fields = {
    access_key: ACCESS_KEY,
    profile_id: PROFILE_ID,
    transaction_uuid,
    signed_field_names:
      'access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,transaction_type,reference_number,amount,currency,locale,signed_date_time,override_custom_receipt_page',
    unsigned_field_names:
      'bill_to_forename,bill_to_surname,bill_to_address_line1,bill_to_address_state,bill_to_address_city,bill_to_address_country,bill_to_email,bill_to_address_postal_code,override_custom_cancel_page',
    transaction_type: 'sale',
    reference_number: `ORDER-${Date.now()}`,
    amount: '100.00',
    currency: 'bdt',
    locale: 'en-us',
    override_custom_receipt_page: 'http://localhost:3000/success',
    override_custom_cancel_page: 'http://localhost:3000/cancel',
    bill_to_forename: 'NOREAL',
    bill_to_surname: 'NAME',
    bill_to_address_line1: '1295 Charleston Road',
    bill_to_address_state: 'CA',
    bill_to_address_city: 'Mountain View',
    bill_to_address_country: 'US',
    bill_to_email: 'null@cybersource.com',
    bill_to_address_postal_code: '94043',
    signed_date_time: convertToSignatureDate(new Date()),
  }

  fields.signature = generateSignature(fields, SECRET_KEY)

  // Generate verbose cURL command
  let curlCommand = `curl -X POST "https://testsecureacceptance.cybersource.com/pay" \\\n`
  for (const [key, value] of Object.entries(fields)) {
    curlCommand += `  -d "${key}=${value}" \\\n`
  }
  curlCommand += `  -v` // Verbose mode

  console.log('Equivalent cURL Request:\n', curlCommand)

  res.render('checkout', {
    fields,
    actionUrl: 'https://testsecureacceptance.cybersource.com/pay',
  })
})

app.post('/success', (req, res) => {
  console.log(req.body)
  console.log(req.statusCode)
  res.send('success')
})

app.post('/cancel', (req, res) => {
  console.log(req.body)
  res.send('cancel')
})

app.post('/api/bkash/payment/callback', (req, res) => {
  console.log(req.body)
  console.log(req.query)
  console.log(req.params)
  res.send('Bkash')
})

app.post('/notify', (req, res) => {
  res.status(200).json({ test: 'OK' })
})

app.post('/dm/api/v1/local/files', (req, res) => {
  // res.status(200).json({ path: '1739698183238_images.png' })
  res.status(200).json({
    success: true,
    path: '1739698183238_images.png',
  })
})

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000')
})
