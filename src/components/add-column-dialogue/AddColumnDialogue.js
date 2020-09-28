import React, { useState } from 'react'
import { TextField, Select, MenuItem } from '@material-ui/core'
import "./AddColumnDialogue.scss"


export default function AddColumnDialogue(props) {

    const [state, setState] = useState({ name: "", type: "text" });

    function handleOnSubmit(event) {
        if (!(isBlank(state.name))) {
            props.addColumnFunction(state.name, state.type);
            props.popState.close()
            event.preventDefault();
        }
    }

    function handleNameOnChange(event) {
        let targetValue = event.target.value
        setState((s) => {
            return {
                ...s,
                name: targetValue
            };
        });
    }

    function handleTypeOnChange(event) {
        let targetValue = event.target.value
        setState((s) => {
            return {
                ...s,
                type: targetValue
            };
        });
    }
    function handleOnKeyPress(event) {
        if (event.key != null && event.key === 'Enter') {
            handleOnSubmit(event)
        }
    }

    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

    return (
        <div>
            <form onSubmit={handleOnSubmit} onKeyPress={handleOnKeyPress}>
                <div className="form-wrapper">
                <TextField id="standard-basic" label={props.val} onChange={handleNameOnChange} />
                <Select value={state.type} onChange={handleTypeOnChange}>
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="lookup">Single Select</MenuItem>
                    </Select>
                    </div>
            </form>
        </div>
    );

}