# Hasura Auth with Headers Forwarding

![hasura-auth-headers-fails](./hasura-auth-headers-fails.svg)

### Source

```
Note over App: load RefreshToken from\nLocalStorage or
App->Authentication Authority: RefreshToken
Authentication Authority->App: RefreshToken + AccessToken
App->Hasura Engine: AccessToken + GraphQL
Note over Hasura Engine: Hasura is set up with the\nHeaders Forwarding rule
Hasura Engine->Hasura Auth: AccessToken
Hasura Auth->Hasura Engine: 4xx
Hasura Engine->App: 4xx
```

Edit this source on:  
https://bramp.github.io/js-sequence-diagrams/
