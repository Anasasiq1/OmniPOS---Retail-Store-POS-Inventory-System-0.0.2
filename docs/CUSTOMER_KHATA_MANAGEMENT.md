# Customer Khata (Credit Ledger) Lifecycle & Accounting Guide

## 1. Customer Khata Lifecycle Management

The Customer Khata module provides a complete, double-entry financial ledger for managing merchant-to-customer store credit.

### Account Status Flow:
1. **Account Creation**: Customer is registered with basic details, optional Opening Balance, and Credit Limit.
2. **Active Cycle**: Credit purchases (`Debit`) and Cash/UPI settlements (`Credit`) are logged with real-time balance calculations.
3. **Zero Balance / Cleared**: When the customer settles all outstanding dues and `netBalance === 0`, the merchant has the option to:
   - Keep the account active for ongoing walk-in transactions.
   - **Archive/Close Khata**: Moves `khataStatus` to `disabled`, preserving complete historical transaction audit trails.
4. **Re-enabling Closed Khata**: At any time, clicking **"Start New Credit Cycle"** restores the active Khata status to allow new credit sales.

---

## 2. Ledger Transaction Schema

Every ledger entry records:
* `id`: Unique transaction identifier (`ktx-...`)
* `date` & `time`: Timestamp of transaction
* `type`: `credit` (Credit given / Debit customer), `payment` (Settlement received), or `adjustment`
* `amount`: Transaction value
* `balanceAfter`: Cumulative running balance after this transaction
* `paymentMethod`: `cash`, `upi`, `card`, `bank`, `cheque`
* `reference`: Invoice ID, receipt number, or UPI transaction reference
* `recordedBy`: Name and role of the logged-in staff member who processed the transaction
* `notes`: Additional notes or justifications

---

## 3. Financial Integration
When a customer settles a Khata payment:
* The customer's `netBalance` is reduced.
* An entry is automatically logged to the **Daily Accounts** ledger under **Credit Collection Income**, ensuring real-time Profit & Loss and Cash in Hand integrity.

---

## 4. Excel / CSV Data Schema

### Export Format:
* **Customer Summary Export**: `Customer ID, Customer Name, Phone Number, Email, Address, Status, Khata Status, Current Balance (INR), Credit Limit (INR), Total Credit (INR), Total Paid (INR), Last Activity, Created Date, Notes`
* **Single Customer Ledger Statement**: `Date, Time, Transaction ID, Type, Debit / Credit (₹), Payment Received (₹), Net Balance After (₹), Reference / Bill, Payment Mode, Recorded By, Description, Notes`

### Import Format (CSV):
Headers: `Customer Name, Phone Number, Opening Balance, Credit Limit, Email, Address, Notes`
