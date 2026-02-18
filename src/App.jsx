import React, { useEffect, useState } from 'react';
import Desktop from './components/Desktop/Desktop';
import Dock from './components/Dock/Dock';
import Window from './components/Window/Window';
import IMessageApp from './apps/iMessage/IMessageApp';
import OnTextApp from './apps/OnText/OnTextApp';
import FlowClipApp from './apps/FlowClip/FlowClipApp';
import './styles/global.css';

function App() {
  const [activeWindows, setActiveWindows] = useState({
    messages: false,
    mail: false,
    instagram: false,
    threads: false,
    ontext: false,
    flowclip: false,
  });
  const [windowOrder, setWindowOrder] = useState([]);

  const closeWindow = (appId) => {
    setActiveWindows((prev) => ({
      ...prev,
      [appId]: false
    }));
    setWindowOrder((order) => order.filter((id) => id !== appId));
  };

  const toggleWindow = (appId) => {
    setActiveWindows((prev) => {
      const isOpening = !prev[appId];
      setWindowOrder((order) =>
        isOpening
          ? [...order.filter((id) => id !== appId), appId]
          : order.filter((id) => id !== appId)
      );
      return {
        ...prev,
        [appId]: isOpening
      };
    });
  };

  const bringToFront = (appId) => {
    setWindowOrder((order) =>
      order.includes(appId)
        ? [...order.filter((id) => id !== appId), appId]
        : [...order, appId]
    );
  };

  const getWindowZIndex = (appId) => {
    const index = windowOrder.indexOf(appId);
    return index === -1 ? 100 : 100 + index;
  };

  useEffect(() => {
    const handleEscapeClose = (e) => {
      if (e.key !== 'Escape') return;
      const topWindowId = [...windowOrder].reverse().find((id) => activeWindows[id]);
      if (!topWindowId) return;
      e.preventDefault();
      closeWindow(topWindowId);
    };

    document.addEventListener('keydown', handleEscapeClose);
    return () => document.removeEventListener('keydown', handleEscapeClose);
  }, [windowOrder, activeWindows]);

  const handleAppClick = (appId) => {
      console.log("App clicked:", appId);
      if (['instagram', 'threads', 'mail'].includes(appId)) {
          // Handle external links or mailto
          if(appId === 'mail') window.location.href = "mailto:freiheit517@icloud.com";
          if(appId === 'instagram') window.open("https://instagram.com", "_blank");
          if(appId === 'threads') window.open("https://www.threads.com/@yeop9690", "_blank");
      } else {
          toggleWindow(appId);
      }
  };

  return (
    <Desktop>
        <Window 
            id="messages" 
            title="Messages" 
            isOpen={activeWindows.messages} 
            onClose={() => closeWindow('messages')}
            onFocus={() => bringToFront('messages')}
            initialPosition={{ x: 100, y: 100 }}
            hideTitleBar={true}
            width="900px"
            height="800px"
            zIndex={getWindowZIndex('messages')}
        >
            <IMessageApp onClose={() => closeWindow('messages')} />
        </Window>

        <Window 
            id="ontext" 
            title="OnText" 
            isOpen={activeWindows.ontext} 
            onClose={() => closeWindow('ontext')}
            onFocus={() => bringToFront('ontext')}
            initialPosition={{ x: 200, y: 150 }}
            hideTitleBar={true}
            width="920px"
            height="650px"
            zIndex={getWindowZIndex('ontext')}
        >
            <OnTextApp onClose={() => closeWindow('ontext')} />
        </Window>

        <Window
            id="flowclip"
            title="FlowClip"
            isOpen={activeWindows.flowclip}
            onClose={() => closeWindow('flowclip')}
            onFocus={() => bringToFront('flowclip')}
            initialPosition={{ x: 250, y: 170 }}
            hideTitleBar={true}
            width="920px"
            height="650px"
            zIndex={getWindowZIndex('flowclip')}
        >
            <FlowClipApp onClose={() => closeWindow('flowclip')} />
        </Window>

        <Dock onAppClick={handleAppClick} />
    </Desktop>
  );
}

export default App;
