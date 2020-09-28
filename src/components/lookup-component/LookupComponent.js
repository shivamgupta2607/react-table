import React, { useState } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core'

export default function LookupComponent(props) {

    const [state, setState] = useState(props.value == null ? Object.keys(props.column.lookup)[0] : props.value)
    const handleOnChange = (e, value) => {
        e.target.value = value != null && value.id
        props.onSelect(e, props.rowIndex, props.column.name)
        props = {
            ...props, value: e.target.value
        }
        setState(props.value)
    }

    const handleOnKeyPress = (e) => {
        if (e.key != null && e.key === 'Enter') {
            props.onAddNewLookup(e, props.rowIndex, props.column.name)
        }
    }

    function getSelectedItem() {
        const item = props.column.lookup.find((opt) => opt.id === state);
        return item || {};
    }

    return (
        <Autocomplete className="auto-complete-box"
            value={getSelectedItem()}
            id="disable-clearable"
            disableClearable
            options={props.column.lookup}
            getOptionLabel={(option) => option.title}
            onChange={handleOnChange}
            onKeyPress={handleOnKeyPress}
            renderInput={(params) => <TextField {...params} label={props.column.title} />}
        />
    )
}