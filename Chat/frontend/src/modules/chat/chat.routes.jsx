import { Route, Routes } from 'react-router-dom';
import { ChatHomePage } from './pages/ChatHomePage.jsx';
import { ChatDetailPage } from './pages/ChatDetailPage.jsx';
import { NewChatPage } from './pages/NewChatPage.jsx';
import { CreateGroupPage } from './pages/CreateGroupPage.jsx';
import { GroupInfoPage } from './pages/GroupInfoPage.jsx';

export function ChatRoutes() {
  return (
    <Routes>
      <Route index element={<ChatHomePage />} />
      <Route path=":chatId" element={<ChatDetailPage />} />
      <Route path="new" element={<NewChatPage />} />
      <Route path="group/new" element={<CreateGroupPage />} />
      <Route path="group/:chatId/info" element={<GroupInfoPage />} />
    </Routes>
  );
}
