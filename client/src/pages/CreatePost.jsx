import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { Loader, FormField } from '../components';


const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setform] = useState({
    name: '',
    prompt: '',
    photo: '',
  });
  const [generatingImg, setgeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);


  const generateImage = async () => {
    if (form.prompt) {
      try {
        setgeneratingImg(true);
        const response = await fetch('http://localhost:8080/api/v1/dalle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: form.prompt }),
        })
        const data = await response.json();
        setform({ ...form, photo: `data:image/jpeg;base64,${data.photo}` })
      } catch (error) {
        // alert(error);
        console.log(error);
      }
      finally {
        setgeneratingImg(false);
      }
    }
    else {
      alert('Please enter a valid prompt');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form)
        })
        await response.json();
        navigate('/');
      }
      catch (error) {
        console.log(error);
      }
      finally {
        setLoading(false);
      }
    }
    else {
      alert('Please enter a valid prompt');
    }
  }


  const handleChange = (e) => setform({ ...form, [e.target.name]: e.target.value });
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setform({ ...form, prompt: randomPrompt })
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Create
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Create Images By AI & Share
        </p>

      </div>
      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Name"
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={form.name}
            handleChange={handleChange}
          />
      <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
      
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 justify-center items-center">
            {form.photo ? (
              <img className='w-full h-full object-contain'
                src={form.photo}
                alt={form.prompt}
              />

            ) : (<img className='w-full h-full object-contain opacity-30'
              src={preview}
              alt={preview}
            />)}
            {generatingImg &&

              (<div
                className='absolute inset-0 justify-center items-center z-0 flex bg-[rgba(0,0,0,0.5)]'
              >
                <Loader />
              </div>)
            }

          </div>

        </div>
        <div className="mt-5 flex gap-5">
          <button
            type='button'
            onClick={generateImage}
            className='text-white bg-blue-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center '
          >
            {generatingImg ? 'Generating....' : 'Generate'}

          </button>
        </div>
        <div className="mt-10">
          <p className='mt-2 text-gray-600 text-[14px]'>You can share your generated image for community</p>
          <button
            type='submit'

            className='mt-3 text-white bg-blue-500 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center '
          >
            {loading ? 'Sharing....' : 'Share With the comunity'}

          </button>


        </div>
      </form>

    </section>
  )
}

export default CreatePost