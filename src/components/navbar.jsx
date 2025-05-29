import  { useEffect, useState } from 'react'

const Navbar = () => {

  const [scrolled , setScrolled] = useState(false);

  useEffect(()=>{
    const handleScroll = () =>{
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    }

    window.addEventListener('scroll',handleScroll);

    return ()=> window.removeEventListener('scroll',handleScroll);
  }, [])

  return (
    <header className={`navbar`}>
      <div className='inner mt-1'>
        <a className='logo' href="#hero">
          Priyanshu Mrinal Jha
        </a>
       

        {/* Contact Page */}
        
        <a href="#contact" className='contact-btn group'>
          <div className='inner'>
            <span className='text-xl font-bold'>
              GenAI -- Cohort
            </span>
          </div>
        </a>
      </div>
    </header>
  )
}

export default Navbar