import React, {useState} from 'react';
import {useWedding} from './context/WeddingContext';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Budget from './pages/Budget';
import Guests from './pages/Guests';
import Entourage from './pages/Entourage';
import Ceremonies from './pages/Ceremonies';
import Vendors from './pages/Vendors';
import Calendar from './pages/Calendar';
import WeddingDay from './pages/WeddingDay';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import PlannerHub from './pages/PlannerHub';

export default function App(){
 const {data,active,authReady,accountReady,loading}=useWedding(); const [page,setPage]=useState('dashboard');
 if(!authReady||!accountReady)return <main className="auth-page"><div className="auth-card"><p className="eyebrow">MI BODA PLANNER</p><h1>Recuperando tu sesión…</h1><p>{loading?'Estamos recuperando tus bodas guardadas…':'Estamos comprobando tu cuenta y tus bodas guardadas.'}</p></div></main>;
 if(!data.user)return <Auth/>;
 if(!active)return <Onboarding/>;
 const pages={dashboard:<Dashboard go={setPage}/>,tasks:<Tasks/>,budget:<Budget/>,guests:<Guests/>,entourage:<Entourage/>,ceremonies:<Ceremonies/>,vendors:<Vendors/>,calendar:<Calendar/>,day:<WeddingDay/>,pricing:<Pricing/>,settings:<Settings/>,planner:<PlannerHub/>};
 return <Layout page={page} setPage={setPage}>{pages[page]||pages.dashboard}</Layout>
}
