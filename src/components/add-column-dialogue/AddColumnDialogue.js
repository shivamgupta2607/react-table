import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';

export default function AddColumnDialogue(props) {

    const [state, setState] = useState("");

    function handleOnSubmit(event) {
        props.addColumnFunction(state);
        props.popState.close()
        event.preventDefault();
    }

    return (
        <div>
            <form onSubmit={handleOnSubmit}>
                <TextField id="standard-basic" label={props.val} onChange={(e) => setState(e.target.value)} />
            </form>
        </div>
    );

}