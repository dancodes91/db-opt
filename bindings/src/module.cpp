#include "sdk_common.h"  // Windows.h first, then SDK headers
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include <pybind11/functional.h>

namespace py = pybind11;

// Forward declarations
void init_zoom_sdk_binding(py::module_ &m);
void init_auth_service_binding(py::module_ &m);
void init_meeting_service_binding(py::module_ &m);
void init_participants_binding(py::module_ &m);
void init_sharing_binding(py::module_ &m);
void init_configuration_binding(py::module_ &m);
void init_callbacks(py::module_ &m);  // Defined in callbacks.cpp

PYBIND11_MODULE(zoom_sdk_bindings, m) {
    m.doc() = "Zoom Meeting SDK Python bindings for Windows";

    // Initialize all sub-modules
    init_zoom_sdk_binding(m);
    init_auth_service_binding(m);
    init_meeting_service_binding(m);
    init_participants_binding(m);
    init_sharing_binding(m);
    init_configuration_binding(m);
    init_callbacks(m);
}
