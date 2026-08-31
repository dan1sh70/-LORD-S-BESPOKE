# LORD'S BESPOKE ALTERATION ERP - Backend

## Getting Started

1. **Start MongoDB**:
   Ensure Docker is running, then from the root of the project:
   ```bash
   docker-compose up -d
   ```

2. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Seed Database**:
   ```bash
   npm run seed
   ```

4. **Start Server**:
   ```bash
   npm run dev
   ```

## Milestone 2: Testing the State Machine

You can test the core order state transitions using `cURL` or Postman.

### 1. Login as a Shop
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9000000001", "password":"password123"}'
```
*Copy the `accessToken` from the response.*

### 2. Create an Order (As Shop)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <SHOP_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "<ANY_OBJECT_ID>",
    "garmentType": "Suit",
    "priority": "NORMAL",
    "deliveryDate": "2026-09-01T00:00:00.000Z"
  }'
```
*Copy the `_id` of the created order. The order is now in `CREATED` status.*

### 3. Transition to PICKUP_REQUESTED (As Shop)
```bash
curl -X PATCH http://localhost:5000/api/orders/<ORDER_ID>/transition \
  -H "Authorization: Bearer <SHOP_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"nextStatus": "PICKUP_REQUESTED"}'
```

### 4. Try to Transition to PICKUP_ASSIGNED (As Shop - Should Fail!)
The guard blocks Shops from doing this. Only Master/SuperAdmin can.
```bash
curl -X PATCH http://localhost:5000/api/orders/<ORDER_ID>/transition \
  -H "Authorization: Bearer <SHOP_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"nextStatus": "PICKUP_ASSIGNED"}'
```
*You will receive a 409 Conflict: "Role SHOP is not permitted..."*

### 5. Login as Master and Transition to PICKUP_ASSIGNED
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"mobile":"8000000001", "password":"password123"}'
```
*Copy the `<MASTER_TOKEN>`.*

```bash
curl -X PATCH http://localhost:5000/api/orders/<ORDER_ID>/transition \
  -H "Authorization: Bearer <MASTER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"nextStatus": "PICKUP_ASSIGNED", "deliveryBoyId": "<DELIVERY_BOY_OBJECT_ID>"}'
```
