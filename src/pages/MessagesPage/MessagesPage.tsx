import React, { useState } from 'react';
import styled from 'styled-components';

const MessagesContainer = styled.div`
  display: flex;
  height: calc(100vh - 200px);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
`;

const ConversationsSidebar = styled.div`
  width: 320px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(16, 18, 24, 0.8);
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const SidebarTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  font-size: 0.875rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const ConversationItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background: ${props => props.active 
    ? 'rgba(102, 126, 234, 0.15)' 
    : 'transparent'};
  border: 1px solid ${props => props.active 
    ? 'rgba(102, 126, 234, 0.3)' 
    : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  
  &:hover {
    background: ${props => props.active 
      ? 'rgba(102, 126, 234, 0.2)' 
      : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
`;

const ConversationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ConversationName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: white;
`;

const LastMessage = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
`;

const UnreadBadge = styled.div`
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(16, 18, 24, 0.5);
`;

const ChatHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatPartner = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PartnerName = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
`;

const PartnerStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
`;

const StatusDot = styled.div<{ online: boolean }>`
  width: 8px;
  height: 8px;
  background: ${props => props.online ? '#10b981' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 50%;
`;

const ChatActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ChatActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.15);
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

const Message = styled.div<{ isOwn: boolean }>`
  max-width: 70%;
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  padding: 1rem;
  background: ${props => props.isOwn 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.isOwn 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${props => props.isOwn 
    ? '16px 16px 4px 16px' 
    : '16px 16px 16px 4px'};
  color: white;
`;

const MessageText = styled.div`
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

const MessageTimeStamp = styled.div`
  font-size: 0.75rem;
  color: ${props => props.color || 'rgba(255, 255, 255, 0.5)'};
  text-align: right;
`;

const ProjectLink = styled.div`
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const ProjectLinkTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: white;
`;

const ProjectLinkInfo = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ChatInputArea = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const MessageInput = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
`;

const InputField = styled.textarea`
  flex: 1;
  min-height: 60px;
  max-height: 120px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-family: inherit;
  font-size: 0.95rem;
  resize: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.5);
  }
`;

const InputActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SendButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  }
`;

const ModerationAlert = styled.div`
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const MessagesPage: React.FC = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [message, setMessage] = useState('');
  const [showModerationAlert, setShowModerationAlert] = useState(false);
  
  const conversations = [
    {
      id: 1,
      name: 'Alex Producer',
      lastMessage: 'Посмотри новый бит, я добавил бас-линию',
      time: '10:25',
      unread: true,
      avatar: 'AP',
      online: true,
      project: { title: 'Midnight Drive', type: 'beat' }
    },
    {
      id: 2,
      name: 'Sarah Beats',
      lastMessage: 'Готов к коллаборации? У меня есть идея для трека',
      time: 'Вчера',
      unread: false,
      avatar: 'SB',
      online: false,
      project: { title: 'Urban Dreams Collab', type: 'collab' }
    },
    {
      id: 3,
      name: 'Beat Collective',
      lastMessage: 'Ремикс почти готов, осталось сведение',
      time: '12 апр',
      unread: true,
      avatar: 'BC',
      online: true,
      project: { title: 'Desert Storm Remix', type: 'remix' }
    },
    {
      id: 4,
      name: 'Synth Sisters',
      lastMessage: 'Привет! Нравится наш новый синтезатор?',
      time: '10 апр',
      unread: false,
      avatar: 'SS',
      online: true,
      project: null
    },
  ];
  
  const messages = [
    {
      id: 1,
      text: 'Привет! Как дела с треком?',
      time: '10:20',
      isOwn: false,
      sender: 'Alex Producer'
    },
    {
      id: 2,
      text: 'Привет! Почти готов, осталось добавить пару эффектов',
      time: '10:22',
      isOwn: true,
      sender: 'Вы'
    },
    {
      id: 3,
      text: 'Отлично! Я добавил новую бас-линию, посмотри что получилось:',
      time: '10:25',
      isOwn: false,
      sender: 'Alex Producer',
      project: {
        title: 'Midnight Drive v2',
        description: 'Добавлен новый бас и хэты',
        time: '2:45'
      }
    },
    {
      id: 4,
      text: 'Круто! Мне нравится этот грув. Давай я добавлю падающий синт на припев',
      time: '10:27',
      isOwn: true,
      sender: 'Вы'
    },
  ];
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Простая проверка на плохие слова
    const badWords = ['дурак', 'идиот', 'тупой'];
    const containsBadWord = badWords.some(word => 
      message.toLowerCase().includes(word)
    );
    
    if (containsBadWord) {
      setShowModerationAlert(true);
      setTimeout(() => setShowModerationAlert(false), 5000);
      return;
    }
    
    // Здесь будет логика отправки сообщения
    console.log('Sending message:', message);
    setMessage('');
  };
  
  const activeConversation = conversations.find(c => c.id === activeChat);

  return (
    <MessagesContainer>
      <ConversationsSidebar>
        <SidebarHeader>
          <SidebarTitle>💬 Сообщения</SidebarTitle>
          <SearchInput placeholder="Поиск диалогов..." />
        </SidebarHeader>
        
        <ConversationsList>
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              active={activeChat === conversation.id}
              onClick={() => setActiveChat(conversation.id)}
            >
              <Avatar>{conversation.avatar}</Avatar>
              <ConversationInfo>
                <ConversationName>{conversation.name}</ConversationName>
                <LastMessage>{conversation.lastMessage}</LastMessage>
              </ConversationInfo>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <MessageTime>{conversation.time}</MessageTime>
                {conversation.unread && <UnreadBadge />}
              </div>
            </ConversationItem>
          ))}
        </ConversationsList>
      </ConversationsSidebar>
      
      <ChatArea>
        {activeConversation ? (
          <>
            <ChatHeader>
              <ChatPartner>
                <Avatar>{activeConversation.avatar}</Avatar>
                <div>
                  <PartnerName>{activeConversation.name}</PartnerName>
                  <PartnerStatus>
                    <StatusDot online={activeConversation.online} />
                    <span>{activeConversation.online ? 'Online' : 'Был недавно'}</span>
                  </PartnerStatus>
                </div>
              </ChatPartner>
              
              <ChatActions>
                <ChatActionButton title="Аудиозвонок">📞</ChatActionButton>
                <ChatActionButton title="Видеозвонок">🎥</ChatActionButton>
                <ChatActionButton title="Настройки">⚙️</ChatActionButton>
              </ChatActions>
            </ChatHeader>
            
            <MessagesList>
              {messages.map((msg) => (
                <Message key={msg.id} isOwn={msg.isOwn}>
                  <MessageBubble isOwn={msg.isOwn}>
                    <MessageText>{msg.text}</MessageText>
                    {msg.project && (
                      <ProjectLink>
                        <ProjectLinkTitle>🎵 {msg.project.title}</ProjectLinkTitle>
                        <ProjectLinkInfo>
                          {msg.project.description} • {msg.project.time}
                        </ProjectLinkInfo>
                      </ProjectLink>
                    )}
                    <MessageTimeStamp color={msg.isOwn ? 'rgba(255, 255, 255, 0.8)' : undefined}>
                      {msg.time}
                    </MessageTimeStamp>
                  </MessageBubble>
                </Message>
              ))}
            </MessagesList>
            
            <ChatInputArea>
              <MessageInput>
                <InputField
                  placeholder="Напишите сообщение..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <InputActions>
                  <ChatActionButton title="Прикрепить файл">📎</ChatActionButton>
                  <ChatActionButton title="Эмодзи">😊</ChatActionButton>
                  <SendButton onClick={handleSendMessage}>
                    ↗️
                  </SendButton>
                </InputActions>
              </MessageInput>
              
              {showModerationAlert && (
                <ModerationAlert>
                  ⚠️ Ваше сообщение содержит неподобающие слова. Пожалуйста, будьте вежливы.
                </ModerationAlert>
              )}
            </ChatInputArea>
          </>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '1rem' }}>💬</div>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Выберите диалог
            </div>
            <div style={{ textAlign: 'center', maxWidth: '400px' }}>
              Начните общение с другими музыкантами, обсуждайте коллаборации
              и делитесь идеями для треков.
            </div>
          </div>
        )}
      </ChatArea>
    </MessagesContainer>
  );
};

export default MessagesPage;
