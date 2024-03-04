import './App.css';
import Task from './component/Task';

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
      <h1>Task List</h1>
      <Task/>
    </div>
  );
}

export default App;
