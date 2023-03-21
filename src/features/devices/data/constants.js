
import * as Yup from 'yup';
export const deviceType = [
    {
        name: "ASR-9922",
        value: "ASR-9922",
    }, {
        name: "ASR-9912",
        value: "ASR-9912",
    }, {
        name: "ASR-9010",
        value: "ASR-9010",
    }, {
        name: "ASR-9006",
        value: "ASR-9006",
    }, {
        name: "ASR-903",
        value: "ASR-903",
    }, {
        name: "ASR-920",
        value: "ASR-920",
    }, {
        name: "ASR-901",
        value: "ASR-901",
    }, {
        name: "NCS-540",
        value: "NCS-540",
    },
]

export const fieldNames = {
    DEVICE_NAME: "DeviceName",
    IP: "Ip",
    DEVICE_TYPE: "Device_Type",
    REGION_ID: "region_id",
    PROVINCE_ID: "province_id",
    LONG: "long",
    LAT: "lat",
    ADDRESS: "address"
}

const ipAddrRegExp =
    /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/;
export const deviceSchema = Yup.object().shape({
    [fieldNames.DEVICE_NAME]: Yup.string().required("Device name is required."),
    [fieldNames.IP]: Yup.string().matches(ipAddrRegExp, 'IP address is invalid.'),
    [fieldNames.DEVICE_TYPE]: Yup.string().required("Device type is required."),
    [fieldNames.REGION_ID]: Yup.string().required("Region is required."),
    [fieldNames.PROVINCE_ID]: Yup.string().required("Province type is required."),
    [fieldNames.LONG]: Yup.string(),
    [fieldNames.LAT]: Yup.string(),
    [fieldNames.ADDRESS]: Yup.string(),
  });