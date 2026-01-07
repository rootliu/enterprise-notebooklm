import { useState } from 'react';
import { Header } from './Header';
import { StatusBar } from './StatusBar';
import { DataPanel } from '../DataPanel';
import { ChatPanel } from '../ChatPanel';
import { StudioPanel } from '../StudioPanel';

export function ThreeColumnLayout() {
  const [leftWidth, setLeftWidth] = useState(300);
  const [rightWidth, setRightWidth] = useState(360);

  const handleLeftResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(260, Math.min(400, startWidth + delta));
      setLeftWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleRightResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = startX - moveEvent.clientX;
      const newWidth = Math.max(320, Math.min(500, startWidth + delta));
      setRightWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header />

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Data Sources */}
        <div style={{ width: leftWidth, flexShrink: 0 }} className="h-full">
          <DataPanel />
        </div>

        {/* Left Resize Handle */}
        <div
          className="w-1 cursor-col-resize transition-colors flex-shrink-0"
          style={{ backgroundColor: 'var(--border-color)' }}
          onMouseDown={handleLeftResize}
        />

        {/* Center Panel - Chat */}
        <div className="flex-1 h-full min-w-0">
          <ChatPanel />
        </div>

        {/* Right Resize Handle */}
        <div
          className="w-1 cursor-col-resize transition-colors flex-shrink-0"
          style={{ backgroundColor: 'var(--border-color)' }}
          onMouseDown={handleRightResize}
        />

        {/* Right Panel - Studio */}
        <div style={{ width: rightWidth, flexShrink: 0 }} className="h-full">
          <StudioPanel />
        </div>
      </main>

      <StatusBar />
    </div>
  );
}
