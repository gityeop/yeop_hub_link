import React, { useState } from 'react';
import Desktop from './components/Desktop/Desktop';
import MenuBar from './components/MenuBar/MenuBar';
import Dock from './components/Dock/Dock';
import Window from './components/Window/Window';
import IMessageApp from './apps/iMessage/IMessageApp';
import './styles/global.css';

function App() {
  const [activeWindows, setActiveWindows] = useState({
    messages: false,
    mail: false,
    instagram: false,
    threads: false,
  });

  const toggleWindow = (appId) => {
    setActiveWindows(prev => ({
      ...prev,
      [appId]: !prev[appId]
    }));
  };

  const handleAppClick = (appId) => {
      console.log("App clicked:", appId);
      if (['instagram', 'threads', 'mail'].includes(appId)) {
          // Handle external links or mailto
          if(appId === 'mail') window.location.href = "mailto:example@email.com";
          if(appId === 'instagram') window.open("https://instagram.com", "_blank");
          if(appId === 'threads') window.open("https://threads.net", "_blank");
      } else {
          toggleWindow(appId);
      }
  };

  return (
    <Desktop>
        <MenuBar />
        
        <Window 
            id="messages" 
            title="Messages" 
            isOpen={activeWindows.messages} 
            onClose={() => toggleWindow('messages')}
            initialPosition={{ x: 100, y: 100 }}
            hideTitleBar={true}
            width="900px"
            height="800px"
        >
            <IMessageApp onClose={() => toggleWindow('messages')} />
        </Window>

        <Dock onAppClick={handleAppClick} />
    </Desktop>
  );
}

export default App;
