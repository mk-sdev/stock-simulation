# Stock simulation app

### How to run

The application can be started with a single command.
If no port is provided, it defaults to **3000**.

#### Linux / macOS (bash)

```bash
./start.sh [PORT]
```

If you encounter a permission error:

```bash
chmod +x ./start.sh
```

Then run the start command again.


#### Windows (PowerShell)

```powershell
.\start.ps1 [PORT]
```

If script execution is blocked:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then run the start command again.

---

Once started, Docker creates containers for the application, database, and load balancer. Three application instances are launched and traffic is distributed between them via Nginx. Failed instances are automatically restarted.

## Stack

- **NestJS**
- **Redis**
- **Nginx**
- **Docker**

## `/src` structure

The app was build following the separation of concerns principle:

- **main.ts** – application entry point, bootstraps the NestJS app
- **stock.module.ts** – registers controllers and providers
- **stock.controller.ts** – defines HTTP endpoints and request handling
- **stock.service.ts** – contains business logic
- **stock.service.spec.ts** – unit tests for buySell function from the StockService
- **stock.repository.ts** – handles all Redis operations (data access layer)
- **redis.service.ts** – provides and manages the Redis client

- **dtos/buy-sell.dto.ts** – DTO for POST /wallets/{wallet_id}/stocks/{stock_name} 
- **dtos/set-stocks.dto.ts** – DTO for POST /stocks
- **dtos/dtos.validation.spec.ts** – tests DTO validation and transformation rules

- **pipes/parse-stock-name.pipe.ts** – validates and normalizes stock name
- **pipes/parse-wallet-id.pipe.ts** – validates wallet id
- **pipes/parse-stock-name.pipe.spec.ts** – tests stock name pipe

