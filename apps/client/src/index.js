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
            refresh: true
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
