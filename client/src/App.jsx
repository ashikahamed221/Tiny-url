import React, { useState } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
const App = () => {

  const [url, seturl] = useState("");
  const [shorturl, setshorturl] = useState("");

  const handleclick = async () => {
    if (!url) {
      toast.error("Please enter your URL")
    }
    try {
      const response = await axios.post('http://localhost:4000/api/shorturl', {

        Originalurl: url,
      })

      setshorturl(response.data.Shorturl)
      console.log(response)
      
      
    }
    catch (error) {
      console.log("Error", error)
    }

  }

  return (
    <div className='min-h-screen bg-white text-black flex items-center justify-center'>
      <div className='mb-4 text-center text-2xl md:text-3xl font-sans'>
        Tiny<span className='text-orange-500'>URL</span>
        <div className='text-black mt-5 text-1xl'>
          <input type="text" className='border-1 p-2 rounded-xl text-1xl focus:border-orange-500 focus:outline focus:outline-orange-500
          md:w-3xl' placeholder='Enter Your URL Here!..'
            value={url}
            onChange={(e) => seturl(e.target.value)} />
          <div>
            <button className='mt-4 bg-orange-500 px-3 text-white py-2 rounded-lg text-2xl hover:bg-orange-600 w-full md:w-3xl font-sans'
              onClick={handleclick}>Short URL</button>
              <ToastContainer />
          </div>
        
         
         {shorturl ? (
          <div>
            <p className='text-sm mt-4'>Your Shorten Link</p>
            <a className='mt-4 underline text-md ' href={shorturl}>
              {shorturl}
              </a>
          </div>
         ): <p className='mt-4 text-2xl'>No Links</p>} 
        </div>
      </div>
    </div>
  )
}

export default App
