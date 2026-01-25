let { ZoomSDKError } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomMeetingWhiteboard = (function () {
  var instance;
  /**
   * Zoom Meeting Whiteboard
   * @module zoom_meeting_whiteboard
   * @param {Function} onWhiteboardStatusChanged Whiteboard status changed callback. Use this function to inform the user that the whiteboard has been started or stopped, and all users in the meeting can get the event.
   * @param {Function} onWhiteboardSettingsChanged Callback to demote attendees to panelist.
   * @return {ZoomMeetingWhiteboard}
   */
  function init(opts) {
    let clientOpts = opts || {};
    // Private methods and variables
    let _addon = clientOpts.addon.GetMeetingWhiteboardCtrl() || null;
    let _onWhiteboardStatusChanged = clientOpts.onWhiteboardStatusChanged || null;
    let _onWhiteboardSettingsChanged = clientOpts.onWhiteboardSettingsChanged || null;

    /**
     * Whiteboard status changed callback. Use this function to inform the user that the whiteboard has been started or stopped, and all users in the meeting can get the event.
     * @event onWhiteboardStatusChanged
     * @param {Number} status Specify current whiteboard status {@link SDKWhiteboardStatus}.
     */
    function onWhiteboardStatusChanged(status) {
      if (_onWhiteboardStatusChanged) {
        _onWhiteboardStatusChanged(status)
      }
    }

    /**
     * Callback event of whiteboard setting type changed.
     * @event onWhiteboardSettingsChanged
     * @param {Number} shareOption Who can share their whiteboard {@link SDKWhiteboardShareOption}.
     * @param {Number} createOption Who can create a new whiteboard {@link SDKWhiteboardCreateOption}.
     * @param {Boolean} bEnable Whether enable the participants create whiteboard without host in the meeting
     */
    function onWhiteboardSettingsChanged(shareOption, createOption, bEnable) {
      if (_onWhiteboardSettingsChanged) {
        _onWhiteboardSettingsChanged(shareOption, createOption, bEnable)
      }
    }

    if (_addon) {
      _addon.SetOnWhiteboardStatusChangedCB(onWhiteboardStatusChanged);
      _addon.SetOnWhiteboardSettingsChangedCB(onWhiteboardSettingsChanged);
    }

    return {
      // Public methods and variables
      /**
       * Set onWhiteboardStatusChanged callback.
       * @method SetOnWhiteboardStatusChangedCB
       * @param {Function} onWhiteboardStatusChanged
       * @return {Boolean} true or false
       */
      SetOnWhiteboardStatusChangedCB: function (onWhiteboardStatusChanged) {
        if (_addon && onWhiteboardStatusChanged && onWhiteboardStatusChanged instanceof Function) {
          _onWhiteboardStatusChanged = onWhiteboardStatusChanged;
          return true;
        }
        return false;
      },
      /**
       * Set onWhiteboardSettingsChanged callback.
       * @method SetOnWhiteboardSettingsChangedCB
       * @param {Function} onWhiteboardSettingsChanged
       * @return {Boolean} true or false
       */
      SetOnWhiteboardSettingsChangedCB: function (onWhiteboardSettingsChanged) {
        if (_addon && onWhiteboardSettingsChanged && onWhiteboardSettingsChanged instanceof Function) {
          _onWhiteboardSettingsChanged = onWhiteboardSettingsChanged;
          return true;
        }
        return false;
      },
      /**
      * Sets the whiteboard web view and dashboard web view owner window.
      * @method SetOwnerWindow
      * @param {String} windowID Specify the owner window. If windowID is null, the owner window will be desktop window. 
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note Valid only for user custom interface mode. Call this function before calling ShowDashboardView. Call this function when receiving the meeting status MEETING_STATUS_INMEETING. Otherwise, the dashboard web view owner window will be desktop window.
      */
      SetOwnerWindow: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let windowID = clientOpts.windowID;
          try {
            let SetOwnerWindowParams = new messages.SetOwnerWindowParams();
            SetOwnerWindowParams.setWindowid(windowID);
            let bytes = SetOwnerWindowParams.serializeBinary();
            return _addon.SetOwnerWindow(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Determines whether the current meeting supports the whiteboard or not.
      * @method IsSupportWhiteBoard
      * @return {Boolean} true indicates to support.
      */
      IsSupportWhiteBoard: function () {
        if (_addon) {
          return _addon.IsSupportWhiteBoard();
        }
        return false;
      },
      /**
       * Determines whether the current meeting can start sharing the whiteboard.
       * @method CanStartShareWhiteboard
       * @return {Object} If the function succeeds, the return value is an object with the following properties:
       *   - bCan: true indicates you can start sharing the whiteboard.
       *   - reason: The reason that no one can start sharing the whiteboard.
       */
      CanStartShareWhiteboard: function () {
        if (_addon) {
          return _addon.CanStartShareWhiteboard();
        }
        return null;
      },
      /**
      * Shows the dashboard web view window.
      * @method ShowDashboardView
      * @param {Number} x The horizontal coordinate value.
      * @param {Number} y The vertical coordinate value. 
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If x == -1 and y = -1, the window position will be in the center of the screen where the owner window is located.
      * @note Valid only for custom user interface mode.
      */
      ShowDashboardView: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let x = clientOpts.x;
          let y = clientOpts.y;
          try {
            let ShowDashboardViewParams = new messages.ShowDashboardViewParams();
            ShowDashboardViewParams.setX(x);
            ShowDashboardViewParams.setY(y);
            let bytes = ShowDashboardViewParams.serializeBinary();
            return _addon.ShowDashboardView(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Sets the dashboard web view window size.
      * @method SetDashboardViewSize
      * @param {Number} width Specify the width of the window.
      * @param {Number} height Specify the height of the window. 
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If height == -1 and width == -1, the window size will be default.
      * @note Valid only for custom user interface mode.
      */
      SetDashboardViewSize: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let width = clientOpts.width;
          let height = clientOpts.height;
          try {
            let SetDashboardViewSizeParams = new messages.SetDashboardViewSizeParams();
            SetDashboardViewSizeParams.setWidth(width);
            SetDashboardViewSizeParams.setHeight(height);
            let bytes = SetDashboardViewSizeParams.serializeBinary();
            return _addon.SetDashboardViewSize(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Sets the whiteboard web view window position.
      * @method SetWhiteboardViewPos
      * @param {Number} x The horizontal coordinate value. 
      * @param {Number} y The vertical coordinate value. 
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If x == -1 and y = -1, the window position will be in the center of the screen where the owner window is located.
      * @note If you don't call this function, the window position will be in the center of the screen where the owner window is located.
      * @note Valid only for custom user interface mode.
      */
      SetWhiteboardViewPos: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let x = clientOpts.x;
          let y = clientOpts.y;
          try {
            let SetWhiteboardViewPosParams = new messages.SetWhiteboardViewPosParams();
            SetWhiteboardViewPosParams.setX(x);
            SetWhiteboardViewPosParams.setY(y);
            let bytes = SetWhiteboardViewPosParams.serializeBinary();
            return _addon.SetWhiteboardViewPos(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Sets the whiteboard web view window size.
      * @method SetWhiteboardViewSize
      * @param {Number} width Specify the width of the window.
      * @param {Number} height Specify the height of the window. 
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      * @note If height == -1 and width == -1, the window size will be default.
      * @note If you don't call this function, the window size will be default.
      * @note Valid only for custom user interface mode.
      */
      SetWhiteboardViewSize: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let width = clientOpts.width;
          let height = clientOpts.height;
          try {
            let SetWhiteboardViewSizeParams = new messages.SetWhiteboardViewSizeParams();
            SetWhiteboardViewSizeParams.setWidth(width);
            SetWhiteboardViewSizeParams.setHeight(height);
            let bytes = SetWhiteboardViewSizeParams.serializeBinary();
            return _addon.SetWhiteboardViewSize(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Sets the option for who can share a whiteboard.
       * @method SetWhiteboardShareOption
       * @param {Number} option New setting for who can share a whiteboard.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      SetWhiteboardShareOption: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let option = clientOpts.option;
          try {
            let SetWhiteboardShareOptionParams = new messages.SetWhiteboardShareOptionParams();
            SetWhiteboardShareOptionParams.setOption(option);
            let bytes = SetWhiteboardShareOptionParams.serializeBinary();
            return _addon.SetWhiteboardShareOption(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Gets the option for who can share a whiteboard.
       * @method GetWhiteboardShareOption
       * @return {Object} If the function succeeds, the return value is an object with the following properties:
       *   - err: If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       *   - option: Setting option for who can share a whiteboard.
       */
      GetWhiteboardShareOption: function () {
        if (_addon) {
          return _addon.GetWhiteboardShareOption();
        }
        return null;
      },
      /**
       * Sets the option for who can initiate a new whiteboard.
       * @method SetWhiteboardCreateOption
       * @param {Number} option Setting option for who can initiate a new whiteboard.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      SetWhiteboardCreateOption: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let option = clientOpts.option;
          try {
            let SetWhiteboardCreateOptionParams = new messages.SetWhiteboardCreateOptionParams();
            SetWhiteboardCreateOptionParams.setOption(option);
            let bytes = SetWhiteboardCreateOptionParams.serializeBinary();
            return _addon.SetWhiteboardCreateOption(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Gets the option for who can initiate a new whiteboard.
       * @method GetWhiteboardCreateOption
       * @return {Object} If the function succeeds, the return value is an object with the following properties:
       *   - err: If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       *   - option: Setting option for who can initiate a new whiteboard.
       */
      GetWhiteboardCreateOption: function () {
        if (_addon) {
          return _addon.GetWhiteboardCreateOption();
        }
        return null;
      },
      /**
      * Enables the participants to create a new whiteboard without the host in the meeting. 
      * @method EnableParticipantsCreateWithoutHost
      * @param {Boolean} bEnable true indicates to enable. Otherwise, false.
      * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
      */
      EnableParticipantsCreateWithoutHost: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let bEnable = clientOpts.bEnable;
          try {
            let EnableParticipantsCreateWithoutHostParams = new messages.EnableParticipantsCreateWithoutHostParams();
            EnableParticipantsCreateWithoutHostParams.setBenable(bEnable);
            let bytes = EnableParticipantsCreateWithoutHostParams.serializeBinary();
            return _addon.EnableParticipantsCreateWithoutHost(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Determines whether the participants can create a new whiteboard without the host in the meeting.
       * @method IsParticipantsCreateWithoutHostEnabled
       * @return {Boolean} true indicates that they have these permission.
       */
      IsParticipantsCreateWithoutHostEnabled: function () {
        if (_addon) {
          return _addon.IsParticipantsCreateWithoutHostEnabled();
        }
        return false;
      },
      /**
      * Query if other user is sharing whiteboard.
      * @method IsOtherSharingWhiteboard
      * @return {Boolean} true if another user is sharing. Otherwise, false.
      */
      IsOtherSharingWhiteboard: function () {
        if (_addon) {
          return _addon.IsOtherSharingWhiteboard();
        }
        return false;
      },
      /**
      * Query if the current user is sharing whiteboard successfully.
      * @method IsSharingWhiteboardOut
      * @return {Boolean} true if the current user is sharing successfully. Otherwise, false.
      */
      IsSharingWhiteboardOut: function () {
        if (_addon) {
          return _addon.IsSharingWhiteboardOut();
        }
        return false;
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
  ZoomMeetingWhiteboard: ZoomMeetingWhiteboard
}