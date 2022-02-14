# Auth

This NodeJS app represents the **AUTHENTICATION AUTHORITY** (AA) responsible for converting an Identity Token (in our case just a plain username) into an Application Refresh Token that is then passed to the third parties Apps.

> This is intended to mimic a completely external service that our Project uses as an Auth provider.

## Service Authentication

This service should be used as authentication point in a _micro-apps_ architecture.

User authenticate here via good old server-side rendered pages and a **SECURE HTTP-ONLY COOKIE**. The IDENTITY TOKEN is therefore known only
by the browser and it is never accessible to the application layer.

> This token may or may not be a JWT. Actually, making this token a JWT may end up in slightly worse overall performances due to its size and networking overhead.

👉 Only the server-side rendered pages will validate the IDENTITY TOKEN against the DB. All the API calls to any service within the App's scope will use the APPLICATION TOKEN and apply a JWT-based validation to it (decentralized).

---

**🔥 CORE CONCEPT: THE IDENTITY TOKEN SHOULD NEVER BE KNOWN TO THE CLIENT APPLICATION 🔥**

---

## Delegating the Authorization

In a _micro-apps_ architecture we want to **DELEGATE AUTHORIZATION** to third parties Apps that will be authorized to make API calls on belhalf of the User.

> A classic approach would be [OAuth2](https://oauth.net/2/) where the delegation flow explicitly notifies Users that a specific App gets "power of attorney" on their behalf.
>
> This is used when the 3rd Party App has no relation with the AA. Like in "Login with XXX" or Auth0 abstraction of it.

In our case, we manage a single logical App. The Authentication Authority (this service) and 3rd parties _micro-apps_ are built by the same group of engineers.

But we want to distribute the implementation to independent Teams as so to **horizontally scale our ability to produce business value**.

> Basically, we want to code faster.

Although we could use OAuth2, we can easily implement part of its standard and achieve a **TRANSPARENT USER EXPERIENCE** that doesn't require active choices or actions.

The less the User is bothered with questions regarding security, the less the concerns, the less the drop-outs.

> 👉 Users are generally unaware of security and they simply freak out at any explicit decision they have to make regarding the subject.

Here are the requirements:

1. The App is just one, owned by one legal entity
2. The AA knows all the _micro-apps_ - centralized knowledge
3. Service-to-Service will keep running on short-lived JWTs
4. Refresh Tokens may be sent over URL - assume high risks!

## Three Tokens Game

We will introduce the SESSION TOKEN to meet our requirements and provide a safe delegation mechanism.

There will be 3 tokens involved in our strategy:

- APPLICATION TOKEN (AT) - short lived, used to make API calls
- REFRESH TOKEN (RT) - long lived, used to obtain new ATs
- SESSION TOKEN (ST) - long lived, used to invalidate RTs

> SESSION TOKEN and REFRESH TOKEN are just [UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier) and must be validated against the DBMS.
>
> The APPLICATION TOKEN is a [JWT](https://jwt.io/) and can be statically validated by the micro-apps without bothering the AA.

🔥 Any time a user wants to delegate an App, a new ST is generated, and will provide an **ISOLATED DELEGATION POLICY** for a particular client (\*) 🔥

👉 A User can list and revoke all its ST in the AA App, effectively disabling a particular session on a particular Client.

👉 The AA is also in charge to keep the User Identity in check while refreshing those sessions. If anything goes wrong with the User's Identity, all the sessions can be automatically disabled at once.

> (\*) NOTE: In this POC we don't keep a digest of the client data so ST will simply keep on growing and growing. We may add it in the future. This is just a POC!

🔥 A big part of the security of this delegation mechanism (and OAuth2 also) rely on the short-lived AT, **THE SHORTEST THE LIFE, THE SAFER IT GETS**. ut it also puts a higher strain on the AA service whose DBMS that is involved for refreshing the AT.

## The Delegation Token

The first time that a Refresh Token is released, it is set to a short Time To Live (TTL). It should be just a few seconds.

> This configuration takes the name of **DELEGATION TOKEN** and it is the critical piece of information that will travel from the AC to the 3rd Party App over URI.

The receiving App should promptly refresh this token, getting a long TTL Refresh Token and its first Application Token.

> From now on, it is the App's responsibility to keep the Refresh Token as safe as possibile.

The Delegation Token TTL is the time window in which a potential attacker could steal the token, refresh it first, hence getting access to a valid Application Token.

Even so, **the attack will be short lived** as the App will likely try to refresh the same token within the second, effectively invalidating the Session Token.

👉 Potentially, it the attacker is fast enough, they will gain access to one single Application Token before their Refresh Token becomes useless.

**🔥 IT IS THEREFORE IMPORTANT THAT THE APPLICATION TOKEN IS SHORT LIVED ANYWAY. 🔥**

<div style="background:white"><img src="../../docs/diagrams/authentication-less-flow.svg" /></div>
