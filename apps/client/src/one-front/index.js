import reactRoot from "@forrestjs/react-root";
import reactMUI from "@forrestjs/react-mui";
import reactRouter from "@forrestjs/react-router";

import { serviceAuth } from "./service-auth";
import { serviceLayout } from "./service-layout";

// Export top level APIs:
export { useAuth } from "./service-auth";
export { useLayout } from "./service-layout";

// Export the list of services:
const services = [reactRoot, reactMUI, reactRouter, serviceAuth, serviceLayout];
export default services;
