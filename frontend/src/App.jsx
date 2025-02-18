import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect, useState } from "react";
import supabase from "./supabase";

function App() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    async function fetchSurveys() {
      let { data, error } = await supabase.from("surveys").select("*");
      if (error) console.error(error);
      else setSurveys(data);
    }

    fetchSurveys();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <h1 className="text-2xl font-bold mb-5">Survey Responses</h1>
      <ul className="bg-white p-5 rounded-lg shadow-md w-full max-w-md">
        {surveys.map((survey) => (
          <li key={survey.id} className="border-b p-2">
            <strong>Q:</strong> {survey.question} <br />
            <strong>A:</strong> {survey.answer}
          </li>
        ))}
      </ul>
    </div>
  );
}


function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-blue-500 text-white text-2xl">
      Tailwind CSS is working! 🎉
    </div>
  );
}

export default App;