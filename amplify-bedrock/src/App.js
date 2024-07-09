/*import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import './App.css';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();
const myAPI = "api8076d3d7";
const path = "/image";


function App() {
    const [prompt, setPrompt] = useState('');
    const [images, setImages] = useState([]);

    const generateImages = async () => {
        const response = await client.get(myAPI, path + "/" + prompt);
        setImages(response.urls);
    };

    return (
      <div className="App">
          <header className="App-header">
              <h1>Generative AI for Synthetic Image Generation</h1>
              <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter defect description"
              />
              <button onClick={generateImages}>Generate Images</button>
              <div className="images">
                  {images.map((imageBase64, index) => (
                      <img
                          key={index}
                          src={`data:image/png;base64,${imageBase64}`}
                          alt={`Generated ${index}`}
                      />
                  ))}
              </div>
          </header>
      </div>
  );
}

export default App;*/
import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import './App.css';

Amplify.configure(awsExports);

const myAPI = "https://5thwxejxk8.execute-api.us-east-1.amazonaws.com/dev/image"; // Replace with your API endpoint

function App() {
    const [prompt, setPrompt] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const generateImages = async () => {
        setLoading(true);
        let promptValue = prompt;

        fetch(`${myAPI}/${promptValue}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (Array.isArray(data.urls)) {
                    setImages(data.urls);
                } else {
                    console.error('Unexpected response format:', data);
                    setImages([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error generating images:', error);
                setLoading(false);
            });
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Generative AI for Synthetic Image Generation</h1>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter defect description"
                />
                <button onClick={generateImages} disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Images'}
                </button>
                <div className="images">
                    {images.map((imageBase64, index) => (
                        <img
                            key={index}
                            src={`data:image/png;base64,${imageBase64}`}
                            alt={`Generated ${index}`}
                        />
                    ))}
                </div>
            </header>
        </div>
    );
}

export default App;
