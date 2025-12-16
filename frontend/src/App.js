import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

const { Content } = Layout;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Content>
            <Routes>
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? 
                    <Navigate to="/dashboard" /> : 
                    <Login setIsAuthenticated={setIsAuthenticated} />
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  isAuthenticated ? 
                    <Dashboard setIsAuthenticated={setIsAuthenticated} /> : 
                    <Navigate to="/login" />
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;