import {useState, useEffect, useContext, Fragment} from "react";
import AuthContext from "../context/AuthContext";
import {
    ArrowDownIcon, BeakerIcon,
    BellIcon, ChartPieIcon,
    ChevronDownIcon, CogIcon,
    CollectionIcon, FolderIcon,
    LogoutIcon,
    SearchIcon
} from "@heroicons/react/outline";
import {UserIcon} from "@heroicons/react/solid";
import {LoginModal} from "./LoginModal";
import {createPortal} from "react-dom";

const themeChange = require("theme-change")

export const Navbar = (props) => {
    const {user} = useContext(AuthContext)
    return (
        <Fragment key={"navBar"}>
            <div className={'flex flex-col sticky h-[100vh]  z-20'} key={"horizontal-navbar"}>
                <div className={'h-20 w-[100vw] flex sticky z-10 top-0'} key={"horizontal-nav-chileOne"}>
                    <div className={'h-full  w-24 bg-indigo-500 flex justify-center items-center'}>
                        <h1 className={'font-bold text-3xl text-accent-content'}>MH</h1>
                    </div>
                    <nav className={'w-[95%]  h-20 bg-base-100 '} key={"horizontal-nae-childTwo"}>
                        <div className={'flex justify-between h-full w-full'}>
                            <div className={'flex h-full justify-center items-center px-10 gap-4'}>
                                <SearchIcon className={'w-5 h-5 stroke-base-300'}/>
                                <input type={"text"} placeholder={"search..."}
                                       className={'input-bordered input border-none'}/>
                            </div>
                            <div className={'flex'} key={"horizontal-nav-childThree"}>
                                <div className={'flex justify-center items-center gap-2'}>
                                    {user ?
                                        <>
                                            <p className={'text-lg font-semibold'}>{user ? user.username : "Unknown"}</p>
                                            <ChevronDownIcon className={'w-5 h-5 stroke-gray-400'}/>
                                        </>
                                        :

                                        <>
                                        </>}
                                </div>

                                <div className="divider divider-horizontal py-4"></div>

                                <div className={'flex justify-center items-center gap-5 pr-10'}>
                                    <div className={'indicator'}>
                                        <span
                                            className="indicator-item badge-xs indicator-top indicator-end badge bg-indigo-400 border-none"></span>
                                        <BellIcon className={'w-6 h-6 stroke-gray-400'}/>
                                    </div>
                                    <LogoutIcon className={'w-6 h-6 stroke-gray-400'}/>
                                </div>
                            </div>
                        </div>

                    </nav>
                </div>

                <div className={'flex h-max'} key={"vertical-navbar"}>
                    <nav className={'bg-current w-max sticky top-20 left-0 h-full h-[91.8vh]'}>
                        <div className={'h-full w-24'}>

                            <div className={'w-full h-full flex flex-col justify-between '}>
                                <div className={'w-full flex flex-col gap-8 justify-center items-center py-10'}>
                                    <div className={"p-3 hover:bg-white transition-colors duration-500 rounded-box"}>
                                        <FolderIcon
                                            className={'stroke-gray-500  fill-gray-700  w-7 h-7  transition-all duration-500 hover:fill-white hover:stroke-indigo-400'}/>
                                    </div>
                                    <div className={"p-3 hover:bg-white transition-colors duration-500 rounded-box"}>
                                        <ChartPieIcon
                                            className={'stroke-gray-500 fill-gray-700 w-7 h-7  transition-all duration-500 hover:fill-white hover:stroke-indigo-400'}/>
                                    </div>
                                    <div className={'p-3 hover:bg-white transition-colors duration-500 rounded-box'}>
                                        <BeakerIcon
                                            className={'stroke-gray-500 fill-gray-700 w-7 h-7 transition-all duration-500 hover:fill-white hover:stroke-indigo-400'}/>
                                    </div>
                                </div>
                                <div className={'flex justify-center items-center py-4 border-t border-t-gray-600'}>
                                    <div className={'p-3 hover:bg-white transition-colors duration-500 rounded-box'}>
                                        <CogIcon
                                            className={'stroke-gray-500 fill-gray-700 w-7 h-7 transition-all duration-500 hover:fill-white hover:stroke-indigo-400'}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </nav>
                    {props.children}
                </div>


            </div>

        </Fragment>
    )
}


