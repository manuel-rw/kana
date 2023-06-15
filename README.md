# Kana

Kana is a modern application to learn Japanese kana characters. It features a modern design and is built with brand-new technologies.

## Techstack

- Server / React: https://nextui.org/
- Typesafe APIs: https://trpc.io/
- Authentication: https://next-auth.js.org/
- User Interface: https://mantine.dev/
- Validation: https://zod.dev/
- Icons: https://tabler-icons.io/
- Styles: https://emotion.sh/
- Database: https://www.sqlite.org/index.html
- ORM: https://www.prisma.io/
- Hashing: https://www.npmjs.com/package/bcryptjs
- Dates: https://day.js.org/

## How do I deploy this?

1. Install yarn ``npm i -g yarn``
2. Install yarn dependencies ``yarn``
3. Create your environment variables:
    - ``cp .env.example .env``
    - Enter a random string into the environment variable ``NEXTAUTH_SECRET``
    - (Optional): If you're running HTTPS, set ``NODE_TLS_REJECT_UNAUTHORIZED`` to ``0``.
    - (Optional): If you're not running on http://localhost:3000, set ``NEXTAUTH_URL`` to your basename
3. Update SQLite DB using Prisma ORM: ``yarn prisma db push`` (Confirm permanent data deletion if you are prompted with ``y`` / ``yes``)
4. Start yarn in developer mode ``yarn dev``

After initial procedure has been done, you only need to execute ``yarn dev`` if you want to start it. If ``next is not recognized as a command`` appears, run ``yarn`` again to install / update dependencies.

## Connect Discord OAuth
### Requirements
- A Discord account
- Your TOTP if 2FA is active

### Procedure
- Open your developer portal: https://discord.com/developers/applications
- Click on ``New Application``
- Give it a reasonable name
- In the dashboard, go to "OAuth"
- Add redirection URL: ``http://localhost:3000/api/auth/callback/discord`` (or any other redirection URLs, e.g. ``https://kana.local/api/auth/callback/discord``)
- Copy the above "Client ID" and paste it into the ``DISCORD_CLIENT_ID`` variable in the ``.env``
- Reset and copy the Client Secret (Warning: The secret wll only be visible once. Store it securely!) and pase it into the ``DISCORD_CLIENT_SECRET`` variable in the ``.env``.

## Database management
### Seeding default Kana data
To bootstrap the database with the default seed data, you can use the following command: ``yarn prisma db seed``.

### Pushing migrations
When the database schema has changed, you can use ``yarn prisma db push`` to apply all changes.
If the operation cannot be applied, without deleting or generating data forcefully, it will ask you for permissions to delete all existing tables and re-create.

## Safety
- All passwords are hashed by default. A password will be hashed using a randomly generated salt per user. Therefore, the same password on seperate user accounts will not be the same hash in the database, since the salt is different for both users.
- Next.js does not support SSL / TLS out of the box. A man in the middle attack is feasable and may compromise user data. It makes sense to remove the HTTP for outgoing communications and expose the application over HTTPS using a reverse proxy. This also ensures frequent renewal of certificates (e.g. using Nginx Proxy Manager with Cerbot).
- The session is stored as a JWT in the cookies. A CSRF token is used for additional protection of the session. The default validity period for sessions is 30 days.
- NextAuth is abstracting the differences between the providers. This enables developers to make zero comparisons / differences in components and routes when accessing session data. Additionally, using the built in access rules for tRPC, routers can be built quickly and effectively.
- APIs are fully end to end typesafe. The compiler will fail, if a type conflict is detected. In development mode, the compilation may not fail until the exact page / router is called.