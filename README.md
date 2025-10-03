STEPS TO REPLICATE THIS PROJECT

1. Create a clean nextjs app:
```
root@DESKTOP:~/projetos# npx create-next-app@latest
Need to install the following packages:
create-next-app@15.5.4
Ok to proceed? (y) y

✔ What is your project named? … prisma-testing
✔ Would you like to use TypeScript? … No / Yes
✔ Which linter would you like to use? › ESLint
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like your code inside a `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to use Turbopack? (recommended) … No / Yes
✔ Would you like to customize the import alias (`@/*` by default)? … No / Yes
Creating a new Next.js app in /root/projetos/prisma-testing.
```

2. Inside the project, install prisma and @prisma/client as dependencies in versions:
```
npm install prisma@6.10.0 -tsx --save-dev
npm install @prisma/client@6.10.0
```

3. Initiate prisma internally:
```
npx prisma init
```

4. To replicate the external database setup, I've simplify created a Serveless Neon postgres database and place the DATABASE_URL in env. The only thing added to schema is a simple User model.
```
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

5. Finnaly our db.ts, a singleton to instantiate the prisma client:
```
import "server-only"

import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
```

6. Lets create a simple middleware to incite the edge runtime on nextjs.
```
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    return NextResponse.redirect(new URL('/', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

7. Create the schema without migrations and generate client. Delete line 'output   = "../app/generated/prisma"' from schema.prisma to generate correctly.
```
npx prisma db push
npx prisma generate
```

8. I've created as well a page and some server actions using the database just for testing purpose.

The complete POC project is in this link:

Let's start the project building comparisons with prisma versions varying from @6.10.0 to @6.16.3.
In order to test the build bundlesize and create a human visualization, lets use @next/bundle-analyzer. Add next.config.ts configs as documentation asks.
```
npm i --save-dev @next/bundle-analyzer 
```

```
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withBundleAnalyzer(nextConfig);
```

To build the project using the bundle analyzer:
```
ANALYZE=true npm run build
```

*** TESTING RESULTS ***
Our main test focus in here is the "edge" bundle. In the console you'll get the save location of the analisys. Just open the html on the browser to visualize the results:
```
Webpack Bundle Analyzer saved report to /root/projetos/prisma-testing/.next/analyze/nodejs.html

No bundles were parsed. Analyzer will show only original module sizes from stats file.

Webpack Bundle Analyzer saved report to /root/projetos/prisma-testing/.next/analyze/edge.html
Webpack Bundle Analyzer saved report to /root/projetos/prisma-testing/.next/analyze/client.html
```