import { onInitService } from "./init-service";
import { Layout } from "./containers/Layout";

export const serviceLayout = ({ registerTargets }) => {
  registerTargets({
    ONE_LAYOUT_TITLE: "one/layout/title",
    ONE_LAYOUT_ROUTE: "one/layout/route"
  });

  return [
    {
      target: "$INIT_SERVICE",
      handler: onInitService
    },
    {
      target: "$REACT_ROOT_COMPONENT",
      handler: { component: Layout }
    }
  ];
};
