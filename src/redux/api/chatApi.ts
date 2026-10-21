import { baseApi } from "./baseApi";

export interface ChatParticipant {
  id: string;
  userId: string;
  unreadCount: number;
  lastReadAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    role: string;
  };
}

export interface ConversationItem {
  id: string;
  familyId: string;
  type: "DIRECT" | "GROUP";
  title: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  otherUser?: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    role: string;
  } | null;
  participants: ChatParticipant[];
}

export interface ChatMessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  avatar?: string;
  text: string;
  mediaUrl?: string;
  status: "SENT" | "DELIVERED" | "READ";
  createdAt: string;
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<ConversationItem[], void>({
      query: () => "/family/chat/conversations",
      providesTags: ["Conversations"],
    }),
    getConversationMessages: builder.query<ChatMessageItem[], string>({
      query: (conversationId) => `/family/chat/conversations/${conversationId}/messages`,
      providesTags: (result, error, id) => [{ type: "ChatMessages", id }],
    }),
    createConversation: builder.mutation<ConversationItem, { recipientId: string; initialMessage?: string }>({
      query: (body) => ({
        url: "/family/chat/conversations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Conversations"],
    }),
    sendChatMessage: builder.mutation<ChatMessageItem, { conversationId: string; text: string; mediaUrl?: string }>({
      query: (body) => ({
        url: "/family/chat/messages",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        "Conversations",
        { type: "ChatMessages", id: arg.conversationId },
      ],
    }),
    markConversationAsRead: builder.mutation<{ success: boolean }, string>({
      query: (conversationId) => ({
        url: `/family/chat/conversations/${conversationId}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Conversations"],
    }),
    checkCanMessage: builder.query<{ allowed: boolean }, string>({
      query: (recipientId) => `/family/chat/can-message/${recipientId}`,
    }),
    updateChatMessage: builder.mutation<
      ChatMessageItem,
      { id: string; conversationId: string; text: string; mediaUrl?: string }
    >({
      query: ({ id, text, mediaUrl }) => ({
        url: `/family/chat/messages/${id}`,
        method: "PATCH",
        body: { text, mediaUrl },
      }),
      invalidatesTags: (result, error, arg) => [
        "Conversations",
        { type: "ChatMessages", id: arg.conversationId },
      ],
    }),
    deleteChatMessage: builder.mutation<
      { success: boolean; deletedId: string; conversationId?: string },
      { id: string; conversationId: string }
    >({
      query: ({ id }) => ({
        url: `/family/chat/messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        "Conversations",
        { type: "ChatMessages", id: arg.conversationId },
      ],
    }),
    deleteConversation: builder.mutation<{ success: boolean; deletedId: string }, string>({
      query: (conversationId) => ({
        url: `/family/chat/conversations/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Conversations"],
    }),
    getOnlineUsers: builder.query<{ onlineUserIds: string[]; lastActiveMap?: Record<string, string> }, void>({
      query: () => "/family/chat/online-users",
    }),
    getChatUsers: builder.query<
      {
        id: string;
        fullName: string;
        email: string;
        avatarUrl?: string;
        role: string;
        online: boolean;
        lastActiveAt?: string | null;
        canMessage: boolean;
        isOwnerTarget: boolean;
      }[],
      void
    >({
      query: () => "/family/chat/users",
      providesTags: ["Conversations"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useCreateConversationMutation,
  useSendChatMessageMutation,
  useMarkConversationAsReadMutation,
  useCheckCanMessageQuery,
  useUpdateChatMessageMutation,
  useDeleteChatMessageMutation,
  useDeleteConversationMutation,
  useGetOnlineUsersQuery,
  useGetChatUsersQuery,
} = chatApi;

