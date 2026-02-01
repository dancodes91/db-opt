#include "sdk_common.h"  // Windows.h first, then SDK headers
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include <pybind11/functional.h>
// Include service interface headers so pybind11 has full class definitions
#include "meeting_service_interface.h"
#include "auth_service_interface.h"
#include "setting_service_interface.h"
#include <iostream>

namespace py = pybind11;
using namespace ZOOM_SDK_NAMESPACE;

void init_zoom_sdk_binding(py::module_ &m) {
    // Bind SDKError enum
    py::enum_<SDKError>(m, "SDKError")
        .value("SDKERR_SUCCESS", SDKERR_SUCCESS)
        .value("SDKERR_NO_IMPL", SDKERR_NO_IMPL)
        .value("SDKERR_WRONG_USAGE", SDKERR_WRONG_USAGE)
        .value("SDKERR_INVALID_PARAMETER", SDKERR_INVALID_PARAMETER)
        .value("SDKERR_MODULE_LOAD_FAILED", SDKERR_MODULE_LOAD_FAILED)
        .value("SDKERR_MEMORY_FAILED", SDKERR_MEMORY_FAILED)
        .value("SDKERR_SERVICE_FAILED", SDKERR_SERVICE_FAILED)
        .value("SDKERR_UNINITIALIZE", SDKERR_UNINITIALIZE)
        .value("SDKERR_UNAUTHENTICATION", SDKERR_UNAUTHENTICATION)
        .value("SDKERR_NORECORDINGINPROCESS", SDKERR_NORECORDINGINPROCESS)
        .value("SDKERR_TRANSCODER_NOFOUND", SDKERR_TRANSCODER_NOFOUND)
        .value("SDKERR_VIDEO_NOTREADY", SDKERR_VIDEO_NOTREADY)
        .value("SDKERR_NO_PERMISSION", SDKERR_NO_PERMISSION)
        .value("SDKERR_UNKNOWN", SDKERR_UNKNOWN)
        .value("SDKERR_OTHER_SDK_INSTANCE_RUNNING", SDKERR_OTHER_SDK_INSTANCE_RUNNING)
        .value("SDKERR_INTERNAL_ERROR", SDKERR_INTERNAL_ERROR)
        .value("SDKERR_NO_AUDIODEVICE_ISFOUND", SDKERR_NO_AUDIODEVICE_ISFOUND)
        .value("SDKERR_NO_VIDEODEVICE_ISFOUND", SDKERR_NO_VIDEODEVICE_ISFOUND)
        .value("SDKERR_TOO_FREQUENT_CALL", SDKERR_TOO_FREQUENT_CALL)
        .value("SDKERR_FAIL_ASSIGN_USER_PRIVILEGE", SDKERR_FAIL_ASSIGN_USER_PRIVILEGE)
        .value("SDKERR_MEETING_DONT_SUPPORT_FEATURE", SDKERR_MEETING_DONT_SUPPORT_FEATURE)
        .value("SDKERR_MEETING_NOT_SHARE_SENDER", SDKERR_MEETING_NOT_SHARE_SENDER)
        .value("SDKERR_MEETING_YOU_HAVE_NO_SHARE", SDKERR_MEETING_YOU_HAVE_NO_SHARE)
        .value("SDKERR_MEETING_VIEWTYPE_PARAMETER_IS_WRONG", SDKERR_MEETING_VIEWTYPE_PARAMETER_IS_WRONG)
        .value("SDKERR_MEETING_ANNOTATION_IS_OFF", SDKERR_MEETING_ANNOTATION_IS_OFF)
        .value("SDKERR_SETTING_OS_DONT_SUPPORT", SDKERR_SETTING_OS_DONT_SUPPORT)
        .value("SDKERR_EMAIL_LOGIN_IS_DISABLED", SDKERR_EMAIL_LOGIN_IS_DISABLED)
        .value("SDKERR_HARDWARE_NOT_MEET_FOR_VB", SDKERR_HARDWARE_NOT_MEET_FOR_VB)
        .value("SDKERR_NEED_USER_CONFIRM_RECORD_DISCLAIMER", SDKERR_NEED_USER_CONFIRM_RECORD_DISCLAIMER)
        .value("SDKERR_NO_SHARE_DATA", SDKERR_NO_SHARE_DATA)
        .value("SDKERR_SHARE_CANNOT_SUBSCRIBE_MYSELF", SDKERR_SHARE_CANNOT_SUBSCRIBE_MYSELF)
        .value("SDKERR_NOT_IN_MEETING", SDKERR_NOT_IN_MEETING)
        .value("SDKERR_NOT_JOIN_AUDIO", SDKERR_NOT_JOIN_AUDIO)
        .value("SDKERR_HARDWARE_DONT_SUPPORT", SDKERR_HARDWARE_DONT_SUPPORT)
        .value("SDKERR_DOMAIN_DONT_SUPPORT", SDKERR_DOMAIN_DONT_SUPPORT)
        .value("SDKERR_MEETING_REMOTE_CONTROL_IS_OFF", SDKERR_MEETING_REMOTE_CONTROL_IS_OFF)
        .value("SDKERR_FILETRANSFER_ERROR", SDKERR_FILETRANSFER_ERROR)
        .export_values();

    // Bind SDK_LANGUAGE_ID enum
    py::enum_<SDK_LANGUAGE_ID>(m, "SDK_LANGUAGE_ID")
        .value("LANGUAGE_Unknown", LANGUAGE_Unknown)
        .value("LANGUAGE_English", LANGUAGE_English)
        .value("LANGUAGE_Chinese_Simplified", LANGUAGE_Chinese_Simplified)
        .value("LANGUAGE_Chinese_Traditional", LANGUAGE_Chinese_Traditional)
        .value("LANGUAGE_Japanese", LANGUAGE_Japanese)
        .value("LANGUAGE_Spanish", LANGUAGE_Spanish)
        .value("LANGUAGE_German", LANGUAGE_German)
        .value("LANGUAGE_French", LANGUAGE_French)
        .value("LANGUAGE_Portuguese", LANGUAGE_Portuguese)
        .value("LANGUAGE_Russian", LANGUAGE_Russian)
        .value("LANGUAGE_Korean", LANGUAGE_Korean)
        .value("LANGUAGE_Vietnamese", LANGUAGE_Vietnamese)
        .value("LANGUAGE_Italian", LANGUAGE_Italian)
        .value("LANGUAGE_Polish", LANGUAGE_Polish)
        .value("LANGUAGE_Turkish", LANGUAGE_Turkish)
        .value("LANGUAGE_Indonesian", LANGUAGE_Indonesian)
        .value("LANGUAGE_Dutch", LANGUAGE_Dutch)
        .value("LANGUAGE_Swedish", LANGUAGE_Swedish)
        .export_values();

    // Bind InitParam struct
    py::class_<InitParam>(m, "InitParam")
        .def(py::init<>())
        .def_readwrite("strWebDomain", &InitParam::strWebDomain)
        .def_readwrite("strBrandingName", &InitParam::strBrandingName)
        .def_readwrite("strSupportUrl", &InitParam::strSupportUrl)
        .def_readwrite("emLanguageID", &InitParam::emLanguageID)
        .def_readwrite("enableGenerateDump", &InitParam::enableGenerateDump)
        .def_readwrite("enableLogByDefault", &InitParam::enableLogByDefault)
        .def_readwrite("uiLogFileSize", &InitParam::uiLogFileSize);

    // Bind core SDK functions
    m.def("InitSDK", [](InitParam& initParam) {
        return InitSDK(initParam);
    }, py::arg("initParam"), "Initialize ZOOM SDK");

    m.def("CleanUPSDK", &CleanUPSDK, "Clean up ZOOM SDK");

    m.def("CreateMeetingService", []() -> IMeetingService* {
        IMeetingService* pService = nullptr;
        SDKError err = CreateMeetingService(&pService);
        if (err != SDKERR_SUCCESS) {
            throw std::runtime_error("Failed to create meeting service");
        }
        return pService;
    }, py::return_value_policy::reference, "Create meeting service");

    m.def("DestroyMeetingService", [](IMeetingService* pService) {
        return DestroyMeetingService(pService);
    }, py::arg("pService"), "Destroy meeting service");

    m.def("CreateAuthService", []() -> IAuthService* {
        IAuthService* pService = nullptr;
        SDKError err = CreateAuthService(&pService);
        if (err != SDKERR_SUCCESS) {
            throw std::runtime_error("Failed to create auth service");
        }
        return pService;
    }, py::return_value_policy::reference, "Create auth service");

    m.def("DestroyAuthService", [](IAuthService* pService) {
        return DestroyAuthService(pService);
    }, py::arg("pService"), "Destroy auth service");

    m.def("CreateSettingService", []() -> ISettingService* {
        ISettingService* pService = nullptr;
        SDKError err = CreateSettingService(&pService);
        if (err != SDKERR_SUCCESS) {
            throw std::runtime_error("Failed to create setting service");
        }
        return pService;
    }, py::return_value_policy::reference, "Create setting service");

    m.def("DestroySettingService", [](ISettingService* pService) {
        return DestroySettingService(pService);
    }, py::arg("pService"), "Destroy setting service");

    m.def("GetSDKVersion", &GetSDKVersion, "Get SDK version");
}
