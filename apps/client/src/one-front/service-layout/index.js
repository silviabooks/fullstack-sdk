import { onInitService } from "./init-service";
import { LayoutProvider } from "./state/LayoutProvider";
import { Layout } from "./containers/Layout";

export { useLayout } from "./state/use-layout";

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
      target: "$REACT_ROOT_WRAPPER",
      handler: { component: LayoutProvider }
    },
    {
      target: "$REACT_ROOT_COMPONENT",
      handler: { component: Layout }
    }
  ];
};
