/**
 * Mock Conversations Data
 * 
 * Example conversations and messages between customers and escorts.
 * Used for development and testing messaging features.
 * 
 * @module data/mockData/conversations
 * @category MockData
 */

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'customer' | 'escort';
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'system';
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  escortId: string;
  escortName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isActive: boolean;
  messages: Message[];
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    customerId: 'cust-001',
    customerName: 'Ahmet Kaya',
    escortId: 'esc-001',
    escortName: 'Ayşe',
    lastMessage: 'Tamam, yarın saat 18:00\'da görüşürüz.',
    lastMessageTime: '2024-03-21T17:30:00Z',
    unreadCount: 0,
    isActive: true,
    messages: [
      {
        id: 'msg-001',
        conversationId: 'conv-001',
        senderId: 'cust-001',
        senderType: 'customer',
        content: 'Merhaba, yarın için randevu alabilir miyim?',
        timestamp: '2024-03-21T16:00:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-002',
        conversationId: 'conv-001',
        senderId: 'esc-001',
        senderType: 'escort',
        content: 'Merhaba, tabii ki. Hangi saatte istersiniz?',
        timestamp: '2024-03-21T16:15:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-003',
        conversationId: 'conv-001',
        senderId: 'cust-001',
        senderType: 'customer',
        content: 'Saat 18:00 uygun mudur?',
        timestamp: '2024-03-21T16:20:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-004',
        conversationId: 'conv-001',
        senderId: 'esc-001',
        senderType: 'escort',
        content: 'Evet, uygun. Klasik masaj mı istiyorsunuz?',
        timestamp: '2024-03-21T16:25:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-005',
        conversationId: 'conv-001',
        senderId: 'cust-001',
        senderType: 'customer',
        content: 'Evet, 1 saatlik klasik masaj.',
        timestamp: '2024-03-21T17:00:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-006',
        conversationId: 'conv-001',
        senderId: 'esc-001',
        senderType: 'escort',
        content: 'Tamam, yarın saat 18:00\'da görüşürüz.',
        timestamp: '2024-03-21T17:30:00Z',
        read: true,
        type: 'text',
      },
    ],
  },
  {
    id: 'conv-002',
    customerId: 'cust-002',
    customerName: 'Mehmet Yılmaz',
    escortId: 'esc-002',
    escortName: 'Zeynep',
    lastMessage: 'Harika, teşekkürler!',
    lastMessageTime: '2024-03-21T19:45:00Z',
    unreadCount: 2,
    isActive: true,
    messages: [
      {
        id: 'msg-007',
        conversationId: 'conv-002',
        senderId: 'cust-002',
        senderType: 'customer',
        content: 'Merhaba Zeynep, geçen seferki hizmet harikaydı.',
        timestamp: '2024-03-21T18:00:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-008',
        conversationId: 'conv-002',
        senderId: 'esc-002',
        senderType: 'escort',
        content: 'Teşekkür ederim! Ne zaman tekrar gelmek istersiniz?',
        timestamp: '2024-03-21T18:30:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-009',
        conversationId: 'conv-002',
        senderId: 'cust-002',
        senderType: 'customer',
        content: 'Bu hafta sonu müsait misiniz?',
        timestamp: '2024-03-21T19:00:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-010',
        conversationId: 'conv-002',
        senderId: 'esc-002',
        senderType: 'escort',
        content: 'Cumartesi akşamı müsaitim. Saat 20:00?',
        timestamp: '2024-03-21T19:15:00Z',
        read: false,
        type: 'text',
      },
      {
        id: 'msg-011',
        conversationId: 'conv-002',
        senderId: 'cust-002',
        senderType: 'customer',
        content: 'Harika, teşekkürler!',
        timestamp: '2024-03-21T19:45:00Z',
        read: false,
        type: 'text',
      },
    ],
  },
  {
    id: 'conv-003',
    customerId: 'cust-003',
    customerName: 'Can Demir',
    escortId: 'esc-004',
    escortName: 'Selin',
    lastMessage: 'Otelin adresini gönderiyorum.',
    lastMessageTime: '2024-03-21T15:00:00Z',
    unreadCount: 0,
    isActive: true,
    messages: [
      {
        id: 'msg-012',
        conversationId: 'conv-003',
        senderId: 'cust-003',
        senderType: 'customer',
        content: 'Merhaba Selin, Antalya\'dayım. Outcall hizmet veriyor musunuz?',
        timestamp: '2024-03-21T14:00:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-013',
        conversationId: 'conv-003',
        senderId: 'esc-004',
        senderType: 'escort',
        content: 'Evet, hangi otelde kalıyorsunuz?',
        timestamp: '2024-03-21T14:15:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-014',
        conversationId: 'conv-003',
        senderId: 'cust-003',
        senderType: 'customer',
        content: 'Otelin adresini gönderiyorum.',
        timestamp: '2024-03-21T15:00:00Z',
        read: true,
        type: 'text',
      },
    ],
  },
  {
    id: 'conv-004',
    customerId: 'cust-001',
    customerName: 'Ahmet Kaya',
    escortId: 'esc-003',
    escortName: 'Elif',
    lastMessage: 'Anlıyorum, başka zaman görüşürüz.',
    lastMessageTime: '2024-03-20T16:30:00Z',
    unreadCount: 0,
    isActive: false,
    messages: [
      {
        id: 'msg-015',
        conversationId: 'conv-004',
        senderId: 'cust-001',
        senderType: 'customer',
        content: 'Merhaba, bugün için randevu alabilir miyim?',
        timestamp: '2024-03-20T15:00:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-016',
        conversationId: 'conv-004',
        senderId: 'esc-003',
        senderType: 'escort',
        content: 'Üzgünüm, bugün doluyum.',
        timestamp: '2024-03-20T16:00:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-017',
        conversationId: 'conv-004',
        senderId: 'cust-001',
        senderType: 'customer',
        content: 'Anlıyorum, başka zaman görüşürüz.',
        timestamp: '2024-03-20T16:30:00Z',
        read: true,
        type: 'text',
      },
    ],
  },
  {
    id: 'conv-005',
    customerId: 'cust-005',
    customerName: 'Emre Çelik',
    escortId: 'esc-009',
    escortName: 'Ceren',
    lastMessage: 'Mükemmel, görüşmek üzere!',
    lastMessageTime: '2024-03-21T20:00:00Z',
    unreadCount: 1,
    isActive: true,
    messages: [
      {
        id: 'msg-018',
        conversationId: 'conv-005',
        senderId: 'cust-005',
        senderType: 'customer',
        content: 'Merhaba Ceren, Bodrum\'a geliyorum.',
        timestamp: '2024-03-21T18:00:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-019',
        conversationId: 'conv-005',
        senderId: 'esc-009',
        senderType: 'escort',
        content: 'Hoş geldiniz! Ne zaman geliyorsunuz?',
        timestamp: '2024-03-21T18:30:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-020',
        conversationId: 'conv-005',
        senderId: 'cust-005',
        senderType: 'customer',
        content: 'Cuma akşamı. Yatımda buluşalım mı?',
        timestamp: '2024-03-21T19:00:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-021',
        conversationId: 'conv-005',
        senderId: 'esc-009',
        senderType: 'escort',
        content: 'Tabii ki! Marina\'da mı?',
        timestamp: '2024-03-21T19:30:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-022',
        conversationId: 'conv-005',
        senderId: 'cust-005',
        senderType: 'customer',
        content: 'Evet, Palmarina. Detayları mesaj ile göndereceğim.',
        timestamp: '2024-03-21T19:45:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'msg-023',
        conversationId: 'conv-005',
        senderId: 'esc-009',
        senderType: 'escort',
        content: 'Mükemmel, görüşmek üzere!',
        timestamp: '2024-03-21T20:00:00Z',
        read: false,
        type: 'text',
      },
    ],
  },
];

/**
 * Get conversation by ID
 */
export function getConversationById(id: string): Conversation | undefined {
  return mockConversations.find(c => c.id === id);
}

/**
 * Get conversations for customer
 */
export function getCustomerConversations(customerId: string): Conversation[] {
  return mockConversations.filter(c => c.customerId === customerId);
}

/**
 * Get conversations for escort
 */
export function getEscortConversations(escortId: string): Conversation[] {
  return mockConversations.filter(c => c.escortId === escortId);
}

/**
 * Get unread message count for user
 */
export function getUnreadCount(userId: string, userType: 'customer' | 'escort'): number {
  const conversations = userType === 'customer'
    ? getCustomerConversations(userId)
    : getEscortConversations(userId);
  
  return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
}
