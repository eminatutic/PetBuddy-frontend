import React from 'react';
import './About.css';


function About() {

  return (
    <>
    <div className='about-page'>
      <div className="about-container">
        <div className="about-header">
          <h1>About PetBuddy</h1>
          <p>Your trusted companion for pet rentals!</p>
        </div>

        <div className="about-content">
          <section className="mission-vision">
            <h2>Our mission & vision</h2>
            <p>
              At PetBuddy, we are dedicated to helping people experience the joy of having a pet, even if it's only for a short time.
              Whether you’re looking for a furry friend for a few days, or need a companion for a special event or vacation,
              we provide a wide selection of pets to suit your needs. We believe that every pet deserves love and care,
              and we ensure that all our pets are well cared for while they are with you.
            </p>
            <p>
              Our vision is to make pet ownership accessible to everyone, bringing happiness and companionship into the lives of people
              through responsible pet rentals.
            </p>
          </section>

          <section className="image-gallery">
           
            <div className="images">
              <div className="image-item"><img src="/images/pic1.jpg" alt="Pet 1" /></div>
              <div className="image-item"><img src="/images/pic2.jpg" alt="Pet 2" /></div>
              <div className="image-item"><img src="/images/pic3.jpg" alt="Pet 3" /></div>
              <div className="image-item"><img src="/images/pic4.jpg" alt="Pet 4" /></div>
            </div>
          </section>

          <section className="contact-us">
            <div className="contact-text">
              <h2>Contact us</h2>
              <p>
                If you have any questions or need assistance, feel free to reach out. We're here to help you find the perfect pet companion!
              </p>
              <p>Email: <strong>petbuddy_support@gmail.com</strong></p>
              <p>Phone: <strong>+1 555-987-6543</strong></p>
              <p>Address: <strong>123 Pet Haven Lane</strong></p>
            </div>
            <div className="organization-image">
              <img src="./images/organization1.jpg" alt="Organization" />
            </div>
          </section>

          <section className="who-we-are">
            <h2>Who are we</h2>
            <p>
              This platform is part of a school project developed by Tech Innovators, a passionate team consisting of a student and their professor.
              Our goal is to combine technology and creativity to solve real-world challenges while learning and growing through collaboration.
            </p>
        
          </section>
        </div>
      </div>
      </div>
    </>
  );
}

export default About;
