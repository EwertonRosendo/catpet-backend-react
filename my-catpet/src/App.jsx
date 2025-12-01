import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
  app: { minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
  container: { maxWidth: '414px', margin: '0 auto', background: '#1e293b', minHeight: '100vh', position: 'relative' },
  header: { background: 'linear-gradient(135deg, #a855f7, #ec4899)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  userAvatar: { width: '48px', height: '48px', background: '#7c3aed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
  button: { padding: '12px 24px', background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  card: { background: 'rgba(51, 65, 85, 0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(100, 116, 139, 0.3)', borderRadius: '20px', padding: '20px', marginBottom: '20px', cursor: 'pointer', transition: 'all 0.3s' },
  input: { width: '350px', padding: '12px', background: '#334155', border: '2px solid #475569', borderRadius: '12px', color: 'white', fontSize: '16px', marginBottom: '15px' },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 50 },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: '414px', margin: '0 auto', background: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid #475569', padding: '12px', display: 'flex', justifyContent: 'space-around' },
  navBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 16px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', borderRadius: '12px', fontSize: '12px', transition: 'all 0.3s' },
  navBtnActive: { background: '#7c3aed', color: 'white' }
};

const mockUsers = [{ id: 1, email: 'maria@email.com', password: '123456', name: 'Maria Silva' }];

const specieEmojis = {
  cat: "🐱",
  dog: "🐶",
  bird: "🐦",
  fish: "🐠",
  rabbit: "🐰",
  hamster: "🐹",
  turtle: "🐢",
  snake: "🐍",
  default: "🐾"
};

export default function App() {

  const [healthItems, setHealthItems] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [section, setSection] = useState('home');
  //const [pets, setPets] = useState([
  //  { id: 1, name: 'Luna', emoji: '🐱', breed: 'Persa', age: 3, status: 'healthy' },
  //  { id: 2, name: 'Rex', emoji: '🐕', breed: 'Labrador', age: 5, status: 'attention' }
  //]);
  const [quests, setQuests] = useState([
    { id: 1, title: 'Exercício Diário', desc: 'Faça 30min de atividade', xp: 15, progress: 3, total: 7, active: true },
    { id: 2, title: 'Momento Carinho', desc: 'Dedique 15min de carinho', xp: 10, progress: 1, total: 1, active: true }
  ]);
  const [stats, setStats] = useState({ xp: 127, level: 3, completed: 8 });
  const [modal, setModal] = useState(null);
  const [notif, setNotif] = useState(null);


  useEffect(() => {
    const saved = localStorage.getItem('catpet_user');
    if (saved) {
      setUser(JSON.parse(saved));
      setIsAuth(true);
    }
  }, []);

  const [pets, setPets] = useState(() => {
    try {
      const saved = localStorage.getItem("catpet_pets");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [alimentacoes, setAlimentacoes] = useState(() => {
    try {
      const saved = localStorage.getItem("catpet_alimentacoes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [registros, setRegistros] = useState(() => {
    try {
      const saved = localStorage.getItem("catpet_registros");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [consultas, setConsultas] = useState(() => {
    try {
      const saved = localStorage.getItem("catpet_consultas");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });



  const addHealthItem = async (item) => {
    try {
      const user = JSON.parse(localStorage.getItem("catpet_user"));
      const token = localStorage.getItem("catpet_token");

      if (!user || !token) {
        showNotif("Erro", "Usuário não autenticado");
        return;
      }
      console.log(item)
      const body = {
        title: item.title,
        description: item.description
      }
      console.log(body)

      // -----------------------------
      // MAP CATEGORIES TO ENDPOINTS
      // -----------------------------
      const endpoints = {
        alimentacao: `/users/${user.id}/alimentacoes`,
        registros: `/users/${user.id}/registros`,
        consultas: `/users/${user.id}/consultas`
      };

      const url = `https://fluffy-computing-machine-94rjx6q64942pvr6-3000.app.github.dev/${endpoints[item.category]}`;

      // -----------------------------
      // SEND REQUEST
      // -----------------------------
      const response = await axios.post(
        url,
        { body }, // or the structure your Rails controller expects
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // -----------------------------
      // UPDATE UI
      // -----------------------------
      const newItem = response.data;

      const updated = [...healthItems, newItem];
      setHealthItems(updated);

      localStorage.setItem("catpet_health", JSON.stringify(updated));

      setModal(null);
      showNotif("Item adicionado!", "Categoria: " + item.category);

    } catch (error) {
      console.log("ADD HEALTH ITEM ERROR:", error);
      showNotif("Erro", error.response?.data?.error || "Não foi possível salvar o item");
    }
  };




  const getPets = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("catpet_user"));
      const token = localStorage.getItem("catpet_token");

      if (!user || !token) return;

      // 1. Load cached pets if they exist (fast UI load)
      const cachedPets = localStorage.getItem("catpet_pets");
      if (cachedPets) {
        setPets(JSON.parse(cachedPets));
      }

      // 2. Fetch latest pets from backend
      const response = await axios.get(
        `https://fluffy-computing-machine-94rjx6q64942pvr6-3000.app.github.dev/users/${user.id}/pets`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const petsList = response.data.pets || response.data;

      // 3. Save new pets to state
      setPets(petsList);

      // 4. Save to localStorage
      localStorage.setItem("catpet_pets", JSON.stringify(petsList));

    } catch (error) {
      console.error("GET PETS ERROR:", error);
    }
  };

  const getAlimentacoes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("catpet_user"));
      const token = localStorage.getItem("catpet_token");

      if (!user || !token) return;

      // 1. Cache
      const cached = localStorage.getItem("catpet_alimentacoes");
      if (cached) setAlimentacoes(JSON.parse(cached));

      // 2. Request Backend
      const response = await axios.get(
        `https://fluffy-computing-machine-94rjx6q64942pvr6-3000.app.github.dev/users/${user.id}/alimentacoes`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const list = response.data;

      // 3. Update state
      setAlimentacoes(list);

      // 4. Save cache
      localStorage.setItem("catpet_alimentacoes", JSON.stringify(list));

    } catch (error) {
      console.error("GET ALIMENTAÇÕES ERROR:", error);
    }
  };


  const getRegistros = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("catpet_user"));
      const token = localStorage.getItem("catpet_token");

      if (!user || !token) return;

      // 1. Cache
      const cached = localStorage.getItem("catpet_registros");
      if (cached) setRegistros(JSON.parse(cached));

      // 2. Request Backend
      const response = await axios.get(
        `https://fluffy-computing-machine-94rjx6q64942pvr6-3000.app.github.dev/users/${user.id}/registros`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const list = response.data;

      // 3. Update state
      setRegistros(list);

      // 4. Save cache
      localStorage.setItem("catpet_registros", JSON.stringify(list));

    } catch (error) {
      console.error("GET REGISTROS ERROR:", error);
    }
  };



  const getConsultas = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("catpet_user"));
      const token = localStorage.getItem("catpet_token");

      if (!user || !token) return;

      // 1. Cache
      const cached = localStorage.getItem("catpet_consultas");
      if (cached) setConsultas(JSON.parse(cached));

      // 2. Request Backend
      const response = await axios.get(
        `https://fluffy-computing-machine-94rjx6q64942pvr6-3000.app.github.dev/users/${user.id}/consultas`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const list = response.data;

      // 3. Update state
      setConsultas(list);

      // 4. Save cache
      localStorage.setItem("catpet_consultas", JSON.stringify(list));

    } catch (error) {
      console.error("GET CONSULTAS ERROR:", error);
    }
  };




  const handleRegister = async (data) => {
    try {
      const res = await axios.post("https://fluffy-computing-machine-94rjx6q64942pvr6-3000.app.github.dev/signup", { user: data });

      const newUser = res.data.user;
      const token = res.data.token;

      // Save to state
      setUser(newUser);
      setIsAuth(true);

      // Save to localStorage
      localStorage.setItem("catpet_user", JSON.stringify(newUser));
      localStorage.setItem("catpet_token", token);

      // Redirect to dashboard
      setSection("home");
      getPets()
      getAlimentacoes()
      getConsultas()
      getRegistros()
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };





  const login = async (email, pass) => {
    try {
      const response = await axios.post("https://fluffy-computing-machine-94rjx6q64942pvr6-3000.app.github.dev/login", {
        email: email,
        password: pass
      });

      const user = response.data.user;
      const token = response.data.token;

      // salvar estado
      setUser(user);
      setIsAuth(true);

      // salvar localStorage
      localStorage.setItem("catpet_user", JSON.stringify(user));
      localStorage.setItem("catpet_token", token);
      getPets()
      getAlimentacoes()
      getConsultas()
      getRegistros()
      return true;
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      return false;
    }
  };


  const logout = () => {
    setUser(null);
    setIsAuth(false);
    localStorage.removeItem('catpet_user');
    showNotif('Até logo!', 'Desconectado com sucesso');
  };

  const addPet = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem("catpet_user"));
      const token = localStorage.getItem("catpet_token");

      if (!user || !token) {
        showNotif("Erro", "Usuário não autenticado");
        return;
      }

      // montar o corpo EXATO que o backend espera
      const body = {
        pet: {
          name: data.name,
          species: data.species,   // <- atualizado
          breed: data.breed,
          age: Number(data.age)
        }
      };
      console.log(body)

      // enviar request
      const response = await axios.post(
        `https://fluffy-computing-machine-94rjx6q64942pvr6-3000.app.github.dev/users/${user.id}/pets`,
        body,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // o backend deve retornar o novo pet
      const newPet = response.data.pet || response.data;

      // atualizar estado
      const updatedPets = [...pets, newPet];
      setPets(updatedPets);

      // atualizar localStorage
      localStorage.setItem("catpet_pets", JSON.stringify(updatedPets));

      // fechar modal
      setModal(null);

      // notificação
      showNotif("Pet Adicionado! 🎉", `${newPet.name} foi adicionado!`);

    } catch (error) {
      console.error("ADD PET ERROR:", error);
      showNotif(
        "Erro",
        error.response?.data?.error || "Não foi possível adicionar o pet"
      );
    }
  };



  const completeQuest = (id) => {
    setQuests(quests.map(q => {
      if (q.id === id && q.active) {
        const newProg = q.progress + 1;
        if (newProg >= q.total) {
          setStats(s => ({ ...s, xp: s.xp + q.xp, completed: s.completed + 1 }));
          showNotif('🎉 Missão Completa!', `+${q.xp} XP ganhos!`);
          return { ...q, progress: newProg, active: false };
        }
        return { ...q, progress: newProg };
      }
      return q;
    }));
  };

  const showNotif = (title, msg) => {
    setNotif({ title, msg });
    setTimeout(() => setNotif(null), 3000);
  };

  if (!isAuth) return <AuthScreen onLogin={login} onRegister={handleRegister} />;


  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <Header user={user} stats={stats} onLogout={logout} />

        <div style={{ paddingBottom: '100px', padding: '20px' }}>
          {section === 'home' && <Home stats={stats} pets={pets} />}
          {section === 'pets' && <Pets pets={pets} onAdd={() => setModal('pet')} />}
          {section === 'health' && <Health onAdd={() => setModal('health')} />}
          {section === 'quest' && <Quest quests={quests} onComplete={completeQuest} stats={stats} />}
          {section === 'connect' && <Connect />}
        </div>

        <BottomNav section={section} onChange={setSection} />

        {modal === 'pet' && <AddPetModal onClose={() => setModal(null)} onAdd={addPet} />}
        {notif && <Notif title={notif.title} msg={notif.msg} />}
        {modal === 'health' && (
          <AddHealthModal
            onClose={() => setModal(null)}
            onAdd={addHealthItem}
          />
        )}

      </div>
    </div>
  );
}

function Register({ onBack, onRegister }) {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    password_confirmation: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    const ok = await onRegister(form);

    if (!ok) {
      setError("Registration failed");
    }
  };


  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #a855f7, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: "rgba(30, 41, 59, 0.95)", borderRadius: "24px", padding: "40px", maxWidth: "400px", width: "100%", border: "1px solid rgba(168, 85, 247, 0.3)" }}>

        <button onClick={onBack} style={{ marginBottom: "20px", background: "transparent", border: "none", color: "#a855f7", cursor: "pointer", fontSize: "16px" }}>
          ← Back
        </button>

        <h2 style={{ color: "#fff", textAlign: "center", marginBottom: "20px" }}>Create Account</h2>

        {error && <p style={{ color: "#ef4444", fontSize: "14px" }}>{error}</p>}

        <form onSubmit={submit}>
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={styles.input} />
          <input name="name" placeholder="name" value={form.name} onChange={handleChange} style={styles.input} />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} style={styles.input} />
          <input type="password" name="password_confirmation" placeholder="Confirm password" value={form.password_confirmation} onChange={handleChange} style={styles.input} />

          <button type="submit" style={{ ...styles.button, width: "100%" }}>Create Account</button>
        </form>
      </div>
    </div>
  );
}

function AuthScreen({ onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return (
      <Register
        onBack={() => setShowRegister(false)}
        onRegister={onRegister}
      />
    );
  }



  const submit = async (e) => {
    e.preventDefault();
    const ok = await onLogin(email, pass);

    if (!ok) setError('Email ou senha incorretos');
  };


  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'rgba(30, 41, 59, 0.95)', borderRadius: '24px', padding: '40px', maxWidth: '400px', width: '100%', border: '1px solid rgba(168, 85, 247, 0.3)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🐱</div>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>CatPet</h1>
          <p style={{ color: '#94a3b8' }}>Seu Pet, Nossa Missão</p>
        </div>

        <form onSubmit={submit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
          <input type="password" placeholder="Senha" value={pass} onChange={(e) => setPass(e.target.value)} style={styles.input} />

          {error && <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}

          <button type="submit" style={{ ...styles.button, width: '100%', marginBottom: '12px' }}>Entrar</button>

          <button type="button"
            onClick={() => { setEmail('maria@email.com'); setPass('123456'); }}
            style={{ ...styles.button, width: '100%', background: '#475569' }}>
            🚀 Demo
          </button>
        </form>

        {/* 🔥 ADD NEW REGISTER BUTTON HERE */}
        <button
          type="button"
          onClick={() => setShowRegister(true)}
          style={{ marginTop: '20px', width: '100%', padding: '12px', background: 'transparent', border: '2px solid #a855f7', borderRadius: '12px', color: '#a855f7', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Criar Conta
        </button>

        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginTop: '24px' }}>
          Demo: maria@email.com / 123456
        </p>
      </div>
    </div>
  );
}


function Header({ user, stats, onLogout }) {
  return (
    <div style={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={styles.userAvatar}>👤</div>
        <div>
          <h3 style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>{user?.name}</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>Nível {stats.level} • {stats.xp} XP</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ width: '40px', height: '40px', background: 'rgba(124, 58, 237, 0.5)', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', position: 'relative' }}>
          🔔
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '20px', height: '20px', background: '#ef4444', borderRadius: '50%', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
        </button>
        <button onClick={onLogout} style={{ width: '40px', height: '40px', background: 'rgba(239, 68, 68, 0.5)', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>
          🚪
        </button>
      </div>
    </div>
  );
}

function Home({ stats, pets }) {
  return (
    <div>
      <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Dashboard</h2>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Bem-vinda de volta!</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <StatCard icon="🏆" value={stats.xp} label="XP" color="linear-gradient(135deg, #f59e0b, #ea580c)" />
        <StatCard icon="🎯" value={stats.completed} label="Missões" color="linear-gradient(135deg, #10b981, #059669)" />
        <StatCard icon="🐾" value={pets.length} label="Pets" color="linear-gradient(135deg, #3b82f6, #2563eb)" />
        <StatCard icon="📅" value="3" label="Consultas" color="linear-gradient(135deg, #a855f7, #9333ea)" />
      </div>

      <div style={styles.card}>
        <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📈 Atividades Recentes
        </h3>
        <Activity icon="🏆" title="Missão Completa!" desc="Exercício diário +15 XP" time="2h" />
        <Activity icon="💊" title="Medicação" desc="Vermífugo para Rex" time="1d" />
        <Activity icon="👨‍⚕️" title="Teleconsulta" desc="Dr. Carlos Silva" time="3d" />
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <div style={{ background: color, borderRadius: '16px', padding: '20px', cursor: 'pointer', transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>{value}</div>
      <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>{label}</div>
    </div>
  );
}

function Activity({ icon, title, desc, time }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px', marginBottom: '8px' }}>
      <div style={{ fontSize: '24px' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <h4 style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{title}</h4>
        <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{desc}</p>
      </div>
      <span style={{ color: '#64748b', fontSize: '12px' }}>{time}</span>
    </div>
  );
}

function Pets({ pets, onAdd }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>Meus Pets</h2>
        <button onClick={onAdd} style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '50%', color: 'white', fontSize: '24px', cursor: 'pointer' }}>+</button>
      </div>

      {pets.map(pet => (
        <div key={pet.id} style={{ ...styles.card, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '48px' }}>
            {specieEmojis[pet.specie?.toLowerCase()] || specieEmojis.default}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{pet.name}</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0' }}>{pet.breed} • {pet.age} anos</p>
            <span style={{ padding: '4px 12px', background: pet.status === 'healthy' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: pet.status === 'healthy' ? '#10b981' : '#f59e0b', borderRadius: '12px', fontSize: '12px' }}>
              {pet.status === 'healthy' ? '✓ Saudável' : '⚠ Atenção'}
            </span>
          </div>
          <div style={{ fontSize: '20px', color: '#64748b' }}>📅</div>
        </div>
      ))}
    </div>
  );
}

function Health({
  onAdd,
}) {
  const [tab, setTab] = useState("alimentacao");
  const [alimentacoes, setAlimentacoes] = useState(() => {
    try {
      const saved = localStorage.getItem("catpet_alimentacoes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Registros
  const [registros, setRegistros] = useState(() => {
    try {
      const saved = localStorage.getItem("catpet_registros");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Consultas
  const [consultas, setConsultas] = useState(() => {
    try {
      const saved = localStorage.getItem("catpet_consultas");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  return (
    <div>
      {/* Title + Add Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>
          Saúde & Cuidados
        </h2>

        <button
          style={{
            padding: "10px 14px",
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            borderRadius: "12px",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold"
          }}
          onClick={onAdd}
        >
          + Add
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        background: 'rgba(51, 65, 85, 0.5)',
        borderRadius: '12px',
        padding: '4px',
        marginBottom: '24px'
      }}>
        <TabBtn active={tab === 'alimentacao'} onClick={() => setTab('alimentacao')}>Alimentação</TabBtn>
        <TabBtn active={tab === 'registros'} onClick={() => setTab('registros')}>Registros</TabBtn>
        <TabBtn active={tab === 'consultas'} onClick={() => setTab('consultas')}>Consultas</TabBtn>
      </div>

      {/* ALIMENTAÇÃO */}
      {tab === "alimentacao" && (
        <div>
          {alimentacoes.length === 0 ? (
            <></>
          ) : (
            alimentacoes.map((item) => (
              <FeedItem
                key={item.id}
                time={item.created_at || ""}
                meal={item.title}
                pet={item.description}
              />
            ))
          )}
        </div>
      )}

      {/* REGISTROS */}
      {tab === "registros" && (
        <div>
          {registros.length === 0 ? (
            <></>
          ) : (
            registros.map((item) => (
              <div key={item.id} style={{ ...styles.card, marginBottom: "12px" }}>
                <h3 style={{ color: "white" }}>{item.title}</h3>
                <p style={{ color: "#94a3b8" }}>{item.description}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* CONSULTAS */}
      {tab === "consultas" && (
        <div>
          {consultas.length === 0 ? (
            <></>
          ) : (
            consultas.map((item) => (
              <div key={item.id} style={{ ...styles.card, marginBottom: "12px" }}>
                <h3 style={{ color: "white" }}>{item.title}</h3>
                <p style={{ color: "#94a3b8" }}>{item.description}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}


function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ flex: 1, padding: '10px', background: active ? '#7c3aed' : 'transparent', color: active ? 'white' : '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.3s' }}>
      {children}
    </button>
  );
}

function FeedItem({ time, meal, pet }) {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ ...styles.card, display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{time}</div>
        <div style={{ color: '#94a3b8', fontSize: '12px' }}>{meal}</div>
      </div>
      <div style={{ flex: 1, color: '#cbd5e1', fontSize: '14px' }}>{pet}</div>
      <button onClick={() => setChecked(!checked)} style={{ width: '40px', height: '40px', background: checked ? '#10b981' : '#475569', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', fontSize: '20px' }}>
        {checked && '✓'}
      </button>
    </div>
  );
}

function Quest({ quests, onComplete, stats }) {
  const [tab, setTab] = useState('ativas');
  const active = quests.filter(q => q.active);
  const completed = quests.filter(q => !q.active);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>PetQuest</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 'bold' }}>
          <span>🏆</span>
          <span>{stats.xp} XP</span>
        </div>
      </div>

      <div style={{ ...styles.card, marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'white', fontWeight: '500' }}>Nível {stats.level}</span>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>{stats.xp % 100}/100 XP</span>
        </div>
        <div style={{ width: '100%', height: '12px', background: '#475569', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${stats.xp % 100}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', transition: 'width 0.5s' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', background: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
        <TabBtn active={tab === 'ativas'} onClick={() => setTab('ativas')}>Ativas</TabBtn>
        <TabBtn active={tab === 'completas'} onClick={() => setTab('completas')}>Completas</TabBtn>
      </div>

      {tab === 'ativas' && active.map(q => (
        <QuestCard key={q.id} quest={q} onComplete={onComplete} />
      ))}
      {tab === 'completas' && completed.map(q => (
        <QuestCard key={q.id} quest={q} completed />
      ))}
    </div>
  );
}

function QuestCard({ quest, onComplete, completed }) {
  return (
    <div onClick={() => !completed && onComplete(quest.id)} style={{ ...styles.card, border: completed ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(100, 116, 139, 0.3)', opacity: completed ? 0.7 : 1, display: 'flex', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', background: completed ? '#10b981' : 'linear-gradient(135deg, #a855f7, #ec4899)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
        {completed ? '✓' : '🏆'}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ color: 'white', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>{quest.title}</h3>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, marginBottom: '12px' }}>{quest.desc}</p>
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
          <span style={{ color: '#10b981' }}>+{quest.xp} XP</span>
          {!completed && <span style={{ color: '#94a3b8' }}>{quest.progress}/{quest.total}</span>}
        </div>
      </div>
      {completed && <div style={{ color: '#10b981', fontSize: '24px' }}>✓</div>}
    </div>
  );
}

function Connect() {
  const vets = [
    { id: 1, name: 'Dr. Carlos Silva', spec: 'Clínica Geral', status: 'online', price: 45, rating: 4.9 },
    { id: 2, name: 'Dra. Ana Oliveira', spec: 'Comportamento', status: 'busy', price: 55, rating: 4.8 },
    { id: 3, name: 'Dr. Pedro Santos', spec: 'Emergências', status: 'online', price: 65, rating: 4.9 }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>PetConnect</h2>
        <button style={{ padding: '8px 16px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', cursor: 'pointer', fontSize: '14px' }}>
          🚨 Emergência
        </button>
      </div>

      {vets.map(vet => (
        <div key={vet.id} style={{ ...styles.card, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #a855f7, #ec4899)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
              👨‍⚕️
            </div>
            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '16px', height: '16px', background: vet.status === 'online' ? '#10b981' : '#f59e0b', borderRadius: '50%', border: '2px solid #1e293b' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>{vet.name}</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0' }}>{vet.spec}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#f59e0b' }}>⭐</span>
              <span style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '500' }}>{vet.rating}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button style={{ padding: '8px 16px', background: vet.status === 'online' ? '#10b981' : '#475569', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', marginBottom: '4px' }}>
              {vet.status === 'online' ? '📹' : '📅'}
            </button>
            <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>R$ {vet.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function BottomNav({ section, onChange }) {
  const items = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'pets', icon: '🐾', label: 'Pets' },
    { id: 'health', icon: '❤️', label: 'Saúde' },
    { id: 'quest', icon: '🏆', label: 'Quest' },
    { id: 'connect', icon: '👨‍⚕️', label: 'Connect' }
  ];

  return (
    <div style={styles.bottomNav}>
      {items.map(item => {
        const active = section === item.id;
        return (
          <button key={item.id} onClick={() => onChange(item.id)} style={{ ...styles.navBtn, ...(active ? styles.navBtnActive : {}) }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}


function AddHealthModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "alimentacao"
  });

  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    onAdd(form);
  };

  return (
    <div style={styles.modal}>
      <div style={{
        background: "#1e293b",
        borderRadius: "20px",
        padding: "24px",
        width: "90%",
        maxWidth: "400px",
        border: "1px solid rgba(148,163,184,0.3)"
      }}>

        <h2 style={{ color: "white", marginBottom: "20px" }}>Adicionar Item de Saúde</h2>

        {/* TÍTULO */}
        <input
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={update}
          style={styles.input}
        />

        {/* DESCRIÇÃO */}
        <textarea
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={update}
          style={{ ...styles.input, height: "90px", resize: "none" }}
        />

        {/* CATEGORIA */}
        <select
          name="category"
          value={form.category}
          onChange={update}
          style={{
            ...styles.input,
            width: "100%",
            cursor: "pointer",
            background: "#334155",
            color: "white"
          }}
        >
          <option value="alimentacao">🍎 Alimentação</option>
          <option value="registros">📘 Registros</option>
          <option value="consultas">👨‍⚕️ Consultas</option>
        </select>

        {/* BOTÕES */}
        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button
            onClick={onClose}
            style={{
              ...styles.button,
              background: "#475569",
              flex: 1
            }}
          >
            Cancelar
          </button>

          <button
            onClick={save}
            style={{
              ...styles.button,
              flex: 1
            }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}





function AddPetModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = (e) => {
    e.preventDefault();
    onAdd(form);
  };

  return (
    <div style={styles.modal}>
      <div style={{ background: "#1e293b", padding: "24px", borderRadius: "20px", width: "90%", maxWidth: "400px" }}>
        <h2 style={{ color: "white", marginBottom: "20px" }}>Adicionar Pet</h2>

        <form onSubmit={submit}>
          <input
            name="name"
            placeholder="Nome"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="species"   // <-- IMPORTANTE
            value={form.species}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Selecione a espécie</option>
            <option value="cat">Gato 🐱</option>
            <option value="dog">Cachorro 🐶</option>
            <option value="bird">Pássaro 🐦</option>
            <option value="fish">Peixe 🐠</option>
            <option value="rabbit">Coelho 🐰</option>
            <option value="hamster">Hamster 🐹</option>
            <option value="turtle">Tartaruga 🐢</option>
            <option value="snake">Cobra 🐍</option>
          </select>

          <input
            name="breed"
            placeholder="Raça"
            value={form.breed}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="age"
            type="number"
            placeholder="Idade"
            value={form.age}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={{ ...styles.button, width: "100%" }}>
            Salvar
          </button>
        </form>

        <button
          onClick={onClose}
          style={{ marginTop: "16px", width: "100%", padding: "12px", background: "#475569", borderRadius: "12px", color: "white", border: "none" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}


function Notif({ title, msg }) {
  return (
    <div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, animation: 'slideDown 0.3s ease-out' }}>
      <div style={{ background: '#1e293b', border: '1px solid #a855f7', borderRadius: '16px', padding: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxWidth: '350px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #a855f7, #ec4899)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
            ✓
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>{title}</h4>
            <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{msg}</p>
          </div>
        </div>
      </div>
    </div>
  );
}