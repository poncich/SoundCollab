import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

const MessagesPage: React.FC = () => {
  const [activeChat, setActiveChat] = useState<string | null>('1');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModerationAlert, setShowModerationAlert] = useState(false);
  const [filteredChats, setFilteredChats] = useState<any[]>(chats);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Список запрещенных слов
  const badWords = [
    'дурак', 'идиот', 'тупой', 'дебил', 'кретин', 'лох',
    'мудак', 'сволочь', 'мразь', 'подонок', 'ублюдок', 'говно',
    'пиздец', 'хуй', 'блядь', 'ебать', 'сука', 'пидор',
  ];

  const chats = [
    {
      id: '1',
      name: 'Alex Producer',
      avatar: 'AP',
      lastMessage: 'Посмотри новый бит, я добавил бас-линию! 🎵',
      time: '10:25',
      unread: true,
      online: true,
      type: 'collab',
      project: { title: 'Midnight Drive', color: '#667eea' },
    },
    {
      id: '2',
      name: 'Sarah Beats',
      avatar: 'SB',
      lastMessage: 'Готов к коллаборации? У меня есть идея для трека в стиле lo-fi',
      time: 'Вчера',
      unread: false,
      online: false,
      type: 'collab',
      project: { title: 'Urban Dreams Collab', color: '#764ba2' },
    },
    {
      id: '3',
      name: 'Beat Collective',
      avatar: 'BC',
      lastMessage: 'Ремикс почти готов, осталось сведение. Когда сможешь проверить?',
      time: '12 апр',
      unread: true,
      online: true,
      type: 'group',
      members: 4,
      project: { title: 'Desert Storm Remix', color: '#f5576c' },
    },
    {
      id: '4',
      name: 'Synth Sisters',
      avatar: 'SS',
      lastMessage: 'Привет! Нравится наш новый синтезатор? Можно использовать в проектах',
      time: '10 апр',
      unread: false,
      online: true,
      type: 'support',
    },
    {
      id: '5',
      name: 'DJ Pulse',
      avatar: 'DP',
      lastMessage: 'Трек на финальной стадии, нужна помощь с мастерингом 🔊',
      time: '9 апр',
      unread: false,
      online: false,
      type: 'collab',
      project: { title: 'Neon Lights', color: '#f093fb' },
    },
  ];

  const messages = {
    '1': [
      { id: 1, text: 'Привет! Как дела с треком?', time: '10:20', isOwn: false, sender: 'Alex Producer' },
      { id: 2, text: 'Привет! Почти готов, осталось добавить пару эффектов и сведение', time: '10:22', isOwn: true },
      { id: 3, text: 'Отлично! Я добавил новую бас-линию, посмотри что получилось:', time: '10:25', isOwn: false, sender: 'Alex Producer', project: { title: 'Midnight Drive v2', description: 'Добавлен новый бас и хэты', time: '2:45' } },
      { id: 4, text: 'Круто! Мне нравится этот грув. Давай я добавлю падающий синт на припев', time: '10:27', isOwn: true },
      { id: 5, text: 'Отличная идея! Можешь сделать на 45 секунде?', time: '10:28', isOwn: false, sender: 'Alex Producer' },
      { id: 6, text: 'Да, именно там и планировал. Завтра скину вариант', time: '10:29', isOwn: true },
      { id: 7, text: 'Супер! Жду с нетерпением 🎹', time: '10:30', isOwn: false, sender: 'Alex Producer' },
    ],
    '2': [
      { id: 1, text: 'Привет! Видела твой последний трек, очень круто!', time: '14:20', isOwn: false, sender: 'Sarah Beats' },
      { id: 2, text: 'Спасибо! Твои lo-fi работы тоже отличные', time: '14:25', isOwn: true },
    ],
  };

  useEffect(() => {
    // Фильтрация чатов по поиску
    const filtered = chats.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [searchQuery]);

  useEffect(() => {
    // Прокрутка к последнему сообщению
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat, messages]);

  const checkForBadWords = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return badWords.some(word => lowerText.includes(word));
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    if (checkForBadWords(message)) {
      setShowModerationAlert(true);
      setTimeout(() => setShowModerationAlert(false), 5000);
      return;
    }

    // Отправка сообщения
    console.log('Отправка сообщения:', message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeChatData = chats.find(chat => chat.id === activeChat);
  const activeMessages = activeChat ? messages[activeChat as keyof typeof messages] || [] : [];

  return (
    <MessagesContainer>
      {/* Sidebar */}
      <ChatsSidebar>
        <SidebarHeader>
          <SidebarTitle>
            <span>💬</span>
            <span>Сообщения</span>
            <UnreadBadge>3</UnreadBadge>
          </SidebarTitle>
          
          <SearchBox>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              placeholder="Поиск чатов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
        </SidebarHeader>

        <ChatFilters>
          <FilterButton active>Все</FilterButton>
          <FilterButton>Коллабы</FilterButton>
          <FilterButton>Группы</FilterButton>
          <FilterButton>Непрочитанные</FilterButton>
        </ChatFilters>

        <ChatsList>
          {filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              active={activeChat === chat.id}
              onClick={() => setActiveChat(chat.id)}
            >
              <ChatAvatar online={chat.online}>
                <AvatarText>{chat.avatar}</AvatarText>
                {chat.online && <OnlineIndicator />}
              </ChatAvatar>
              
              <ChatInfo>
                <ChatHeader>
                  <ChatName>{chat.name}</ChatName>
                  <ChatTime>{chat.time}</ChatTime>
                </ChatHeader>
                
                <ChatPreview>
                  <ChatMessage>{chat.lastMessage}</ChatMessage>
                  {chat.unread && <UnreadDot />}
                </ChatPreview>
                
                {chat.project && (
                  <ChatProject style={{ background: chat.project.color + '20' }}>
                    <ProjectIcon>🎵</ProjectIcon>
                    <ProjectName>{chat.project.title}</ProjectName>
                  </ChatProject>
                )}
                
                {chat.type === 'group' && (
                  <ChatMeta>
                    <GroupIcon>👥</GroupIcon>
                    <span>{chat.members} участника</span>
                  </ChatMeta>
                )}
              </ChatInfo>
            </ChatItem>
          ))}
        </ChatsList>

        <NewChatButton>
          <Button variant="primary" icon="➕" fullWidth>
            Новый чат
          </Button>
        </NewChatButton>
      </ChatsSidebar>

      {/* Chat Area */}
      <ChatArea>
        {activeChat ? (
          <>
            <ChatHeader>
              <ChatPartner>
                <PartnerAvatar online={activeChatData?.online}>
                  <AvatarText>{activeChatData?.avatar}</AvatarText>
                  {activeChatData?.online && <OnlineIndicator />}
                </PartnerAvatar>
                
                <PartnerInfo>
                  <PartnerName>{activeChatData?.name}</PartnerName>
                  <PartnerStatus>
                    {activeChatData?.online ? 'Online' : 'Был недавно'}
                    {activeChatData?.type === 'collab' && ' • Совместный проект'}
                  </PartnerStatus>
                </PartnerInfo>
              </ChatPartner>

              <ChatActions>
                <ActionButton title="Аудиозвонок">
                  <span>📞</span>
                </ActionButton>
                <ActionButton title="Открыть проект">
                  <span>🎵</span>
                </ActionButton>
                <ActionButton title="Настройки чата">
                  <span>⚙️</span>
                </ActionButton>
              </ChatActions>
            </ChatHeader>

            <MessagesList>
              <DateSeparator>Сегодня</DateSeparator>
              
              {activeMessages.map((msg) => (
                <MessageBubble key={msg.id} isOwn={msg.isOwn}>
                  {!msg.isOwn && msg.sender && (
                    <MessageSender>{msg.sender}</MessageSender>
                  )}
                  
                  <MessageContent isOwn={msg.isOwn}>
                    <MessageText>{msg.text}</MessageText>
                    
                    {msg.project && (
                      <ProjectCard>
                        <ProjectHeader>
                          <ProjectIcon>🎵</ProjectIcon>
                          <ProjectTitle>{msg.project.title}</ProjectTitle>
                        </ProjectHeader>
                        <ProjectInfo>
                          <span>{msg.project.description}</span>
                          <span>•</span>
                          <span>{msg.project.time}</span>
                        </ProjectInfo>
                        <ProjectActions>
                          <Button variant="ghost" size="sm" icon="▶️">
                            Слушать
                          </Button>
                          <Button variant="ghost" size="sm" icon="✏️">
                            Редактировать
                          </Button>
                        </ProjectActions>
                      </ProjectCard>
                    )}
                    
                    <MessageTime>{msg.time}</MessageTime>
                  </MessageContent>
                </MessageBubble>
              ))}
              
              <div ref={messagesEndRef} />
            </MessagesList>

            {showModerationAlert && (
              <ModerationAlert>
                <AlertIcon>⚠️</AlertIcon>
                <AlertText>
                  Сообщение содержит неподобающие слова. Пожалуйста, будьте вежливы.
                </AlertText>
              </ModerationAlert>
            )}

            <MessageInputArea>
              <InputTools>
                <ToolButton title="Прикрепить файл">
                  <span>📎</span>
                </ToolButton>
                <ToolButton title="Запись голоса">
                  <span>🎤</span>
                </ToolButton>
                <ToolButton title="Эмодзи">
                  <span>😊</span>
                </ToolButton>
                <ToolButton title="Форматирование">
                  <span>𝐀</span>
                </ToolButton>
              </InputTools>
              
              <MessageInputWrapper>
                <MessageTextarea
                  placeholder="Напишите сообщение..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={3}
                />
                
                <SendButton
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <SendIcon>↗️</SendIcon>
                </SendButton>
              </MessageInputWrapper>
              
              <InputHint>
                Нажмите Enter для отправки, Shift+Enter для новой строки
              </InputHint>
            </MessageInputArea>
          </>
        ) : (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyTitle>Выберите чат</EmptyTitle>
            <EmptyDescription>
              Начните общение с другими музыкантами, обсуждайте коллаборации
              и делитесь идеями для треков
            </EmptyDescription>
            <Button
              variant="primary"
              icon="👥"
              onClick={() => console.log('Найти партнеров')}
            >
              Найти партнеров для коллаборации
            </Button>
          </EmptyState>
        )}
      </ChatArea>

      {/* Right Sidebar - Info */}
      <InfoSidebar>
        {activeChatData && (
          <>
            <InfoHeader>
              <InfoTitle>Информация о чате</InfoTitle>
            </InfoHeader>
            
            <UserInfoCard>
              <UserAvatar large>
                <AvatarText>{activeChatData.avatar}</AvatarText>
                {activeChatData.online && <OnlineIndicator large />}
              </UserAvatar>
              
              <UserName>{activeChatData.name}</UserName>
              <UserStatus>
                {activeChatData.online ? 'Online' : 'Offline'}
              </UserStatus>
              
              <UserStats>
                <Stat>
                  <StatLabel>Совместных проектов</StatLabel>
                  <StatValue>3</StatValue>
                </Stat>
                <Stat>
                  <StatLabel>Активность</StatLabel>
                  <StatValue>Высокая</StatValue>
                </Stat>
              </UserStats>
            </UserInfoCard>
            
            {activeChatData.project && (
              <ProjectInfoCard>
                <CardHeader>
                  <CardTitle>Совместный проект</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectPreview style={{ background: activeChatData.project.color }}>
                    <ProjectIconLarge>🎵</ProjectIconLarge>
                  </ProjectPreview>
                  <ProjectDetails>
                    <ProjectNameLarge>{activeChatData.project.title}</ProjectNameLarge>
                    <ProjectStatus>В разработке</ProjectStatus>
                    <ProjectProgress>
                      <ProgressBar>
                        <ProgressFill width="75%" />
                      </ProgressBar>
                      <ProgressText>75% завершено</ProgressText>
                    </ProjectProgress>
                  </ProjectDetails>
                </CardContent>
                <CardFooter>
                  <Button variant="primary" size="sm" icon="▶️" fullWidth>
                    Открыть в студии
                  </Button>
                </CardFooter>
              </ProjectInfoCard>
            )}
            
            <ChatSettings>
              <SettingsTitle>Настройки чата</SettingsTitle>
              <SettingsList>
                <Setting>
                  <SettingLabel>Уведомления</SettingLabel>
                  <ToggleSwitch checked />
                </Setting>
                <Setting>
                  <SettingLabel>Фильтр слов</SettingLabel>
                  <ToggleSwitch checked />
                </Setting>
                <Setting>
                  <SettingLabel>Сохранять историю</SettingLabel>
                  <ToggleSwitch checked />
                </Setting>
              </SettingsList>
            </ChatSettings>
            
            <DangerZone>
              <DangerTitle>Опасная зона</DangerTitle>
              <Button variant="danger" icon="🚫" fullWidth>
                Заблокировать пользователя
              </Button>
              <Button variant="outline" icon="📤" fullWidth>
                Экспорт истории
              </Button>
            </DangerZone>
          </>
        )}
      </InfoSidebar>
    </MessagesContainer>
  );
};

// Styled Components
const MessagesContainer = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  background: var(--bg-primary);
`;

const ChatsSidebar = styled.div`
  width: 360px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const SidebarTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const UnreadBadge = styled.span`
  background: var(--primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
`;

const SearchBox = styled.div`
  position: relative;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const ChatFilters = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.active 
    ? 'rgba(102, 126, 234, 0.15)' 
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active 
    ? 'rgba(102, 126, 234, 0.3)' 
    : 'var(--border-color)'};
  border-radius: var(--radius-full);
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  font-size: 0.875rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const ChatsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
`;

const ChatItem = styled.div<{ active?: boolean }>`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-lg);
  background: ${props => props.active 
    ? 'rgba(102, 126, 234, 0.15)' 
    : 'transparent'};
  border: 1px solid ${props => props.active 
    ? 'rgba(102, 126, 234, 0.3)' 
    : 'transparent'};
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: 0.5rem;
  
  &:hover {
    background: ${props => props.active 
      ? 'rgba(102, 126, 234, 0.2)' 
      : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const ChatAvatar = styled.div<{ online?: boolean }>`
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const AvatarText = styled.span`
  font-weight: 600;
  font-size: 1.25rem;
  color: white;
`;

const OnlineIndicator = styled.div<{ large?: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${props => props.large ? '12px' : '10px'};
  height: ${props => props.large ? '12px' : '10px'};
  background: #10b981;
  border: 2px solid var(--bg-secondary);
  border-radius: 50%;
`;

const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.25rem;
`;

const ChatName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatTime = styled.div`
  font-size: 0.75rem;
  color: var(--text-tertiary);
  flex-shrink: 0;
`;

const ChatPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ChatMessage = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  flex-shrink: 0;
`;

const ChatProject = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`;

const ProjectIcon = styled.span`
  font-size: 0.75rem;
`;

const ProjectName = styled.span`
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
`;

const GroupIcon = styled.span`
  font-size: 0.75rem;
`;

const NewChatButton = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-tertiary);
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
`;

const ChatPartner = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PartnerAvatar = styled(ChatAvatar)``;

const PartnerInfo = styled.div``;

const PartnerName = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const PartnerStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const ChatActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
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

const MessagesList = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DateSeparator = styled.div`
  text-align: center;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 1rem auto;
`;

const MessageBubble = styled.div<{ isOwn?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  max-width: 70%;
`;

const MessageSender = styled.div`
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-bottom: 0.25rem;
  padding-left: 0.5rem;
`;

const MessageContent = styled.div<{ isOwn?: boolean }>`
  padding: 0.75rem 1rem;
  background: ${props => props.isOwn 
    ? 'linear-gradient(135deg, var(--primary), var(--secondary))' 
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.isOwn 
    ? 'transparent' 
    : 'var(--border-color)'};
  border-radius: ${props => props.isOwn 
    ? 'var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg)' 
    : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)'};
  color: ${props => props.isOwn ? 'white' : 'var(--text-primary)'};
  word-break: break-word;
`;

const MessageText = styled.div`
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

const ProjectCard = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ProjectIcon = styled.span``;

const ProjectTitle = styled.div`
  font-weight: 600;
  color: inherit;
`;

const ProjectInfo = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: inherit;
  opacity: 0.8;
  margin-bottom: 0.75rem;
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  text-align: right;
  opacity: 0.8;
  margin-top: 0.25rem;
`;

const ModerationAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-lg);
  margin: 0 1.5rem;
  animation: slideUp var(--transition-normal);
`;

const AlertIcon = styled.span`
  font-size: 1.25rem;
  color: #fca5a5;
`;

const AlertText = styled.div`
  color: #fca5a5;
  font-size: 0.875rem;
  flex: 1;
`;

const MessageInputArea = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
`;

const InputTools = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const ToolButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const MessageInputWrapper = styled.div`
  position: relative;
  margin-bottom: 0.5rem;
`;

const MessageTextarea = styled.textarea`
  width: 100%;
  padding: 1rem 4rem 1rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.95rem;
  resize: none;
  min-height: 60px;
  max-height: 120px;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const SendButton = styled.button<{ disabled?: boolean }>`
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background: ${props => props.disabled 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'linear-gradient(135deg, var(--primary), var(--secondary))'};
  border: none;
  color: ${props => props.disabled ? 'var(--text-tertiary)' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all var(--transition-fast);
  
  &:not(:disabled):hover {
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  }
`;

const SendIcon = styled.span`
  font-size: 1.25rem;
`;

const InputHint = styled.div`
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
`;

const EmptyDescription = styled.p`
  color: var(--text-secondary);
  max-width: 400px;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const InfoSidebar = styled.div`
  width: 320px;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
  overflow-y: auto;
  padding: 1.5rem;
`;

const InfoHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const InfoTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const UserInfoCard = styled(Card)`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const UserAvatar = styled(ChatAvatar)<{ large?: boolean }>`
  width: ${props => props.large ? '80px' : '48px'};
  height: ${props => props.large ? '80px' : '48px'};
  margin: 0 auto 1rem;
`;

const UserName = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
`;

const UserStatus = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
`;

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const ProjectInfoCard = styled(Card)`
  margin-bottom: 1.5rem;
`;

const ProjectPreview = styled.div`
  height: 120px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const ProjectIconLarge = styled.span`
  font-size: 3rem;
`;

const ProjectDetails = styled.div``;

const ProjectNameLarge = styled.h5`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
`;

const ProjectStatus = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
`;

const ProjectProgress = styled.div`
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div<{ width: string }>`
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  width: ${props => props.width};
  border-radius: var(--radius-full);
`;

const ProgressText = styled.div`
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-align: center;
`;

const ChatSettings = styled.div`
  margin-bottom: 1.5rem;
`;

const SettingsTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
`;

const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Setting = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SettingLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-primary);
`;

const ToggleSwitch = styled.div<{ checked?: boolean }>`
  width: 44px;
  height: 24px;
  background: ${props => props.checked ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: var(--radius-full);
  position: relative;
  cursor: pointer;
  transition: background var(--transition-fast);
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.checked ? '22px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left var(--transition-fast);
  }
`;

const DangerZone = styled.div`
  border-top: 1px solid rgba(239, 68, 68, 0.3);
  padding-top: 1.5rem;
`;

const DangerTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 600;
  color: #fca5a5;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
`;

export default MessagesPage;
