import React, { useState } from 'react';
import styled from 'styled-components';

const StudioContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StudioHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const StudioTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProjectInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const ProjectName = styled.div`
  font-size: 1.25rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const BPMDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
`;

const BPMValue = styled.span`
  background: rgba(102, 126, 234, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.4);
  font-weight: 600;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ControlButton = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.primary 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.primary 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.primary 
      ? '0 10px 30px rgba(102, 126, 234, 0.4)' 
      : '0 5px 20px rgba(0, 0, 0, 0.3)'};
  }
`;

const StudioContent = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 1rem;
  flex: 1;
  min-height: 600px;
`;

const SidePanel = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
`;

const PanelTitle = styled.h3`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TimelineArea = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1rem;
  position: relative;
  overflow: hidden;
`;

const MixerPanel = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
`;

const TimelineGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(8, 60px);
  gap: 2px;
`;

const Track = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
`;

const TrackColor = styled.div<{ color: string }>`
  width: 4px;
  height: 40px;
  background: ${props => props.color};
  border-radius: 2px;
  margin-right: 1rem;
`;

const TrackName = styled.span`
  font-weight: 500;
`;

const ToolList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ToolButton = styled.button<{ active?: boolean }>`
  padding: 0.75rem;
  background: ${props => props.active 
    ? 'rgba(102, 126, 234, 0.15)' 
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active 
    ? 'rgba(102, 126, 234, 0.3)' 
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const SampleLibrary = styled.div`
  margin-top: 2rem;
`;

const SampleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const SampleItem = styled.div`
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }
`;

const SampleName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const SampleInfo = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
`;

const MixerChannel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const Fader = styled.div`
  width: 6px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  position: relative;
  cursor: pointer;
`;

const FaderHandle = styled.div`
  width: 24px;
  height: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  position: absolute;
  left: -9px;
  top: 50%;
  cursor: grab;
`;

const ChannelName = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
`;

const StudioPage: React.FC = () => {
  const [bpm, setBpm] = useState(120);
  const [projectName] = useState('Мой первый проект');
  const [activeTool, setActiveTool] = useState('cursor');
  
  const tools = [
    { id: 'cursor', name: 'Выделение', icon: '↖️' },
    { id: 'cut', name: 'Разрезать', icon: '✂️' },
    { id: 'draw', name: 'Рисование', icon: '✏️' },
    { id: 'automation', name: 'Автоматизация', icon: '📈' },
  ];
  
  const tracks = [
    { id: 1, name: 'Кик', color: '#667eea' },
    { id: 2, name: 'Снейр', color: '#764ba2' },
    { id: 3, name: 'Хэты', color: '#f093fb' },
    { id: 4, name: 'Бас', color: '#f5576c' },
    { id: 5, name: 'Мелодия', color: '#4facfe' },
    { id: 6, name: 'Пэды', color: '#43e97b' },
    { id: 7, name: 'Вокал', color: '#fa709a' },
    { id: 8, name: 'Эффекты', color: '#fee140' },
  ];
  
  const samples = [
    { name: '808 Kick', category: 'Drums', duration: '2s' },
    { name: 'Sine Bass', category: 'Bass', duration: '3s' },
    { name: 'Pluck Lead', category: 'Synth', duration: '4s' },
    { name: 'Vocal Chop', category: 'Vocals', duration: '1.5s' },
  ];

  return (
    <StudioContainer>
      <StudioHeader>
        <StudioTitle>
          <span>🎵</span>
          SoundCollab Studio
        </StudioTitle>
        
        <ProjectInfo>
          <ProjectName>{projectName}</ProjectName>
          <BPMDisplay>
            <span>BPM:</span>
            <BPMValue>{bpm}</BPMValue>
          </BPMDisplay>
        </ProjectInfo>
      </StudioHeader>
      
      <Controls>
        <ControlButton primary>
          <span>▶️</span>
          Играть
        </ControlButton>
        <ControlButton>
          <span>⏸️</span>
          Пауза
        </ControlButton>
        <ControlButton>
          <span>⏹️</span>
          Стоп
        </ControlButton>
        <ControlButton>
          <span>💾</span>
          Сохранить
        </ControlButton>
        <ControlButton>
          <span>📤</span>
          Экспорт
        </ControlButton>
      </Controls>
      
      <StudioContent>
        <SidePanel>
          <PanelTitle>Инструменты</PanelTitle>
          <ToolList>
            {tools.map((tool) => (
              <ToolButton
                key={tool.id}
                active={activeTool === tool.id}
                onClick={() => setActiveTool(tool.id)}
              >
                <span>{tool.icon}</span>
                <span>{tool.name}</span>
              </ToolButton>
            ))}
          </ToolList>
          
          <SampleLibrary>
            <PanelTitle>Библиотека сэмплов</PanelTitle>
            <SampleGrid>
              {samples.map((sample, index) => (
                <SampleItem key={index}>
                  <SampleName>{sample.name}</SampleName>
                  <SampleInfo>
                    {sample.category} • {sample.duration}
                  </SampleInfo>
                </SampleItem>
              ))}
            </SampleGrid>
          </SampleLibrary>
        </SidePanel>
        
        <TimelineArea>
          <TimelineGrid>
            {tracks.map((track) => (
              <Track key={track.id}>
                <TrackColor color={track.color} />
                <TrackName>{track.name}</TrackName>
              </Track>
            ))}
          </TimelineGrid>
        </TimelineArea>
        
        <MixerPanel>
          <PanelTitle>Микшер</PanelTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tracks.slice(0, 4).map((track) => (
              <MixerChannel key={track.id}>
                <ChannelName>{track.name}</ChannelName>
                <Fader>
                  <FaderHandle />
                </Fader>
                <div style={{ fontSize: '0.875rem' }}>0 dB</div>
              </MixerChannel>
            ))}
          </div>
        </MixerPanel>
      </StudioContent>
    </StudioContainer>
  );
};

export default StudioPage;
