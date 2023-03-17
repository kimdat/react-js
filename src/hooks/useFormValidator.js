import React from "react"
import * as Yup from 'yup'

const useFormValidator = (schemas, milliseconds) => {
    const defaultState = {}
    const [state, updateState] = React.useState(defaultState)

    let changeSeed = 0

    const commitChange = (field, value) => {
        Yup.reach(schemas, field).validate(value).then(result => {
            commitResult(field, result)
        }).catch(result => {
            commitResult(field, result)
        })
    }

    const commitResult = (field, result) => {
        let currentItem = state[field]
        if(result instanceof Yup.ValidationError) {
            // Error
            if(currentItem) {
                // First to avoid same result redraw
                if(currentItem.error && currentItem.text === result.message)
                    return

                // Update state
                currentItem.error = true
                currentItem.text = result.message
            } else {
                // New item
                const newItem = {
                    error: true,
                    text: result.message
                }
                state[field] = newItem
            }
        } else {
            // Success and no result, just continue
            if(currentItem === null)
                return
            // Delete current state result
            delete state[field]
        }

        // Update state, for object update, need a clone
        const newState = {...state}
        updateState(newState)
    }

    // Clear timeout seed
    const clearSeed = () => {
        if(changeSeed > 0)
            clearTimeout(changeSeed)
    }

    // Delay change
    const delayChange = (field, value) => {
        clearSeed()

        changeSeed = setTimeout(() => {
            commitChange(field, value)
        }, milliseconds)
    }

    // Merge into the life cycle
    React.useEffect(() => {
        return () => {
            // clearTimeout before dispose the view
            clearSeed()
        }
        // eslint-disable-next-line
    }, [])

    // Return methods for manipulation
    return {
        blurHandler: (event) => {
            const { name, value } = event.currentTarget
            delayChange(name, value)
        },
        changeHandler: (event) => {
            const { name, value } = event.currentTarget
            delayChange(name, value)
        },
        commitChange: commitChange,
        errors: (field) => {
            return state[field]?.error
        },
        texts: (field) => {
            return state[field]?.text
        },
        validate: async (data) => {
            try
            {
                clearSeed()
                return await schemas.validate(data, { strict: true, abortEarly: false, stripUnknown: false })
            }
            catch(e)
            {
                // Reset
                const newState = {}
                // Iterate the error items
                if(e instanceof Yup.ValidationError) {
                    for(let error of e.inner) {
                        // Only show the first error of the field
                        if(newState[error.path] == null) {
                            // New item
                            const newItem = {
                                error: true,
                                text: error.message
                            }
                            newState[error.path] = newItem
                        }
                    }
                }
                updateState(newState)
            }
            return null
        }
    }
}

export default useFormValidator;