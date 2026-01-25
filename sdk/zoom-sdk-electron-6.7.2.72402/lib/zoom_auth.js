const { ZoomAuthResult, ZoomSDKError } = require('./settings.js');
const ZOOMDIRECTSHAREMOD = require('./zoom_direct_share_helper.js');
const messages = require('./electron_sdk_pb.js');

const ZoomAuth = (function () {
  let instance;

  /**
   * Zoom SDK Authentication Service Init
   * @module zoom_auth
   * @param {Function} authcb Notification of authentication result.
   * @param {Function} logoutcb Notification of logout.
   * @param {Function} onZoomIdentityExpired Notification of Zoom identity has expired, please re-login or generate a new zoom access token via REST Api.
   * @param {Function} onZoomAuthIdentityExpired Notification of Zoom authentication identity will be expired in 10 minutes, please re-auth.
   * @param {Function} onLoginReturnWithReason Notification of login result with fail reason.
   * @return {ZoomAuth}
   */
  function init(opts) {
    let clientOpts = opts || {};
    let _addon = clientOpts.addon.GetAuthObj() || null;
    let _onAuthenticationReturn = clientOpts.authcb || null;
    let _onLogout = clientOpts.logoutcb || null;
    let _onZoomIdentityExpired = clientOpts.onZoomIdentityExpired || null;
    let _onZoomAuthIdentityExpired = clientOpts.onZoomAuthIdentityExpired || null;
    let _onLoginReturnWithReason = clientOpts.onLoginReturnWithReason || null;
    let _isSDKAuthentication = false;

    /**
      * Notification of authentication result.
      * @event onAuthenticationReturn
      * @param {Number} ret Authentication result value.
      */
    function onAuthenticationReturn(ret) {
      if (ZoomAuthResult.AUTHRET_SUCCESS == ret) {
        _isSDKAuthentication = true;
      } else {
        _isSDKAuthentication = false;
      }
      if (_onAuthenticationReturn)
        _onAuthenticationReturn(ret);
    }

    /**
      * Notification of logout.
      * @event onLogout
      */
    function onLogout() {
      if (_onLogout)
        _onLogout();
    }

    /**
      * Notification of Zoom identity has expired, please re-login or generate a new zoom access token via REST Api.
      * @event onZoomIdentityExpired
      */
    function onZoomIdentityExpired() {
      if (_onZoomIdentityExpired) {
        _onZoomIdentityExpired()
      }
    }

    /**
      * Notification of Zoom authentication identity will be expired in 10 minutes, please re-auth.
      * @event onZoomAuthIdentityExpired
      */
    function onZoomAuthIdentityExpired() {
      if (_onZoomAuthIdentityExpired) {
        _onZoomAuthIdentityExpired()
      }
    }

    /**
      * Notification of login result with fail reason.
      * @event onLoginReturnWithReason
      * @param {Number} status Login status.
      * @param {Number} reason Login fail reason. Valid when the ret is LOGIN_FAILED. Otherwise LoginFail_None.
      */
    function onLoginReturnWithReason(status, reason) {
      if (_onLoginReturnWithReason) {
        _onLoginReturnWithReason(status, reason)
      }
    }

    if (_addon) {
      _addon.SetOnAuthReturnCB(onAuthenticationReturn);
      _addon.SetLogoutCB(onLogout);
      _addon.SetOnZoomIdentityExpiredCB(onZoomIdentityExpired);
      _addon.SetOnZoomAuthIdentityExpiredCB(onZoomAuthIdentityExpired);
      _addon.SetLoginReturnWithReasonCB(onLoginReturnWithReason);
    }

    return {
      // Public methods and variables
      /**
       * Set authcb callback.
       * @method SetOnAuthReturnCB
       * @param {Function} authcb
       * @return {Boolean} true or false
       */
      SetOnAuthReturnCB: function (onAuthenticationReturn) {
        if (_addon && onAuthenticationReturn && onAuthenticationReturn instanceof Function) {
          _onAuthenticationReturn = onAuthenticationReturn;
          return true
        }
        return false
      },
      /**
       * Set logoutcb callback.
       * @method SetLogoutCB
       * @param {Function} logoutcb
       * @return {Boolean} true or false
       */
      SetLogoutCB: function (onLogout) {
        if (_addon && onLogout && onLogout instanceof Function) {
          _onLogout = onLogout;
          return true
        }
        return false
      },
      /**
       * Set onZoomIdentityExpired callback.
       * @method SetOnZoomIdentityExpiredCB
       * @param {Function} onZoomIdentityExpired
       * @return {Boolean} true or false
       */
      SetOnZoomIdentityExpiredCB: function (onZoomIdentityExpired) {
        if (_addon && onZoomIdentityExpired && onZoomIdentityExpired instanceof Function) {
          _onZoomIdentityExpired = onZoomIdentityExpired;
          return true
        }
        return false
      },
      /**
       * Set onZoomAuthIdentityExpired callback.
       * @method SetOnZoomAuthIdentityExpiredCB
       * @param {Function} onZoomAuthIdentityExpired
       * @return {Boolean} true or false
       */
      SetOnZoomAuthIdentityExpiredCB: function (onZoomAuthIdentityExpired) {
        if (_addon && onZoomAuthIdentityExpired && onZoomAuthIdentityExpired instanceof Function) {
          _onZoomAuthIdentityExpired = onZoomAuthIdentityExpired;
          return true
        }
        return false
      },
      /**
       * Set onLoginReturnWithReason callback.
       * @method SetLoginReturnWithReasonCB
       * @param {Function} onLoginReturnWithReason
       * @return {Boolean} true or false
       */
      SetLoginReturnWithReasonCB: function (onLoginReturnWithReason) {
        if (_addon && onLoginReturnWithReason && onLoginReturnWithReason instanceof Function) {
          _onLoginReturnWithReason = onLoginReturnWithReason;
          return true
        }
        return false
      },
      /**
       * Get SSO login web url.
       * @method GenerateSSOLoginWebURL
       * @param {String} prefixOfVanityUrl prefix of vanity url. 
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      GenerateSSOLoginWebURL: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let prefixOfVanityUrl = clientOpts.prefixOfVanityUrl;
          try {
            let GenerateSSOLoginWebURLParams = new messages.GenerateSSOLoginWebURLParams();
            GenerateSSOLoginWebURLParams.setPrefixofvanityurl(prefixOfVanityUrl);
            let bytes = GenerateSSOLoginWebURLParams.serializeBinary();
            return _addon.GenerateSSOLoginWebURL(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return _isSDKAuthentication ? ZoomSDKError.SDKERR_UNAUTHENTICATION : ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Account login.
       * @method SSOLoginWithWebUriProtocol
       * @param {String} uriProtocol For the parameter to be used for sso account login.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       * @note You need to call this APIs after onAuthenticationReturn(AUTHRET_SUCCESS).
       */
      SSOLoginWithWebUriProtocol: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          let uriProtocol = clientOpts.uriProtocol;
          try {
            let SSOLoginWithWebUriProtocolParams = new messages.SSOLoginWithWebUriProtocolParams();
            SSOLoginWithWebUriProtocolParams.setUriprotocol(uriProtocol);
            let bytes = SSOLoginWithWebUriProtocolParams.serializeBinary();
            return _addon.SSOLoginWithWebUriProtocol(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return _isSDKAuthentication ? ZoomSDKError.SDKERR_UNAUTHENTICATION : ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Account logout.
       * @method Logout
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      Logout: function () {
        if (_isSDKAuthentication && _addon)
          return _addon.Logout();
        return _isSDKAuthentication ? ZoomSDKError.SDKERR_UNAUTHENTICATION : ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * SDK Authentication with jwt token.
       * @method AuthWithJwtToken
       * @param {String} authContext The parameter to be used for authentication SDK.
       * @return {Number} If the function succeeds, the return value is SDKERR_SUCCESS. Otherwise, this function returns an error.
       */
      AuthWithJwtToken: function (authContext) {
        if (_addon) {
          try {
            let AuthWithJwtTokenParams = new messages.AuthWithJwtTokenParams();
            AuthWithJwtTokenParams.setSdkjwttoken(authContext);
            let bytes = AuthWithJwtTokenParams.serializeBinary();
            return _addon.AuthWithJwtToken(bytes);
          } catch (error) {
            return ZoomSDKError.SDKERR_INVALID_PARAMETER;
          }
        }
        return _isSDKAuthentication ? ZoomSDKError.SDKERR_UNAUTHENTICATION : ZoomSDKError.SDKERR_UNINITIALIZE;
      },
      /**
       * Get authentication status.
       * @method GetAuthResult
       * @return {Number} The return value is authentication status.
       */
      GetAuthResult: function () {
        return _addon.GetAuthResult();
      },
      /**
       * Get login status.
       * @method GetLoginStatus
       * @return {Number} The return value is login status.
       */
      GetLoginStatus: function () {
        return _addon.GetLoginStatus();
      },
      GetDirectShare: function (opts) {
        if (_addon) {
          let clientOpts = opts || {};
          clientOpts.addon = _addon;
          return ZOOMDIRECTSHAREMOD.ZoomDirectShareHelper.getInstance(clientOpts);
        }
        return _isSDKAuthentication ? ZoomSDKError.SDKERR_UNAUTHENTICATION : ZoomSDKError.SDKERR_UNINITIALIZE;
      }
    }
  }
  return {
    getInstance: function (opts) {
      if (!instance) {
        instance = init(opts);
      }
      return instance
    }
  };
})();

module.exports = {
  ZoomAuth: ZoomAuth
};
