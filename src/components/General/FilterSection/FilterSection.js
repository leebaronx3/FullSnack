import React, { useState, useEffect, useContext } from 'react'

import { Form, FormControl } from 'react-bootstrap'
import { BiSearch } from 'react-icons/bi'
import MyMultiSelect from '../FormComponents/MyMultiSelect'
import { getProjectsCardData, getUsersProjectsCardData } from '../../../DAL/projects'
import userContext from '../../../utils/AuthContext'

export default function FilterSection({ setCardsData, usersDashboard, setLoader }) {
    const context = useContext(userContext)
    const [filterByData, setFilterByData] = useState({
        sortBy: 'likes',
        amount: 20,
        searchTxt: '',
        difficultyLevels: [],
        requiredTechs: [],
        assets: [],
        currentPage: 1,
        userId: context.loggedUser.id
    })

    useEffect(async () => {
        let cards;
        // setLoader(true)
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
    }, [usersDashboard, filterByData])


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
                    <button className='btn-as-link text-dark'  ><BiSearch /></button>
                </Form.Group>
                <Form.Row className='col-12'>
                    <p className='mr-4 font-weight-bold'>Filter By</p>
                    <div className='mr-2'>
                        <MyMultiSelect type='reqTechs' onSelectChange={onInputChangeHandler} />
                    </div>
                    <div className='mr-2'>
                        <MyMultiSelect type='difficultyLvls' onSelectChange={onInputChangeHandler} />
                    </div>
                    <div className=''>
                        <MyMultiSelect type='assets' onSelectChange={onInputChangeHandler} />
                    </div>
                </Form.Row>
                <Form.Row className='sort-by-section col-12'>
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
