import './App.css';

function App() {
  fetch("http://localhost:8080/users/", {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "your-api-key",
        "X-RapidAPI-Host": "jokes-by-api-ninjas.p.rapidapi.com",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  
  
  return (
    <div className="App">
      <h1>My App</h1>
    </div>
  );
}

export default App;
