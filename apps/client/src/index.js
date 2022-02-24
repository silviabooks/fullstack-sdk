import forrest from "@forrestjs/core";

// Services
import services from "./one-front";

// Features
import { fakeLogin } from "./features/fake-login";

forrest
  .run({
    services,
    features: [fakeLogin]
  })
  .catch((err) => console.error(`Boot: ${err.message}`));
