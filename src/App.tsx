import React, { createContext, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Routes, Route, Outlet, useLocation, Navigate, useNavigate, } from 'react-router-dom';

import './App.scss';

function Dashboard() {
  return (
    <p>Dashboard</p>
  )
}

function List() {
  return (
    <p>List</p>
  )
}

function NoMatch() {
  return (
    <p>404</p>
  )
}

function PublicLayout() {
  return (
    <div>
      <AuthStatus />
      <header>This is public header</header>
      <Outlet />
      <footer>This if public footer</footer>
    </div>
  )
}

function DashboardLayout() {
  return (
    <div>
      <AuthStatus />
      <header>This is dashboard header</header>
      <Outlet />
      <footer>This if dashboard footer</footer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<List />} />
          <Route path="login" element={<LogIn />} />
        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<RequireAuth><Dashboard /></RequireAuth>} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </AuthProvider>
  );
}


function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useContext(AuthContext);
  const location = useLocation();
  console.log(auth);

  if (!auth.user) {
    // The use of navigate("...", { replace: true }) to replace the /login route in the history
    // stack so the user doesn't return to the login page when clicking the back button after logging in
    return (<Navigate to="/login" state={{ from: location }} />)
  }

  return children;
}


//define context structure
interface AuthContextType {
  user: string | null,
  signIn: (user: string, callback: () => void) => void,
  signOut: (callback: () => void) => void,
}

const AuthContext = createContext<AuthContextType>({ user: null, signIn: () => undefined, signOut: () => undefined });

function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<null | string>(null);

  function signIn(newUser: string, callback: () => void) {
    setUser(newUser);
    callback();
  }

  function signOut(callback: () => void): void {
    setUser(null);
    callback();
  }

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}

function LogIn() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const userName = form.get('userName')?.toString();

    if (userName) {
      auth.signIn(userName, () => {
        navigate(from, { replace: true })
      });
    }
  }

  return (
    <>
      <p>Login</p>
      <form onSubmit={handleFormSubmit}>
        <input type="text" name="userName" />
        <button type="submit">Log me in</button>
      </form>
    </>
  )
}


function AuthStatus() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <p>User is {auth.user}</p>
      {auth.user && <button onClick={() => { auth.signOut(() => navigate("/")) }}>signout</button>}
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
    </>
  )
}


export default App;
