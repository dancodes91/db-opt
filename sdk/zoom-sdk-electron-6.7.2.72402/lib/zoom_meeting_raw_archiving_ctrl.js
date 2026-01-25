const { ZoomSDKError } = require('./settings.js');

var ZoomMeetingRawArchivingCtrl = (function () {
  let instance;
  /**
   * Zoom Meeting Raw Archiving Ctrl
   * @module zoom_meeting_raw_archiving_ctrl
   * @return {ZoomMeetingRawArchivingCtrl}
   */
  function init(opts) {
    
    let clientOpts = opts || {};

    // Private methods and variables
    let _addon = clientOpts.addon.GetMeetingRawArchivingCtrl() || null;

    return {
      /** 
       * Start raw archiving, call this method can get rawdata receive privilege.
       * @method StartRawArchiving
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      StartRawArchiving: function () {
        if (_addon) {
          return _addon.StartRawArchiving();            
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      },
      /** 
       * Stop raw archiving, call this method reclaim rawdata receive privilege.
       * @method StopRawArchiving
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      StopRawArchiving: function () {
        if (_addon) {
          return _addon.StopRawArchiving();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE
      }
    };
  };
  
  return {
    getInstance: function (opts) {
      if (!instance) {
        instance = init(opts)
      }
      return instance
    }
  };
})();

module.exports = {
  ZoomMeetingRawArchivingCtrl: ZoomMeetingRawArchivingCtrl
}