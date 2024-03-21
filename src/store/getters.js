const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  realName: state => state.user.realName,
  // operationPermission: state => state.user.operationPermission,
  titleName: state => state.user.titleName,
  showIcon: state => state.user.showIcon,
  isTagview: state => state.user.isTagview,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews

}
export default getters
