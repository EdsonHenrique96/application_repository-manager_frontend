import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [ isDefault, setIsDefault ] = useState(false);

  const [ title, setTitle ] = useState('Default');
  const [ url, setUrl ] = useState('Default');
  const [ techs, setTechs ] = useState('Default');

  const [ repositories, setRepositories ] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(res => {
      setRepositories(res.data);
    });
  }, [])

  async function handleAddRepository() {
    if(title === 'Default'
      && url === 'Default'
      && techs === 'Default'
    ) {
      setIsDefault(true);
    }
    setIsDefault(false);

    api.post('/repositories', {
      title,
      url,
      techs: techs.split(' '),
    }).then(res => setRepositories([...repositories, res.data]));
  }

  async function handleRemoveRepository(id) {
    api.delete(`/repositories/${id}`)
      .then(() => {
        const repos = repositories
          .filter(repository => repository.id !== id);

        setRepositories(repos);
      })
  }

  function handleTitle(event) {
    setTitle(event.target.value);
  }

  function handleUrl(event) {
    setUrl(event.target.value);
  }

  function handleTechs(event) {
    setTechs(event.target.value);
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => {
          return (
            <li key={repository.id}>
              <b>{repository.title}</b>

              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li>
          )
        })}
        
      </ul>
      <div>
        <input type="text" placeholder="Título" onChange={handleTitle}/>
        <input type="text" placeholder="URL" onChange={handleUrl}/>
        <input type="text"
          placeholder="techs (Ex. Nodejs React Express)"
          onChange={handleTechs}
        />
        
        { isDefault && <h1>Repositório criado com valores default</h1> }

        <button onClick={handleAddRepository}>Adicionar</button>
      </div>
    </div>
  );
}

export default App;
