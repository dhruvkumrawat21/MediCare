import React, { useLayoutEffect } from 'react'
import {navbarStyles as ns} from "../assets/dummyStyles"
import logoImg from "../assets/logo.png";
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { Calendar, Grid, Home, List, Menu, PlusSquare, UserPlus, Users, X } from 'lucide-react';
import { useAuth, useClerk, useUser } from '@clerk/react';
import { useCallback } from 'react';





const Navbar = () => 
{
    const [open,setOpen] = useState(false);
    const navInnerRef=useRef(null);
    const indicatorRef=useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    //clerk
    const clerk=useClerk?.();
    const {getToken,isLoaded:authLoaded}=useAuth();
    const {isSignedIn,user, isLoaded:userLoaded}=useUser();

    //sliding active indicator
    const moveIndicator = useCallback(() => {
        const container = navInnerRef.current;
        const ind = indicatorRef.current;
        if (!container || !ind) return;

        const active = container.querySelector(".nav-item.active");
        if (!active) {
            ind.style.opacity = "0";
            return;
        }

        const containerRect = container.getBoundingClientRect();
        const activeRect = active.getBoundingClientRect();

        const left = activeRect.left - containerRect.left + container.scrollLeft;
        const width = activeRect.width;

        ind.style.transform = `translateX(${left}px)`;
        ind.style.width = `${width}px`;
        ind.style.opacity = "1";
    }, []);

    //it will be moving in the x axis in 0.12 seconds
    useLayoutEffect(() => {
        moveIndicator();
        const t = setTimeout(() => {
        moveIndicator();
        }, 120);
        return () => clearTimeout(t);
    }, [location.pathname, moveIndicator]);

    //it will hwlp us in scrolling on x-axis fro smaller views 
    useEffect(() => {
        const container = navInnerRef.current;
        if (!container) return;

        const onScroll = () => {
        moveIndicator();
        };
        container.addEventListener("scroll", onScroll, { passive: true });

        const ro = new ResizeObserver(() => {
        moveIndicator();
        });
        ro.observe(container);
        if (container.parentElement) ro.observe(container.parentElement);

        window.addEventListener("resize", moveIndicator);

        moveIndicator();

        return () => {
        container.removeEventListener("scroll", onScroll);
        ro.disconnect();
        window.removeEventListener("resize", moveIndicator);
        };
    }, [moveIndicator]);


    //it will toggling the mobile menu : close the menu when we click on the escape button 
    useEffect(() => {
        const onKey = (e) => {
        if (e.key === "Escape" && open) setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    //when user is signed in 
    //we have to fetch the token and store in the local storage
    useEffect(()=>{
        let mounted=true;
        const storageToken=async()=>{
            if(!authLoaded || !userLoaded) return;
            if(!isSignedIn)
            {
                try{
                    localStorage.removeItem("clerk_token");
                }catch(error)
                {
                    //ignore any error
                }
                return;
            }
            try{
                if(getToken)
                {
                    const token=await getToken();
                    if(!mounted) return;
                    if(token)
                    {
                        try{
                            localStorage.setItem("clerk_token",token);
                        }catch(error){
                            console.warn("Failed to write clerk token in localstorage",error);
                        }
                    }
                }
            }catch(error)
            {   
                console.warn("could not retrive clerk token,",error);
            }
        };
        storageToken();
        return()=>{
            mounted=false;
        };
    },[isSignedIn,authLoaded,userLoaded,getToken]);

    //to open the clerk signedIn
    const handelOpenSignIn=()=>{
        if(!clerk || !clerk.openSignIn)
        {
            console.warn("Clerk is not available");
            return;
        }
        clerk.openSignIn();
        navigate("/h");     //navigte to another page 
    }

    //to handel the sign out 
    const handelSignOut= async()=>{
        if(!clerk || !clerk.signOut)
        {
            console.warn("Clerk is not available");
            return;
        }
        try{
            await clerk.signOut();
        }catch(error)
        {
            console.error("Sign Out failed",error);
        }finally{
            try{
                localStorage.removeItem("clerk_token");
            }catch(error)
            {
                //ignore
            }
            navigate("/");
        }
    }

    return (
        <header className={ns.header}>
            <nav className={ns.navContainer}>
                <div className={ns.flexContainer}>
                    <div className={ns.logoContainer}>
                        <img src={logoImg} alt="logo" className={ns.logoImage}/>
                        <Link to='/'>
                        <div className={ns.logoLink}>MediCare</div>
                        <div className={ns.logoSubtext}>Healthcare Solutions</div>
                        </Link>
                    </div>

                    {/* create a center navigations  */}
                    <div className={ns.centerNavContainer}>
                        <div className={ns.glowEffect}>
                            <div className={ns.centerNavInner}>
                                {/* ADDED: The Missing Indicator Element */}
                                <div 
                                    ref={indicatorRef} 
                                    className="absolute top-0 h-full bg-black/5 rounded-md pointer-events-none transition-all duration-150 ease-out"
                                />
                                <div ref={navInnerRef} tabIndex={0} className={ns.centerNavScrollContainer}
                                style={{
                                    WebkitOverflowScrolling:"touch"
                                }}>
                                    <CenterNavItem
                                        to="/h"
                                        label="Dashboard"
                                        icon={<Home size={16} />}
                                    />
                                    <CenterNavItem
                                        to="/add"
                                        label="Add Doctor"
                                        icon={<UserPlus size={16} />}
                                    />
                                    <CenterNavItem
                                        to="/list"
                                        label="List Doctors"
                                        icon={<Users size={16} />}
                                    />
                                    <CenterNavItem
                                        to="/appointments"
                                        label="Appointments"
                                        icon={<Calendar size={16} />}
                                    />
                                    <CenterNavItem
                                        to="/service-dashboard"
                                        label="Service Dashboard"
                                        icon={<Grid size={16} />}
                                    />
                                    <CenterNavItem
                                        to="/add-service"
                                        label="Add Service"
                                        icon={<PlusSquare size={16} />}
                                    />
                                    <CenterNavItem
                                        to="/list-service"
                                        label="List Services"
                                        icon={<List size={16} />}
                                    />
                                    <CenterNavItem
                                        to="/service-appointments"
                                        label="Service Appointments"
                                        icon={<Calendar size={16} />}
                                    />
                                </div>
                            </div>  
                        </div>
                    </div>
                    {/* Right side for desktop menu */}
                    <div className={ns.rightContainer}>
                        {/* authentication */}
                        {isSignedIn?(
                            <button onClick={handelSignOut} className={ns.signOutButton+ " "+ns.cursorPointer}>
                                Sign Out
                            </button>
                        ):(
                            <div className="hidden : lg:flex items-center gap-2">
                                <button 
                                    onClick={handelOpenSignIn}
                                    className={ns.loginButton + " " + ns.cursorPointer}
                                >
                                    Login
                                </button>
                            </div>
                        )}

                        {/* mobile toggle */}
                        <button onClick={()=>setOpen((v)=> !v)} className={ns.mobileMenuButton}>
                            {open ? <X size={18}/> : <Menu size={18}/>}
                        </button>
                    </div>
                </div>
                {/* Mobile Navigation */}
                {open && (
                    <div className={ns.mobileOverlay} onClick={()=>setOpen(false)}/>
                )}
                {open && (
                    <div className={ns.mobileMenuContainer} id="mobile-menu">
                        <div className={ns.mobileMenuInner}>
                            <MobileItem
                                to="/h"
                                label="Dashboard"
                                icon={<Home size={16} />}
                                onClick={() => setOpen(false)}
                            />

                            <MobileItem
                                to="/add"
                                label="Add Doctor"
                                icon={<UserPlus size={16} />}
                                onClick={() => setOpen(false)}
                            />
                            <MobileItem
                                to="/list"
                                label="List Doctors"
                                icon={<Users size={16} />}
                                onClick={() => setOpen(false)}
                            />
                            <MobileItem
                                to="/appointments"
                                label="Appointments"
                                icon={<Calendar size={16} />}
                                onClick={() => setOpen(false)}
                            />

                            <MobileItem
                                to="/service-dashboard"
                                label="Service Dashboard"
                                icon={<Grid size={16} />}
                                onClick={() => setOpen(false)}
                            />
                            <MobileItem
                                to="/add-service"
                                label="Add Service"
                                icon={<PlusSquare size={16} />}
                                onClick={() => setOpen(false)}
                            />
                            <MobileItem
                                to="/list-service"
                                label="List Services"
                                icon={<List size={16} />}
                                onClick={() => setOpen(false)}
                            />
                            <MobileItem
                                to="/service-appointments"
                                label="Service Appointments"
                                icon={<Calendar size={16} />}
                                onClick={() => setOpen(false)}
                            />
                            <div className={ns.mobileAuthContainer}>
                                {isSignedIn ? (
                                        <button onClick={()=>{
                                            handelSignOut();
                                            setOpen(false);
                                        }} className={ns.mobileSignOutButton}>
                                            Sign Out
                                        </button>
                                    ) : (
                                        <div className="space-y-2">
                                            <button onClick={() => {
                                                handelOpenSignIn();
                                                setOpen(false);
                                            }} className={ns.mobileLoginButton + " " + ns.cursorPointer}>
                                                Login
                                            </button>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;

function CenterNavItem({to, icon, label})
{
    return(
        <NavLink
        to={to} 
        end 
        className={({isActive})=>
        `nav-item ${isActive ? "active":""} ${ns.centerNavItemBase} ${isActive ? ns.centerNavItemActive : ns.centerNavItemInactive}`
        }>
            <span>{icon}</span>
            <span className='font-medium'>{label}</span>
         </NavLink>
    )
}


function MobileItem({to,icon, label,onClick}){
    return (
        <NavLink
             to={to}
             onClick={onClick}
             className={({isActive})=>
                `${ns.mobileItemBase} ${
                    isActive ? ns.mobileItemActive : ns.mobileItemInactive
                }`
            }
        >
            {icon}
            <span className="font-medium text-sm">{label}</span>
        </NavLink>
    );
};