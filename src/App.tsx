import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface MappingItem {
  id: string
  message?: {
    author: {
      role: string
    }
    content: {
      parts: string[]
    }
  }
  parent?: string
  children?: string[]
}

interface ChatData {
  title: string
  mapping: Record<string, MappingItem>
}

interface Chat {
  _id: string
  title: string
  mapping: Record<string, any>
}

const Detail = ({ id }: { id: Chat["_id"] | null }) => {
  const [chatData, setChatData] = useState<ChatData | null>(null)

  useEffect(() => {

    if (id) {
      axios.get(`http://localhost:5000/api/chats/${id}`)
        .then(response => setChatData(response.data))
        .catch(error => console.error('Error fetching chat data:', error))
    }
  }, [id])

  const renderMessage = (item: MappingItem) => {
    const { message } = item
    if (!message) return null

    const isUser = message.author.role === 'user'
    return (
      <div
        key={item.id}
        style={{
          textAlign: isUser ? 'right' : 'left',
          margin: '10px 0',
          padding: '10px',
          backgroundColor: isUser ? '#e1f5fe' : '#fffde7',
          borderRadius: '10px',
          display: 'inline-block',
          maxWidth: '70%',
        }}
      >
        {message?.content?.parts?.map((part, index) => (
          <p key={index} style={{ margin: 0 }}>{part}</p>
        ))}
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>{chatData?.title || 'Chat Viewer'}</h1>
      <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', backgroundColor: '#f9f9f9' }}>
        {chatData?.mapping && Object.values(chatData.mapping).map(item => renderMessage(item))}
      </div>
    </div>
  )
}

const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat["_id"] | null>(null)

  useEffect(() => {
    axios.get('http://localhost:5000/api/chats')
      .then(response => setChats(response.data))
      .catch(error => console.error('Error fetching chats:', error))
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chat Viewer</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>Conversations</h2>
          <ul>
            {chats.map(chat => (
              <li
                key={chat._id}
                style={{ cursor: 'pointer', marginBottom: '10px' }}
                onClick={() => setSelectedChat(chat._id)}
              >
                {chat.title || `Chat ID: ${chat._id}`}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 2, border: '1px solid #ddd', padding: '10px' }}>
          <h2>Chat Details</h2>
          <Detail id={selectedChat} />
        </div>
      </div>
    </div>
  )
}

export default App
