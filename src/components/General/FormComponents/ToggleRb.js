import { ToggleButton, ButtonGroup } from "react-bootstrap";

function ToggleRb({ name, options, onRbChange, checkedValue }) {
    return (
        <div className='toggle-rb'>
            <ButtonGroup >
                {options.map((radio, idx) => ( //value-label / id-name
                    <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant="outline-success"
                        name={name}
                        value={name === 'gender' ? radio.id.toString() : radio.value.toString()}
                        checked={checkedValue ? checkedValue.toString() === (name === 'gender' ? radio.id.toString() : radio.value.toString()) : ''}
                        onChange={(e) => onRbChange(e)}
                    >
                        {radio.label || radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>
        </div>
    );
}

export default ToggleRb;
