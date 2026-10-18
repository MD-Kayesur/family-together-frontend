import fs from 'fs';
import path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ShadingType,
  BorderStyle,
} from 'docx';

async function generateSocketExplanationDoc() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Segoe UI',
            size: 22, // 11pt
            color: '1E293B',
          },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 150 },
            children: [
              new TextRun({
                text: '⚡ Real-Time Socket.io Architecture & WebSocket Implementation Guide',
                bold: true,
                size: 34,
                color: '1E3A8A',
              }),
            ],
          }),

          // Subtitle
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'Complete Technical Explanation of Real-Time Messaging, Room Segmentation, JWT Handshake Authentication, Facebook Messenger-Style Relational Permissions, and Fallback Architecture',
                italics: true,
                size: 22,
                color: '64748B',
              }),
            ],
          }),

          // Overview Callout Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'EFF6FF', type: ShadingType.CLEAR, color: 'auto' },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 2, color: 'BFDBFE' },
                      bottom: { style: BorderStyle.SINGLE, size: 2, color: 'BFDBFE' },
                      left: { style: BorderStyle.SINGLE, size: 6, color: '2563EB' },
                      right: { style: BorderStyle.SINGLE, size: 2, color: 'BFDBFE' },
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'SOCKET STACK OVERVIEW: ', bold: true, color: '1E3A8A' }),
                          new TextRun({
                            text: 'Backend: NestJS Gateway (@nestjs/websockets, socket.io) with JWT verification | Frontend: socket.io-client in Next.js 15 | Transports: WebSocket with Polling fallback | Protocol: Bidirectional pub/sub with room isolation.',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // Section 1: Core Architecture
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '1. High-Level Socket Architecture & Event Lifecycle',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'In FamilyRoots, real-time messaging is powered by a high-performance Socket.io gateway integrated into NestJS. Rather than relying on continuous HTTP polling, a single persistent TCP connection enables instant two-way event streaming between clients and the server.',
              }),
            ],
          }),

          // Flow Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Stage', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Component', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { fill: '1E3A8A', type: ShadingType.CLEAR, color: 'auto' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Action & Security Mechanism', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '1. Handshake', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Client -> Gateway' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Sends Bearer JWT token in auth: { token } during connection handshake.' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '2. Auth Validation', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'ChatGateway (handleConnection)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Validates JWT via JwtService.verify(). Injects userId into client.data. Disconnects if invalid.' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '3. Room Subscriptions', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Socket Rooms' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Client auto-joins user_${userId} for private pings, and conv_${conversationId} for active chats.' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '4. Message Pipeline', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'send_message Handler' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Validates relation permissions, writes to PostgreSQL via Prisma, and emits new_message to room.' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '5. Typing & Read', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Ephemeral Events' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Lightweight typing and mark_read events stream directly to conversation participants without DB writes.' })] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // Section 2: Code Breakdown
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '2. Backend Implementation Breakdown (ChatGateway)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'File: src/family/chat/chat.gateway.ts',
                bold: true,
                font: 'Consolas',
                color: '0369A1',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: `Key Gateway Methods:
• handleConnection(client: Socket):
  Extracts the JWT token from client.handshake.auth.token. Verifies signature against JWT_SECRET. Stores verified payload on client.data.userId. Joins client.join('user_' + userId). Unauthenticated connections are dropped instantly.

• handleJoinConversation(client, data: { conversationId }):
  Executes client.join('conv_' + data.conversationId). Segregates message streams so only participants in that specific chat thread receive data.

• handleSendMessage(client, dto: SendChatMessageDto):
  1. Identifies authenticated senderId from client.data.userId.
  2. Calls chatService.saveMessage(senderId, dto) to write to PostgreSQL.
  3. Broadcasts this.server.to('conv_' + dto.conversationId).emit('new_message', savedMessage).
  4. Returns acknowledgment to the sender.

• handleTyping(client, dto: TypingEventDto):
  Broadcasts client.to('conv_' + dto.conversationId).emit('user_typing', { userId, isTyping }).

• handleMarkRead(client, dto: MarkReadDto):
  Updates unread count to 0 and message statuses to READ in PostgreSQL, then notifies other participant via message_read.`,
                font: 'Consolas',
                size: 20,
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // Section 3: Facebook Messenger Logic
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '3. Facebook Messenger-Style Relational Permission Engine',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'In typical messaging apps, any authenticated user can spam any other user. In FamilyRoots, messaging permission is strictly governed by relational graph ties in ChatService.canInitiateMessage():',
              }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [
              new TextRun({ text: 'Rule 1 (Sanctuary Protection): ', bold: true, color: 'DC2626' }),
              new TextRun({ text: 'Ordinary MEMBER accounts CANNOT initiate direct 1-on-1 chats to the Sanctuary OWNER. This protects family heads from unsolicited messaging while allowing them to announce in group channels.' }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [
              new TextRun({ text: 'Rule 2 (Administrative Authority): ', bold: true, color: '16A34A' }),
              new TextRun({ text: 'Sanctuary OWNER and SUPER_ADMIN can initiate direct conversations with any member in the sanctuary.' }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [
              new TextRun({ text: 'Rule 3 (Creator / Added Tracking): ', bold: true, color: '2563EB' }),
              new TextRun({ text: 'If User A created or invited User B (createdById), messaging is automatically permitted.' }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [
              new TextRun({ text: 'Rule 4 (Active Family Tree Tie): ', bold: true, color: '7C3AED' }),
              new TextRun({ text: 'Members can message relatives if an ACTIVE Relationship record exists between their linked person profiles in the family lineage tree.' }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // Section 4: Frontend Socket Client
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '4. Frontend Client Implementation (MessagesTab.tsx)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'File: src/components/dashboard/tabs/MessagesTab.tsx',
                bold: true,
                font: 'Consolas',
                color: '0369A1',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: `Key Frontend Socket Workflows:
1. Connection Setup:
   const socket = io(backendUrl, {
     auth: { token: 'Bearer ' + accessToken },
     transports: ['websocket', 'polling'],
     reconnectionAttempts: 5,
   });

2. Incoming Message Listener (new_message):
   Receives the saved message from the server. Checks if it already exists in state (deduplication). Appends to localMessages[conversationId] and triggers audio/unread refresh.

3. Typing Pulse (user_typing):
   Listens for typing status from the other participant. Displays a dynamic 3-dot bounce animation when activeConversation matches.

4. Optimistic Sending with Fallback:
   When user hits Send, the UI instantly renders the message locally with status 'sent'. If the WebSocket socketConnected flag is true, it emits send_message. If offline, it seamlessly falls back to REST POST /family/chat/messages.`,
                font: 'Consolas',
                size: 20,
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 250, after: 150 } }),

          // Section 5: Summary
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '5. Summary of Engineering Highlights',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Zero Data Leaks: ', bold: true }),
              new TextRun({ text: 'Private room segregation (conv_<id>) ensures messages only reach verified thread participants.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'PostgreSQL Persistence: ', bold: true }),
              new TextRun({ text: 'Every socket message is persisted atomically with sender metadata, avatar, and timestamp before broadcast.' }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Dual Transport Reliability: ', bold: true }),
              new TextRun({ text: 'Supports native WebSocket with fallback to long-polling and REST API fallback for strict firewalls.' }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const frontendDocPath = path.resolve('REALTIME_SOCKET_ARCHITECTURE_AND_IMPLEMENTATION_EXPLANATION.doc');
  const frontendDocxPath = path.resolve('REALTIME_SOCKET_ARCHITECTURE_AND_IMPLEMENTATION_EXPLANATION.docx');
  const backendDocPath = path.resolve('../family-together-backend/REALTIME_SOCKET_ARCHITECTURE_AND_IMPLEMENTATION_EXPLANATION.doc');
  const backendDocxPath = path.resolve('../family-together-backend/REALTIME_SOCKET_ARCHITECTURE_AND_IMPLEMENTATION_EXPLANATION.docx');

  fs.writeFileSync(frontendDocPath, buffer);
  fs.writeFileSync(frontendDocxPath, buffer);
  console.log(`✅ Saved Frontend Docs: ${frontendDocPath}`);

  fs.writeFileSync(backendDocPath, buffer);
  fs.writeFileSync(backendDocxPath, buffer);
  console.log(`✅ Saved Backend Docs: ${backendDocPath}`);
}

generateSocketExplanationDoc().catch(console.error);
