# Hasura Auth with Headers Forwarding

![authentication-less-flow](./authentication-less-flow.svg)

Edit this source on:  
https://bramp.github.io/js-sequence-diagrams/

---

## Vocabulary

### Application Type

This is a differentiation based on the tech stack that an App utilizes.

#### SPA

- it is consumed via Web Browser
- it is served by a CDN
- any requests are CORS to the target
- **🔥 ANY LOCALLY STORED DATA MUST BE CONSIDERED TO BE EXPOSED TO THE GENERAL PUBLIC**
- 🔥 All the security is in the developer's hand

#### Web App (WA)

- it is consumed via Web Browser
- it is served by an Application Server
- 👉 it can make **authenticated requests** to the **same origin**, who can then proxy to relevant services while **validating the authentication claims**
- 🔥 We could delegate the entire security problem to the Server App **leveraging on http-only cookies**
- **🔥 ANY LOCALLY STORED DATA MUST BE CONSIDERED TO BE EXPOSED TO THE GENERAL PUBLIC**

#### Native App (NA)

- it (may) use the device's OS' API to store sensitive informations in encrypted vault who's access is bound to the lock status of the device
- 🔥 All the security is in the developer's hand, but it is helped by the OS' API

### Application Role

This is a differentiation based on the responsibility that the App undertakes.

#### Authentication Authority (AA)

- it is an app in charge of exchanging strong credentials (username + password + ?mfa) for tokens
- it owns the real-time invalidation of the user
- it may also be in charge of Authorization

#### Client App (CA)

- it is known by the AA via ClientID
- it can be trusted to make legit service-to-service calls (usually via ClientSecret)
- it is trusted to safely store and refresh an IDToken that is released by the AA
- 🔥 it behaves as AA towards the Delegated Apps

#### Delegated App (DA)

- it is a logical component of the CA, the User should not authenticate this App
- its technically a 3rd Party WA that can live on a **separated 2nd level domain**
- it can be directly accessed by the User
- it needs to use an Application Token to make calls to the CA's services

### IDToken (IDT)

- it is issued by TSID in exchange for a Login
- it is long-lived
- it is bound to a CA
- it is used by the CA to generate new AT
- it rotates at every refresh
- it has an explicit server-side invalidation policy
- **it should be stored in secure, signed, possibly encrypted, httpOnly cookie**

### ApplicationToken (AT)

- it is issued by TSID in exchange for an IDT
- it is short-lived
- it follows JWT format
- it can be validated locally
- it may or may not carry authorization related claims
- it **could** be stored in memory or weak storage (still better in a secure, httpOnly, signed and possibly encrypted cookie)

### Delegated SessionToken (dST)

- it is a _guid_ related to the ITD
- it is issued by a CA that needs to delegate the session to 3rd parties that are not related to TSID
- it has an explicit server-side invalidation policy
- **it is a secret that never leaves the CA**

### Delegated RefreshToken (dRT)

- it is a _guid_ related to the dST
- it is long-lived
- it is used by the DA to generate new dAT
- it rotates at every refresh
- it is bound to a specific device fingerprint
- it has an explicit server-side invalidation policy
- **it should be stored in secure, signed, possibly encrypted, httpOnly cookie**

### Delegated ApplicationToken (dAT)

- it is issued by the CA in exchange for a dRT
- it is short-lived
- it follows JWT format
- it may be the same as the AT (\*)
- it **could** be stored in memory or weak storage (still better in a secure, httpOnly, signed and possibly encrypted cookie)

(\*) Forward the AT is relatively safe as it is short-lived and allows DAs to make direct calls to 1Platform services.

---

## Create the Session

![session create](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgU2Vzc2lvbiBDcmVhdGUKClRTSUQtPlRTUG9ydGFsOiBsb2dpbgpOb3RlIG92ZXIgABAKUGVyc2lzdCBUU0lEVG9rZW5cbmluIGxvY2FsU3RvcmFnZQAiFVVzZXIgY2xpY2tcbm9uIEFwcFggQ2FyZAoAbAgtPlRTQXV0aDogcmVxdWVzdCB0byBnbyB0bwAoBQCAfw0AIAhhZAB7DGZyb20gcwCBUwYAdxQAWAZnZW5lcmF0ZSBjbGllbnQnc1xuZmluZ2VycHJpbnQAFRxhAIIuCACBcAdhbmQgZmlyc3QgUmVmcmVzaACCCAdsaW5rZWQgdG8AghoKCgCBVgYtPkFwcFg6IHdpdGgAKA0gaW4gVVJMCg&s=default)

The SessionToken is a logical connection between a user session in TSDigital (via TSID) and a _Delegated Session_ (DS) towards a 3rd party App.

The DS is sent via URL to the Target App using a intermediate, short-lived Refresh Token.

> NOTE: the session in TSAuth is liked to the session in TSPortal and both are dependent on the TSID behavior.
>
> If TSID rotates the Refresh Token, we will experience racing conditions that will invalidate the session.
>
> Such a case must be verified as it would be an impediment to the external implementation of TSAuth.

## Validate the Session

![session validate](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgU2Vzc2lvbiBWYWxpZGF0ZQoKQXBwWC0-SGFzdXJhWDogbXV0YXRpb24geyB2AB0HACwIfVxuUmVmcmVzaFRva2VuIGluIGhlYWRlcnMKADgHLT5IQXV0aFg6IGZvcndhcmQgYWxsABsKABcFLT5UU0F1dGg6IHIARwYgdGhlIHRva2VuCgAUBgA8Cm5ldyAAZg0rIEFwcGxpYwCBHgUAgQAGdmlhIEh0dHBPbmx5IGNvb2tpZQBhCQCBTQljbGFpbXMAJgYAgS0GICsAJgcAgTILQXBwWDogR3JhcGhRTCBib2R5ICsgQwAfBw&s=default)

## Consume the Session

![session consume](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgU2Vzc2lvbiBDb25zdW1lCgpBcHBYLT5IYXN1cmE6IHF1ZXJ5IHsgLi4uIH0KABAGLT5IQXV0aFg6IGZvcndhcmQgaGVhZGVycwpOb3RlIG92ZXIgABoIdmFsaWRhdGUgQVQgZnJvbSBjb29raWUKADwGAF4KMjAwIC0gZGVjb3JhdGUgd2l0aCAAfgYAgRkJSABeBwB9CEFwcFg6IHJlcXVlc3QgZGF0YQo&s=default)

## Refresh the Session

![session refresh](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgU2Vzc2lvbiBSZWZyZXNoCgpBcHBYLT5IYXN1cmE6IHF1ZXJ5IHsgLi4uIH0KABAGLT5IQXV0aFg6IGZvcndhcmQgaGVhZGVycwpOb3RlIG92ZXIgABoIdmFsaWRhdGUgQVQgZnJvbSBjb29raWVcbkZBSUxTCgBDBi0-VFNBdXRoOgB-CFRva2VuCgAPBi0-VFNJRAASCSBUU0lEABgISUQAMQpuZXcgQVQALAkAgRsIbmV3IFJUICsgQVQAZQkAgVUIMjAwIC0gZGVjb3JhdGUgd2l0aCAAgXMGAIIOCUgAgVMHAIFyCEFwcFg6IHJlcXVlc3QgZGF0YQo&s=default)
