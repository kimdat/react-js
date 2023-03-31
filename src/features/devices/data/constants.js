
import * as Yup from 'yup';

export const fieldNames = {
  ID: "Id",
  DEVICE_NAME: "DeviceName",
  IP: "Ip",
  STATUS: "status",
  DEVICE_TYPE: "Device_Type",
  REGION_ID: "region_id",
  PROVINCE_ID: "province_id",
  LONG: "long",
  LAT: "lat",
  ADDRESS: "address",
};

const ipAddrRegExp =
  /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/;
export const deviceSchema = Yup.object().shape({
    [fieldNames.DEVICE_NAME]: Yup.string().trim().required("Device name is required."),
    [fieldNames.IP]: Yup.string().trim().required("IP address is required.").matches(ipAddrRegExp, 'IP address is invalid.'),
    [fieldNames.DEVICE_TYPE]: Yup.string().required("Device type is required."),
    [fieldNames.REGION_ID]: Yup.string().required("Region is required."),
    [fieldNames.PROVINCE_ID]: Yup.string().required("Province is required."),
    [fieldNames.LONG]: Yup.string(),
    [fieldNames.LAT]: Yup.string(),
    [fieldNames.ADDRESS]: Yup.string(),
});

export const pageSizes = [10, 15, 20, 25, 30];
