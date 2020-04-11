/* Global Variables */

// Base URL and API Key for OpenWeatherMap API
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=b57bee0bc2c7b57c45d8b55708a722fb'; //Personal Api Key

//Get the date
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction); //Create an event listener for the element with the id: generate

/* Function called by event listener */
function performAction(e) {
  e.preventDefault();
  const newZip = document.getElementById('zip').value; //Get zip user input
  const feelings = document.getElementById('feelings').value; //Get feelings user input

  // Form validation (Found it from a comment a mentor made to help a student in Knowledge channel)
  if(newZip.length == 0){
    alert("Please enter zip code");
    return
  }
  if(feelings.length == 0){
    alert("Please enter feelings");
    return
  }

  getWeather(baseURL, newZip, apiKey)
    .then(function (userData) {
      postData('/add', { date: newDate, temp: userData.main.temp, content:feelings }) // add data to POST request
    }).then(function (newData) {
      updateUI() // call updateUI to update browser content
    })
}

/* Function to GET Web API Data*/
const getWeather = async (baseURL, newZip, apiKey) => {
  const res = await fetch(baseURL + newZip + apiKey);
  try {
    const userData = await res.json();
    return userData;
  } catch (error) {
    console.log("error", error);
  }
}


/* Function to POST data */
const postData = async (url = '', data = {}) => {
  const req = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify({ 
      date: data.date,    //data object that includes date, temperature and user response
      temp: data.temp,
      content: data.content
    })
  })

  try {
    const newData = await req.json();
    return newData;
  }
  catch(error) {
    console.log(error);
  }
};

//Update the UI dynamically
const updateUI = async () => {
  const request = await fetch('/all');
  try {
    const allData = await request.json()
    document.getElementById('date').innerHTML = `Date:${allData.date}`;
    document.getElementById('temp').innerHTML = `Temperature:${allData.temp} ℉`;
    document.getElementById('content').innerHTML = `My feelings:${allData.content}`;
  }
  catch(error) {
    console.log("error", error);
  }
}