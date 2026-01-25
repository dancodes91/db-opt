const { ZoomSDKError } = require('./settings.js');
const messages = require('./electron_sdk_pb.js');

var ZoomSMSHelper = (function () {
  var instance;
  /**
   * Zoom SMS Helper
   * @module zoom_sms_helper
   * @param {Function} onNeedRealNameAuthMeetingNotification If real name auth is needed, this callback will be triggered.
   * @param {Function} onRetrieveSMSVerificationCodeResultNotification The callback event for retrieving SMS verification code.
   * @param {Function} onVerifySMSVerificationCodeResultNotification The callback event for verification.
   * @return {ZoomSMSHelper}
   */
  function init(opts) { 
    var clientOpts = opts || {};

    // Private methods and variables
    var _addon = clientOpts.addon.GetSDKSMSHelperObj() || null;
    let _onNeedRealNameAuthMeetingNotification = clientOpts.onNeedRealNameAuthMeetingNotification || null;
    let _onRetrieveSMSVerificationCodeResultNotification = clientOpts.onRetrieveSMSVerificationCodeResultNotification || null;
    let _onVerifySMSVerificationCodeResultNotification = clientOpts.onVerifySMSVerificationCodeResultNotification || null;

    /**
      * If real name auth is needed, this callback will be triggered.
      * @event onNeedRealNameAuthMeetingNotification
      * @param {Array} support_country_list The list of the supporting country information.
      * @param {String} privacy_url The privacy url.
    */
    function onNeedRealNameAuthMeetingNotification(support_country_list, privacy_url) {
      if (_onNeedRealNameAuthMeetingNotification) {
        _onNeedRealNameAuthMeetingNotification(support_country_list, privacy_url)
      }
    }

    /**
      * The callback event for retrieving SMS verification code.
      * @event onRetrieveSMSVerificationCodeResultNotification
      * @param {String} result Specifies the result of retrieve {@link SMSVerificationCodeErr}
    */
    function onRetrieveSMSVerificationCodeResultNotification(result) {
      if (_onRetrieveSMSVerificationCodeResultNotification) {
        _onRetrieveSMSVerificationCodeResultNotification(result)
      }
    }

    /**
      * The callback event for verification.
      * @event onVerifySMSVerificationCodeResultNotification
      * @param {String} result Specifies the result of verification {@link SMSVerificationCodeErr}
    */
    function onVerifySMSVerificationCodeResultNotification(result) {
      if (_onVerifySMSVerificationCodeResultNotification) {
        _onVerifySMSVerificationCodeResultNotification(result)
      }
    }

    if (_addon) {
      _addon.SetNeedRealNameAuthMeetingNotificationCB(onNeedRealNameAuthMeetingNotification);
      _addon.SetRetrieveSMSVerificationCodeResultNotificationCB(onRetrieveSMSVerificationCodeResultNotification);
      _addon.SetVerifySMSVerificationCodeResultNotificationCB(onVerifySMSVerificationCodeResultNotification);
    }

    return {
      /**
      * Set onNeedRealNameAuthMeetingNotification callback.
      * @method SetNeedRealNameAuthMeetingNotificationCB
      * @param {Function} onNeedRealNameAuthMeetingNotification
      * @return {Boolean} true or false
      */
      SetNeedRealNameAuthMeetingNotificationCB: function (onNeedRealNameAuthMeetingNotification) {
        if (_addon && onNeedRealNameAuthMeetingNotification && onNeedRealNameAuthMeetingNotification instanceof Function) {
          _onNeedRealNameAuthMeetingNotification = onNeedRealNameAuthMeetingNotification;
          return true;
        }
        return false;
      },
      /**
      * Set onRetrieveSMSVerificationCodeResultNotification callback.
      * @method SetRetrieveSMSVerificationCodeResultNotificationCB
      * @param {Function} onRetrieveSMSVerificationCodeResultNotification
      * @return {Boolean} true or false
      */
      SetRetrieveSMSVerificationCodeResultNotificationCB: function (onRetrieveSMSVerificationCodeResultNotification) {
        if (_addon && onRetrieveSMSVerificationCodeResultNotification && onRetrieveSMSVerificationCodeResultNotification instanceof Function) {
          _onRetrieveSMSVerificationCodeResultNotification = onRetrieveSMSVerificationCodeResultNotification;
          return true;
        }
        return false;
      },
      /**
      * Set onVerifySMSVerificationCodeResultNotification callback.
      * @method SetVerifySMSVerificationCodeResultNotificationCB
      * @param {Function} onVerifySMSVerificationCodeResultNotification
      * @return {Boolean} true or false
      */
      SetVerifySMSVerificationCodeResultNotificationCB: function (onVerifySMSVerificationCodeResultNotification) {
        if (_addon && onVerifySMSVerificationCodeResultNotification && onVerifySMSVerificationCodeResultNotification instanceof Function) {
          _onVerifySMSVerificationCodeResultNotification = onVerifySMSVerificationCodeResultNotification;
          return true;
        }
        return false;
      },
      /**
      * Set the visibility of the dialog box of auth real name when needed. Default value: true.
      * @method EnableZoomAuthRealNameMeetingUIShown
      * @param {Boolean} b_enable true to display the dialog box, false otherwise.
      * @return {Boolean} If the function succeeds, the return value is true.
      */
      EnableZoomAuthRealNameMeetingUIShown: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let b_enable = clientOpts.b_enable;
          try {
            let EnableZoomAuthRealNameMeetingUIShownParams = new messages.EnableZoomAuthRealNameMeetingUIShownParams();
            EnableZoomAuthRealNameMeetingUIShownParams.setBenable(b_enable);
            let bytes = EnableZoomAuthRealNameMeetingUIShownParams.serializeBinary();
            return _addon.EnableZoomAuthRealNameMeetingUIShown(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get retrieve SMS verification code handler interface.
      * @method GetResendSMSVerificationCodeHandler
      * @return {Boolean} If the function succeeds, the return value is true. Otherwise returns false.
      */
      GetResendSMSVerificationCodeHandler: function () {
        if (_addon) {
          return _addon.GetResendSMSVerificationCodeHandler();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Retrieve the sms verification code. 
      * @method Retrieve
      * @param {String} country_code Specifies the country code.
      * @param {String} phone_number Specifies the phone number.
      * @return {Boolean} If the function succeeds, the return value is true.
      * @note The handler will become invalid after calling this function successfully.
      */
      Retrieve: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let country_code = clientOpts.country_code;
          let phone_number = clientOpts.phone_number;
          try {
            let RetrieveParams = new messages.RetrieveParams();
            RetrieveParams.setCountrycode(country_code);
            RetrieveParams.setPhonenum(phone_number);
            let bytes = RetrieveParams.serializeBinary();
            return _addon.Retrieve(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Ignore the prompt of retrieving the verification code and leave meeting.
      * @method Retrieve_CancelAndLeaveMeeting
      * @return {Boolean} If the function succeeds, the return value is true.
      * @note The handler will become invalid and destroied after calling this function successfully.
      */
      Retrieve_CancelAndLeaveMeeting: function () {
        if (_addon) {
          return _addon.Retrieve_CancelAndLeaveMeeting();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get verify SMS verification code handler interface.
      * @method GetReVerifySMSVerificationCodeHandler
      * @return {Boolean} If the function succeeds, the return value is true. Otherwise returns false.
      */
      GetReVerifySMSVerificationCodeHandler: function () {
        if (_addon) {
          return _addon.GetReVerifySMSVerificationCodeHandler();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Verify the sms verification code. 
      * @method Verify
      * @param {String} country_code Specifies the country code.
      * @param {String} phone_number Specifies the phone number.
      * @param {String} verification_code Specifies the verification code.
      * @return {Boolean} If the function succeeds, the return value is true.
      * @note The handler will become invalid after calling this function successfully.
      */
      Verify: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let country_code = clientOpts.country_code;
          let phone_number = clientOpts.phone_number;
          let verification_code = clientOpts.verification_code;
          try {
            let VerifyParams = new messages.VerifyParams();
            VerifyParams.setCountrycode(country_code);
            VerifyParams.setPhonenum(phone_number);
            VerifyParams.setVerificationcode(verification_code);
            let bytes = VerifyParams.serializeBinary();
            return _addon.Verify(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Ignore the prompt of verifying the verification code and leave meeting.
      * @method Verify_CancelAndLeaveMeeting
      * @return {Boolean} If the function succeeds, the return value is true.
      * @note The handler will become invalid and destroied after calling this function successfully.
      */
      Verify_CancelAndLeaveMeeting: function () {
        if (_addon) {
          return _addon.Verify_CancelAndLeaveMeeting();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Get the list of the country information where the meeting supports real name auth.
      * @method GetSupportPhoneNumberCountryList
      * @return {Array} List of the country information where the meeting supports real name auth.
      */
      GetSupportPhoneNumberCountryList: function () {
        if (_addon) {
          return _addon.GetSupportPhoneNumberCountryList();
        }
        return ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
      * Set default cellphone information to let the user bypass the real name auth to start/join meeting directly.
      * @method SetDefaultCellPhoneInfo
      * @param {String} country_code Specifies the country code.
      * @param {String} phone_number Specifies the phone number. 
      * @return {Boolean} If the function succeeds, the return value is true.
      */
      SetDefaultCellPhoneInfo: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let country_code = clientOpts.country_code;
          let phone_number = clientOpts.phone_number;
          try {
            let SetDefaultCellPhoneInfoParams = new messages.SetDefaultCellPhoneInfoParams();
            SetDefaultCellPhoneInfoParams.setCountrycode(country_code);
            SetDefaultCellPhoneInfoParams.setPhonenum(phone_number);
            let bytes = SetDefaultCellPhoneInfoParams.serializeBinary();
            return _addon.SetDefaultCellPhoneInfo(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
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
  ZoomSMSHelper: ZoomSMSHelper
}