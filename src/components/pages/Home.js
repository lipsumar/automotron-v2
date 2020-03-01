import React from 'react';
import GraphUi from '../GraphUi';

function Home() {
  return (
    <div>
      <h1>home page</h1>
      <div style={{ width: '800px', height: '500px' }}>
        <GraphUi />
      </div>
    </div>
  );
}

export default Home;
