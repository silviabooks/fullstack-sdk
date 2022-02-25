export const onInitService = ({ createExtension, getConfig, setContext }) => {
  const { value: layoutTitle } = createExtension.waterfall(
    "$ONE_LAYOUT_TITLE",
    getConfig("one.layout.title", "OneFront")
  );

  const layoutRoutes = createExtension
    .sync("$ONE_LAYOUT_ROUTE")
    .map((_) => _[0]);

  setContext("one.layout.title", layoutTitle);
  setContext("one.layout.route.items", layoutRoutes);
};
