const { ZoomSDKError } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomSettingAccessibilityCtrl = (function () {
  var instance;
   /**
   * Zoom Setting Accessibility Ctrl
   * @module zoom_setting_accessibility_ctrl
   * @return {ZoomSettingAccessibilityCtrl}
   */
  function init(opts) {
    let clientOpts = opts || {};
    // Private methods and variables
    let _addon = clientOpts.addon.GetSettingAccessibilityCtrl() || null;

    return {
      // Public methods and variables
      /** 
      * Enable/Disable Always Show Meeting Controls in meeting window.
      * @method Setting_EnableAlwaysShowMeetingControls
      * @param {Boolean} bEnable true indicates enabled.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      Setting_EnableAlwaysShowMeetingControls: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let bEnable = clientOpts.bEnable;
          try {
            let EnableAlwaysShowMeetingControlsParams = new messages.EnableAlwaysShowMeetingControlsParams();
            EnableAlwaysShowMeetingControlsParams.setBenable(Boolean(bEnable));
            let bytes = EnableAlwaysShowMeetingControlsParams.serializeBinary();
            return _addon.EnableAlwaysShowMeetingControls(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /** 
      * Get the current setting status of Always Show Meeting Controls in meeting window.
      * @method Setting_IsAlwaysShowMeetingControlsEnable
      * @return {Number} If the return value is SDKERR_SUCCESS means that always show meeting controls is enabled.
      */
      Setting_IsAlwaysShowMeetingControlsEnable: function () {
        if (_addon) {
          return _addon.IsAlwaysShowMeetingControlsEnable();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      }
    };
  };
 
  return {
    getInstance: function(opts) {
      if (!instance) {
        instance = init(opts);
      }
      return instance;
    }
  };
})();

module.exports = {
  ZoomSettingAccessibilityCtrl: ZoomSettingAccessibilityCtrl
}
