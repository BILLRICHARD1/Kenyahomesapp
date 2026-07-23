/**
 * mpesa.js — Safaricom Daraja API service
 * Handles OAuth token generation and STK Push initiation
 */

const axios = require('axios');

const SANDBOX_BASE = 'https://sandbox.safaricom.co.ke';
const LIVE_BASE    = 'https://api.safaricom.co.ke';

const BASE_URL = process.env.MPESA_ENV === 'production' ? LIVE_BASE : SANDBOX_BASE;

// ─── OAuth: get a fresh access token ─────────────────────────────────────────
// Tokens expire after 1 hour. We cache the current one and refresh when stale.
let cachedToken   = null;
let tokenExpiry   = 0;

const getAccessToken = async () => {
    const now = Date.now();
    if (cachedToken && now < tokenExpiry) return cachedToken;

    const credentials = Buffer.from(
        `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const res = await axios.get(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: { Authorization: `Basic ${credentials}` },
    });

    cachedToken  = res.data.access_token;
    tokenExpiry  = now + (res.data.expires_in - 60) * 1000; // refresh 60s before real expiry
    return cachedToken;
};

// ─── Build the Base64 password required by Daraja ────────────────────────────
// password = base64(shortcode + passkey + timestamp)
const buildPassword = (timestamp) => {
    const raw = `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`;
    return Buffer.from(raw).toString('base64');
};

// ─── Format timestamp: YYYYMMDDHHmmss ────────────────────────────────────────
const getTimestamp = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return (
        `${now.getFullYear()}` +
        `${pad(now.getMonth() + 1)}` +
        `${pad(now.getDate())}` +
        `${pad(now.getHours())}` +
        `${pad(now.getMinutes())}` +
        `${pad(now.getSeconds())}`
    );
};

// ─── Normalise phone to 254XXXXXXXXX format ──────────────────────────────────
const formatPhone = (phone) => {
    const digits = String(phone).replace(/\D/g, '');
    if (digits.startsWith('0'))   return `254${digits.slice(1)}`;
    if (digits.startsWith('254')) return digits;
    if (digits.startsWith('+'))   return digits.slice(1);
    return digits;
};

// ─── Initiate STK Push ───────────────────────────────────────────────────────
/**
 * @param {string} phone       – customer phone (07xx or 2547xx or +2547xx)
 * @param {number} amount      – amount in KES (integer)
 * @param {string} reference   – your internal reference (≤12 chars)
 * @param {string} description – short description shown on the phone prompt
 * @returns Daraja API response data including CheckoutRequestID
 */
const stkPush = async (phone, amount, reference, description) => {
    const token     = await getAccessToken();
    const timestamp = getTimestamp();
    const password  = buildPassword(timestamp);
    const callbackUrl = `${process.env.MPESA_CALLBACK_BASE_URL}/api/v1/payments/mpesa/callback`;

    // MPESA_RECEIVER_SHORTCODE is the Paybill/Till that receives the money.
    // If not set, defaults to MPESA_SHORTCODE (same account initiates & receives).
    const receiverShortcode = process.env.MPESA_RECEIVER_SHORTCODE || process.env.MPESA_SHORTCODE;

    // Use 'CustomerBuyGoodsOnline' for Till numbers, 'CustomerPayBillOnline' for Paybill
    const transactionType = process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline';

    const payload = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password:          password,
        Timestamp:         timestamp,
        TransactionType:   transactionType,
        Amount:            Math.ceil(amount),          // must be a whole number
        PartyA:            formatPhone(phone),         // the customer paying
        PartyB:            receiverShortcode,          // where the money goes
        PhoneNumber:       formatPhone(phone),
        CallBackURL:       callbackUrl,
        AccountReference:  reference.slice(0, 12),    // Daraja limit: 12 chars
        TransactionDesc:   description.slice(0, 13),  // Daraja limit: 13 chars
    };

    const res = await axios.post(
        `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
};

// ─── Query STK Push status (optional — for manual reconciliation) ─────────────
const stkQuery = async (checkoutRequestId) => {
    const token     = await getAccessToken();
    const timestamp = getTimestamp();
    const password  = buildPassword(timestamp);

    const res = await axios.post(
        `${BASE_URL}/mpesa/stkpushquery/v1/query`,
        {
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password:          password,
            Timestamp:         timestamp,
            CheckoutRequestID: checkoutRequestId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
};

module.exports = { stkPush, stkQuery, formatPhone };
