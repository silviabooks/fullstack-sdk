export const onInitService = ({ createExtension, setContext }) => {
  const layoutRoutes = createExtension
    .sync("$ONE_LAYOUT_ROUTE")
    .map((_) => _[0]);

  setContext("one.layout.route.items", layoutRoutes);
};
