
import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import MessagesPage from './MessagesPage';
import corporateMaleAvatar from './avatar/corporate-male.png';
import corporateFemaleAvatar from './avatar/corporate-female.png';
import casualMaleAvatar from './avatar/casual-male.png';
import casualFemaleAvatar from './avatar/casual-female.png';
import InstallPrompt from './InstallPrompt';
import UpdatePrompt from './UpdatePrompt';
import { enablePushNotifications } from './pushNotifications';

import {
  RotateCcw,
  Pause,
  Home,
  BookOpen,
  Library,
  NotebookPen,
  UserRound,
  Flame,
  Sparkles,
  ChevronRight,
  Plus,
  Clock3,
  Check,
  ArrowUpRight,
  Bookmark,
  Search,
  Bell,
  MoreHorizontal,
  MessageCircle,
  Heart,
  CalendarDays,
  Target,
  TrendingUp,
  X,
  Send,
  Quote,
  FileText,
  Link2,
  Play,
  CircleCheck,
  Menu,
  Settings,
  LogOut,
  Award,
  BookMarked,
  Pencil,
  Trash2,
  Users,
  UserPlus,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'materials', label: 'Materials', icon: Library },
  { id: 'notes', label: 'Notes', icon: NotebookPen },
  { id: 'connect', label: 'Connect', icon: Users },
  { id: 'messages', label: 'Messages', icon: MessageCircle, badge: true },
  { id: 'me', label: 'Me', icon: UserRound },
];
const emptyMaterialForm = {
  title: '',
  type: 'Article',
  description: '',
  url: ''
};


function App() {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  const [authLoading, setAuthLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const [active, setActive] = useState('home');

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Notes state
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesSaving, setNotesSaving] = useState(false);
  const [search, setSearch] = useState('');

  // Courses state
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesSaving, setCoursesSaving] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Materials state
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [materialsSaving, setMaterialsSaving] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [materialForm, setMaterialForm] = useState(emptyMaterialForm);

  // Reading buddy state
 // Reading buddy state
const [myProfile, setMyProfile] = useState(null);
const [buddySearch, setBuddySearch] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [searchLoading, setSearchLoading] = useState(false);
const [buddyRequests, setBuddyRequests] = useState([]);
const [incomingRequests, setIncomingRequests] = useState([]);
const [outgoingRequests, setOutgoingRequests] = useState([]);

const [connectedBuddy, setConnectedBuddy] = useState(null);
const [connectedBuddies, setConnectedBuddies] = useState([]);

const [buddyLoading, setBuddyLoading] = useState(false);
const [buddyActionLoading, setBuddyActionLoading] = useState('');

const avatarImages = {
  'corporate-male': corporateMaleAvatar,
  'corporate-female': corporateFemaleAvatar,
  'casual-male': casualMaleAvatar,
  'casual-female': casualFemaleAvatar
};
const [showAccountSettings, setShowAccountSettings] = useState(false);
const [activeSettingsSection, setActiveSettingsSection] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [passwordSaving, setPasswordSaving] = useState(false);
const [notificationsEnabled, setNotificationsEnabled] = useState(false);
const [notificationLoading, setNotificationLoading] = useState(false);

function ProfileAvatar({
  avatarId,
  fallback = 'R',
  className = 'partner-avatar',
  alt = 'User avatar'
}) {
  const image = avatarImages[avatarId];

  return (
    <div className={className}>
      {image ? (
        <img
          src={image}
          alt={alt}
          className="profile-avatar-image"
        />
      ) : (
        fallback
      )}
    </div>
  );
}

function ProfileAvatar({ avatarId, fallback = 'R', className = 'partner-avatar', alt = 'User avatar' }) {
  const image = avatarImages[avatarId];

  return (
    <div className={className}>
      {image ? (
        <img
          src={image}
          alt={alt}
          className="profile-avatar-image"
        />
      ) : (
        fallback
      )}
    </div>
  );
}

  // Load current user's profile
  useEffect(() => {
    const loadMyProfile = async () => {
      if (!user?.id) {
        setMyProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      setMyProfile(data);
    };

    loadMyProfile();
  }, [user?.id]);

  // Course form state
  const [courseForm, setCourseForm] = useState({
    title: '',
    author: '',
    chapter: '',
    progress: 0,
    color: 'cover-lilac'
  });

  // Notes and general form state
  const [showNote, setShowNote] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Individual and group messaging state
const [messages, setMessages] = useState([]);
const [messagesLoading, setMessagesLoading] = useState(false);
const [messageSending, setMessageSending] = useState(false);
const [messageText, setMessageText] = useState('');
const [unreadCount, setUnreadCount] = useState(0);

const [conversations, setConversations] = useState([]);
const [selectedConversation, setSelectedConversation] = useState(null);
const [conversationsLoading, setConversationsLoading] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotificationCount = notifications.filter(
    notification => !notification.is_read
  ).length;

  // Toast state
  const [toast, setToast] = useState('');

  const [form, setForm] = useState({
    title: '',
    book: 'Atomic Habits',
    body: '',
    tag: 'Key takeaway'
  });

  // General notification/toast message
  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.readmateToastTimer);

    window.readmateToastTimer = window.setTimeout(() => {
      setToast('');
    }, 3000);
  };

  // Load and subscribe to user notifications
  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setNotificationsLoading(false);
      return;
    }

    let mounted = true;

    const loadNotifications = async () => {
      setNotificationsLoading(true);

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading notifications:', error);
      } else if (mounted) {
        setNotifications(data || []);
      }

      if (mounted) {
        setNotificationsLoading(false);
      }
    };

    loadNotifications();

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id]);


  // Authentication
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted) setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Session check failed:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load notes
  useEffect(() => {
    let mounted = true;

    const loadNotes = async () => {
      if (!user?.id) {
        setNotes([]);
        setNotesLoading(false);
        return;
      }

      setNotesLoading(true);

      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (mounted) {
          setNotes((data || []).map(note => ({
            ...note,
            date: new Date(note.created_at).toLocaleDateString(
              undefined,
              { month: 'short', day: 'numeric', year: 'numeric' }
            ),
            author: 'You',
            color: 'lilac'
          })));
        }
      } catch (error) {
        console.error('Error loading notes:', error);
        if (mounted) notify('Unable to load your reflections.');
      } finally {
        if (mounted) setNotesLoading(false);
      }
    };

    loadNotes();
    return () => { mounted = false; };
  }, [user?.id]);

  // Load courses
  useEffect(() => {
    let mounted = true;

    const loadCourses = async () => {
      if (!user?.id) {
        setCourses([]);
        setCoursesLoading(false);
        return;
      }

      setCoursesLoading(true);

      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted) setCourses(data || []);
      } catch (error) {
        console.error('Error loading courses:', error);
        if (mounted) notify('Unable to load your reading shelf.');
      } finally {
        if (mounted) setCoursesLoading(false);
      }
    };

    loadCourses();
    return () => { mounted = false; };
  }, [user?.id]);

  // Load materials
  useEffect(() => {
    let mounted = true;

    const loadMaterials = async () => {
      if (!user?.id) {
        setMaterials([]);
        setMaterialsLoading(false);
        return;
      }

      setMaterialsLoading(true);

      try {
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted) setMaterials(data || []);
      } catch (error) {
        console.error('Error loading materials:', error);
        if (mounted) notify('Unable to load your saved materials.');
      } finally {
        if (mounted) setMaterialsLoading(false);
      }
    };

    loadMaterials();
    return () => { mounted = false; };
  }, [user?.id]);

  // Load current user's profile, requests and connected buddy
  useEffect(() => {
    let mounted = true;

    const loadBuddyData = async () => {
      if (!user?.id) {
        setMyProfile(null);
        setBuddyRequests([]);
        setIncomingRequests([]);
        setOutgoingRequests([]);
        setConnectedBuddy(null);
        return;
      }

      setBuddyLoading(true);

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (mounted) setMyProfile(profile);

        const { data: requests, error: requestError } = await supabase
          .from('buddy_requests')
          .select('*')
          .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (requestError) throw requestError;

        const allRequests = requests || [];
        const accepted = allRequests.filter(r => r.status === 'accepted');
        const incoming = allRequests.filter(
          r => r.status === 'pending' && r.recipient_id === user.id
        );
        const outgoing = allRequests.filter(
          r => r.status === 'pending' && r.requester_id === user.id
        );

        const otherUserIds = [
          ...new Set([
            ...accepted.map(r =>
              r.requester_id === user.id ? r.recipient_id : r.requester_id
            ),
            ...incoming.map(r => r.requester_id),
            ...outgoing.map(r => r.recipient_id)
          ])
        ];

        let profiles = [];

        if (otherUserIds.length) {
          const { data: profileData, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', otherUserIds);

          if (profilesError) throw profilesError;
          profiles = profileData || [];
        }

        const profileById = Object.fromEntries(
          profiles.map(p => [p.id, p])
        );

        const enrichedIncoming = incoming.map(r => ({
          ...r,
          profile: profileById[r.requester_id]
        }));

        const enrichedOutgoing = outgoing.map(r => ({
          ...r,
          profile: profileById[r.recipient_id]
        }));

        const enrichedAccepted = accepted.map(r => ({
          ...r,
          profile: profileById[
            r.requester_id === user.id ? r.recipient_id : r.requester_id
          ]
        }));

        if (mounted) {
         setConnectedBuddies(enrichedAccepted);
setConnectedBuddy(enrichedAccepted[0] || null);

setIncomingRequests(enrichedIncoming);
setOutgoingRequests(enrichedOutgoing);
        }
      } catch (error) {
        console.error('Error loading reading buddy data:', error);
        if (mounted) notify('Unable to load your reading buddy information.');
      } finally {
        if (mounted) setBuddyLoading(false);
      }
    };

    loadBuddyData();

    return () => { mounted = false; };
  }, [user?.id]);

  // Search registered READMATE users
  useEffect(() => {
    let mounted = true;

    const searchUsers = async () => {
      const query = buddySearch.trim();

      if (!user?.id || query.length < 2) {
        setSearchResults([]);
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);

      try {
        const safeQuery = query.replace(/[%_]/g, '\\$&');

        const { data, error } = await supabase
          .from('profiles')
          .select('id, display_name, username, avatar_id')
          .neq('id', user.id)
          .or(
            `display_name.ilike.%${safeQuery}%,username.ilike.%${safeQuery}%`
          )
          .limit(20);

        if (error) throw error;
        if (mounted) setSearchResults(data || []);
      } catch (error) {
        console.error('User search failed:', error);
        if (mounted) notify('Unable to search users. Please try again.');
      } finally {
        if (mounted) setSearchLoading(false);
      }
    };

    const timeout = window.setTimeout(searchUsers, 350);

    return () => {
      mounted = false;
      window.clearTimeout(timeout);
    };
  }, [buddySearch, user?.id]);

  // Refresh buddy data after a connection action
  const refreshBuddyData = async () => {
    if (!user?.id) return;

    const { data: requests, error } = await supabase
      .from('buddy_requests')
      .select('*')
      .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const allRequests = requests || [];
    const accepted = allRequests.filter(r => r.status === 'accepted');
    const incoming = allRequests.filter(
      r => r.status === 'pending' && r.recipient_id === user.id
    );
    const outgoing = allRequests.filter(
      r => r.status === 'pending' && r.requester_id === user.id
    );

    const ids = [
      ...new Set([
        ...accepted.map(r =>
          r.requester_id === user.id ? r.recipient_id : r.requester_id
        ),
        ...incoming.map(r => r.requester_id),
        ...outgoing.map(r => r.recipient_id)
      ])
    ];

    let profiles = [];

    if (ids.length) {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', ids);

      if (profileError) throw profileError;
      profiles = data || [];
    }

    const byId = Object.fromEntries(profiles.map(p => [p.id, p]));

    setBuddyRequests(allRequests);

        setIncomingRequests(incoming.map(r => ({
      ...r,
      profile: byId[r.requester_id]
    })));

    setOutgoingRequests(outgoing.map(r => ({
      ...r,
      profile: byId[r.recipient_id]
    })));

    setConnectedBuddies(accepted);
    setConnectedBuddy(accepted[0] || null);
  };

  // Send a buddy request
  const sendBuddyRequest = async (profile) => {
    if (!user?.id || !profile?.id) return;

    setBuddyActionLoading(profile.id);

    try {
      if (profile.id === user.id) {
        notify("You can't send a request to yourself.");
        return;
      }

      const existing = buddyRequests.find(r =>
        (
          r.requester_id === user.id && r.recipient_id === profile.id
        ) ||
        (
          r.requester_id === profile.id && r.recipient_id === user.id
        )
      );

      if (existing) {
        if (existing.status === 'accepted') {
          notify('You are already reading buddies.');
        } else if (existing.status === 'pending') {
          notify(
            existing.requester_id === user.id
              ? 'Your request is already pending.'
              : 'This user has already sent you a request. Check incoming requests.'
          );
        } else {
          notify('A previous request exists between you and this user.');
        }
        return;
      }

      const { error } = await supabase
        .from('buddy_requests')
        .insert({
          requester_id: user.id,
          recipient_id: profile.id,
          status: 'pending'
        });

      if (error) throw error;

      await refreshBuddyData();
      notify(`Reading buddy request sent to ${profile.display_name}.`);
    } catch (error) {
      console.error('Error sending buddy request:', error);
      notify(error.message || 'Unable to send buddy request.');
    } finally {
      setBuddyActionLoading('');
    }
  };

  // Accept or decline a request
  const respondToBuddyRequest = async (request, status) => {
    if (!user?.id) return;

    setBuddyActionLoading(request.id);

    try {
      const { error } = await supabase
        .from('buddy_requests')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id)
        .eq('recipient_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;

      await refreshBuddyData();

      notify(
        status === 'accepted'
          ? `You and ${request.profile?.display_name || 'your new buddy'} are now reading buddies!`
          : 'Buddy request declined.'
      );
    } catch (error) {
      console.error('Error responding to buddy request:', error);
      notify(error.message || 'Unable to update this request.');
    } finally {
      setBuddyActionLoading('');
    }
  };

  // Load unread messages and listen for new messages
  useEffect(() => {
    if (!user?.id) {
      setMessages([]);
      setUnreadCount(0);
      setMessagesLoading(false);
      return;
    }

    const buddyId = connectedBuddy?.profile?.id;
    let mounted = true;

    const loadUnreadCount = async () => {
      const { count, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .is('read_at', null);

      if (error) {
        console.error('Unread message count error:', error);
        return;
      }

      if (mounted) {
        setUnreadCount(count || 0);
      }
    };

    const loadConversation = async () => {
      if (!buddyId) {
        if (mounted) {
          setMessages([]);
          setMessagesLoading(false);
        }
        return;
      }

      if (mounted) setMessagesLoading(true);

      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(
            `and(sender_id.eq.${user.id},recipient_id.eq.${buddyId}),and(sender_id.eq.${buddyId},recipient_id.eq.${user.id})`
          )
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (!mounted) return;

        setMessages(data || []);

        const { error: readError } = await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .eq('sender_id', buddyId)
          .eq('recipient_id', user.id)
          .is('read_at', null);

        if (readError) throw readError;

        await loadUnreadCount();
      } catch (error) {
        console.error('Conversation loading failed:', error);

        if (mounted) {
          notify('Unable to load your messages.');
        }
      } finally {
        if (mounted) setMessagesLoading(false);
      }
    };

    loadUnreadCount();

    if (active === 'messages' && buddyId) {
      loadConversation();
    }

    const channel = supabase
      .channel(`readmate-messages-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        payload => {
          const row = payload.new || payload.old;

          if (
            !row ||
            (row.sender_id !== user.id && row.recipient_id !== user.id)
          ) {
            return;
          }

          loadUnreadCount();

          if (
            active === 'messages' &&
            buddyId &&
            (
              row.sender_id === buddyId ||
              row.recipient_id === buddyId
            )
          ) {
            loadConversation();
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id, connectedBuddy?.profile?.id, active]);

  // Send a private message
  const sendMessage = async () => {
    const buddyId = connectedBuddy?.profile?.id;
    const body = messageText.trim();

    if (!user?.id || !buddyId || !body || messageSending) return;

    setMessageSending(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: buddyId,
          body
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(previous => {
        if (previous.some(message => message.id === data.id)) {
          return previous;
        }

        return [...previous, data];
      });

      setMessageText('');
      notify('Message sent.');
    } catch (error) {
      console.error('Message sending failed:', error);
      notify(error.message || 'Unable to send your message.');
    } finally {
      setMessageSending(false);
    }
  };

  const pageTitle = {
    home: ['Welcome back', 'A little progress every day goes a long way.'],
    courses: ['Your reading shelf', 'Every great idea starts with curiosity.'],
    materials: ['Your materials', 'Keep useful knowledge within reach.'],
    notes: ['Your reflections', 'Save the ideas worth remembering.'],
    connect: ['Find your reading buddy', 'Good ideas grow when they are shared.'],
    messages: ['Your conversations', 'Share ideas and grow together.'],
    me: ['Your profile', 'Your learning journey, all in one place.']
  }[active];

  // Logout
  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        notify(error.message);
        return;
      }

      setUser(null);
      setActive('home');
      setSearch('');
      setBuddySearch('');
      setShowNote(false);
      setShowAdd(false);
      setShowCourseForm(false);
      setShowMaterialForm(false);
      setEditingCourse(null);
      setEditingMaterial(null);
      setEditingNote(null);
      setNotes([]);
      setCourses([]);
      setMaterials([]);
      setMyProfile(null);
      setBuddyRequests([]);
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setConnectedBuddy(null);

      setMessages([]);
      setMessageText('');
      setUnreadCount(0);

      setToast('');

      setForm({
        title: '',
        book: 'Atomic Habits',
        body: '',
        tag: 'Key takeaway'
      });

      setCourseForm({
        title: '',
        author: '',
        chapter: '',
        progress: 0,
        color: 'cover-lilac'
      });

      setMaterialForm(emptyMaterialForm);
    } catch (error) {
      console.error('Logout failed:', error);
      notify('Unable to log out. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  // Save or update note
  const submitNote = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      notify('Please log in to save your reflection.');
      return;
    }

    if (!form.title.trim() || !form.body.trim()) {
      notify('Please complete your reflection.');
      return;
    }

    setNotesSaving(true);

    try {
      const noteData = {
        title: form.title.trim(),
        book: form.book,
        body: form.body.trim(),
        tag: form.tag
      };

      let savedNote;

      if (editingNote) {
        const { data, error } = await supabase
          .from('notes')
          .update(noteData)
          .eq('id', editingNote.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        savedNote = data;

        setNotes(previous => previous.map(note =>
          note.id === savedNote.id
            ? {
                ...savedNote,
                date: new Date(savedNote.created_at).toLocaleDateString(
                  undefined,
                  { month: 'short', day: 'numeric', year: 'numeric' }
                ),
                author: 'You',
                color: 'lilac'
              }
            : note
        ));

        notify('Your reflection has been updated.');
      } else {
        const { data, error } = await supabase
          .from('notes')
          .insert({ user_id: user.id, ...noteData })
          .select()
          .single();

        if (error) throw error;
        savedNote = data;

        setNotes(previous => [{
          ...savedNote,
          date: 'Just now',
          author: 'You',
          color: 'lilac'
        }, ...previous]);

        notify('Your reflection has been saved.');
      }

      setForm({
        title: '',
        book: 'Atomic Habits',
        body: '',
        tag: 'Key takeaway'
      });

      setEditingNote(null);
      setShowNote(false);
    } catch (error) {
      console.error('Error saving reflection:', error);
      notify(error.message || 'Unable to save your reflection.');
    } finally {
      setNotesSaving(false);
    }
  };

  const openNewNote = () => {
    setEditingNote(null);
    setForm({
      title: '',
      book: 'Atomic Habits',
      body: '',
      tag: 'Key takeaway'
    });
    setShowNote(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setForm({
      title: note.title || '',
      book: note.book || 'Other material',
      body: note.body || '',
      tag: note.tag || 'Key takeaway'
    });
    setShowNote(true);
  };

  const handleDeleteNote = async (note) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${note.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotes(previous => previous.filter(item => item.id !== note.id));
      notify('Reflection deleted successfully.');
    } catch (error) {
      console.error('Error deleting reflection:', error);
      notify(error.message || 'Unable to delete this reflection.');
    }
  };

  const openNewCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      title: '',
      author: '',
      chapter: '',
      progress: 0,
      color: 'cover-lilac'
    });
    setShowAdd(false);
    setShowCourseForm(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title || '',
      author: course.author || '',
      chapter: course.chapter || '',
      progress: course.progress ?? 0,
      color: course.color || 'cover-lilac'
    });
    setShowCourseForm(true);
  };

  const submitCourse = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      notify('Please log in to manage your reading shelf.');
      return;
    }

    if (!courseForm.title.trim()) {
      notify('Please enter a book or course title.');
      return;
    }

    setCoursesSaving(true);

    try {
      const progress = Math.min(
        100,
        Math.max(0, Number(courseForm.progress) || 0)
      );

      const courseData = {
        title: courseForm.title.trim(),
        author: courseForm.author.trim(),
        chapter: courseForm.chapter.trim() || 'Not started',
        progress,
        color: courseForm.color
      };

      if (editingCourse) {
        const { data, error } = await supabase
          .from('courses')
          .update({
            ...courseData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCourse.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;

        setCourses(previous => previous.map(course =>
          course.id === data.id ? data : course
        ));

        notify('Your reading shelf has been updated.');
      } else {
        const { data, error } = await supabase
          .from('courses')
          .insert({ user_id: user.id, ...courseData })
          .select()
          .single();

        if (error) throw error;

        setCourses(previous => [data, ...previous]);
        notify('Added to your reading shelf.');
      }

      setShowCourseForm(false);
      setEditingCourse(null);

      setCourseForm({
        title: '',
        author: '',
        chapter: '',
        progress: 0,
        color: 'cover-lilac'
      });
    } catch (error) {
      console.error('Error saving course:', error);
      notify(error.message || 'Unable to save this course.');
    } finally {
      setCoursesSaving(false);
    }
  };

  const handleProgressChange = async (course, value) => {
    const progress = Math.min(
      100,
      Math.max(0, Number(value) || 0)
    );

    setCourses(previous => previous.map(item =>
      item.id === course.id ? { ...item, progress } : item
    ));

    try {
      const { error } = await supabase
        .from('courses')
        .update({
          progress,
          updated_at: new Date().toISOString()
        })
        .eq('id', course.id)
        .eq('user_id', user.id);

      if (error) throw error;

      notify(
        progress === 100
          ? 'Congratulations! Course completed.'
          : 'Reading progress saved.'
      );
    } catch (error) {
      console.error('Progress update failed:', error);

      setCourses(previous => previous.map(item =>
        item.id === course.id
          ? { ...item, progress: course.progress }
          : item
      ));

      notify('Unable to update reading progress.');
    }
  };

  const handleDeleteCourse = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${course.title}" from your shelf?`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', course.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCourses(previous => previous.filter(item => item.id !== course.id));
      notify('Removed from your reading shelf.');
    } catch (error) {
      console.error('Error deleting course:', error);
      notify(error.message || 'Unable to delete this course.');
    }
  };

  const openNewMaterial = () => {
    setEditingMaterial(null);
    setMaterialForm(emptyMaterialForm);
    setShowAdd(false);
    setShowMaterialForm(true);
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setMaterialForm({
      title: material.title || '',
      type: material.type || 'Article',
      description: material.description || '',
      url: material.url || ''
    });
    setShowMaterialForm(true);
  };

  const submitMaterial = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      notify('Please log in to save materials.');
      return;
    }

    if (!materialForm.title.trim()) {
      notify('Please enter a resource title.');
      return;
    }

    setMaterialsSaving(true);

    try {
      const materialData = {
        title: materialForm.title.trim(),
        type: materialForm.type,
        description: materialForm.description.trim(),
        url: materialForm.url.trim()
      };

      if (editingMaterial) {
        const { data, error } = await supabase
          .from('materials')
          .update({
            ...materialData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingMaterial.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;

        setMaterials(previous => previous.map(material =>
          material.id === data.id ? data : material
        ));

              } else {
        const { data, error } = await supabase
          .from('materials')
          .insert({
            user_id: user.id,
            reading_item_id: materialData.reading_item_id,
            title: materialData.title,
            description: materialData.description || '',
            resource_type: materialData.resource_type || 'pdf',
            url: materialData.url,
            storage_path: materialData.storage_path || null
          })
          .select()
          .single();

        if (error) throw error;

        setMaterials(previous => [data, ...previous]);
        notify('Resource saved to your materials.');
      }

      setShowMaterialForm(false);
      setEditingMaterial(null);
      setMaterialForm(emptyMaterialForm);
    } catch (error) {
      console.error('Error saving material:', error);
      notify(error.message || 'Unable to save this resource.');
    } finally {
      setMaterialsSaving(false);
    }
  };

  const handleDeleteMaterial = async (material) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${material.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', material.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setMaterials(previous => previous.filter(item => item.id !== material.id));
      notify('Resource deleted successfully.');
    } catch (error) {
      console.error('Error deleting material:', error);
      notify(error.message || 'Unable to delete this resource.');
    }
  };

  const handleOpenMaterial = (material) => {
    if (!material.url?.trim()) {
      notify('This resource does not have a link yet.');
      return;
    }

    try {
      const rawUrl = material.url.trim();

      const normalizedUrl = /^https?:\/\//i.test(rawUrl)
        ? rawUrl
        : `https://${rawUrl}`;

      const parsedUrl = new URL(normalizedUrl);

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid URL protocol');
      }

      window.open(parsedUrl.href, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Invalid resource URL:', error);
      notify('Please check that this resource has a valid web link.');
    }
  };

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center'
      }}>
        Loading READMATE....
      </div>
    );
  }

  if (!user) return <Auth />;

  const displayName =
    myProfile?.display_name ||
    user.user_metadata?.display_name ||
    user.email?.split('@')[0] ||
    'Reader';

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <aside className="sidebar">
        <Brand />

        <div className="workspace-label">YOUR SPACE</div>

        
<nav className="side-nav">
  {navItems.map(item => (
    <NavButton
      key={item.id}
      item={item}
      active={active === item.id}
      unreadCount={
        item.id === 'messages' && unreadCount > 0
          ? unreadCount
          : 0
      }
      onClick={() => setActive(item.id)}
    />
  ))}
</nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="partner-mini"
            onClick={() => setActive('connect')}
            style={{
              width: '100%',
              border: 0,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
           <div className="avatar-stack">
  {/* Your avatar */}
  <span className="avatar avatar-you">
    {myProfile?.avatar_id && avatarImages[myProfile.avatar_id] ? (
      <img
        src={avatarImages[myProfile.avatar_id]}
        alt={displayName}
        className="profile-avatar-image"
      />
    ) : (
      avatarLetter
    )}
  </span>

  {/* Reading buddy avatar */}
  <span className="avatar avatar-them">
    {connectedBuddy?.profile?.avatar_id &&
    avatarImages[connectedBuddy.profile.avatar_id] ? (
      <img
        src={avatarImages[connectedBuddy.profile.avatar_id]}
        alt={connectedBuddy.profile.display_name || 'Reading buddy'}
        className="profile-avatar-image"
      />
    ) : (
      connectedBuddy?.profile?.display_name?.charAt(0)?.toUpperCase() || '+'
    )}
  </span>
</div>

            <div>
              <strong>Your reading circle</strong>
              <small>
                {connectedBuddy ? '2 members · Connected' : 'Find your reading buddy'}
              </small>
            </div>

            <ChevronRight size={16} />
          </button>

          <div className="profile-mini">
  <div className="avatar avatar-you">
    {myProfile?.avatar_id ? (
      <img
        src={{
          'corporate-male': corporateMaleAvatar,
          'corporate-female': corporateFemaleAvatar,
          'casual-male': casualMaleAvatar,
          'casual-female': casualFemaleAvatar
        }[myProfile.avatar_id]}
        alt={`${displayName}'s avatar`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '50%'
        }}
      />
    ) : (
      avatarLetter
    )}
  </div>

  <div>
    <strong>{displayName}</strong>
    <small>Curious mind ✦</small>
  </div>

  <MoreHorizontal size={18} />
</div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Log out of READMATE"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '12px',
              width: '100%',
              padding: '12px 14px',
              marginTop: '10px',
              border: '1px solid rgba(150, 120, 180, 0.16)',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.55)',
              color: '#806b91',
              fontSize: '13px',
              fontWeight: 600,
              cursor: loggingOut ? 'wait' : 'pointer',
              opacity: loggingOut ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={17} />
            <span>{loggingOut ? 'Logging out...' : 'Log out'}</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand">
            <Brand />
          </div>

          <div className="breadcrumb">
            Your space <span>/</span>{' '}
            <b>{navItems.find(n => n.id === active)?.label}</b>
          </div>

          <div className="top-actions">
            <button
              className="icon-button"
              aria-label="Search"
              onClick={() => {
                setActive('materials');
                setTimeout(() => {
                  document.querySelector('.search-box input')?.focus();
                }, 100);
              }}
            >
              <Search size={18} />
            </button>

                       {/* NOTIFICATIONS */}
            <div style={{ position: 'relative' }}>
              <button
                className="icon-button notification"
                aria-label="Notifications"
                onClick={() => setShowNotifications(prev => !prev)}
              >
                <Bell size={18} />
                {unreadNotificationCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    minWidth: 16,
                    height: 16,
                    padding: '0 3px',
                    borderRadius: 20,
                    background: '#c47c83',
                    color: '#fff',
                    fontSize: 9,
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700
                  }}>
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: 'min(360px, calc(100vw - 35px))',
                  maxHeight: '460px',
                  overflowY: 'auto',
                  background: '#fff',
                  border: '1px solid rgba(150,120,180,0.16)',
                  borderRadius: '16px',
                  boxShadow: '0 14px 40px rgba(40,25,55,0.16)',
                  zIndex: 1000,
                  color: '#51415f'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    borderBottom: '1px solid #f0ebf4'
                  }}>
                    <div>
                      <b style={{ fontSize: 15 }}>Notifications</b>
                      <p style={{
                        margin: '4px 0 0',
                        fontSize: 11,
                        color: '#998ba5'
                      }}>
                        {unreadNotificationCount > 0
                          ? `${unreadNotificationCount} unread notification${unreadNotificationCount === 1 ? '' : 's'}`
                          : "You're all caught up"}
                      </p>
                    </div>

                    {unreadNotificationCount > 0 && (
                      <button
                        type="button"
                        onClick={async () => {
                          const unreadIds = notifications
                            .filter(n => !n.is_read)
                            .map(n => n.id);

                          const { error } = await supabase
                            .from('notifications')
                            .update({
                              is_read: true,
                              read_at: new Date().toISOString()
                            })
                            .in('id', unreadIds)
                            .eq('user_id', user.id);

                          if (error) {
                            console.error('Could not mark notifications as read:', error);
                            notify('Could not update notifications.');
                            return;
                          }

                          setNotifications(current =>
                            current.map(n => ({
                              ...n,
                              is_read: true,
                              read_at: n.read_at || new Date().toISOString()
                            }))
                          );

                          notify('All notifications marked as read.');
                        }}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#8065a7',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {notificationsLoading ? (
                    <div style={{
                      padding: 28,
                      textAlign: 'center',
                      fontSize: 13,
                      color: '#998ba5'
                    }}>
                      Loading notifications...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div style={{
                      padding: '35px 20px',
                      textAlign: 'center'
                    }}>
                      <Bell size={25} color="#b6a6c8" />
                      <p style={{
                        fontSize: 13,
                        color: '#998ba5',
                        marginTop: 10
                      }}>
                        No notifications yet. We'll let you know when something happens.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {notifications.map(notification => {
                        const notificationIcon = {
                          buddy_request: <Users size={17} />,
                          buddy_accepted: <UserCheck size={17} />,
                          buddy_declined: <UserRound size={17} />,
                          new_message: <MessageCircle size={17} />,
                          reading_encouragement: <Sparkles size={17} />
                        };

                        const openNotification = async () => {
                          if (!notification.is_read) {
                            const { error } = await supabase
                              .from('notifications')
                              .update({
                                is_read: true,
                                read_at: new Date().toISOString()
                              })
                              .eq('id', notification.id)
                              .eq('user_id', user.id);

                            if (error) {
                              console.error('Could not mark notification as read:', error);
                            } else {
                              setNotifications(current =>
                                current.map(n =>
                                  n.id === notification.id
                                    ? {
                                        ...n,
                                        is_read: true,
                                        read_at: new Date().toISOString()
                                      }
                                    : n
                                )
                              );
                            }
                          }

                          setShowNotifications(false);

                          switch (notification.type) {
                            case 'buddy_request':
                            case 'buddy_accepted':
                            case 'buddy_declined':
                              setActive('connect');
                              break;

                            case 'new_message':
                              setActive('messages');
                              break;

                            case 'reading_encouragement':
                              setActive('home');
                              break;

                            default:
                              break;
                          }
                        };

                        return (
                          <div
                            key={notification.id}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 11,
                              padding: '14px 13px',
                              background: notification.is_read
                                ? '#fff'
                                : '#faf7fd',
                              borderBottom: '1px solid #f3eff6',
                              cursor: 'pointer'
                            }}
                          >
                            <button
                              type="button"
                              onClick={openNotification}
                              style={{
                                display: 'flex',
                                flex: 1,
                                minWidth: 0,
                                gap: 11,
                                alignItems: 'flex-start',
                                border: 'none',
                                background: 'transparent',
                                textAlign: 'left',
                                padding: 0,
                                color: 'inherit',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{
                                width: 35,
                                height: 35,
                                flexShrink: 0,
                                borderRadius: 11,
                                background: '#f0eaf8',
                                color: '#8065a7',
                                display: 'grid',
                                placeItems: 'center'
                              }}>
                                {notificationIcon[notification.type] || (
                                  <Bell size={17} />
                                )}
                              </span>

                              <span style={{ flex: 1, minWidth: 0 }}>
                                <span style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6
                                }}>
                                  <b style={{
                                    fontSize: 12,
                                    color: '#51415f'
                                  }}>
                                    {notification.title}
                                  </b>

                                  {!notification.is_read && (
                                    <i style={{
                                      width: 7,
                                      height: 7,
                                      borderRadius: '50%',
                                      background: '#c47c83',
                                      flexShrink: 0
                                    }} />
                                  )}
                                </span>

                                <span style={{
                                  display: 'block',
                                  fontSize: 11,
                                  color: '#887b94',
                                  lineHeight: 1.6,
                                  marginTop: 4,
                                  overflowWrap: 'anywhere'
                                }}>
                                  {notification.body}
                                </span>

                                <span style={{
                                  display: 'block',
                                  fontSize: 10,
                                  color: '#b0a4bb',
                                  marginTop: 6
                                }}>
                                  {new Date(notification.created_at).toLocaleString(
                                    'en-NG',
                                    {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }
                                  )}
                                </span>
                              </span>
                            </button>

                            <button
                              type="button"
                              title="Delete notification"
                              aria-label="Delete notification"
                              onClick={async () => {
                                const { error } = await supabase
                                  .from('notifications')
                                  .delete()
                                  .eq('id', notification.id)
                                  .eq('user_id', user.id);

                                if (error) {
                                  console.error('Could not delete notification:', error);
                                  notify('Could not delete notification.');
                                  return;
                                }

                                setNotifications(current =>
                                  current.filter(n => n.id !== notification.id)
                                );
                              }}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#b5a8c0',
                                cursor: 'pointer',
                                padding: 3
                              }}
                            >
                              <X size={15} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="top-avatar">{avatarLetter}</div>
          </div>
        </header>

        <div className="content-wrap">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <Sparkles size={13} /> YOUR READING JOURNEY
              </div>

              <h1>
                {pageTitle[0]}
                <span className="heading-dot">.</span>
              </h1>

              <p>{pageTitle[1]}</p>
            </div>

            <div className="date-pill">
              <CalendarDays size={15} />

              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}

              <span style={{
                marginLeft: '12px',
                paddingLeft: '12px',
                borderLeft: '1px solid rgba(255,255,255,0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontVariantNumeric: 'tabular-nums'
              }}>
                <Clock3 size={15} />
                {currentTime.toLocaleTimeString('en-NG', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                  timeZone: 'Africa/Lagos'
                })}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 9 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: .2 }}
            >
              {active === 'home' && (
                <HomePage
                  onNote={openNewNote}
                  setActive={setActive}
                  notify={notify}
                  courses={courses}
                  notes={notes}
                  buddy={connectedBuddy?.profile || null}
                  buddyLoading={buddyLoading}
                  user={user}
                />
              )}

              {active === 'courses' && (
                <CoursesPage
                  courses={courses}
                  coursesLoading={coursesLoading}
                  notify={notify}
                  onAdd={() => setShowAdd(true)}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                  onProgressChange={handleProgressChange}
                />
              )}

              {active === 'materials' && (
                <MaterialsPage
                  materials={materials}
                  materialsLoading={materialsLoading}
                  search={search}
                  setSearch={setSearch}
                  onAdd={openNewMaterial}
                  onEdit={handleEditMaterial}
                  onDelete={handleDeleteMaterial}
                  onOpen={handleOpenMaterial}
                />
              )}

              {active === 'notes' && (
                <NotesPage
                  notes={notes}
                  notesLoading={notesLoading}
                  onNote={openNewNote}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                />
              )}

              {active === 'connect' && (
                <ConnectPage
                  user={user}
                  myProfile={myProfile}
                  search={buddySearch}
                  setSearch={setBuddySearch}
                  results={searchResults}
                  searchLoading={searchLoading}
                  incomingRequests={incomingRequests}
                  outgoingRequests={outgoingRequests}
                  connectedBuddy={connectedBuddy?.profile || null}
                  buddyLoading={buddyLoading}
                  actionLoading={buddyActionLoading}
                  onSendRequest={sendBuddyRequest}
                  onRespond={respondToBuddyRequest}
                  onRefresh={refreshBuddyData}
                />
              )}

              {active === 'messages' && (
                <MessagesPage
                  buddy={connectedBuddy?.profile || null}
                  userId={user.id}
                  messages={messages}
                  loading={messagesLoading}
                  sending={messageSending}
                  messageText={messageText}
                  setMessageText={setMessageText}
                  onSend={sendMessage}
                  onConnect={() => setActive('connect')}
                />
              )}

              {active === 'me' && (
                <ProfilePage

                  notify={notify}
                  courses={courses}
                  notes={notes}
                  user={user}
                  myProfile={myProfile}
                  buddy={connectedBuddy?.profile || null}
                  onConnect={() => setActive('connect')}
                  onLogout={handleLogout}
                  onProfileUpdated={setMyProfile}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="footer-note">
          Made for the joy of learning <span>✦</span> READMATE
        </footer>
      </main>

      <nav className="mobile-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={
              active === item.id
                ? 'mobile-nav-item active'
                : 'mobile-nav-item'
            }
            onClick={() => setActive(item.id)}
          >
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <item.icon size={19} />

              {item.id === 'messages' && unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -7,
                  right: -9,
                  minWidth: 15,
                  height: 15,
                  padding: '0 3px',
                  borderRadius: 20,
                  background: '#c47c83',
                  color: '#fff',
                  fontSize: 9,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {showNote && (
          <Modal
            title={editingNote ? 'Edit your reflection' : 'Capture a little insight'}
            subtitle={
              editingNote
                ? 'Refine your thoughts and keep them meaningful.'
                : 'The best ideas deserve a place to stay.'
            }
            onClose={() => {
              setShowNote(false);
              setEditingNote(null);
            }}
          >
            <form className="note-form" onSubmit={submitNote}>
              <label>
                Give your reflection a title
                <input
                  autoFocus
                  placeholder="e.g. Progress over perfection"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                />
              </label>

              <label>
                What were you reading?
                <select
                  value={form.book}
                  onChange={e => setForm({ ...form, book: e.target.value })}
                >
                  <option>Atomic Habits</option>
                  <option>The Psychology of Money</option>
                  <option>Mindset</option>
                  <option>Other material</option>
                </select>
              </label>

              <label>
                Your key takeaway
                <textarea
                  rows="5"
                  placeholder="Write what stood out to you today..."
                  value={form.body}
                  onChange={e => setForm({ ...form, body: e.target.value })}
                  required
                />
              </label>

              <label>
                Reflection type
                <select
                  value={form.tag}
                  onChange={e => setForm({ ...form, tag: e.target.value })}
                >
                  <option>Key takeaway</option>
                  <option>Important quote</option>
                  <option>Question to explore</option>
                  <option>Personal reflection</option>
                </select>
              </label>

              <button
                className="primary-button full-button"
                type="submit"
                disabled={notesSaving}
              >
                <Send size={16} />
                {notesSaving
                  ? 'Saving...'
                  : editingNote
                    ? 'Update reflection'
                    : 'Save reflection'}
              </button>
            </form>
          </Modal>
        )}

        {showAdd && (
          <Modal
            title="Add to your reading shelf"
            subtitle="Make room for another good idea."
            onClose={() => setShowAdd(false)}
          >
            <div className="add-options">
              <button type="button" onClick={openNewCourse}>
                <BookOpen />
                <span>
                  <b>Add a book or course</b>
                  <small>Track chapters and reading progress</small>
                </span>
                <ChevronRight />
              </button>

              <button type="button" onClick={openNewMaterial}>
                <FileText />
                <span>
                  <b>Add a resource</b>
                  <small>Save a PDF, article or useful link</small>
                </span>
                <ChevronRight />
              </button>
            </div>
          </Modal>
        )}

        {showCourseForm && (
          <Modal
            title={editingCourse ? 'Edit your reading shelf' : 'Add a book or course'}
            subtitle={
              editingCourse
                ? 'Keep your learning progress up to date.'
                : 'Every new title is another opportunity to grow.'
            }
            onClose={() => {
              setShowCourseForm(false);
              setEditingCourse(null);
            }}
          >
            <form className="note-form" onSubmit={submitCourse}>
              <label>
                Book or course title
                <input
                  autoFocus
                  placeholder="e.g. Atomic Habits"
                  value={courseForm.title}
                  onChange={e => setCourseForm({
                    ...courseForm,
                    title: e.target.value
                  })}
                  required
                />
              </label>

              <label>
                Author or instructor
                <input
                  placeholder="e.g. James Clear"
                  value={courseForm.author}
                  onChange={e => setCourseForm({
                    ...courseForm,
                    author: e.target.value
                  })}
                />
              </label>

              <label>
                Current chapter or learning point
                <input
                  placeholder="e.g. Chapter 3 — Make it obvious"
                  value={courseForm.chapter}
                  onChange={e => setCourseForm({
                    ...courseForm,
                    chapter: e.target.value
                  })}
                />
              </label>

              <label>
                Reading progress: {courseForm.progress}%
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={courseForm.progress}
                  onChange={e => setCourseForm({
                    ...courseForm,
                    progress: Number(e.target.value)
                  })}
                />
              </label>

              <label>
                Cover style
                <select
                  value={courseForm.color}
                  onChange={e => setCourseForm({
                    ...courseForm,
                    color: e.target.value
                  })}
                >
                  <option value="cover-lilac">Lilac</option>
                  <option value="cover-peach">Peach</option>
                  <option value="cover-blue">Blue</option>
                </select>
              </label>

              <button
                className="primary-button full-button"
                type="submit"
                disabled={coursesSaving}
              >
                <Check size={16} />
                {coursesSaving
                  ? 'Saving...'
                  : editingCourse
                    ? 'Update reading shelf'
                    : 'Add to reading shelf'}
              </button>
            </form>
          </Modal>
        )}

        {showMaterialForm && (
          <Modal
            title={editingMaterial ? 'Edit resource' : 'Add a resource'}
            subtitle={
              editingMaterial
                ? 'Update the details of your saved material.'
                : 'Keep useful knowledge within reach.'
            }
            onClose={() => {
              setShowMaterialForm(false);
              setEditingMaterial(null);
              setMaterialForm(emptyMaterialForm);
            }}
          >
            <form className="note-form" onSubmit={submitMaterial}>
              <label>
                Resource title
                <input
                  autoFocus
                  placeholder="e.g. The 1% Rule"
                  value={materialForm.title}
                  onChange={e => setMaterialForm({
                    ...materialForm,
                    title: e.target.value
                  })}
                  required
                />
              </label>

              <label>
                Resource type
                <select
                  value={materialForm.type}
                  onChange={e => setMaterialForm({
                    ...materialForm,
                    type: e.target.value
                  })}
                >
                  <option>Article</option>
                  <option>PDF</option>
                  <option>Link</option>
                  <option>Video</option>
                  <option>Book</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Description
                <textarea
                  rows="3"
                  placeholder="What is this resource about?"
                  value={materialForm.description}
                  onChange={e => setMaterialForm({
                    ...materialForm,
                    description: e.target.value
                  })}
                />
              </label>

              <label>
                Resource link
                <input
                  type="url"
                  placeholder="https://example.com/resource"
                  value={materialForm.url}
                  onChange={e => setMaterialForm({
                    ...materialForm,
                    url: e.target.value
                  })}
                />
              </label>

              <button
                className="primary-button full-button"
                type="submit"
                disabled={materialsSaving}
              >
                <Check size={16} />
                {materialsSaving
                  ? 'Saving...'
                  : editingMaterial
                    ? 'Update resource'
                    : 'Save resource'}
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <CircleCheck size={17} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// BRAND
function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark">
        <BookOpen size={19} />
        <span />
      </div>
      <div>
        <strong>readmate<span>.</span></strong>
        <small>READ TOGETHER. GROW TOGETHER.</small>
      </div>
    </div>
  );
}

// NAVIGATION BUTTON
function NavButton({ item, active, onClick, unreadCount = 0 }) {
  return (
    <button
      onClick={onClick}
      className={active ? 'nav-item active' : 'nav-item'}
    >
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <item.icon size={18} />

        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: -7,
            right: -10,
            minWidth: 16,
            height: 16,
            padding: '0 3px',
            borderRadius: 20,
            background: '#c47c83',
            color: '#fff',
            fontSize: 9,
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </span>

      <span>{item.label}</span>
      {active && <i />}
    </button>
  );
}

// DASHBOARD
function HomePage({
  onNote,
  setActive,
  notify,
  courses = [],
  notes = [],
  buddy,
  buddyLoading,
  user
}) {
  const [readingGoal, setReadingGoal] = useState(null);
  const [personalStreak, setPersonalStreak] = useState(0);
  const [buddyStreak, setBuddyStreak] = useState(null);
  const [streakLoading, setStreakLoading] = useState(true);

  const [goalLoading, setGoalLoading] = useState(true);
  const [goalSaving, setGoalSaving] = useState(false);
  const [targetInput, setTargetInput] = useState('30');

  // Today's date
  const today = new Date();

  const todayDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  // Reading countdown timer
  const [timerDuration, setTimerDuration] = useState(25);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStartedAt, setTimerStartedAt] = useState(null);
  const [customTimerMinutes, setCustomTimerMinutes] = useState('');
  const [customTimerHours, setCustomTimerHours] = useState('');

  // Manual reading entry
  const [manualMinutes, setManualMinutes] = useState('');
  const [manualReflection, setManualReflection] = useState('');
  const [savingManualSession, setSavingManualSession] = useState(false);

  // Reading history
  const [readingSessions, setReadingSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);


  // Load or create today's reading goal
  useEffect(() => {
    let cancelled = false;

    const loadReadingGoal = async () => {
      if (!user?.id) {
        setReadingGoal(null);
        setGoalLoading(false);
        return;
      }

      setGoalLoading(true);

      const { error } = await supabase
        .from('reading_goals')
        .upsert(
          {
            user_id: user.id,
            goal_date: todayDate
          },
          {
            onConflict: 'user_id,goal_date',
            ignoreDuplicates: true
          }
        );

      if (error) {
        console.error('Error creating reading goal:', error);
      }

      const { data: goal, error: fetchError } = await supabase
        .from('reading_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('goal_date', todayDate)
        .maybeSingle();

      if (fetchError) {
        console.error('Error loading reading goal:', fetchError);
      }

      if (!cancelled) {
        setReadingGoal(goal || null);

        if (goal) {
          setTargetInput(String(goal.daily_target));
        }

        setGoalLoading(false);
      }
    };

    loadReadingGoal();

    return () => {
      cancelled = true;
    };
  }, [user?.id, todayDate]);

  // Calculate consecutive reading days
  const calculateReadingStreak = (rows, today) => {
    const activeDates = new Set(
      (rows || [])
        .filter(row => Number(row.minutes_read) > 0)
        .map(row => row.goal_date)
    );

    const yesterdayDate = new Date(`${today}T12:00:00`);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    const yesterday = [
      yesterdayDate.getFullYear(),
      String(yesterdayDate.getMonth() + 1).padStart(2, '0'),
      String(yesterdayDate.getDate()).padStart(2, '0')
    ].join('-');

    let cursor = activeDates.has(today) ? today : yesterday;
    let streak = 0;

    while (activeDates.has(cursor)) {
      streak++;

      const previousDate = new Date(`${cursor}T12:00:00`);
      previousDate.setDate(previousDate.getDate() - 1);

      cursor = [
        previousDate.getFullYear(),
        String(previousDate.getMonth() + 1).padStart(2, '0'),
        String(previousDate.getDate()).padStart(2, '0')
      ].join('-');
    }

    return streak;
  };

  // Load personal and buddy streaks (one effect only)
  useEffect(() => {
    let cancelled = false;

    const loadStreaks = async () => {
      if (!user?.id) {
        setPersonalStreak(0);
        setBuddyStreak(null);
        setStreakLoading(false);
        return;
      }

      setStreakLoading(true);

      const { data: personalData, error: personalError } = await supabase
        .from('reading_goals')
        .select('goal_date, minutes_read')
        .eq('user_id', user.id)
        .lte('goal_date', todayDate)
        .gt('minutes_read', 0)
        .order('goal_date', { ascending: false });

      if (personalError) {
        console.error('Error loading personal streak:', personalError);
      }

      const ownStreak = calculateReadingStreak(
        personalData || [],
        todayDate
      );

      let otherStreak = null;

      if (buddy?.id) {
        const { data, error } = await supabase.rpc(
          'get_buddy_reading_streak',
          {
            p_buddy_id: buddy.id,
            p_today: todayDate
          }
        );

        if (error) {
          console.error('Error loading buddy streak:', error);
        } else {
          otherStreak = Number(data) || 0;
        }
      }

      if (!cancelled) {
        setPersonalStreak(ownStreak);
        setBuddyStreak(otherStreak);
        setStreakLoading(false);
      }
    };

    loadStreaks();

    return () => {
      cancelled = true;
    };
  }, [user?.id, buddy?.id, todayDate, readingGoal?.minutes_read]);

  // Countdown timer
  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setRemainingSeconds(current => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  
// Automatically save completed reading sessions
useEffect(() => {
  if (!timerRunning || remainingSeconds !== 0) return;
playTimerSound();

  setTimerRunning(false);

  const saveCompletedSession = async () => {
    if (!user?.id || !readingGoal || goalSaving) return;

    setGoalSaving(true);

    const sessionId = crypto.randomUUID();

    const startedAt = timerStartedAt ||
      new Date(Date.now() - timerDuration * 60 * 1000).toISOString();

    const { data, error } = await supabase.rpc(
      'record_reading_session',
      {
        p_session_id: sessionId,
        p_duration_minutes: timerDuration,
        p_session_type: 'timed',
        p_started_at: startedAt,
        p_reading_item_id: null,
        p_reflection: ''
      }
    );

    if (error) {
      console.error('Error saving completed session:', error);
      notify?.('Could not save your reading session.');
    } else {
      setReadingGoal(data.reading_goal);
      await loadReadingSessions();
      setTimerStartedAt(null);
      notify?.(`${timerDuration} minutes of reading completed!`);
    }

    setGoalSaving(false);
  };

  saveCompletedSession();
}, [timerRunning, remainingSeconds]);

 
const startTimer = () => {
  if (remainingSeconds === 0) {
    setRemainingSeconds(timerDuration * 60);
    setTimerStartedAt(new Date().toISOString());
  } else if (!timerStartedAt) {
    setTimerStartedAt(new Date().toISOString());
  }

  setTimerRunning(true);
};

const pauseTimer = () => {
  setTimerRunning(false);
};

const playTimerSound = () => {
  try {
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();

    const playBeep = (frequency, startTime) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.type = 'square';
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(0.7, startTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        startTime + 0.3
      );

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    };

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const now = audioContext.currentTime;

    playBeep(880, now);
    playBeep(880, now + 0.4);
    playBeep(1100, now + 0.8);

    setTimeout(() => audioContext.close(), 1500);

  } catch (error) {
    console.error('Timer sound error:', error);
  }
};

  
const resetTimer = () => {
  setTimerRunning(false);
  setTimerStartedAt(null);
  setRemainingSeconds(timerDuration * 60);
};


 const changeTimerDuration = (minutes) => {
  if (timerRunning) return;

  setTimerDuration(minutes);
  setRemainingSeconds(minutes * 60);
  setTimerStartedAt(null);
};

   const formattedTime = `${String(
    Math.floor(remainingSeconds / 60)
  ).padStart(2, '0')}:${String(
    remainingSeconds % 60
  ).padStart(2, '0')}`;


  // Load reading history
  const loadReadingSessions = async () => {
    if (!user?.id) return;

    setSessionsLoading(true);

    const { data, error } = await supabase
      .from('reading_sessions')
      .select('id, duration_minutes, session_type, started_at, reflection')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading reading history:', error);
      notify?.('Could not load reading history.');
    } else {
      setReadingSessions(data || []);
    }

    setSessionsLoading(false);
  };

  // Refresh history when the user is available
  useEffect(() => {
    loadReadingSessions();
  }, [user?.id]);

  // Save manually recorded reading
  const saveManualSession = async () => {
    const minutes = Number(manualMinutes);

    if (
      !user?.id ||
      savingManualSession ||
      !Number.isInteger(minutes) ||
      minutes < 1
    ) {
      notify?.('Enter a valid reading duration.');
      return;
    }

    setSavingManualSession(true);

    const { data, error } = await supabase.rpc(
      'record_reading_session',
      {
        p_session_id: crypto.randomUUID(),
        p_duration_minutes: minutes,
        p_session_type: 'manual',
        p_started_at: new Date().toISOString(),
        p_reading_item_id: null,
        p_reflection: manualReflection.trim()
      }
    );

    if (error) {
      console.error('Error saving manual reading:', error);
      notify?.('Could not save your reading entry.');
    } else {
      setReadingGoal(data.reading_goal);
      setManualMinutes('');
      setManualReflection('');
      await loadReadingSessions();
      notify?.(`${minutes} minutes of reading recorded!`);
    }

    setSavingManualSession(false);
  };

  // Update daily target
  const saveReadingTarget = async () => {
    const newTarget = Number(targetInput);

    if (
      !readingGoal ||
      goalSaving ||
      !Number.isInteger(newTarget) ||
      newTarget < 1
    ) {
      notify?.('Enter a valid daily target.');
      return;
    }

    setGoalSaving(true);

    const { data, error } = await supabase
      .from('reading_goals')
      .update({
        daily_target: newTarget,
        updated_at: new Date().toISOString()
      })
      .eq('id', readingGoal.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating reading target:', error);
      notify?.('Could not update your target.');
    } else {
      setReadingGoal(data);
      notify?.('Daily reading target updated!');
    }

    setGoalSaving(false);
  };

  // Reading statistics
  const activeCourse = courses.find(
    course => Number(course.progress) < 100
  );

  const completedCourses = courses.filter(
    course => Number(course.progress) === 100
  ).length;

  const totalProgress = courses.length
    ? Math.round(
        courses.reduce(
          (sum, course) => sum + (Number(course.progress) || 0),
          0
        ) / courses.length
      )
    : 0;

  const courseInitials = activeCourse?.title
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');

  const buddyName = buddy?.display_name || 'Your reading buddy';
  const buddyInitial = buddyName.charAt(0).toUpperCase();

  return (
    <div className="dashboard-grid">
      <section className="main-column">

        {/* HERO */}
        <div className="hero-card">
          <div className="hero-glow" />

          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="live-dot" /> YOUR DAILY PAUSE
            </div>

            <h2>
              Make today<br />
              a <em>chapter</em> worth<br />
              remembering.
            </h2>

            <p>
              Your next small step is waiting. Pick up where you left off.
            </p>

            <button className="hero-button" onClick={onNote}>
              Add today's reflection <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="hero-bottom">
            <span>✦ &nbsp; A gentle reminder</span>
            <b>Consistency over intensity.</b>
          </div>
        </div>

        {/* READING RHYTHM */}
        <div className="section-heading">
          <div>
            <h3>Your reading rhythm</h3>
            <p>Little by little, you're getting there.</p>
          </div>

          <button
            className="text-button"
            onClick={() => setActive('me')}
          >
            View insights <ChevronRight size={15} />
          </button>
        </div>

        <div className="stats-grid">
          <StatCard
            icon={BookOpen}
            label="On your shelf"
            value={courses.length}
            detail="Books and courses"
            tone="purple"
          />

          <StatCard
            icon={Check}
            label="Completed"
            value={completedCourses}
            detail="Titles you've finished"
            tone="orange"
          />

          <StatCard
            icon={TrendingUp}
            label="Average progress"
            value={`${totalProgress}%`}
            detail="Across your reading shelf"
            tone="blue"
          />
        </div>

        {/* CURRENT READING */}
        <div className="section-heading">
          <div>
            <h3>Pick up where you left off</h3>
            <p>Your active reading list.</p>
          </div>

          <button
            className="text-button"
            onClick={() => setActive('courses')}
          >
            All courses <ChevronRight size={15} />
          </button>
        </div>

        {activeCourse ? (
          <div className="continue-card">
            <div className={`book-cover ${activeCourse.color || 'cover-lilac'}`}>
              <span>
                {(activeCourse.author || 'READMATE').toUpperCase()}
              </span>
              <b>{courseInitials || 'BK'}</b>
              <small>{activeCourse.title.toUpperCase()}</small>
            </div>

            <div className="continue-info">
              <div className="mini-label">CURRENTLY READING</div>
              <h4>{activeCourse.title}</h4>

              <p>
                {activeCourse.author || 'Author not specified'} · {activeCourse.chapter || 'Not started'}
              </p>

              <div className="progress-line">
                <span
                  style={{
                    width: `${Number(activeCourse.progress) || 0}%`
                  }}
                />
              </div>

              <div className="progress-meta">
                <span>
                  {Number(activeCourse.progress) || 0}% completed
                </span>
                <span>
                  {Number(activeCourse.progress) === 100
                    ? 'Finished'
                    : 'Keep going'}
                </span>
              </div>

              <button
                className="inline-action"
                onClick={() => setActive('courses')}
              >
                <Play size={13} fill="currentColor" />
                Update reading progress
              </button>
            </div>

            <Bookmark className="bookmark-icon" size={18} />
          </div>
        ) : (
          <div className="empty-hint">
            <BookOpen size={18} />
            <span>
              {courses.length
                ? "You've completed everything on your shelf. Add another title to continue!"
                : 'Your reading journey starts here. Add your first book or course!'}
            </span>
          </div>
        )}

        {/* RECENT REFLECTIONS */}
        <div className="section-heading">
          <div>
            <h3>Recent reflections</h3>
            <p>Your saved thoughts and ideas.</p>
          </div>

          <button
            className="text-button"
            onClick={() => setActive('notes')}
          >
            All reflections <ChevronRight size={15} />
          </button>
        </div>

        {notes.length > 0 ? (
          <div className="continue-card">
            <div className="resource-icon lilac">
              <NotebookPen size={22} />
            </div>

            <div className="continue-info">
              <div className="mini-label">LATEST REFLECTION</div>
              <h4>{notes[0].title}</h4>
              <p>{notes[0].book || 'Other material'}</p>

              <button
                className="inline-action"
                onClick={() => setActive('notes')}
              >
                View reflection <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-hint">
            <NotebookPen size={18} />
            <span>Your saved reflections will appear here.</span>
          </div>
        )}
      </section>

      {/* RIGHT COLUMN */}
      <aside className="right-column">

        {/* DAILY READING GOAL */}
        <div className="streak-card">
          <div className="card-topline">
            <span>YOUR DAILY READING GOAL</span>
            <BookOpen size={18} />
          </div>

          {goalLoading ? (
            <div className="empty-hint">
              <span>Loading your daily goal...</span>
            </div>
          ) : !readingGoal ? (
            <div className="empty-hint">
              <span>
                Unable to load your reading goal. Please refresh the page.
              </span>
            </div>
          ) : (
            <>
              <div className="streak-number">
                <BookOpen
                  size={28}
                  fill="#a58bdc"
                  stroke="#a58bdc"
                />
                <strong>{readingGoal.minutes_read}</strong>
                <span> / {readingGoal.daily_target} mins</span>
              </div>

              <p>
                {readingGoal.minutes_read >= readingGoal.daily_target
                  ? "Amazing! You've reached your daily reading goal."
                  : `${readingGoal.daily_target - readingGoal.minutes_read} more minutes to reach today's goal.`}
              </p>

              <div
                className="progress-line"
                style={{ margin: '18px 0 8px' }}
              >
                <span
                  style={{
                    width: `${Math.min(
                      100,
                      (readingGoal.minutes_read / readingGoal.daily_target) * 100
                    )}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>

              <div className="progress-meta">
                <span>Daily progress</span>
                <b>
                  {Math.min(
                    100,
                    Math.round(
                      (readingGoal.minutes_read / readingGoal.daily_target) * 100
                    )
                  )}%
                </b>
              </div>

              {/* FOCUS TIMER */}
              <div style={{ marginTop: '20px' }}>
                <span className="mini-label">FOCUS READING TIMER</span>

                <div
                  style={{
                    display: 'flex',
                    gap: '7px',
                    marginTop: '12px'
                  }}
                >
                  {[15, 25, 30, 45].map(minutes => (
                    <button
                      key={minutes}
                      onClick={() => changeTimerDuration(minutes)}
                      disabled={timerRunning || goalSaving}
                      style={{
                        flex: 1,
                        padding: '9px 3px',
                        borderRadius: '9px',
                        border: '1px solid rgba(165,139,220,0.3)',
                        background: timerDuration === minutes
                          ? '#a58bdc'
                          : 'transparent',
                        color: timerDuration === minutes ? '#fff' : 'inherit',
                        cursor: 'pointer',
                        fontWeight: 600,
                        opacity: timerRunning ? 0.5 : 1
                      }}
                    >
                      {minutes}m
                    </button>
                  ))}
                </div>
               {/* CUSTOM TIMER DURATION */}
<div style={{
  display: 'flex',
  gap: '8px',
  marginTop: '14px',
  alignItems: 'center'
}}>
  <input
    type="number"
    min="0"
    placeholder="Hours"
    value={customTimerHours}
    onChange={e => setCustomTimerHours(e.target.value)}
    disabled={timerRunning || goalSaving}
    style={{
      width: '75px',
      minWidth: 0,
      padding: '10px',
      borderRadius: '9px',
      border: '1px solid rgba(165,139,220,0.3)',
      background: 'transparent',
      color: 'inherit'
    }}
  />

  <input
    type="number"
    min="0"
    max="59"
    placeholder="Minutes"
    value={customTimerMinutes}
    onChange={e => setCustomTimerMinutes(e.target.value)}
    disabled={timerRunning || goalSaving}
    style={{
      width: '85px',
      minWidth: 0,
      padding: '10px',
      borderRadius: '9px',
      border: '1px solid rgba(165,139,220,0.3)',
      background: 'transparent',
      color: 'inherit'
    }}
  />

  <button
    onClick={() => {
      const hours = Number(customTimerHours || 0);
      const minutes = Number(customTimerMinutes || 0);
      const totalMinutes = hours * 60 + minutes;

      if (
        !Number.isInteger(hours) ||
        !Number.isInteger(minutes) ||
        hours < 0 ||
        minutes < 0 ||
        minutes > 59 ||
        totalMinutes < 1 ||
        totalMinutes > 1440
      ) {
        notify?.('Enter a valid duration between 1 minute and 24 hours.');
        return;
      }

      changeTimerDuration(totalMinutes);
      setCustomTimerHours('');
      setCustomTimerMinutes('');
    }}
    disabled={timerRunning || goalSaving}
    className="primary-button"
    style={{ padding: '10px 14px' }}
  >
    Set
  </button>
</div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '24px 10px 16px'
                  }}
                >
                  <div
                    style={{
                      fontSize: '48px',
                      fontWeight: 750,
                      letterSpacing: '2px',
                      fontVariantNumeric: 'tabular-nums',
                      lineHeight: 1.2
                    }}
                  >
                    {formattedTime}
                  </div>

                  <small style={{ opacity: 0.65 }}>
                    {timerRunning
                      ? 'FOCUS TIME — KEEP GOING'
                      : remainingSeconds === 0
                        ? 'SESSION COMPLETED'
                        : remainingSeconds < timerDuration * 60
                          ? 'SESSION PAUSED'
                          : 'READY WHEN YOU ARE'}
                  </small>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '9px',
                    justifyContent: 'center'
                  }}
                >
                  {!timerRunning ? (
                    <button
                      className="primary-button"
                      onClick={startTimer}
                      disabled={goalSaving}
                      style={{
                        flex: 1,
                        justifyContent: 'center'
                      }}
                    >
                      <Play size={15} fill="currentColor" />
                      {remainingSeconds < timerDuration * 60
                        ? 'Resume'
                        : remainingSeconds === 0
                          ? 'Start again'
                          : 'Start reading'}
                    </button>
                  ) : (
                    <button
                      className="primary-button"
                      onClick={pauseTimer}
                      style={{
                        flex: 1,
                        justifyContent: 'center'
                      }}
                    >
                      <Pause size={15} />
                      Pause
                    </button>
                  )}

                  <button
                    className="text-button"
                    onClick={resetTimer}
                    disabled={goalSaving}
                    style={{
                      padding: '10px 14px',
                      border: '1px solid rgba(165,139,220,0.3)',
                      borderRadius: '10px'
                    }}
                  >
                    <RotateCcw size={15} />
                    Reset
                  </button>
                </div>
              </div>

              {/* DAILY TARGET */}
              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(165,139,220,0.2)'
                }}
              >
                <span className="mini-label">
                  DAILY TARGET (MINUTES)
                </span>

                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '10px'
                  }}
                >
                  <input
                    type="number"
                    min="1"
                    value={targetInput}
                    onChange={e => setTargetInput(e.target.value)}
                    style={{
                      width: '100%',
                      minWidth: 0,
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid rgba(165,139,220,0.3)',
                      background: 'transparent',
                      color: 'inherit'
                    }}
                  />

                  <button
                    className="primary-button"
                    disabled={goalSaving}
                    onClick={saveReadingTarget}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Save goal
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* MANUAL READING ENTRY */}
        <div className="partner-card">
          <div className="section-heading compact">
            <div>
              <h3>Log reading time</h3>
              <p>Record reading you did without the timer.</p>
            </div>
            <BookOpen size={19} />
          </div>

          <div style={{ marginTop: '16px' }}>
            <label className="mini-label">
              READING DURATION (MINUTES)
            </label>

            <input
              type="number"
              min="1"
              step="1"
              value={manualMinutes}
              onChange={e => setManualMinutes(e.target.value)}
              placeholder="e.g. 40"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px',
                marginTop: '8px',
                borderRadius: '10px',
                border: '1px solid rgba(165,139,220,0.3)',
                background: 'transparent',
                color: 'inherit'
              }}
            />

            <label
              className="mini-label"
              style={{ display: 'block', marginTop: '16px' }}
            >
              REFLECTION (OPTIONAL)
            </label>

            <textarea
              value={manualReflection}
              onChange={e => setManualReflection(e.target.value)}
              placeholder="What did you learn?"
              rows={3}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px',
                marginTop: '8px',
                borderRadius: '10px',
                border: '1px solid rgba(165,139,220,0.3)',
                background: 'transparent',
                color: 'inherit',
                resize: 'vertical'
              }}
            />

            <button
              className="primary-button full-button"
              onClick={saveManualSession}
              disabled={savingManualSession}
              style={{ marginTop: '14px' }}
            >
              {savingManualSession ? 'Saving...' : 'Save reading time'}
            </button>
          </div>
        </div>

        {/* READING HISTORY */}
        <div className="partner-card">
          <div className="section-heading compact">
            <div>
              <h3>Reading history</h3>
              <p>Your latest reading activities.</p>
            </div>
            <Clock3 size={19} />
          </div>

          {sessionsLoading ? (
            <div className="empty-hint">
              Loading reading history...
            </div>
          ) : readingSessions.length === 0 ? (
            <div className="empty-hint">
              Your reading activities will appear here.
            </div>
          ) : (
            <div style={{ marginTop: '16px' }}>
              {readingSessions.map(session => (
                <div
                  key={session.id}
                  style={{
                    padding: '14px 0',
                    borderBottom: '1px solid rgba(165,139,220,0.15)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '10px',
                    alignItems: 'center'
                  }}>
                    <strong>
                      {session.duration_minutes} minutes
                    </strong>

                    <span style={{
                      fontSize: '11px',
                      padding: '5px 9px',
                      borderRadius: '20px',
                      background: 'rgba(165,139,220,0.15)'
                    }}>
                      {session.session_type === 'manual'
                        ? 'Manual'
                        : 'Timed'}
                    </span>
                  </div>

                  <small style={{
                    display: 'block',
                    opacity: 0.65,
                    marginTop: '6px'
                  }}>
                    {new Date(session.started_at).toLocaleString()}
                  </small>

                  {session.reflection && (
                    <p style={{
                      fontSize: '13px',
                      marginTop: '8px',
                      lineHeight: 1.5
                    }}>
                      {session.reflection}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* READING BUDDY */}
        <div className="partner-card">
          <div className="section-heading compact">
            <div>
              <h3>Your reading buddy</h3>
              <p>
                {buddy
                  ? 'Growing side by side.'
                  : 'Find someone to grow with.'}
              </p>
            </div>

            {buddy && (
              <span className="online-label">
                <i /> CONNECTED
              </span>
            )}
          </div>

          {buddyLoading ? (
            <div className="empty-hint">
              <Users size={17} />
              <span>Loading your reading buddy...</span>
            </div>
          ) : buddy ? (
            <>
              <div className="partner-profile">
                <div className="partner-avatar">
                  {buddyInitial}
                  <span />
                </div>

                <div>
                  <b>{buddyName}</b>
                  <small>@{buddy.username || 'reader'}</small>
                </div>

                <button
                  className="round-soft"
                  onClick={() => setActive('messages')}
                  aria-label="Message reading buddy"
                >
                  <MessageCircle size={16} />
                </button>
              </div>

              <div className="partner-progress">
                <div className="progress-person">
                  <span>Your buddy</span>
                  <b>Connected</b>
                </div>

                <div className="progress-person">
                  <span>Your reading</span>
                  <b>{courses.length} titles</b>
                </div>

                <div className="progress-person">
                  <span>Buddy's daily streak</span>
                  <b style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <Flame size={15} color="#e99b55" />
                    {streakLoading
                      ? '...'
                      : buddyStreak === null
                        ? 'Unavailable'
                        : `${buddyStreak} ${buddyStreak === 1 ? 'day' : 'days'}`}
                  </b>
                </div>
              </div>

              <div className="shared-note">
                <Heart size={14} fill="#a58bdc" />
                <span>Keep learning, one page at a time.</span>
              </div>
            </>
          ) : (
            <>
              <div className="partner-profile">
                <div className="partner-avatar">?</div>
                <div>
                  <b>No buddy yet</b>
                  <small>Your next reading connection awaits.</small>
                </div>
              </div>

              <button
                className="primary-button full-button"
                onClick={() => setActive('connect')}
                style={{ marginTop: '14px' }}
              >
                <UserPlus size={16} />
                Find a reading buddy
              </button>
            </>
          )}
        </div>

        {/* REFLECTION PROMPT */}
        <div className="prompt-card">
          <div className="prompt-icon">
            <Quote size={18} />
          </div>

          <span className="mini-label">
            TODAY'S REFLECTION PROMPT
          </span>

          <h3>
            What's one idea you read today that you'd like to put into practice?
          </h3>

          <button className="text-button" onClick={onNote}>
            Reflect on this <ArrowUpRight size={14} />
          </button>
        </div>

        {/* DAILY NUDGE */}
        <div className="nudge-card">
          <Sparkles size={17} />

          <p>
            <b>A little nudge</b><br />
            You have {courses.length} titles in your reading journey. Make time for a little learning today.
          </p>

          <button onClick={() => setActive('courses')}>
            <ArrowUpRight size={17} />
          </button>
        </div>

      </aside>
    </div>
  );
}

// STAT CARD COMPONENT
function StatCard({ icon: Icon, label, value, detail, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={17} />
      </div>

      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}


 // CONNECT
function ConnectPage({
  user,
  myProfile,
  search,
  setSearch,
  results,
  searchLoading,
  incomingRequests,
  outgoingRequests,
  connectedBuddy,
  buddyLoading,
  actionLoading,
  onSendRequest,
  onRespond
}) {
  const avatarImages = {
    'corporate-male': corporateMaleAvatar,
    'corporate-female': corporateFemaleAvatar,
    'casual-male': casualMaleAvatar,
    'casual-female': casualFemaleAvatar
  };

  // Handle either a direct profile or a request/buddy containing a profile.
  const connectedProfile = connectedBuddy?.profile || connectedBuddy;

  const renderAvatar = (profile, size = 46) => {
    const avatar = avatarImages[profile?.avatar_id];
    const initial = (profile?.display_name || 'R')
      .charAt(0)
      .toUpperCase();

    return (
      <div
        className="partner-avatar"
        style={{
          width: size,
          height: size,
          minWidth: size,
          overflow: 'hidden'
        }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={`${profile?.display_name || 'Reader'} avatar`}
            className="profile-avatar-image"
          />
        ) : (
          initial
        )}
      </div>
    );
  };

  const getRequestState = (profileId) => {
    if (connectedProfile?.id === profileId) return 'connected';

    if (outgoingRequests.some(r => r.recipient_id === profileId)) {
      return 'pending';
    }

    if (incomingRequests.some(r => r.requester_id === profileId)) {
      return 'incoming';
    }

    return 'none';
  };

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h2>Learning is better together.</h2>
          <p>Find real READMATE users and build your reading circle.</p>
        </div>
      </div>

      <div className="soft-banner">
        <div className="achievement-icon">
          <Users size={22} />
        </div>

        <div>
          <b>Your READMATE profile</b>
          <p>
            {myProfile?.display_name ||
              user?.user_metadata?.display_name ||
              'Reader'}
            {myProfile?.username ? ` · @${myProfile.username}` : ''}
          </p>
        </div>
      </div>

      {/* CONNECTED BUDDY */}
      {connectedProfile && (
        <section className="connect-section">
          <div className="section-heading">
            <div>
              <h3>Your reading buddy</h3>
              <p>You've connected with this reader.</p>
            </div>

            <span className="earned-pill">CONNECTED</span>
          </div>

          <div className="resource-list">
            <div className="resource-row">
              {renderAvatar(connectedProfile, 50)}

              <div className="resource-info">
                <b>
                  {connectedProfile.display_name || 'READMATE Reader'}
                </b>
                <span>
                  @{connectedProfile.username || 'reader'}
                </span>
              </div>

              <span className="earned-pill">CONNECTED</span>
            </div>
          </div>
        </section>
      )}

      {/* FIND READERS */}
      <section className="connect-section">
        <div className="section-heading">
          <div>
            <h3>Find readers</h3>
            <p>Search by display name or username.</p>
          </div>
        </div>

        <div className="search-box">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search READMATE users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="icon-button"
              aria-label="Clear search"
              onClick={() => setSearch('')}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {search.trim().length < 2 ? (
          <div className="empty-hint">
            <Search size={18} />
            <span>
              Enter at least two characters to find other READMATE users.
            </span>
          </div>
        ) : searchLoading ? (
          <div className="empty-hint">
            <Users size={18} />
            <span>Searching READMATE users...</span>
          </div>
        ) : results.length === 0 ? (
          <div className="empty-hint">
            <UserRound size={18} />
            <span>
              No users found. Try another name or username.
            </span>
          </div>
        ) : (
          <div className="resource-list">
            {results.map(profile => {
              const state = getRequestState(profile.id);
              const busy = actionLoading === profile.id;

              return (
                <div className="resource-row" key={profile.id}>
                  {renderAvatar(profile)}

                  <div className="resource-info">
                    <b>
                      {profile.display_name || 'READMATE Reader'}
                    </b>
                    <span>@{profile.username || 'reader'}</span>
                  </div>

                  {state === 'connected' ? (
                    <span className="earned-pill">CONNECTED</span>
                  ) : state === 'pending' ? (
                    <span className="resource-type">Request sent</span>
                  ) : state === 'incoming' ? (
                    <span className="resource-type">Request received</span>
                  ) : (
                    <button
                      type="button"
                      className="primary-button"
                      disabled={busy}
                      onClick={() => onSendRequest(profile)}
                    >
                      <UserPlus size={15} />
                      {busy ? 'Sending...' : 'Connect'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* INCOMING REQUESTS */}
      <section className="connect-section">
        <div className="section-heading">
          <div>
            <h3>Incoming requests</h3>
            <p>Readers who want to connect with you.</p>
          </div>

          <span className="resource-type">
            {incomingRequests.length} pending
          </span>
        </div>

        {buddyLoading ? (
          <div className="empty-hint">
            <Clock3 size={18} />
            <span>Loading requests...</span>
          </div>
        ) : incomingRequests.length === 0 ? (
          <div className="empty-hint">
            <UserPlus size={18} />
            <span>No incoming requests right now.</span>
          </div>
        ) : (
          <div className="resource-list">
            {incomingRequests.map(request => {
              const profile = request.profile || {};
              const busy = actionLoading === request.id;

              return (
                <div className="resource-row" key={request.id}>
                  {renderAvatar(profile)}

                  <div className="resource-info">
                    <b>
                      {profile.display_name || 'READMATE Reader'}
                    </b>
                    <span>
                      @{profile.username || 'reader'} wants to connect
                    </span>
                  </div>

                  <button
                    type="button"
                    className="primary-button"
                    disabled={busy}
                    onClick={() => onRespond(request, 'accepted')}
                  >
                    <Check size={15} />
                    {busy ? 'Saving...' : 'Accept'}
                  </button>

                  <button
                    type="button"
                    className="dots-button"
                    disabled={busy}
                    title="Decline request"
                    onClick={() => onRespond(request, 'declined')}
                    style={{ color: '#c47c83' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SENT REQUESTS */}
      <section className="connect-section">
        <div className="section-heading">
          <div>
            <h3>Sent requests</h3>
            <p>Requests waiting for a response.</p>
          </div>
        </div>

        {outgoingRequests.length === 0 ? (
          <div className="empty-hint">
            <Send size={18} />
            <span>You haven't sent any pending requests.</span>
          </div>
        ) : (
          <div className="resource-list">
            {outgoingRequests.map(request => {
              const profile = request.profile || {};

              return (
                <div className="resource-row" key={request.id}>
                  {renderAvatar(profile)}

                  <div className="resource-info">
                    <b>
                      {profile.display_name || 'READMATE Reader'}
                    </b>
                    <span>@{profile.username || 'reader'}</span>
                  </div>

                  <span className="resource-type">
                    Awaiting response
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}


// COURSES
function CoursesPage({
  courses,
  coursesLoading,
  notify,
  onAdd,
  onEdit,
  onDelete,
  onProgressChange
}) {
  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h2>Keep your curiosity close.</h2>
          <p>
            {courses.length} {courses.length === 1 ? 'title' : 'titles'} in your reading journey.
          </p>
        </div>

        <button className="primary-button" onClick={onAdd}>
          <Plus size={16} /> Add to shelf
        </button>
      </div>

      {coursesLoading ? (
        <div className="empty-hint">
          <BookOpen size={18} />
          <span>Loading your reading shelf...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="empty-hint">
          <BookOpen size={18} />
          <span>
            Your reading shelf is waiting. Add your first book or course!
          </span>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map(c => {
            const progress = Number(c.progress) || 0;

            const initials = (c.title || '')
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map(word => word[0].toUpperCase())
              .join('');

            return (
              <div className="course-card" key={c.id}>
                <div className={`course-cover ${c.color || 'cover-lilac'}`}>
                  <span>{(c.author || 'READMATE').toUpperCase()}</span>
                  <strong>{initials || 'BK'}</strong>
                  <small>{(c.title || '').toUpperCase()}</small>

                  <button
                    type="button"
                    title="Edit book"
                    onClick={() => onEdit(c)}
                  >
                    <Pencil size={16} />
                  </button>
                </div>

                <div className="course-details">
                  <div className="course-status">
                    {progress === 100
                      ? 'Completed'
                      : progress > 0
                        ? 'In progress'
                        : 'Not started'}
                  </div>

                  <h3>{c.title}</h3>
                  <p>{c.author || 'Author not specified'}</p>

                  <div className="progress-line">
                    <span style={{ width: `${progress}%` }} />
                  </div>

                  <div className="progress-meta">
                    <span>{progress}% complete</span>
                    <span>
                      {progress === 100 ? 'Finished' : 'Keep going'}
                    </span>
                  </div>

                  <div className="chapter-line">
                    <BookMarked size={14} />
                    {c.chapter || 'Not started'}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <label style={{
                      fontSize: '12px',
                      color: '#806b91',
                      fontWeight: 600
                    }}>
                      Progress
                    </label>

                    <select
                      value={progress}
                      onChange={e => onProgressChange(c, e.target.value)}
                      aria-label={`Update progress for ${c.title}`}
                      style={{
                        flex: 1,
                        minWidth: '90px',
                        padding: '8px',
                        borderRadius: '9px',
                        border: '1px solid rgba(150, 120, 180, 0.2)',
                        background: '#fff',
                        color: '#51415f',
                        fontSize: '12px'
                      }}
                    >
                      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(value => (
                        <option key={value} value={value}>
                          {value}%
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="dots-button"
                      title="Edit course"
                      onClick={() => onEdit(c)}
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      className="dots-button"
                      title="Delete course"
                      onClick={() => onDelete(c)}
                      style={{ color: '#c47c83' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="soft-banner">
        <Sparkles />

        <div>
          <b>Learning is a lifelong collection of little moments.</b>
          <p>
            Add a book, course or learning goal whenever inspiration strikes.
          </p>
        </div>
      </div>
    </div>
  );
}


// MATERIALS
function MaterialsPage({
  materials = [],
  materialsLoading,
  search,
  setSearch,
  onAdd,
  onEdit,
  onDelete,
  onOpen
}) {
  const filteredMaterials = materials.filter(material => {
    const query = search.toLowerCase();

    return (
      material.title?.toLowerCase().includes(query) ||
      material.type?.toLowerCase().includes(query) ||
      material.description?.toLowerCase().includes(query)
    );
  });

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'PDF':
        return FileText;
      case 'Link':
        return Link2;
      case 'Video':
        return Play;
      case 'Book':
        return BookOpen;
      default:
        return Library;
    }
  };

  const getMaterialColor = (type) => {
    switch (type) {
      case 'PDF':
        return 'peach';
      case 'Link':
        return 'blue';
      case 'Video':
        return 'lilac';
      case 'Book':
        return 'blue';
      default:
        return 'lilac';
    }
  };

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h2>A shelf beyond the books.</h2>
          <p>
            {materials.length} saved {materials.length === 1 ? 'resource' : 'resources'} to deepen your learning.
          </p>
        </div>

        <button className="primary-button" onClick={onAdd}>
          <Plus size={16} /> Add resource
        </button>
      </div>

      <div className="search-box">
        <Search size={17} />

        <input
          placeholder="Search your saved materials..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {search && (
          <button
            type="button"
            className="icon-button"
            aria-label="Clear search"
            onClick={() => setSearch('')}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {materialsLoading ? (
        <div className="empty-hint">
          <Library size={18} />
          <span>Loading your saved materials...</span>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="empty-hint">
          <Bookmark size={18} />
          <span>
            {search
              ? 'No resources match your search. Try another keyword.'
              : 'Your library is waiting. Save your first article, PDF, video or useful link!'}
          </span>
        </div>
      ) : (
        <div className="resource-list">
          {filteredMaterials.map(material => {
            const Icon = getMaterialIcon(material.type);
            const color = getMaterialColor(material.type);

            return (
              <div className="resource-row" key={material.id}>
                <div className={`resource-icon ${color}`}>
                  <Icon size={21} />
                </div>

                <div className="resource-info">
                  <b>{material.title}</b>
                  <span>
                    {material.description ||
                      `${material.type || 'Resource'} · Saved to your library`}
                  </span>
                </div>

                <span className="resource-type">
                  {material.type || 'Other'}
                </span>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <button
                    type="button"
                    className="icon-button"
                    title="Open resource"
                    aria-label={`Open ${material.title}`}
                    onClick={() => onOpen(material)}
                  >
                    <ArrowUpRight size={17} />
                  </button>

                  <button
                    type="button"
                    className="dots-button"
                    title="Edit resource"
                    aria-label={`Edit ${material.title}`}
                    onClick={() => onEdit(material)}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    className="dots-button"
                    title="Delete resource"
                    aria-label={`Delete ${material.title}`}
                    onClick={() => onDelete(material)}
                    style={{ color: '#c47c83' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="soft-banner">
        <Bookmark />

        <div>
          <b>Your personal knowledge library.</b>
          <p>
            Save useful articles, links, videos and documents so you can find them whenever you need them.
          </p>
        </div>
      </div>
    </div>
  );
}


// NOTES
function NotesPage({
  notes,
  notesLoading,
  onNote,
  onEdit,
  onDelete
}) {
  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h2>Little ideas. Lasting impact.</h2>
          <p>Your personal reflections and saved ideas.</p>
        </div>

        <button className="primary-button" onClick={onNote}>
          <Plus size={16} /> New reflection
        </button>
      </div>

      <div className="notes-filter">
        <button className="filter-active">
          All reflections <span>{notes.length}</span>
        </button>

        <button>My notes</button>
        <button>Partner's notes</button>
      </div>

      <div className="notes-grid">
        {notesLoading ? (
          <p>Loading your reflections...</p>
        ) : notes.length === 0 ? (
          <div className="empty-hint">
            <NotebookPen size={18} />
            <span>
              Your reflections will appear here. Create your first one!
            </span>
          </div>
        ) : (
          notes.map(n => (
            <article
              className={`note-card note-${n.color}`}
              key={n.id}
            >
              <div className="note-top">
                <span className="note-tag">{n.tag}</span>

                <div style={{ display: 'flex', gap: '7px' }}>
                  <button
                    type="button"
                    className="dots-button"
                    title="Edit reflection"
                    aria-label="Edit reflection"
                    onClick={() => onEdit(n)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    className="dots-button"
                    title="Delete reflection"
                    aria-label="Delete reflection"
                    onClick={() => onDelete(n)}
                    style={{ color: '#c47c83' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 style={{
                fontSize: '22px',
                fontWeight: 800,
                lineHeight: 1.3,
                letterSpacing: '-0.6px',
                color: '#30263b',
                margin: '18px 0 12px',
                overflowWrap: 'anywhere'
              }}>
                {n.title}
              </h3>

              <p className="note-book" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#927fa4',
                marginBottom: '16px'
              }}>
                <BookOpen size={14} />
                {n.book || 'Other material'}
              </p>

              <p className="note-body" style={{
                fontSize: '14px',
                lineHeight: 1.8,
                color: '#71677c',
                whiteSpace: 'pre-wrap'
              }}>
                {n.body}
              </p>

              <div className="note-footer">
                <div className="note-author">
                  <span className="tiny-avatar you">P</span>

                  <span>
                    You
                    <small>{n.date}</small>
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}


// PROFILE
function ProfilePage({
  notify,
  courses = [],
  notes = [],
  user,
  myProfile,
  buddy,
  onConnect,
  onLogout,
  onProfileUpdated
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nameInput, setNameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [interestsInput, setInterestsInput] = useState('');

  const [selectedAvatarId, setSelectedAvatarId] = useState(
    myProfile?.avatar_id || ''
  );
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState('');
const [showAvatarPicker, setShowAvatarPicker] = useState(false);

const [accountName, setAccountName] = useState('');
const [accountUsername, setAccountUsername] = useState('');
const [accountBio, setAccountBio] = useState('');

const [settingsSaving, setSettingsSaving] = useState(false);
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [passwordSaving, setPasswordSaving] = useState(false);

const [notificationsEnabled, setNotificationsEnabled] = useState(false);
const [notificationLoading, setNotificationLoading] = useState(false);

  const avatarOptions = [
    {
      id: 'corporate-male',
      name: 'Corporate Male',
      category: 'Corporate',
      image: corporateMaleAvatar
    },
    {
      id: 'corporate-female',
      name: 'Corporate Female',
      category: 'Corporate',
      image: corporateFemaleAvatar
    },
    {
      id: 'casual-male',
      name: 'Casual Male',
      category: 'Casual',
      image: casualMaleAvatar
    },
    {
      id: 'casual-female',
      name: 'Casual Female',
      category: 'Casual',
      image: casualFemaleAvatar
    }
  ];

  useEffect(() => {
  setNameInput(
    myProfile?.display_name ||
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    ''
  );

  setBioInput(myProfile?.bio || '');

  setInterestsInput(
    Array.isArray(myProfile?.reading_interests)
      ? myProfile.reading_interests.join(', ')
      : ''
  );

  setSelectedAvatarId(myProfile?.avatar_id || '');

  setAccountName(myProfile?.display_name || '');
  setAccountUsername(myProfile?.username || '');
  setAccountBio(myProfile?.bio || '');
}, [myProfile, user]);

  const completedCourses = courses.filter(
    course => Number(course.progress) === 100
  ).length;

  const averageProgress = courses.length
    ? Math.round(
        courses.reduce(
          (sum, course) => sum + (Number(course.progress) || 0),
          0
        ) / courses.length
      )
    : 0;

  const displayName =
    myProfile?.display_name ||
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    'Reader';

  const interests = Array.isArray(myProfile?.reading_interests)
    ? myProfile.reading_interests
    : [];

  const selectedAvatar = avatarOptions.find(
    avatar => avatar.id === (myProfile?.avatar_id || selectedAvatarId)
  );

  const saveProfile = async (e) => {
    e.preventDefault();

    if (!user?.id || !nameInput.trim()) {
      notify('Please enter your display name.');
      return;
    }

    setSaving(true);

    try {
      const readingInterests = interestsInput
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

      const { data, error } = await supabase
        .from('profiles')
        .update({
          display_name: nameInput.trim(),
          bio: bioInput.trim(),
          reading_interests: readingInterests,
          avatar_id: selectedAvatarId || null
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update the parent profile state immediately when the callback exists.
      if (onProfileUpdated && data) {
        onProfileUpdated(data);
      }

      setEditing(false);
      notify('Your profile and avatar have been updated successfully.');
    } catch (error) {
      console.error('Profile update failed:', error);
      notify(error.message || 'Unable to update your profile.');
    } finally {
      setSaving(false);
    }
  };
 const saveAccountSettings = async (e) => {
  e.preventDefault();

  if (!accountName.trim()) {
    notify('Please enter your display name.');
    return;
  }

  setSettingsSaving(true);

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        display_name: accountName.trim(),
        username: accountUsername.trim() || null,
        bio: accountBio.trim(),
        reading_interests: interestsInput
          .split(',')
          .map(item => item.trim())
          .filter(Boolean),
        avatar_id: selectedAvatarId || null
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    onProfileUpdated?.(data);

    setNameInput(accountName.trim());
    setBioInput(accountBio.trim());

    notify('Account settings updated successfully.');
  } catch (error) {
    console.error(error);
    notify(error.message || 'Unable to update account settings.');
  } finally {
    setSettingsSaving(false);
  }
};

const changeAccountPassword = async (e) => {
  e.preventDefault();

  if (newPassword.length < 6) {
    notify('Password must be at least 6 characters.');
    return;
  }

  if (newPassword !== confirmPassword) {
    notify('Passwords do not match.');
    return;
  }

  setPasswordSaving(true);

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    setNewPassword('');
    setConfirmPassword('');
    notify('Password updated successfully.');
  } catch (error) {
    notify(error.message || 'Unable to update password.');
  } finally {
    setPasswordSaving(false);
  }
};

   

if (showAccountSettings) {
  const toggleSettingsSection = (section) => {
    setActiveSettingsSection(prev => prev === section ? '' : section);
  };

  return (
    <div className="account-settings-page">
      <div className="settings-heading">
        <button
          type="button"
          className="settings-back"
          onClick={() => setShowAccountSettings(false)}
        >
          ← Back to profile
        </button>

        <span className="settings-eyebrow">YOUR PERSONAL SPACE</span>
        <h2>Account Settings<span>.</span></h2>
        <p>Manage your personal information and keep your account up to date.</p>
      </div>

      <div className="settings-content">

        {/* PERSONAL INFORMATION */}
        <section className="settings-section">
          <button
            type="button"
            className="settings-accordion-button"
            onClick={() => toggleSettingsSection('personal')}
            aria-expanded={activeSettingsSection === 'personal'}
          >
            <div className="settings-section-heading">
              <div className="settings-section-icon">✦</div>
              <div>
                <h3>Personal information</h3>
                <p>Update how other readers see you on READMATE.</p>
              </div>
            </div>
            <ChevronRight
              className={activeSettingsSection === 'personal' ? 'settings-chevron-open' : ''}
              size={19}
            />
          </button>

          {activeSettingsSection === 'personal' && (
            <form className="settings-form" onSubmit={saveAccountSettings}>
              <div className="settings-avatar-section">
                <button
                  type="button"
                  className="change-avatar-button"
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                >
                  <Settings size={15} />
                  {showAvatarPicker ? 'Close avatar selection' : 'Change avatar'}
                  <ChevronRight
                    size={15}
                    className={showAvatarPicker ? 'avatar-chevron-open' : ''}
                  />
                </button>

                {showAvatarPicker && (
                  <div className="settings-avatar-grid">
                    {avatarOptions.map(avatar => (
                      <button
                        key={avatar.id}
                        type="button"
                        className={`settings-avatar-option ${
                          selectedAvatarId === avatar.id ? 'selected' : ''
                        }`}
                        disabled={settingsSaving}
                        onClick={() => setSelectedAvatarId(avatar.id)}
                      >
                        <img src={avatar.image} alt={avatar.name} />
                        <strong>{avatar.name}</strong>
                        <small>{avatar.category}</small>

                        {selectedAvatarId === avatar.id && (
                          <span className="settings-avatar-selected">
                            ✓ Selected
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <label className="settings-field">
                <span>Display name</span>
                <input
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </label>

              <label className="settings-field">
                <span>Username</span>
                <div className="username-input">
                  <span>@</span>
                  <input
                    value={accountUsername}
                    onChange={e => setAccountUsername(e.target.value)}
                    placeholder="yourusername"
                  />
                </div>
              </label>

              <label className="settings-field">
                <span>About me</span>
                <textarea
                  value={accountBio}
                  onChange={e => setAccountBio(e.target.value)}
                  placeholder="Tell other readers a little about yourself..."
                  rows={4}
                />
                <small>Let your reading buddies know more about you.</small>
              </label>

              <label className="settings-field">
                <span>Reading interests</span>
                <input
                  value={interestsInput}
                  onChange={e => setInterestsInput(e.target.value)}
                  placeholder="Technology, Business, Fiction..."
                  maxLength={300}
                />
                <small>Separate each interest with a comma.</small>
              </label>

              <button
                type="submit"
                className="settings-save-button"
                disabled={settingsSaving}
              >
                {settingsSaving ? 'Saving changes...' : 'Save changes →'}
              </button>
            </form>
          )}
        </section>

        {/* SECURITY & PASSWORD */}
        <section className="settings-section">
          <button
            type="button"
            className="settings-accordion-button"
            onClick={() => toggleSettingsSection('security')}
            aria-expanded={activeSettingsSection === 'security'}
          >
            <div className="settings-section-heading">
              <div className="settings-section-icon blue">⌑</div>
              <div>
                <h3>Security & password</h3>
                <p>Keep your account protected with a strong password.</p>
              </div>
            </div>
            <ChevronRight
              className={activeSettingsSection === 'security' ? 'settings-chevron-open' : ''}
              size={19}
            />
          </button>

          {activeSettingsSection === 'security' && (
            <form className="settings-form" onSubmit={changeAccountPassword}>
              <label className="settings-field">
                <span>New password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength={6}
                  required
                />
              </label>

              <label className="settings-field">
                <span>Confirm new password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  minLength={6}
                  required
                />
              </label>

              <p className="settings-hint">
                Use at least 6 characters for your new password.
              </p>

              <button
                type="submit"
                className="settings-save-button"
                disabled={passwordSaving}
              >
                {passwordSaving ? 'Updating password...' : 'Update password →'}
              </button>
            </form>
          )}
        </section>

        {/* EMAIL ADDRESS */}
        <section className="settings-section">
          <button
            type="button"
            className="settings-accordion-button"
            onClick={() => toggleSettingsSection('email')}
            aria-expanded={activeSettingsSection === 'email'}
          >
            <div className="settings-section-heading">
              <div className="settings-section-icon peach">✉</div>
              <div>
                <h3>Email address</h3>
                <p>Your registered account email.</p>
              </div>
            </div>
            <ChevronRight
              className={activeSettingsSection === 'email' ? 'settings-chevron-open' : ''}
              size={19}
            />
          </button>

          {activeSettingsSection === 'email' && (
            <>
              <div className="settings-email-card">
                <div>
                  <span>Email address</span>
                  <strong>{user?.email || 'No email available'}</strong>
                </div>
                <span className="settings-verified">Account email</span>
              </div>

              <p className="settings-hint">
                Your email is managed through your READMATE authentication account.
              </p>
            </>
          )}
        </section>

        {/* SIGN OUT */}
        <section className="settings-logout-section">
          <div>
            <h3>Leaving READMATE?</h3>
            <p>You can sign out of your account on this device.</p>
          </div>

          <button
            type="button"
            className="settings-logout-button"
            onClick={onLogout}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </section>

      </div>
    </div>
  );
}


    return (
    <div className="profile-layout">
      <div className="profile-card">
        <div className="profile-cover" />

        <div className="profile-main">
          <div className="large-avatar">
            {selectedAvatar ? (
              <img
                src={selectedAvatar.image}
                alt={selectedAvatar.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="profile-name">
            <h2>{displayName}</h2>

            <p>
              {myProfile?.username ? `@${myProfile.username} · ` : ''}
              Curious mind · Reader in progress ✦
            </p>
          </div>

        </div>

        <div className="profile-bio">
          {myProfile?.bio ||
            'Collecting ideas, building better habits, and becoming a little better every day.'}
        </div>

        {interests.length > 0 && (
          <div style={{ padding: '0 22px 20px' }}>
            <b style={{ fontSize: 13, color: '#51415f' }}>
              Reading interests
            </b>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 10
            }}>
              {interests.map((interest, index) => (
                <span
                  key={`${interest}-${index}`}
                  style={{
                    background: '#f2edf8',
                    color: '#8065a7',
                    padding: '6px 11px',
                    borderRadius: 20,
                    fontSize: 11
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="profile-stats">
        <StatCard
          icon={BookOpen}
          label="Books and courses"
          value={courses.length}
          detail="On your reading shelf"
          tone="purple"
        />

        <StatCard
          icon={Award}
          label="Completed"
          value={completedCourses}
          detail="Finished titles"
          tone="orange"
        />

        <StatCard
          icon={TrendingUp}
          label="Average progress"
          value={`${averageProgress}%`}
          detail="Across your shelf"
          tone="blue"
        />
      </div>

      <div className="achievement-card">
        <div className="achievement-icon">
          <Award size={23} />
        </div>

        <div>
          <b>Your reading collection</b>
          <p>
            You've saved {courses.length} titles and {notes.length} reflections in READMATE.
          </p>
        </div>

        <span className="earned-pill">GROWING</span>
      </div>

      <div className="achievement-card">
        <div className="achievement-icon">
          <Users size={23} />
        </div>

        <div>
          <b>Your reading buddy</b>
          <p>
            {buddy
              ? `Connected with ${buddy.display_name || 'your reading buddy'}.`
              : 'You have not connected with a reading buddy yet.'}
          </p>
        </div>

        <button className="outline-button" onClick={onConnect}>
          {buddy ? 'View connection' : 'Find a buddy'}
        </button>
      </div>

            
<button
  className="outline-button"
  onClick={async () => {
    if (!user?.id) {
      notify('Please sign in first.');
      return;
    }

    const result = await enablePushNotifications(user.id);

    if (result.success) {
      notify('Push notifications enabled successfully!');
    } else {
      notify(result.error || 'Could not enable notifications.');
    }
  }}
>
  <Bell />
  Enable Notifications
  <ChevronRight />
</button>

<button
  className="account-settings-trigger"
  onClick={() => setShowAccountSettings(true)}
>
  <Settings size={17} />
  <span>Account settings</span>
  <ChevronRight size={17} />
</button>

  

                  <InstallPrompt />
<UpdatePrompt />
    </div>
  );
}


// MODAL
function Modal({
  title,
  subtitle,
  onClose,
  children
}) {
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="modal-card"
        initial={{ opacity: 0, y: 20, scale: .98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: .98 }}
      >
        <div className="modal-heading">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        {children}
      </motion.div>
    </motion.div>
  );
}

export default App;
