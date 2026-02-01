#include "sdk_common.h"  // Windows.h first, then SDK headers
#include <pybind11/pybind11.h>
#include <pybind11/functional.h>
#include "callbacks.h"

namespace py = pybind11;
using namespace ZOOM_SDK_NAMESPACE;

void init_callbacks(py::module_ &m) {
    // Bind callback classes without specifying base classes
    // The base classes (IAuthServiceEvent, etc.) are SDK interfaces that we don't need to expose to Python
    // We only need the callback wrapper classes that we'll pass to the SDK
    py::class_<AuthServiceEventCallbacks>(m, "AuthServiceEventCallbacks")
        .def(py::init<>())
        .def_readwrite("onAuthCallback", &AuthServiceEventCallbacks::onAuthCallback)
        .def_readwrite("onIdentityExpiredCallback", &AuthServiceEventCallbacks::onIdentityExpiredCallback);

    py::class_<MeetingServiceEventCallbacks>(m, "MeetingServiceEventCallbacks")
        .def(py::init<>())
        .def_readwrite("onStatusChangedCallback", &MeetingServiceEventCallbacks::onStatusChangedCallback);

    py::class_<ParticipantsCtrlEventCallbacks>(m, "ParticipantsCtrlEventCallbacks")
        .def(py::init<>())
        .def_readwrite("onUserJoinCallback", &ParticipantsCtrlEventCallbacks::onUserJoinCallback)
        .def_readwrite("onUserLeftCallback", &ParticipantsCtrlEventCallbacks::onUserLeftCallback);

    py::class_<SharingCtrlEventCallbacks>(m, "SharingCtrlEventCallbacks")
        .def(py::init<>())
        .def_readwrite("onSharingStatusChangedCallback", &SharingCtrlEventCallbacks::onSharingStatusChangedCallback);
    
    // Note: ZoomSDKSharingSourceInfo and SharingStatus enum are already bound in sharing_binding.cpp
    // No need to bind them here to avoid duplicates
}
