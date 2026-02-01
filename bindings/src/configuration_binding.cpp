#include "sdk_common.h"  // Windows.h first, then SDK headers
#include <pybind11/pybind11.h>
#include "meeting_service_components/meeting_configuration_interface.h"

namespace py = pybind11;
using namespace ZOOM_SDK_NAMESPACE;

void init_configuration_binding(py::module_ &m) {
    // Bind IMeetingConfiguration interface
    py::class_<IMeetingConfiguration>(m, "IMeetingConfiguration")
        .def("EnableInputMeetingPasswordDlg", [](IMeetingConfiguration& self, bool bEnable) {
            return self.EnableInputMeetingPasswordDlg(bEnable);
        }, py::arg("bEnable"), "Enable/disable password dialog")
        .def("EnableInputMeetingScreenNameDlg", [](IMeetingConfiguration& self, bool bEnable) {
            return self.EnableInputMeetingScreenNameDlg(bEnable);
        }, py::arg("bEnable"), "Enable/disable screen name dialog")
        .def("EnableAutoEndOtherMeetingWhenStartMeeting", [](IMeetingConfiguration& self, bool bEnable) {
            return self.EnableAutoEndOtherMeetingWhenStartMeeting(bEnable);
        }, py::arg("bEnable"), "Enable auto-end other meetings")
        .def("EnableAutoAdjustMicVolumeWhenJoinAudio", [](IMeetingConfiguration& self, bool bEnable) {
            return self.EnableAutoAdjustMicVolumeWhenJoinAudio(bEnable);
        }, py::arg("bEnable"), "Enable auto-adjust mic volume")
        .def("EnableAutoAdjustSpeakerVolumeWhenJoinAudio", [](IMeetingConfiguration& self, bool bEnable) {
            return self.EnableAutoAdjustSpeakerVolumeWhenJoinAudio(bEnable);
        }, py::arg("bEnable"), "Enable auto-adjust speaker volume")
        .def("EnableForceAutoStartMyVideoWhenJoinMeeting", [](IMeetingConfiguration& self, bool bEnable) {
            return self.EnableForceAutoStartMyVideoWhenJoinMeeting(bEnable);
        }, py::arg("bEnable"), "Force auto-start video when join meeting")
        .def("EnableForceAutoStopMyVideoWhenJoinMeeting", [](IMeetingConfiguration& self, bool bEnable) {
            return self.EnableForceAutoStopMyVideoWhenJoinMeeting(bEnable);
        }, py::arg("bEnable"), "Force auto-stop video when join meeting")
        .def("DisableAutoShowSelectJoinAudioDlgWhenJoinMeeting", [](IMeetingConfiguration& self, bool bDisable) {
            return self.DisableAutoShowSelectJoinAudioDlgWhenJoinMeeting(bDisable);
        }, py::arg("bDisable"), "Disable auto-show join audio dialog")
        .def("DisableShowJoinMeetingWnd", [](IMeetingConfiguration& self, bool bDisable) {
            return self.DisableShowJoinMeetingWnd(bDisable);
        }, py::arg("bDisable"), "Disable show join meeting window")
        .def("DisableWaitingForHostDialog", [](IMeetingConfiguration& self, bool bDisable) {
            return self.DisableWaitingForHostDialog(bDisable);
        }, py::arg("bDisable"), "Disable waiting for host dialog")
        .def("DisablePopupMeetingWrongPSWDlg", [](IMeetingConfiguration& self, bool bDisable) {
            return self.DisablePopupMeetingWrongPSWDlg(bDisable);
        }, py::arg("bDisable"), "Disable popup meeting wrong password dialog")
        .def("EnableApproveRemoteControlDlg", [](IMeetingConfiguration& self, bool bEnable) {
            return self.EnableApproveRemoteControlDlg(bEnable);
        }, py::arg("bEnable"), "Enable/disable approve remote control dialog")
        .def("EnableDeclineRemoteControlResponseDlg", [](IMeetingConfiguration& self, bool bEnable) {
            return self.EnableDeclineRemoteControlResponseDlg(bEnable);
        }, py::arg("bEnable"), "Enable/disable decline remote control response dialog")
        .def("HideRemoteControlOnMeetingUI", [](IMeetingConfiguration& self, bool bHide) {
            return self.HideRemoteControlOnMeetingUI(bHide);
        }, py::arg("bHide"), "Hide remote control button on meeting UI");
}
