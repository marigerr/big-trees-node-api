export default function ajaxDefaults() {
    return {
        url: "http://localhost:3000/trees",
        data: {
            // where: '',
            // outFields: "OBJECTID_1, Kommun,Lokalnamn,Tradslag,Stamomkret,Tradstatus",
            // geometryType: "esriGeometryEnvelope",
            // spatialRel: "esriSpatialRelIntersects",
            // returnGeometry: true,
            // returnTrueCurves: false,
            // returnIdsOnly: false,
            // returnCountOnly: false,
            // returnZ: false,
            // returnM: false,
            // returnDistinctValues: false,
            // resultRecordCount: null,
            // orderByFields: "Stamomkret DESC",
            // outStatistics: null,
            // outSR: 4326,
            // f: "pjson"
        },
        type: "GET",
        datatype: "json",
        success: function (response) {
            console.log(response);
        },
        error: function (xhr) {
            console.log(xhr.statusText);
        }
    };
}

export { lanstyrDefault };