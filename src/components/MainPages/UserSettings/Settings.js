import React from 'react'
import { useState, useEffect, useRef, useContext } from 'react'
import { useHistory } from "react-router-dom";
import { Container, Button, Form, Row, Col } from 'react-bootstrap'
import MyModal from '../../General/Modal/MyModal'
import { getUserData, updateUserData } from '../../../DAL/users';
import TextInput from '../../General/FormComponents/TextInput';
import userContext from '../../../utils/AuthContext';
import ToggleRb from '../../General/FormComponents/ToggleRb';
import { inputChangeHandler } from '../../../utils/handlers';
import { validateInput, isFormValid } from '../../../utils/validations';
import { getGenderList, getOccupationsList } from '../../../DAL/staticData';
import MySpinner from '../../General/MySpinner';
import { baseUrl } from '../../../utils/serverRouting';
export default function Settings() {
    const context = useContext(userContext)
    const history = useHistory();
    const elementRef = useRef();

    const [occuptations, setOccupations] = useState([])
    const [gender, setGender] = useState([])

    const [loader, setLoader] = useState(false)
    const [disableBtn, setDisableBtn] = useState(true)
    const [madeChanges, setMadeChanges] = useState(false)
    const [passwordChanged, setPasswordChanged] = useState(false)
    const [dataChangedRes, setDataChangedRes] = useState({})

    const [imgFile, setImgFile] = useState('')
    const [userData, setUserData] = useState({
        userId: {
            value: context.loggedUser.id
        },
        email: {
            value: context.loggedUser.email,
            error: ''
        },
        gender: {
            value: context.loggedUser.gender_id,
            error: ''
        },
        birthdate: {
            value: context.loggedUser.birthdate,
            error: ''
        },
        occupation: {
            value: context.loggedUser.occupation_id,
            error: ''
        },
        profileImg: {
            value: context.loggedUser.profile_img,
            error: ''
        }
    })
    const [previewedPicture, setPreviewedPicture] = useState(`${baseUrl}/public/${userData.profileImg.value}`)

    const fetchOccupations = async () => {
        const occupationsOptions = await getOccupationsList()
        setOccupations([...occupationsOptions])
    }
    const fetchGender = async () => {
        const genderOptions = await getGenderList()
        setGender([...genderOptions])
    }

    useEffect(() => {
        if (!context.loggedUser.id) {
            history.push('/home');
        }
        setDisableBtn(true)
        fetchOccupations();
        fetchGender();
    }, [])

    useEffect(() => {
        if (madeChanges) setDisableBtn(!isFormValid(userData))
    }, [userData])

    function changeProfileImg(e) {

        setPreviewedPicture(URL.createObjectURL(e.target.files[0]))
        setImgFile(e.target.files[0])
        setUserData({
            ...userData,
            profileImg: {
                ...userData.profileImg,
                value: e.target.files[0]
            }
        })
    }

    function updatePasswordResponse() {
        setPasswordChanged(true)
    }

    async function saveSettings(e) {
        e.preventDefault();
        if (isFormValid(userData)) {
            setLoader(true)
            const formData = new FormData();
            for (const input in userData) {
                if (input === 'profileImg') {
                    if (imgFile) formData.append(input, imgFile);
                    break;
                }
                if (userData[input].value) {
                    formData.append(input, userData[input].value)
                }
            }

            const res = await updateUserData(formData)
            if (res) {
                setDataChangedRes({ msg: 'Changes saved successfully!' })
                const updatedUser = await getUserData(context.loggedUser.id)
                context.setLoggedUser(updatedUser)
            }
            else {
                setDataChangedRes({ msg: 'Email address already taken' })
            }
            setLoader(false)
            setDisableBtn(true)
        }
    }

    return (
        <Container className='settings mt-5'>

            <h2 className='mb-0 pb-0'><span className='font-weight-normal'>Settings /</span> {context.loggedUser.username} </h2>
            <small className='text-success'>{dataChangedRes.msg && dataChangedRes.msg.includes('success') ? dataChangedRes.msg : ''}</small>
            {loader && <MySpinner />}

            {!loader && <Form className='mt-5' onSubmit={saveSettings}>
                <Form.Row className='mb-5'>
                    <Col className='mr-md-5' sm={12} md={5} lg={3}>

                        <TextInput
                            controlId='email'
                            type='email'
                            label='Email'
                            name='email'
                            value={userData.email.value}
                            error={userData.email.error || (dataChangedRes.msg && dataChangedRes.msg.includes('success') ? '' : dataChangedRes.msg)}
                            onChange={(e) => {
                                setUserData(inputChangeHandler(e, userData))
                                setMadeChanges(true)
                            }}
                            onBlur={(e) => setUserData(validateInput(e, userData))
                            }
                        />


                        <div className='mb-5'>
                            <MyModal type='password' updatePasswordResponse={updatePasswordResponse} />
                            {passwordChanged && <small className='text-success d-block'>Password changed successfully!</small>}
                        </div>
                    </Col>

                    <Col className='mb-5 mr-md-5' sm={12} md={5} lg={3}>
                        <Form.Group controlId="gender">
                            <Form.Label>
                                Gender:
                            </Form.Label>
                            <ToggleRb
                                name='gender'
                                options={gender}
                                checkedValue={userData.gender.value}
                                onRbChange={(e) => {
                                    setUserData(inputChangeHandler(e, userData))
                                    setMadeChanges(true)
                                }}
                            />
                        </Form.Group>

                        <div className='mb-5'>
                            <TextInput
                                controlId="birthdate"
                                label="Birthdate:"
                                type="date"
                                name="birthdate"
                                value={userData.birthdate.value}
                                onChange={(e) => {
                                    setUserData(inputChangeHandler(e, userData))
                                    setMadeChanges(true)
                                }}
                            />
                        </div>

                        <Form.Group controlId="occupationSelect">
                            <Form.Label>Occupation:</Form.Label>
                            <Form.Control as="select"
                                name='occupation'
                                value={userData.occupation.value}
                                onChange={(e) => {
                                    setUserData(inputChangeHandler(e, userData))
                                    setMadeChanges(true)
                                }}
                            >
                                <option value={null} selected>Select occupation</option>
                                {occuptations.map((occupation, idx) => (
                                    <option key={idx}
                                        value={occupation.id}
                                        selected={occupation.id === context.loggedUser.occupation_id}
                                    >
                                        {occupation.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                    </Col>

                    <Col md={12} lg={4} className='text-center'>
                        <Form.Group controlId="profileImg" className='user-profile-img'>
                            <Form.Label className='d-block'>Profile Pic:</Form.Label>
                            <img src={previewedPicture} className='img-fluid rounded-circle' alt='user preview' />
                            <Button onClick={(e) => { elementRef.current.click() }}>Edit</Button>
                            <Form.File hidden ref={elementRef} onChange={(e) => {
                                changeProfileImg(e)
                                setMadeChanges(true)
                            }} accept='image/*'></Form.File>
                        </Form.Group>
                    </Col>
                </Form.Row>

                <Row className='justify-content-end'>
                    <Button variant="primary" type="submit" className='mt-5 mb-5' disabled={disableBtn}>
                        Save Settings
                    </Button>
                </Row>
            </Form>}

        </Container>
    )
}
