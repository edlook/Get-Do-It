import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
};

type ConversationPartner = {
  id: string;
  name: string;
  avatar_url: string | null;
  lastMessage: string;
  lastTime: string;
  unread: number;
};

export default function Messages() {
  const { user, loading } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationPartner[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [profiles, setProfiles] = useState<Record<string, { name: string; avatar_url: string | null }>>({});

  const t = {
    de: {
      title: 'Nachrichten',
      noConversations: 'Noch keine Nachrichten',
      noConversationsDesc: 'Wenn Sie auf ein Angebot antworten oder eine Nachricht erhalten, erscheint die Konversation hier.',
      placeholder: 'Nachricht schreiben...',
      send: 'Senden',
    },
    en: {
      title: 'Messages',
      noConversations: 'No messages yet',
      noConversationsDesc: 'When you respond to a task or receive a message, conversations will appear here.',
      placeholder: 'Type a message...',
      send: 'Send',
    },
  };
  const tr = t[lang];

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchConversations = async () => {
      const { data: allMsgs } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (!allMsgs) return;

      // Group by partner
      const partnerMap = new Map<string, Message[]>();
      allMsgs.forEach((m: Message) => {
        const partnerId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
        if (!partnerMap.has(partnerId)) partnerMap.set(partnerId, []);
        partnerMap.get(partnerId)!.push(m);
      });

      // Fetch profiles
      const partnerIds = Array.from(partnerMap.keys());
      if (partnerIds.length > 0) {
        const { data: profs } = await supabase.from('profiles').select('id, name, avatar_url').in('id', partnerIds);
        const profMap: Record<string, { name: string; avatar_url: string | null }> = {};
        profs?.forEach((p) => { profMap[p.id] = { name: p.name, avatar_url: p.avatar_url }; });
        setProfiles(profMap);
      }

      const convos: ConversationPartner[] = Array.from(partnerMap.entries()).map(([partnerId, msgs]) => ({
        id: partnerId,
        name: '',
        avatar_url: null,
        lastMessage: msgs[0].content,
        lastTime: msgs[0].created_at,
        unread: msgs.filter((m) => m.receiver_id === user.id && !m.read).length,
      }));

      setConversations(convos);
    };
    fetchConversations();

    // Realtime
    const channel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    if (!user || !selectedId) return;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedId}),and(sender_id.eq.${selectedId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      if (data) setMessages(data as Message[]);

      // Mark as read
      await supabase.from('messages').update({ read: true }).eq('receiver_id', user.id).eq('sender_id', selectedId).eq('read', false);
    };
    fetchMessages();
  }, [user, selectedId]);

  const handleSend = async () => {
    if (!newMsg.trim() || !user || !selectedId) return;
    await supabase.from('messages').insert({ sender_id: user.id, receiver_id: selectedId, content: newMsg.trim() });
    setNewMsg('');
  };

  if (loading || !user) return null;

  const selectedPartner = selectedId ? profiles[selectedId] : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">{tr.title}</h1>

        <div className="flex bg-card rounded-xl border border-border overflow-hidden" style={{ minHeight: '500px' }}>
          {/* Conversation list */}
          <div className={`w-full sm:w-80 shrink-0 border-r border-border ${selectedId ? 'hidden sm:block' : ''}`}>
            {conversations.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground font-medium">{tr.noConversations}</p>
                <p className="text-sm text-muted-foreground mt-2">{tr.noConversationsDesc}</p>
              </div>
            ) : (
              conversations.map((c) => {
                const prof = profiles[c.id];
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors border-b border-border ${selectedId === c.id ? 'bg-muted/50' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                      {prof?.avatar_url ? (
                        <img src={prof.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                          {(prof?.name || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground truncate">{prof?.name || 'User'}</span>
                        <span className="text-xs text-muted-foreground">{new Date(c.lastTime).toLocaleDateString(lang)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                    </div>
                    {c.unread > 0 && (
                      <span className="w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Chat area */}
          <div className={`flex-1 flex flex-col ${!selectedId ? 'hidden sm:flex' : 'flex'}`}>
            {selectedId ? (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <button className="sm:hidden text-muted-foreground mr-1" onClick={() => setSelectedId(null)}>←</button>
                  <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                    {selectedPartner?.avatar_url ? (
                      <img src={selectedPartner.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {(selectedPartner?.name || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-foreground">{selectedPartner?.name || 'User'}</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${m.sender_id === user.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                        {m.content}
                        <span className={`block text-[10px] mt-1 ${m.sender_id === user.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {new Date(m.created_at).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border flex gap-2">
                  <Input
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder={tr.placeholder}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSend} disabled={!newMsg.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                {lang === 'de' ? 'Wählen Sie eine Konversation' : 'Select a conversation'}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
