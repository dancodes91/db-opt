let { ZoomSDKError, FeatureEnableOption } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomMeetingIndicator = (function () {
  var instance;
  /**
   * Zoom Meeting Indicator
   * @module zoom_meeting_indicator
   * @param {Function} onIndicatorItemReceived Notify receive Callback event IMeetingIndicatorHandler received.
   * @param {Function} onIndicatorItemRemoved Notify receive Callback event IMeetingIndicatorHandler removed.
   * @return {ZoomMeetingIndicator}
   */
  function init(opts) {
    let clientOpts = opts || {};
    // Private methods and variables
    let _addon = clientOpts.addon.GetMeetingIndicatorCtrl() || null;
    let _onIndicatorItemReceived = clientOpts.onIndicatorItemReceived || null;
    let _onIndicatorItemRemoved = clientOpts.onIndicatorItemRemoved || null;

    /**
     * Notify receive Callback event IMeetingIndicatorHandler received.
     * @event onIndicatorItemReceived
     */
    function onIndicatorItemReceived() {
      if (_onIndicatorItemReceived) {
        _onIndicatorItemReceived()
      }
    }

    /**
     * Notify receive Callback event IMeetingIndicatorHandler removed.
     * @event onIndicatorItemRemoved
     */
    function onIndicatorItemRemoved() {
      if (_onIndicatorItemRemoved) {
        _onIndicatorItemRemoved()
      }
    }

    if (_addon) {
      _addon.SetOnIndicatorItemReceivedCB(onIndicatorItemReceived);
      _addon.SetOnIndicatorItemRemovedCB(onIndicatorItemRemoved);
    }

    return {
      // Public methods and variables
      /**
       * Set onIndicatorItemReceived callback.
       * @method SetOnIndicatorItemReceivedCB
       * @param {Function} onIndicatorItemReceived
       * @return {Boolean} true or false
       */
      SetOnIndicatorItemReceivedCB: function (onIndicatorItemReceived) {
        if (_addon && onIndicatorItemReceived && onIndicatorItemReceived instanceof Function) {
          _onIndicatorItemReceived = onIndicatorItemReceived;
          return true;
        }
        return false;
      },
      /**
       * Set onIndicatorItemRemoved callback.
       * @method SetOnIndicatorItemRemovedCB
       * @param {Function} onIndicatorItemRemoved
       * @return {Boolean} true or false
       */
      SetOnIndicatorItemRemovedCB: function (onIndicatorItemRemoved) {
        if (_addon && onIndicatorItemRemoved && onIndicatorItemRemoved instanceof Function) {
          _onIndicatorItemRemoved = onIndicatorItemRemoved;
          return true;
        }
        return false;
      },
      /**
       * Get indicator item ID.
       * @method GetIndicatorItemId
       * @return {String} The item ID of the Indicator.
       */
      GetIndicatorItemId: function () {
        if (_addon) {
          return _addon.GetIndicatorItemId();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get indicator name.
       * @method GetIndicatorName
       * @return {String} The name of the Indicator.
       */
      GetIndicatorName: function () {
        if (_addon) {
          return _addon.GetIndicatorName();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get indicator Icon URL.
       * @method GetIndicatorIcon
       * @return {String} The URL of the Indicator.
       */
      GetIndicatorIcon: function () {
        if (_addon) {
          return _addon.GetIndicatorIcon();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Show indicator panel window.
       * @method ShowIndicatorPanel
       * @param {Number} x The horizontal coordinate value.
       * @param {Number} y The vertical coordinate value.
       * @param {Number} windowId Show the AI companion panel's dynamic notice in this window, only for MAC platform.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      ShowIndicatorPanel: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let x = clientOpts.x;
          let y = clientOpts.y;
          let windowId = clientOpts.windowId;
          try {
            let ShowIndicatorPanelParams = new messages.ShowIndicatorPanelParams();
            ShowIndicatorPanelParams.setX(x);
            ShowIndicatorPanelParams.setY(y);
            ShowIndicatorPanelParams.setWindowid(windowId);
            let bytes = ShowIndicatorPanelParams.serializeBinary();
            return _addon.ShowIndicatorPanel(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Hide indicator panel window.
       * @method HideIndicatorPanel
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      HideIndicatorPanel: function () {
        if (_addon) {
          return _addon.HideIndicatorPanel();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      }
    };
  };

  return {
    getInstance: function (opts) {
      if (!instance) {
        instance = init(opts);
      }
      return instance;
    }
  };
})();

module.exports = {
  ZoomMeetingIndicator: ZoomMeetingIndicator
}
