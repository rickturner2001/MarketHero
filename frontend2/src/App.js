import React from 'react';
import './App.css';
import {HomePage} from "./pages/HomePage";
import {LoginPage} from "./pages/LoginPage";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {PrivateRoute} from "./utils/PrivateRoute";
import AuthContext, {AuthProvider} from "./context/AuthContext";
import {Navbar} from "./components/Navbar";
import {Application} from "./components/Application";
import {WatchLists} from "./pages/WatchLists";
import {WatchlistView} from "./pages/WatchlistView";
import {Dashboard} from "./pages/Dashboard";
import {Theme} from "react-daisyui";
import {StrategiesMenu} from "./components/menus/StrategiesMenu";
import {StrategiesAccount} from "./pages/strategies/StrategiesAccount";
import {StrategyCreation} from "./pages/StrategyCreation";
import {useContext} from "react";


function App() {


    return (
        <Theme dataTheme={"emerald"}>

            <div className="App bg-gray-100 overflow-x-hidden scrollbar scrollbar-thumb-gray-500  scrollbar-track-gray-100 scrollbar-thin">

                <Router>
                    <AuthProvider>
                        <Navbar>
                            <div className={' bg-gray-100 h-full  w-full  p-8'}>
                                <div className={'relative bg-gray-100 pb-32'}>
                                    <Route component={HomePage} path='/' exact/>
                                    <PrivateRoute component={Application} path='/application'/>
                                    <PrivateRoute component={WatchLists} path='/watchlists'/>
                                    <PrivateRoute component={WatchlistView} path='/watchlist/:id'/>
                                    <PrivateRoute component={StrategiesMenu} path='/strategies'/>
                                    <PrivateRoute component={StrategiesAccount} path='/my-strategies'/>
                                    <PrivateRoute component={Dashboard} path='/dashboard'/>
                                    <PrivateRoute component={StrategyCreation} path='/temp-strategies'/>
                                    <Route component={LoginPage} path='/login'/>
                                </div>
                            </div>
                        </Navbar>


                    </AuthProvider>
                </Router>


            </div>
        </Theme>

    );
}

export default App;