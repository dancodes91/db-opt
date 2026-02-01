#include "sdk_common.h"  // Windows.h first, then SDK headers
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
// Include meeting_service_interface.h before meeting_sharing_interface.h
// because sharing interface uses SDKViewType and SDKShareViewZoomRatio enums defined in meeting_service_interface.h
#include "meeting_service_interface.h"
#include "meeting_service_components/meeting_sharing_interface.h"
#include "callbacks.h"

namespace py = pybind11;
using namespace ZOOM_SDK_NAMESPACE;

void init_sharing_binding(py::module_ &m) {
    // Bind SharingStatus enum
    // Note: Sharing_None doesn't exist in the enum - it starts with Sharing_Self_Send_Begin
    py::enum_<SharingStatus>(m, "SharingStatus")
        .value("Sharing_Self_Send_Begin", Sharing_Self_Send_Begin)
        .value("Sharing_Self_Send_End", Sharing_Self_Send_End)
        .value("Sharing_Self_Send_Pure_Audio_Begin", Sharing_Self_Send_Pure_Audio_Begin)
        .value("Sharing_Self_Send_Pure_Audio_End", Sharing_Self_Send_Pure_Audio_End)
        .value("Sharing_Other_Share_Begin", Sharing_Other_Share_Begin)
        .value("Sharing_Other_Share_End", Sharing_Other_Share_End)
        .value("Sharing_Other_Share_Pure_Audio_Begin", Sharing_Other_Share_Pure_Audio_Begin)
        .value("Sharing_Other_Share_Pure_Audio_End", Sharing_Other_Share_Pure_Audio_End)
        .value("Sharing_View_Other_Sharing", Sharing_View_Other_Sharing)
        .value("Sharing_Pause", Sharing_Pause)
        .value("Sharing_Resume", Sharing_Resume)
        .export_values();
    
    // Bind ZoomSDKSharingSourceInfo struct
    py::class_<ZoomSDKSharingSourceInfo>(m, "ZoomSDKSharingSourceInfo")
        .def(py::init<>())
        .def_readwrite("userid", &ZoomSDKSharingSourceInfo::userid)
        .def_readwrite("status", &ZoomSDKSharingSourceInfo::status);

    // Bind IMeetingShareController interface
    py::class_<IMeetingShareController>(m, "IMeetingShareController")
        .def("StartMonitorShare", [](IMeetingShareController& self, const zchar_t* monitorID = nullptr) {
            return self.StartMonitorShare(monitorID);
        }, py::arg("monitorID") = nullptr, "Start monitor sharing")
        .def("StopShare", [](IMeetingShareController& self) {
            return self.StopShare();
        }, "Stop sharing")
        .def("SetEvent", [](IMeetingShareController& self, SharingCtrlEventCallbacks* pEvent) {
            return self.SetEvent(pEvent);
        }, py::arg("pEvent"), "Set event callbacks");
}
