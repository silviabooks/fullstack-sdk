# Auth

This NodeJS app represents the **AUTHENTICATION AUTHORITY** (AA) responsible for converting an Identity Token (in our case just a plain username) into an Application Refresh Token that is then passed to the third parties Apps.

> This is intended to mimic a completely external service that our Project uses as an Auth provider.

## Service Authentication

This service should be used as authentication point in a micro-apps architecture.

User authenticate here via good old server-side rendered pages and a **SECURE HTTP-ONLY COOKIE**. The IDENTITY TOKEN is therefore known only
by the browser and it is never accessible to the application layer.

> This token may or may not be a JWT. Actually, making this token a JWT may end up in slightly worse overall performances due to its size.

👉 Only the server-side rendered pages will validate the IDENITY TOKEN against the DB. All the API calls will use the APPLICATION TOKEN and apply a JWT validatio to it.

---

**🔥 THE IDENTITY TOKEN SHOULD NEVER BE KNOWN TO THE CLIENT APPLICATION 🔥**

---

## Delegating the Authorization

In a micro-app architecture we want to **DELEGATE AUTHORIZATION** to third parties Applications that will be authorized to make API calls on belhalf of the user.

> A classic approach would be [OAuth2](https://oauth.net/2/) where the delegation flow explicitly notifies Users that a specific App gets "power of attorney" on their behalf.
>
> This is used when the 3rd Party App has no relation with the central Authentication authority.

In our case, the logical Application is just one. But we want to distribute the implementation to independent groups of people as so to **horizontally scale our ability to produce business value**.

Although we could use OAuth2, we can easily implement part of its standard and achieve a **TRANSPARENT USER EXPERIENCE** that doesn't require active choices or actions.

Here are the requirements:

1. The App is just one, owned by one legal entity
2. The AA knows all the micro-apps - centralized knowledge
3. Service-to-Service will keep running on short-lived JWTs
4. Refresh Tokens may be sent over URL - assume high risks!

## Three Tokens Game

We will introduce the FAMILY TOKEN to meet our requirements and provide a safe delegation mechanism.

There will be 3 tokens involved in our strategy:

- APPLICATION TOKEN (AT) - short lived, used to make API calls
- REFRESH TOKEN (RT) - long lived, used to obtain new ATs
- FAMILY TOKEN (FT) - long lived, used to invalidate RTs

> FAMILY TOKEN and REFRESH TOKEN are just [UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier) and must be validated against the DBMS.
>
> The APPLICATION TOKEN is a [JWT](https://jwt.io/) and can be statically validated by the micro-apps without bothering the AA.

🔥 Any time a user wants to delegate an App, a new FT is generated, and will provide an **isolated delegation policy** for a particular client 🔥

👉 A User can list all its FT in the AA App, effectively disabling a particular session on a particular client.

👉 The AA is also in charge to keep the User Identity in check while refreshing those sessions. If anything goes wrong with the User's Identity, all the sessions can be automatically disabled.

NOTE: In this POC we don't keep a digest of the client so FT will simply keep on growing and growing. We may add it in the future.

🔥 A big part of the security of this delegation mechanism (and OAuth2 also) rely on the short-lived AT, **THE SHORTEST THE LIFE, THE SAFER IT GETS**. ut it also puts a higher strain on the AA service whose DBMS that is involved for refreshing the AT.

## First Refresh Token
