# Fancyfy Updated

## Website analysis (current state)

The project is a Java Servlet + JSP e-commerce web app for fashion accessories under `fashion-jewelry-website/`.

### Existing stack
- Java web app packaged as a WAR (Maven build).
- UI: JSP + JSTL + Bootstrap.
- Controllers: `ProductController`, `CheckoutController`.
- Persistence DAOs: `ProductDao`, `OrderDao`.
- Originally configured for Oracle DB on localhost.

### Issues found before fixes
- If Oracle DB is unavailable, DAO methods could return `null` connections and cause runtime failures.
- Product detail and cart flows had no null-guards for missing products.
- Cart used `Product` as map key without `equals`/`hashCode`, causing duplicate entries for the same product id.
- App root routing/web.xml setup was incomplete for predictable startup navigation.

## What was implemented to make it fully working locally

- Added resilient DAO behavior with in-memory fallback data/storage when DB is unavailable.
- Added DB config via environment variables:
  - `FANCYFY_DB_URL`
  - `FANCYFY_DB_USERNAME`
  - `FANCYFY_DB_PASSWORD`
- Added null safety in key controller actions.
- Added `equals`/`hashCode` for `Product` based on `id` for correct cart aggregation.
- Simplified `web.xml` and configured a welcome route.

## Run locally

```bash
cd fashion-jewelry-website
mvn clean package
```

Deploy generated WAR from:

```text
target/fancyfy-accessories-1.0-SNAPSHOT.war
```

If you run without Oracle DB, the app still works using fallback in-memory data.
