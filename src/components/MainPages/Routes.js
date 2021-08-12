import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import ChooseServer from './ChooseServer';
import Homepage from '../MainPages/Homepage/Homepage';
import ExplorePage from '../MainPages/Explore/ExplorePage';
import Settings from '../MainPages/UserSettings/Settings';
import EditProject from '../MainPages/AddEditProject/EditProject';
import ProjectDisplay from '../MainPages/ProjectDisplay/ProjectDisplay';

export default function Routes() {
    return (
        < Switch >
            <Route path="/server">
                <ChooseServer />
            </Route>
            <Route path="/home">
                <Homepage />
            </Route>
            <Route exact path="/explore">
                <ExplorePage />
            </Route>
            <Route path="/usersprojects/:uid">
                <ExplorePage type='users' />
            </Route>
            <Route path="/settings/:uid">
                <Settings />
            </Route>
            <Route path="/projectdisplay/:pid">
                <ProjectDisplay />
            </Route>
            <Route path="/editproject/:pid">
                <EditProject />
            </Route>
            <Route path='*'>
                <Redirect to='/home'></Redirect>
            </Route>
        </Switch >
    )
}

