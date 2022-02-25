import forrest from "@forrestjs/core";

// Services
import services from "./one-front";

// Features
import { fakeLogin } from "./features/fake-login";
import { dashboard } from "./features/dashboard";

forrest
  .run({
    settings: {
      one: {
        auth: {
          token: {
            verify: true,
            refresh: false,
            keepAlive: 0
          }
        },
        layout: {
          title: "Demo App"
        }
      }
    },
    services,
    features: [fakeLogin, dashboard]
  })
  .catch((err) => console.error(`Boot: ${err.message}`));
