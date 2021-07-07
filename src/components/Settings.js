import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useLocation, useParams } from "react-router-dom";
import { Container, Button, Form, Row, Col, ButtonGroup, ToggleButton } from 'react-bootstrap'
import imgPlaceholder from '../images/img-placeholder.png'
import MyModal from './MyModal'
import api from '../DAL/api'
export default function Settings() {
    const location = useLocation();
    const { uid } = useParams();
    const elementRef = useRef();

    //temp for mockup
    const [dataChanged, setDataChanged] = useState(false)
    const [passwordChanged, setPasswordChanged] = useState(false)


    const [userData, setUserData] = useState({})
    const [previewedPicture, setPreviewedPicture] = useState(imgPlaceholder)
    const [imgFile, setImgFile] = useState()

    useEffect(() => {
        api.getUserData(1).then(data => { //passed userId manually for now
            const userImg = data[0].profile_img
            if (userImg) {
                setPreviewedPicture(`http://localhost:3100/static/${userImg}`)
            }
            setUserData({ ...data[0] })
        })
    }, [])


    function handleFormSubmit(e) {
        e.preventDefault()
        const formData = new FormData();
        formData.append("userId", '1');
        formData.append('profileImg', imgFile);
        //console.log(formData.get('userId'))
        api.updateUserData(formData).then(data => setDataChanged(true))
    }

    function changeProfileImg(e) {
        setPreviewedPicture(URL.createObjectURL(e.target.files[0]))
        setImgFile(e.target.files[0])
    }



    return (
        <Container className='settings mt-5'>
            <h2 className='mb-0 pb-0'><span className='font-weight-normal'>Settings /</span> {userData.username} </h2>
            {dataChanged && <small className='text-success'>Changes saved successfully!</small>}
            <Form className='mt-5' onSubmit={handleFormSubmit}>
                <Form.Row className='mb-5'>
                    <Col className='mr-md-5' sm={12} md={5} lg={3}>
                        <Form.Group controlId="email" className='mb-5'>
                            <Form.Label>Email address:</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={userData.email} className='w-100' />
                            {/* <FormControl.Feedback type='invalid'></FormControl.Feedback> */}
                        </Form.Group>

                        <div className='mb-5'>
                            <MyModal type='password' />
                            {passwordChanged && <small className='text-success d-block'>Password changed successfully!</small>}
                        </div>
                    </Col>
                    <Col className='mb-5 mr-md-5' sm={12} md={5} lg={3}>
                        <Form.Group controlId="gender" className='mb-5'>
                            <Form.Label className='d-block'>Gender:</Form.Label>
                            <ButtonGroup className=''>
                                <ToggleButton type='radio' checked={false}>Female</ToggleButton>
                                <ToggleButton type='radio' checked={false}>Male</ToggleButton>
                                <ToggleButton type='radio' checked={false}>Other</ToggleButton>
                            </ButtonGroup>
                            {/* <FormControl.Feedback type='invalid'></FormControl.Feedback> */}
                        </Form.Group>

                        <Form.Group controlId="birthdate" className='mb-5'>
                            <Form.Label className='d-block'>Birthdate:</Form.Label>
                            <input type='date' />
                            {/* <FormControl.Feedback type='invalid'></FormControl.Feedback> */}
                        </Form.Group>


                        <Form.Group controlId="occupationSelect">
                            <Form.Control as="select">
                                <option>Select your occupation:</option>
                                <option>Student</option>
                                <option>Junior Developer</option>
                                <option>Senior Developer</option>
                                <option>Other</option>
                            </Form.Control>
                        </Form.Group>

                    </Col>

                    <Col md={12} lg={4} className='text-center'>
                        <Form.Group controlId="profileImg" className='user-profile-img'>
                            <Form.Label className='d-block'>Profile Pic:</Form.Label>
                            <img src={previewedPicture} className='img-fluid rounded-circle' />
                            <Button onClick={(e) => { elementRef.current.click() }}>Edit</Button>
                            <Form.File hidden ref={elementRef} onChange={changeProfileImg} accept='image/*'></Form.File>
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Row className='justify-content-end'>
                    <Button variant="primary" type="submit" className='mt-5 mb-5'>
                        Save Settings
                    </Button>
                </Row>
            </Form>
        </Container>
    )
}
