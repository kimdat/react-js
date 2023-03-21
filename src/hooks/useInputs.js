import React from 'react';

export const useInputs = (fieldNames) => {
    const initState = fieldNames.reduce((state, fieldName) => {
        state[fieldName] = "";
        return state;
    }, {});

    const [state, setState] = React.useState(initState);

    const inputs = (fieldName) => {
        return state[fieldName];
    }

    const setInputs = (fieldName, newValue) => {
        return setState({
            ...state, [fieldName]: newValue
        });
    }

    const getAllInputs = () => state;

    const resetInputs = () => setState(initState);

    return [inputs, setInputs, getAllInputs, resetInputs];
}