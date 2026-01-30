import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

const StudioPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedTool, setSelectedTool] = useState('cursor');
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [clips, setClips] = useState<any[]>([]);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const tools = [
    { id: 'cursor', name: 'Выделение', icon: '↖️' },
    { id: 'cut', name: 'Разрезать', icon: '✂️' },
    { id: 'draw', name: 'Рисование', icon: '✏️' },
    { id: 'automation', name: 'Автоматизация', icon: '📈' },
    { id: 'mute', name: 'Мьют', icon: '🔇' },
    { id: 'solo', name: 'Соло', icon: '🎧' },
  ];

  const tracks = [
    { id: 'kick', name: 'Кик', color: '#667eea', volume: 0.8, muted: false, solo: false },
    { id: 'snare', name: 'Снейр', color: '#764ba2', volume: 0.7, muted: false, solo: false },
    { id: 'hats', name: 'Хэты', color: '#f093fb', volume: 0.6, muted: false, solo: false },
    { id: 'bass', name: 'Бас', color: '#f5576c', volume: 0.9, muted: false, solo: false },
    { id: 'melody', name: 'Мелодия', color: '#4facfe', volume: 0.8, muted: false, solo: false },
    { id: 'pads', name: 'Пэды', color: '#43e97b', volume: 0.5, muted: false, solo: false },
    { id: 'vocals', name: 'Вокал', color: '#fa709a', volume: 0.8, muted: false, solo: false },
    { id: 'fx', name: 'Эффекты', color: '#fee140', volume: 0.4, muted: false, solo: false },
  ];

  const effects = [
    { id: 'reverb', name: 'Reverb', icon: '🌊' },
    { id: 'delay', name: 'Delay', icon: '🔁' },
    { id: 'compressor', name: 'Compressor', icon: '📊' },
    { id: 'eq', name: 'EQ', icon: '📈' },
    { id: 'distortion', name: 'Distortion', icon: '🎸' },
    { id: 'chorus', name: 'Chorus', icon: '🎶' },
  ];

  const samples = [
    { id: 1, name: '808 Kick', category: 'Drums', duration: '2s', color: '#667eea' },
    { id: 2, name: 'Snare Roll', category: 'Drums', duration: '3s', color: '#764ba2' },
    { id: 3, name: 'Hi-Hat Loop', category: 'Drums', duration: '4s', color: '#f093fb' },
    { id: 4, name: 'Sine Bass', category: 'Bass', duration: '2s', color: '#f5576c' },
    { id: 5, name: 'Pluck Lead', category: 'Synth', duration: '3s', color: '#4facfe' },
    { id: 6, name: 'Vocal Chop', category: 'Vocals', duration: '1.5s', color: '#fa709a' },
    { id: 7, name: 'Atmosphere', category: 'Pads', duration: '5s', color: '#43e97b' },
    { id: 8, name: 'Riser FX', category: 'Effects', duration: '2s', color: '#fee140' },
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Start playback
      setCurrentTime(0);
    }
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording
    }
  };

  const handleBpmChange = (value: number) => {
    setBpm(Math.max(40, Math.min(240, value)));
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.1, Math.min(5, newZoom));
    });
  };

  const addClip = (trackId: string, startTime: number) => {
    const newClip = {
      id: Date.now(),
      trackId,
      startTime,
      duration: 4,
      name: `Clip ${clips.length + 1}`,
      color: tracks.find(t => t.id === trackId)?.color || '#667eea',
    };
    setClips([...clips, newClip]);
  };

  const handleDrop = (e: React.DragEvent, trackId: string, time: number) => {
    e.preventDefault();
    const sampleId = e.dataTransfer.getData('sampleId');
    if (sampleId) {
      addClip(trackId, time);
    }
  };

  const handleDragStart = (e: React.DragEvent, sampleId: number) => {
    e.dataTransfer.setData('sampleId', sampleId.toString());
  };

  return (
    <StudioContainer>
      {/* Header */}
      <StudioHeader>
        <HeaderLeft>
          <StudioTitle>
            <StudioIcon>🎵</StudioIcon>
            <span>SoundCollab Studio</span>
          </StudioTitle>
          <ProjectName>
            <span>📁</span>
            <span>Мой проект • Версия 2.0</span>
          </ProjectName>
        </HeaderLeft>
        
        <HeaderRight>
          <TransportControls>
            <Button
              variant="ghost"
              size="sm"
              icon="⏮️"
              onClick={() => setCurrentTime(0)}
            >
              Начало
            </Button>
            
            <PlayButton
              variant={isRecording ? 'danger' : 'primary'}
              size="lg"
              icon={isRecording ? '🔴' : isPlaying ? '⏸️' : '▶️'}
              onClick={handlePlayPause}
              className={isRecording ? 'recording' : ''}
            >
              {isRecording ? 'Запись' : isPlaying ? 'Пауза' : 'Играть'}
            </PlayButton>
            
            <RecordButton
              variant={isRecording ? 'danger' : 'outline'}
              size="sm"
              icon="🔴"
              onClick={handleRecord}
              className={isRecording ? 'recording' : ''}
            >
              {isRecording ? 'Стоп' : 'Запись'}
            </RecordButton>
            
            <Button
              variant="ghost"
              size="sm"
              icon="⏭️"
              onClick={() => setCurrentTime(60)}
            >
              Конец
            </Button>
          </TransportControls>
          
          <TimeDisplay>
            <TimeValue>
              {Math.floor(currentTime / 60)}:
              {(currentTime % 60).toString().padStart(2, '0')}
            </TimeValue>
            <TimeSignature>4/4</TimeSignature>
          </TimeDisplay>
        </HeaderRight>
      </StudioHeader>

      {/* Main Content */}
      <StudioContent>
        {/* Left Sidebar - Tools & Samples */}
        <LeftSidebar>
          <ToolsSection>
            <SectionTitle>Инструменты</SectionTitle>
            <ToolsGrid>
              {tools.map((tool) => (
                <ToolButton
                  key={tool.id}
                  active={selectedTool === tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                >
                  <ToolIcon>{tool.icon}</ToolIcon>
                  <ToolName>{tool.name}</ToolName>
                </ToolButton>
              ))}
            </ToolsGrid>
          </ToolsSection>

          <SamplesSection>
            <SectionTitle>
              <span>🎵</span>
              <span>Библиотека сэмплов</span>
            </SectionTitle>
            <SamplesGrid>
              {samples.map((sample) => (
                <SampleCard
                  key={sample.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, sample.id)}
                  onClick={() => console.log('Select sample', sample.id)}
                >
                  <SampleColor style={{ background: sample.color }} />
                  <SampleInfo>
                    <SampleName>{sample.name}</SampleName>
                    <SampleMeta>
                      <span>{sample.category}</span>
                      <span>•</span>
                      <span>{sample.duration}</span>
                    </SampleMeta>
                  </SampleInfo>
                  <SampleAction>+</SampleAction>
                </SampleCard>
              ))}
            </SamplesGrid>
          </SamplesSection>

          <EffectsSection>
            <SectionTitle>Эффекты</SectionTitle>
            <EffectsList>
              {effects.map((effect) => (
                <EffectItem key={effect.id}>
                  <EffectIcon>{effect.icon}</EffectIcon>
                  <EffectName>{effect.name}</EffectName>
                  <EffectAdd>+</EffectAdd>
                </EffectItem>
              ))}
            </EffectsList>
          </EffectsSection>
        </LeftSidebar>

        {/* Main Timeline */}
        <TimelineSection>
          <TimelineHeader>
            <TimeRuler>
              {Array.from({ length: 33 }, (_, i) => i).map((beat) => (
                <TimeMarker key={beat} style={{ left: `${beat * 50 * zoomLevel}px` }}>
                  {beat % 4 === 0 ? (
                    <TimeLabel>{beat / 4}</TimeLabel>
                  ) : (
                    <TimeTick />
                  )}
                </TimeMarker>
              ))}
              <Playhead style={{ left: `${currentTime * 50 * zoomLevel}px` }}>
                <PlayheadLine />
                <PlayheadDot />
              </Playhead>
            </TimeRuler>
            
            <ZoomControls>
              <Button
                variant="ghost"
                size="sm"
                icon="➖"
                onClick={() => handleZoom('out')}
              >
                -
              </Button>
              <ZoomLevel>{Math.round(zoomLevel * 100)}%</ZoomLevel>
              <Button
                variant="ghost"
                size="sm"
                icon="➕"
                onClick={() => handleZoom('in')}
              >
                +
              </Button>
            </ZoomControls>
          </TimelineHeader>

          <TracksContainer ref={timelineRef}>
            {tracks.map((track) => (
              <TrackRow
                key={track.id}
                onDrop={(e) => handleDrop(e, track.id, currentTime)}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => setActiveTrack(track.id)}
                active={activeTrack === track.id}
              >
                <TrackHeader>
                  <TrackColor style={{ background: track.color }} />
                  <TrackInfo>
                    <TrackName>{track.name}</TrackName>
                    <TrackControls>
                      <TrackControl
                        active={track.muted}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Toggle mute', track.id);
                        }}
                      >
                        M
                      </TrackControl>
                      <TrackControl
                        active={track.solo}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Toggle solo', track.id);
                        }}
                      >
                        S
                      </TrackControl>
                    </TrackControls>
                  </TrackInfo>
                  <TrackVolume>
                    <VolumeSlider
                      type="range"
                      min="0"
                      max="100"
                      value={track.volume * 100}
                      onChange={(e) => console.log('Volume change', e.target.value)}
                    />
                    <VolumeValue>{Math.round(track.volume * 100)}%</VolumeValue>
                  </TrackVolume>
                </TrackHeader>
                
                <TrackTimeline>
                  {clips
                    .filter(clip => clip.trackId === track.id)
                    .map((clip) => (
                      <Clip
                        key={clip.id}
                        style={{
                          left: `${clip.startTime * 50 * zoomLevel}px`,
                          width: `${clip.duration * 50 * zoomLevel}px`,
                          background: clip.color,
                        }}
                      >
                        <ClipContent>
                          <ClipName>{clip.name}</ClipName>
                          <ClipWaveform>
                            {Array.from({ length: 20 }, (_, i) => (
                              <WaveBar key={i} height={`${Math.random() * 60 + 20}%`} />
                            ))}
                          </ClipWaveform>
                        </ClipContent>
                      </Clip>
                    ))}
                </TrackTimeline>
              </TrackRow>
            ))}
          </TracksContainer>
        </TimelineSection>

        {/* Right Sidebar - Mixer */}
        <RightSidebar>
          <MixerSection>
            <SectionTitle>
              <span>🎚️</span>
              <span>Микшер</span>
            </SectionTitle>
            
            <MixerChannels>
              {tracks.map((track) => (
                <MixerChannel key={track.id}>
                  <ChannelHeader>
                    <ChannelName>{track.name}</ChannelName>
                    <ChannelMute active={track.muted}>M</ChannelMute>
                  </ChannelHeader>
                  
                  <FaderContainer>
                    <FaderTrack>
                      <FaderHandle
                        style={{ top: `${100 - track.volume * 100}%` }}
                      />
                    </FaderTrack>
                  </FaderContainer>
                  
                  <ChannelMeter>
                    <MeterLevel style={{ height: `${Math.random() * 80 + 20}%` }} />
                  </ChannelMeter>
                  
                  <ChannelPan>0</ChannelPan>
                </MixerChannel>
              ))}
            </MixerChannels>
            
            <MasterChannel>
              <MasterLabel>MASTER</MasterLabel>
              <MasterFader>
                <FaderTrack>
                  <FaderHandle style={{ top: '50%' }} />
                </FaderTrack>
              </MasterFader>
              <MasterMeter>
                <MeterLevel style={{ height: '60%' }} />
              </MasterMeter>
            </MasterChannel>
          </MixerSection>

          <SettingsSection>
            <SectionTitle>Настройки проекта</SectionTitle>
            <SettingsGrid>
              <SettingItem>
                <SettingLabel>BPM</SettingLabel>
                <SettingControl>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="➖"
                    onClick={() => handleBpmChange(bpm - 1)}
                  />
                  <BPMValue>{bpm}</BPMValue>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="➕"
                    onClick={() => handleBpmChange(bpm + 1)}
                  />
                </SettingControl>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Ключ</SettingLabel>
                <Select defaultValue="C">
                  <option value="C">C Major</option>
                  <option value="Am">A Minor</option>
                  <option value="G">G Major</option>
                  <option value="Em">E Minor</option>
                </Select>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>Размер</SettingLabel>
                <Select defaultValue="4/4">
                  <option value="4/4">4/4</option>
                  <option value="3/4">3/4</option>
                  <option value="6/8">6/8</option>
                </Select>
              </SettingItem>
            </SettingsGrid>
          </SettingsSection>
        </RightSidebar>
      </StudioContent>

      {/* Bottom Bar */}
      <StudioFooter>
        <FooterLeft>
          <Button variant="outline" size="sm" icon="💾">
            Сохранить
          </Button>
          <Button variant="outline" size="sm" icon="📤">
            Экспорт
          </Button>
          <Button variant="outline" size="sm" icon="👥">
            Пригласить
          </Button>
        </FooterLeft>
        
        <FooterCenter>
          <StatusIndicator>
            <StatusDot className="pulse" />
            <StatusText>Online • 3 участника</StatusText>
          </StatusIndicator>
        </FooterCenter>
        
        <FooterRight>
          <CPUUsage>CPU: 24%</CPUUsage>
          <MemoryUsage>RAM: 1.2GB</MemoryUsage>
          <Latency>Latency: 5ms</Latency>
        </FooterRight>
      </StudioFooter>
    </StudioContainer>
  );
};

// Styled Components
const StudioContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-primary);
`;

const StudioHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const StudioTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StudioIcon = styled.span`
  font-size: 1.5rem;
`;

const ProjectName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  font-size: 0.95rem;
  color: var(--text-secondary);
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const TransportControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PlayButton = styled(Button)`
  &.recording {
    animation: recording 1s infinite;
  }
`;

const RecordButton = styled(Button)`
  &.recording {
    animation: recording 1s infinite;
  }
`;

const TimeDisplay = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-family: var(--font-mono);
`;

const TimeValue = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const TimeSignature = styled.span`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const StudioContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const LeftSidebar = styled.aside`
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  padding: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ToolsSection = styled.div`
  margin-bottom: 2rem;
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const ToolButton = styled.button<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${props => props.active 
    ? 'rgba(102, 126, 234, 0.15)' 
    : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.active 
    ? 'rgba(102, 126, 234, 0.3)' 
    : 'rgba(255, 255, 255, 0.08)'};
  border-radius: var(--radius-lg);
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const ToolIcon = styled.span`
  font-size: 1.5rem;
`;

const ToolName = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
`;

const SamplesSection = styled.div`
  margin-bottom: 2rem;
`;

const SamplesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SampleCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: grab;
  transition: all var(--transition-fast);
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(4px);
  }
  
  &:active {
    cursor: grabbing;
  }
`;

const SampleColor = styled.div`
  width: 8px;
  height: 32px;
  border-radius: var(--radius-sm);
`;

const SampleInfo = styled.div`
  flex: 1;
`;

const SampleName = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const SampleMeta = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
`;

const SampleAction = styled.button`
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: rgba(102, 126, 234, 0.15);
    color: white;
  }
`;

const EffectsSection = styled.div``;

const EffectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EffectItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const EffectIcon = styled.span`
  font-size: 1.25rem;
`;

const EffectName = styled.span`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
`;

const EffectAdd = styled.button`
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: rgba(102, 126, 234, 0.15);
    color: white;
  }
`;

const TimelineSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
`;

const TimeRuler = styled.div`
  flex: 1;
  position: relative;
  height: 40px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-lg);
  overflow: hidden;
`;

const TimeMarker = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
`;

const TimeLabel = styled.div`
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
`;

const TimeTick = styled.div`
  width: 1px;
  height: 20px;
  background: var(--border-color);
`;

const Playhead = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  pointer-events: none;
`;

const PlayheadLine = styled.div`
  width: 2px;
  height: 100%;
  background: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
`;

const PlayheadDot = styled.div`
  position: absolute;
  top: -4px;
  left: -3px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
`;

const ZoomLevel = styled.span`
  min-width: 60px;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const TracksContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.2);
  position: relative;
`;

const TrackRow = styled.div<{ active?: boolean }>`
  display: flex;
  height: 100px;
  border-bottom: 1px solid var(--border-color);
  background: ${props => props.active 
    ? 'rgba(102, 126, 234, 0.05)' 
    : 'transparent'};
  transition: background var(--transition-fast);
  
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const TrackHeader = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid var(--border-color);
  flex-shrink: 0;
`;

const TrackColor = styled.div`
  width: 4px;
  height: 60px;
  border-radius: var(--radius-sm);
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const TrackName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
`;

const TrackControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TrackControl = styled.button<{ active?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  background: ${props => props.active 
    ? 'rgba(239, 68, 68, 0.2)' 
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active 
    ? 'rgba(239, 68, 68, 0.3)' 
    : 'var(--border-color)'};
  color: ${props => props.active ? '#fca5a5' : 'var(--text-tertiary)'};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TrackVolume = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 60px;
`;

const VolumeSlider = styled.input`
  width: 4px;
  height: 60px;
  appearance: slider-vertical;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: var(--primary);
    border-radius: 50%;
    cursor: pointer;
  }
`;

const VolumeValue = styled.span`
  font-size: 0.75rem;
  color: var(--text-tertiary);
`;

const TrackTimeline = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const Clip = styled.div`
  position: absolute;
  top: 1rem;
  bottom: 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: move;
  user-select: none;
  transition: all var(--transition-fast);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const ClipContent = styled.div`
  padding: 0.75rem;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ClipName = styled.div`
  font-weight: 600;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  color: white;
`;

const ClipWaveform = styled.div`
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: flex-end;
  gap: 1px;
  padding: 0.25rem;
`;

const WaveBar = styled.div<{ height: string }>`
  flex: 1;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1px;
  min-height: 2px;
  height: ${props => props.height};
  animation: wave 1s ease-in-out infinite;
`;

const RightSidebar = styled.aside`
  width: 280px;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
  overflow-y: auto;
  padding: 1rem;
`;

const MixerSection = styled.div`
  margin-bottom: 2rem;
`;

const MixerChannels = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const MixerChannel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 60px;
`;

const ChannelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`;

const ChannelName = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const ChannelMute = styled.button<{ active?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
  background: ${props => props.active 
    ? 'rgba(239, 68, 68, 0.2)' 
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active 
    ? 'rgba(239, 68, 68, 0.3)' 
    : 'var(--border-color)'};
  color: ${props => props.active ? '#fca5a5' : 'var(--text-tertiary)'};
  font-size: 0.625rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  height: 120px;
`;

const FaderTrack = styled.div`
  width: 6px;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  position: relative;
`;

const FaderHandle = styled.div`
  position: absolute;
  left: -9px;
  width: 24px;
  height: 8px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: var(--radius-sm);
  cursor: grab;
  transition: box-shadow var(--transition-fast);
  
  &:hover {
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
  }
  
  &:active {
    cursor: grabbing;
  }
`;

const ChannelMeter = styled.div`
  width: 4px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
`;

const MeterLevel = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to top, #10b981, #3b82f6);
  border-radius: var(--radius-full);
  transition: height 0.1s ease;
`;

const ChannelPan = styled.div`
  font-size: 0.75rem;
  color: var(--text-tertiary);
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MasterChannel = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
`;

const MasterLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const MasterFader = styled.div`
  flex: 1;
  height: 80px;
`;

const MasterMeter = styled(ChannelMeter)`
  height: 80px;
`;

const SettingsSection = styled.div``;

const SettingsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SettingLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const SettingControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BPMValue = styled.div`
  min-width: 40px;
  text-align: center;
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--text-primary);
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const StudioFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
`;

const FooterLeft = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FooterCenter = styled.div``;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
`;

const StatusText = styled.span`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const FooterRight = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
`;

const CPUUsage = styled.div``;
const MemoryUsage = styled.div``;
const Latency = styled.div``;

export default StudioPage;
