import React from 'react'
import { Link } from 'react-router-dom'
const Home = () => {
    return (
     
            <div className='min-h-screen flex flex-col justify-center items-center'>
               
                <h1 className='text-6xl mb-4 font-sans'>Welcome to Tiny URL🔗</h1>
                <p className='text-3xl mb-4 font-sans'>Convert the large URL into short</p>
                <Link to='/app' className='bg-orange-500 font-sans shadow-lg px-3 py-2 text-2xl text-white rounded hover:bg-orange-700'>Let's Search</Link>
            </div>
            
     
        
        
    )
}

export default Home
