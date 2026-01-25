const { ZoomSDKError } = require('./settings.js');

var ZoomSettingStatisticCtrl = (function () {
  var instance;
  /**
   * Zoom Setting Statistic Ctrl
   * @module zoom_setting_statistic_ctrl
   * @return {ZoomSettingStatisticCtrl}
   */
  function init(opts) {
    let clientOpts = opts || {};
    // Private methods and variables
    let _addon = clientOpts.addon.GetSettingStatisticCtrl() || null;

    return {
      // Public methods and variables
      /** 
      * Query overall statistic information.
      * @method Setting_QueryOverallStatisticInfo
      * @return {Object} If the function succeeds, the return value is an object with properties:
      *   - err: If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      *   - net_work_type_: Network type
      *   - connection_type_: Connection type
      *   - proxy_addr_: Proxy address
      */
      Setting_QueryOverallStatisticInfo: function () {
        if (_addon){
          return _addon.QueryOverallStatisticInfo();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /** 
      * Query audio statistic information.
      * @method Setting_QueryAudioStatisticInfo
      * @deprecated This interface is marked as deprecated, and is replaced by GetMeetingAudioStatisticInfo().
      * @return {Object} If the function succeeds, the return value is an object with properties:
      *   - err: If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      *   - frequency_send_: Sending frequency, unit: KHz
      *   - frequency_recv_: Receiving frequency, unit: KHz
      *   - latency_send_: Sending latency, unit: ms
      *   - latency_recv_: Receiving latency, unit: ms
      *   - jitter_send_: Sending jitter, unit: ms
      *   - jitter_recv_: Receiving jitter, unit: ms
      *   - packetloss_send_: Sending packet loss, unit: %
      *   - packetloss_recv_: Receiving packet loss, unit: %
      */
      Setting_QueryAudioStatisticInfo: function () {
        if (_addon){
          return _addon.QueryAudioStatisticInfo();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /** 
      * Query video statistic information.
      * @method Setting_QueryVideoStatisticInfo
      * @deprecated This interface is marked as deprecated, and is replaced by GetMeetingVideoStatisticInfo().
      * @return {Object} If the function succeeds, the return value is an object with properties:
      *   - err: If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      *   - latency_send_: Sending latency, unit: ms
      *   - latency_recv_: Receiving latency, unit: ms
      *   - jitter_send_: Sending jitter, unit: ms
      *   - jitter_recv_: Receiving jitter, unit: ms
      *   - packetloss_send_max_: Sending max packet loss, unit: %
      *   - packetloss_recv_max_: Receiving max packet loss, unit: %
      *   - packetloss_send_avg_: Sending average packet loss, unit: %
      *   - packetloss_recv_avg_: Receiving average packet loss, unit: %
      *   - resolution_send_: HIWORD->height, LOWORD->width
      *   - resolution_recv_: HIWORD->height, LOWORD->width
      *   - fps_send_: Frame per second sending
      *   - fps_recv_: Frame per second receiving
      */
      Setting_QueryVideoStatisticInfo: function () {
        if (_addon){
          return _addon.QueryVideoStatisticInfo();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /** 
      * Query share statistic information.
      * @method Setting_QueryShareStatisticInfo
      * @deprecated This interface is marked as deprecated, and is replaced by GetMeetingShareStatisticInfo().
      * @return {Object} If the function succeeds, the return value is an object with properties:
      *   - err: If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      *   - latency_send_: Sending latency, unit: ms
      *   - latency_recv_: Receiving latency, unit: ms
      *   - jitter_send_: Sending jitter, unit: ms
      *   - jitter_recv_: Receiving jitter, unit: ms
      *   - packetloss_send_max_: Sending max packet loss, unit: %
      *   - packetloss_recv_max_: Receiving max packet loss, unit: %
      *   - packetloss_send_avg_: Sending average packet loss, unit: %
      *   - packetloss_recv_avg_: Receiving average packet loss, unit: %
      *   - resolution_send_: HIWORD->height, LOWORD->width
      *   - resolution_recv_: HIWORD->height, LOWORD->width
      *   - fps_send_: Frame per second sending
      *   - fps_recv_: Frame per second receiving
      */
      Setting_QueryShareStatisticInfo: function () {
        if (_addon){
          return _addon.QueryShareStatisticInfo();
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
  ZoomSettingStatisticCtrl: ZoomSettingStatisticCtrl
}
