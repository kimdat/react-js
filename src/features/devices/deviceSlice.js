import { createSlice, current } from "@reduxjs/toolkit";
import { deviceApiSlice } from "./deviceApiSlice";

const initialState = {
    list: [],
    isSelectAll: false,
    isLoading: false,
    filters: {}
}

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        selectAllToggle: (state, action) => {
            state.isSelectAll = !state.isSelectAll;
            state.list = state.list.map((device) => {
                return { ...device, isSelected: state.isSelectAll }
            });
        },
        selectRowToggle: (state, action) => {
            state.list = state.list.map((device) => {
                if (current(device).Id === action.payload) {
                    return { ...device, isSelected: !device.isSelected };
                } else {
                    return device;
                }
            });
            const checkSelectAll = (devices) => {
                return devices.every((device) => device.isSelected === true);
            };
            const isSelectAll = checkSelectAll(state.list);
            state.isSelectAll = isSelectAll;
        },
        addFilter: (state, action) => {
            const { filterName, filterValue } = action.payload;
            state.filters[`${filterName}`] = filterValue;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(deviceApiSlice.endpoints.getAllDevices.matchFulfilled, (state, action) => {
                const devices = action.payload;
                state.list = devices?.map((device) => {
                    return {
                        ...device,
                        isSelected: false,
                    }
                });
            })
    }
});

export const { selectAllToggle, selectRowToggle } = deviceSlice.actions;
export const selectDeviceList = (state) => state.device.list;
export const selectFilters = (state) => state.device.filters;
export default deviceSlice.reducer;