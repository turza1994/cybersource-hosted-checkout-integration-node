# Cybersource Payment Gateway Integration

This repository demonstrates the integration of the Cybersource Secure Acceptance Hosted Checkout payment gateway with a Node.js application. It covers critical aspects of handling `signed_date_time` and `signature` generation, ensuring secure and successful transactions.

---

## Features

- Secure integration with Cybersource Secure Acceptance Hosted Checkout.
- Dynamic signature generation for transaction security.
- Proper handling of `signed_date_time` to avoid errors.
- Routes for handling successful and canceled transactions.
- EJS-based form for initiating payments.

---

## Prerequisites

- **Node.js**: Ensure Node.js is installed on your machine.
- **Cybersource Account**: Obtain a Cybersource Secure Acceptance profile with:
  - `PROFILE_ID`
  - `ACCESS_KEY`
  - `SECRET_KEY`

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/turza1994/cybersource-hosted-checkout-integration-node.git
   cd cybersource-hosted-checkout-integration-node

   ```

2. Install dependencies:

   ```bash
   npm install

   ```

3. Update credentials:

- Replace the PROFILE_ID, ACCESS_KEY, and SECRET_KEY in index.js with your Cybersource credentials.

4. Start the server:

   ```bash
   node index.js

   ```

5. Open the application in your browser:
   ```bash
   http://localhost:3000/checkout
   ```

---

## How It Works

### 1. **Checkout Page**

- A form is rendered with all required Cybersource fields.
- The `signed_date_time` and `signature` are dynamically generated.
- The form is submitted to Cybersource's test environment.

### 2. **Success and Cancel Routes**

- Cybersource redirects to `/success` or `/cancel` based on the transaction result.
- These routes log the response and handle post-payment processing.

---

## Key Concepts

## Signature Generation

The signature ensures transaction security by validating the data sent to Cybersource.

### How It Works

1. The signature is generated using:
   - Comma-separated fields listed in `signed_field_names`.
   - The `SECRET_KEY`.
2. Cybersource reads the `signed_field_names` to identify which fields were signed and generates its own signature. Cybersource then compares its generated signature with the one we provided. If the two signatures match, the transaction proceeds. Otherwise, an authorization error is thrown.

### Implementation

- The `generateSignature` function handles signature creation:

  ```javascript
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
  ```

### `signed_date_time` Issue

The `signed_date_time` field must:

- Be in **ISO 8601 format** with seconds precision.
- Be synchronized with Cybersource's server clock.

#### Solution

- The `convertToSignatureDate` function ensures the timestamp is in the correct format:

  ```javascript
  function convertToSignatureDate(d) {
    const [isoDate] = d.toISOString().split('.')
    return `${isoDate}Z`
  }
  ```

---

## How It Works

### Checkout Page

- A form is rendered with all required Cybersource fields.
- The `signature` and `signed_date_time` are dynamically generated.
- The form is submitted to Cybersource's test environment.

### Success and Cancel Routes

- Cybersource redirects to `/success` or `/cancel` based on the transaction result.
- These routes log the response and handle post-payment processing.

---

---

## Key Fields in the Integration

- **`signed_field_names`**: Determines the fields included in the signature.
- **`signed_date_time`**: Ensures the timestamp is synchronized and formatted correctly.
- **`signature`**: Secures the transaction using HMAC-SHA256.
