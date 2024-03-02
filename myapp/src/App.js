import './App.css';

function App() {
  fetch("http://localhost:8000/users", {
      method: "GET",

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
