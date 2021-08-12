import React, { useState } from 'react'
import ToggleRb from '../General/FormComponents/ToggleRb'
import { changeBaseUrl } from '../../utils/serverRouting'
import { useHistory } from 'react-router-dom'

export default function ChooseServer() {
    const history = useHistory();
    const [chosenServer, setChosenServer] = useState('')

    const setServer = (e) => {
        setChosenServer(e.target.value)
        changeBaseUrl(+e.target.value)
        return history.push('/home')
    }

    return (
        <div className='text-center mt-5'>
            <h2 className='mb-5'>Choose a server</h2>
            <ToggleRb
                name='server'
                options={
                    [{ value: 1, label: 'Node - Express.js' },
                    { value: 2, label: 'Pyhton - Flask' }]
                }
                onRbChange={setServer}
                checkedValue={chosenServer}
            />
        </div>
    )
}
