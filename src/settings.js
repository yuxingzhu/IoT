const Cookies = require('js-cookie')

module.exports = {

 // title: Cookies.get('EcoTitleName'),
  title: 'AloT平台',
  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,
  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: Cookies.get('isTagview'),

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  setLogo: Cookies.get('showIcon'),

  duration: 1000
}
