import React from 'react';
import { Link } from 'react-router-dom';  
import './Home.css';
import Button from '../../components/Button/Button';
import PetSections from '../../components/PetSections/PetSections';
import Steps from '../../components/Steps/Steps';
import { faForward } from '@fortawesome/free-solid-svg-icons';


function Home(){


const petData = [
  {
    imageUrl: "/images/dog.jpg",
    name: "Dogs",
    text: "Loyal and loving, dogs are the ultimate companions who bring joy to every moment. They’re always ready for an adventure or a cuddle by your side.",
    buttonText: "View Dogs",
    buttonLink: "/petsbytype/dog",
  },
  {
    imageUrl: "/images/cat.jpg",
    name: "Cats",
    text: "Independent yet affectionate, cats are a perfect blend of elegance and charm. With their playful antics and soothing purrs, they make every day special.",
    buttonText: "View Cats",
    buttonLink: "/petsbytype/cat",
  },
  {
    imageUrl: "/images/parrot.jpg",
    name: "Parrots",
    text: "Colorful and clever, parrots brighten up your home with their vibrant feathers and curious nature. Their ability to mimic sounds and bond with humans makes them truly unique.",
    buttonText: "View Parrots",
    buttonLink: "/petsbytype/parrot",
  },
  {
    imageUrl: "/images/hamster.jpg",
    name: "Hamsters",
    text: "Tiny adventurers, hamsters are full of energy and curiosity. Watching them explore their world is endlessly entertaining.",
    buttonText: "View Hamsters",
    buttonLink: "/petsbytype/hamster",
  },
  {
    imageUrl: "/images/rabbit.jpg",
    name: "Rabbits",
    text: "Soft and gentle, rabbits bring warmth and joy with their playful hops and cuddly nature. They’re quiet companions who quickly become part of the family.",
    buttonText: "View Rabbits",
    buttonLink: "/petsbytype/rabbit",
  },
  {
    imageUrl: "/images/turtle.jpg",
    name: "Turtles",
    text: "Calm and resilient, turtles remind us to take life slow and steady. Their peaceful presence and long lifespan make them fascinating pets.",
    buttonText: "View Turtles",
    buttonLink: "/petsbytype/turtle",  
  },
];
  
return (
  <>
  <div className='page'>
    <div className="home-image">
      <img 
        src="/images/pozadina112.png" 
        alt="Home Image"
        className="home-image"
      />
      <div className="home-overlay">
        <div className="home-text-container">
          <h2>Welcome to PetBuddy!</h2>
          <h3>Pet Rental Service</h3>
          <p>
            Rent loving pets for temporary companionship.<br />
            Your furry friend is just a click away!
          </p>
        </div>
        <div className="home-page-btn-container">
          <Link to="/pets">
            <Button 
              icon={faForward} 
              text=" VIEW ALL PETS" 
              className="home-page-btn" 
              />
          </Link>
        </div>
      </div>
    </div>

    <Steps/>

      <div className='photo-h-and-text'>
      <div className='photo-h'>
        <img src='/images/slikah.jpg' alt='Slika' />
      </div>
      <div className="text-section">
        <h2>Find your perfect companion!</h2>
        <p>
          Discover a world of furry, feathery, and scaly friends waiting to bring joy into your life. 
          Whether you're looking for a playful puppy, a cuddly cat, or a unique exotic pet, 
          we have something for everyone. Browse through our categories and find the companion 
          that suits your lifestyle. Start your journey with us today!
        </p>
      </div>
      </div>

      <PetSections petData={petData} icon="fa-solid fa-arrow-right" />
  
  <div className="survey-call-to-action">
  <div className="survey-text-container">
  <h2>Not sure which pet is right for you?</h2>
  <p>
    Take our short survey to help us recommend the perfect pet based on your lifestyle and preferences.
    Whether you're a first-time pet owner or an experienced animal lover, we will match you with a companion 
    that suits your needs. Start your journey to find your ideal pet today!
  </p>
  <Link to="/survey">
  <Button className="survey-btn"
    text="Take the survey"
  />
  </Link>
</div>
</div>
</div>
</>
);
}

export default Home;
