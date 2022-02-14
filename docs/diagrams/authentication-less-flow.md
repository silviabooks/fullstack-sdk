# Hasura Auth with Headers Forwarding

![authentication-less-flow](./authentication-less-flow.svg)

### Source

```
Note right of Authentication Authority (AA): Generate a new:\n- Session Token (ST)\n- short-lived Refresh Token (RT)
Authentication Authority (AA)->App: Send Refresh Token via URI
App->Authentication Authority (AA): Refresh Access Token (AT) using RT
Note right of Authentication Authority (AA): Validate RT against ST + History.\nIf used, invalidate ST
Note right of Authentication Authority (AA): Rotate RT and keep a history\nof expired RTs
Authentication Authority (AA)->App: Send AT + new long-lived RT
App->ServiceX: Use Application Token (AT)
```

Edit this source on:  
https://bramp.github.io/js-sequence-diagrams/
