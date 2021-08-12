import React, { useState, useEffect, useContext } from 'react'

import { Form, FormControl } from 'react-bootstrap'
import { BiSearch } from 'react-icons/bi'
import MyMultiSelect from '../FormComponents/MyMultiSelect'
import { getProjectsCardData, getUsersProjectsCardData } from '../../../DAL/projects'
import userContext from '../../../utils/AuthContext'
import { Redirect, useHistory } from 'react-router-dom'

export default function FilterSection({ setCardsData, usersDashboard, setLoader, rerender }) {

    const context = useContext(userContext)
    const [filterByData, setFilterByData] = useState({
        sortBy: 'likes',
        amount: 20,
        searchTxt: '',
        difficultyLevels: [],
        requiredTechnologies: [],
        assets: [],
        currentPage: 1,
        userId: usersDashboard ? context.loggedUser.id : ''
    })

    useEffect(() => {
        if (!usersDashboard) {
            delete filterByData['userId']
        } else {
            filterByData['userId'] = context.loggedUser.id
        }
        setFilterByData({ ...filterByData })
    }, [usersDashboard])


    useEffect(() => {
        (async () => {
            let cards;
            if (usersDashboard) {
                cards = await getUsersProjectsCardData(filterByData);
            } else {
                cards = await getProjectsCardData(filterByData);
            }
            if (cards.msg) {
                setCardsData([])
            } else {
                setCardsData([...cards])
                setLoader(false)
            }
        })();
    }, [filterByData, rerender])


    function onInputChangeHandler({ target: { name, value } }) {
        setFilterByData({
            ...filterByData,
            [name]: value
        })
    }

    return (
        <div>
            <Form>
                <Form.Group controlId='search' className='search col-sm-12 col-md-6 col-lg-4 p-0'>
                    <FormControl
                        type="text"
                        placeholder="Search by keyword..."
                        name='searchTxt'
                        onChange={onInputChangeHandler}
                        value={filterByData.searchTxt}
                    />
                    <button disabled className='btn-as-link text-dark'><BiSearch /></button>
                </Form.Group>
                <Form.Row className='col-12 flex-column flex-lg-row'>
                    <p className='mr-4 font-weight-bold d-sm-block'>Filter By</p>
                    <div className='mr-2'>
                        <MyMultiSelect type='requiredTechnologies' onSelectChange={onInputChangeHandler} />
                    </div>
                    <div className='mr-2'>
                        <MyMultiSelect type='difficultyLvls' onSelectChange={onInputChangeHandler} />
                    </div>
                    <div className=''>
                        <MyMultiSelect type='assets' onSelectChange={onInputChangeHandler} />
                    </div>
                </Form.Row>
                <Form.Row className='sort-by-section col-12 flex-column flex-lg-row'>
                    <p className='mr-4 font-weight-bold d-sm-block'>Sort By</p>
                    <Form.Check
                        label="Most Popular"
                        type='radio'
                        id='most-popular'
                        className='font-weight-lighter mr-4'
                        name="sortBy"
                        value='likes'
                        checked={filterByData.sortBy === 'likes'}
                        onChange={onInputChangeHandler}
                    />
                    <Form.Check
                        label="Most Recent"
                        type='radio'
                        id='most-recent'
                        className='font-weight-lighter'
                        name="sortBy"
                        value='timestamp'
                        checked={filterByData.sortBy === 'timestamp'}
                        onChange={onInputChangeHandler}
                    />
                </Form.Row>
            </Form>
        </div>
    )
}
