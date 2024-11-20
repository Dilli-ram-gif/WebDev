'use strict';

///////////////////////////////////////
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));


// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//Button scrolling
btnScrollTo.addEventListener('click', function(e){
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());


  //The property pageXOffset and pageOffsetY have been deprecated. 
  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log('Current scroll (X/Y)', window.scrollX, window.scrollY);

  //We can also see the height and width of the portion of the page we see
  console.log('Height and Width of viewport:', document.documentElement.clientHeight, document.documentElement.clientWidth);

  //Scrolling
  // window.scrollTo(
  //   s1coords.left + window.scrollX, s1coords.top + window.scrollY
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  //More polished approach
  section1.scrollIntoView({behavior: 'smooth'});  

});



///////////////////////////////////////
//Page Navigation
// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click', function(e){
//     
//   })
// })

//Event Delegation
//1. Add event listener to common parent element
//2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();

  //Matching strategy
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({
    behavior: 'smooth'});
  }
});


/////////////////////////////////////////
////////////////////////////////////////
//Tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');


//This is the bad practice
// tabs.forEach(t => t.addEventListener('click',() => console.log('TAB')));

tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  //Guard clause
  if(!clicked) return;


  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove(
    'operations__content--active'
  ))

  //Active tab
  clicked.classList.add('operations__tab--active');

  //Activate content area
  // console.log(clicked.dataset.tab);
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');

})


//Menu Fade Animation
const nav = document.querySelector('.nav');

const handleHover = function (e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el =>{
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));


//Sticky Navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function(){
//   console.log(window.scrollY);

//   if(window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky'); 
// })


//Sticky Navigation: Intersection Observer API
// const obsCallback = function(entries, observer){
//   entries.forEach(entry =>{
//     console.log(entry);
//   })
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// }

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);



const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);


//Reveal Sections
const allSections = document.querySelectorAll('.section');
const revealSection = function(entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section){
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
})


//Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');
  
const loadImg = function(entries, observer){
  const [entry] = entries;
  console.log(entry);

  if(!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function (){
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));

//Slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let curSlide = 0;
const maxSlide = slides.length;

const slider = document.querySelector('.slider');
slider.style.transform = 'scale(0.4) translateX(-800px)';
slider.style.overflow = 'visible';

//The code below has been optimized adding goToSlide function.
// slides.forEach((s, i) => (s.style.transform = `translateX(${100*i}%)`));
// 0%, 100%, 200%, 300%

const goToSlide = function(slide) {
  slides.forEach(
    (s,i) => {s.style.transform = `translateX(${100*(i - slide)}%)`}
  );
};
goToSlide(0);

//Next slide 
btnRight.addEventListener('click', function(){
  if(curSlide === maxSlide - 1){
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);

  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100*(i - curSlide)}%)`)
  );
});

///////////////////////////////////////
///////////////////////////////////////
/*=============== SELECTING ELEMENTS============= */

/* 
console.log(document.documentElement)
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1')

const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

/*========== CREATING AND INSERTING ELEMENTS ===========*/
//insertAdjacentHTML

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and analytics.';

// message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>';

// // header.prepend(message);
// header.append(message);
// // header.append(message.cloneNode(true));

// //beore and after
// // header.before(message);
// // header.after(message);

// //Delete elements
// document.querySelector('.btn--close-cookie').addEventListener('click', function(){
//   message.remove();
// })


// Create the message element and set its content

/* const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>';

// Append the message to the header
header.append(message);

// Now, add the event listener after the message is appended to the DOM
document.querySelector('.btn--close--cookie').addEventListener('click', function() {
  message.remove();  //This method has arrived recently 
  //Alternative: message.parentElement.removeChild(message);
});

//Styles for the message
message.style.backgroundColor = '#00416A';
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10)+ 30 +'px'; 

//Change CSS variable
document.documentElement.style.setProperty(
  '--color-primary', 'orangered'
);

//Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

//We not only read but also create the attribute
logo.alt = 'Beautiful minimilist logo';

//Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company','Bankist');

console.log(logo.src);
console.log(logo.getAttribute('src'));

//let's see on link
const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href'));


//Data attributes
console.log(logo.dataset.versionNumber);

//Classes
logo.classList.add('c', 'k');
logo.classList.remove('c', 'p');
logo.classList.toggle('c');
logo.classList.contains('c'); //not include

//Don't use
// logo.className = 'Dilliram';
//This ends the topic and afterwards we are going to start our project
*/


// const h1 = document.querySelector('h1');

// function handleEvent (e){
//   alert("EventListener: Good Job!");
// };

// h1.addEventListener('mouseenter', handleEvent);

// // h1.addEventListener('mouseenter', function(e){
// //   alert("EventListener: Good job!");
// // });


// // h1.onmouseenter = function(e){
// //   alert("onmouseenter: Good job!");
// // };

// setTimeout(()=> h1.removeEventListener('mouseenter', handleEvent), 3000);
// //

// //Random number generator
// const randomInt = (min, max) => 
//   Math.floor(Math.random()*(max-min + 1) + min);

// const randomColor = ()=> `rgb(${randomInt(0,256)}, ${randomInt(0,256)}, ${randomInt(0,256)})`;

// //Selecting element using their classes

// const navLink = document.querySelector('.nav__link');
// const navLinks = document.querySelector('.nav__links');
// const nav = document.querySelector('.nav');

// //addEventlistener
// navLink.addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
//   // Stop propagation
//   // e.stopPropagation();

// })

// navLinks.addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);

// })

// nav.addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// })

/* const h1 = document.querySelector('h1');

//Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.firstChild)
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';


//Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

//Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(
  function(el) {
    if (el !==h1) el.style.transform = 'scale(0.5)';
  }
)
*/
