import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, Cell, Legend } from 'recharts';
import { Upload, ChevronRight, Check, X, Sun, Moon, TrendingUp, Clock, Target, Zap, BarChart3, FileText, Download, Settings, LogOut, Menu, ChevronDown, Play, Loader2, ArrowRight, Shield, Cpu, Brain, Users, Star, HelpCircle, Mail, Linkedin, ExternalLink } from 'lucide-react';

// ==============================================
// DESIGN TOKENS & CONFIGURATION
// ==============================================
const tokens = {
  dark: {
    bgPrimary: '#0B1020',
    bgSecondary: '#0D1428',
    bgSurface: '#111A30',
    bgHover: '#1A2340',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A8C0',
    textMuted: '#5A6380',
    accent: '#4F5BD5',
    accentHover: '#6370E8',
    accentMuted: 'rgba(79, 91, 213, 0.15)',
    border: '#1E2A45',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  light: {
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F8F9FC',
    bgSurface: '#EEF0F5',
    bgHover: '#E4E7EF',
    textPrimary: '#0B1020',
    textSecondary: '#4A5068',
    textMuted: '#8891A8',
    accent: '#4F5BD5',
    accentHover: '#3D49B8',
    accentMuted: 'rgba(79, 91, 213, 0.1)',
    border: '#D0D4E0',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
  }
};

// ==============================================
// MOCK DATA
// ==============================================
const forecastData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2025, 0, i + 1);
  const actual = i < 20 ? Math.floor(1200 + Math.random() * 600 + Math.sin(i / 3) * 200) : null;
  const forecast = i >= 18 ? Math.floor(1400 + Math.random() * 400 + Math.sin(i / 3) * 150) : null;
  const lower = forecast ? forecast - 150 - Math.random() * 100 : null;
  const upper = forecast ? forecast + 150 + Math.random() * 100 : null;
  return {
    date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    actual,
    forecast,
    lower,
    upper,
  };
});

const recentForecasts = [
  { id: 1, name: 'Q1_2025_Products.csv', date: '15 Jan 2025', series: 47, status: 'completed', smape: 8.2 },
  { id: 2, name: 'Winter_Sales.csv', date: '12 Jan 2025', series: 32, status: 'completed', smape: 11.4 },
  { id: 3, name: 'Electronics_Dec.csv', date: '08 Jan 2025', series: 89, status: 'completed', smape: 6.8 },
  { id: 4, name: 'Fashion_Q4.csv', date: '02 Jan 2025', series: 156, status: 'completed', smape: 9.1 },
];

const abcDistribution = [
  { name: 'A', value: 15, color: '#4F5BD5', label: 'Produits stratégiques' },
  { name: 'B', value: 35, color: '#6370E8', label: 'Produits standards' },
  { name: 'C', value: 50, color: '#8B94E8', label: 'Longue traîne' },
];

const modelPerformance = [
  { model: 'AutoARIMA', smape: 8.2, series: 12 },
  { model: 'Theta', smape: 9.1, series: 18 },
  { model: 'CrostonOptimized', smape: 7.4, series: 8 },
  { model: 'ETS', smape: 10.2, series: 6 },
  { model: 'MSTL', smape: 8.8, series: 3 },
];

// ==============================================
// MAIN APPLICATION
// ==============================================
export default function LumenIQApp() {
  const [theme, setTheme] = useState('dark');
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const colors = tokens[theme];

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    if (page === 'dashboard' || page === 'forecast' || page === 'results' || page === 'history' || page === 'settings') {
      setIsAuthenticated(true);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.bgPrimary,
      color: colors.textPrimary,
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      transition: 'all 0.3s ease'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        ::selection {
          background: ${colors.accent};
          color: white;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-fade { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide { animation: slideIn 0.4s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        
        .gradient-text {
          background: linear-gradient(135deg, ${colors.accent} 0%, #8B94E8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glow {
          box-shadow: 0 0 40px ${colors.accentMuted};
        }
        
        input:focus, button:focus { outline: none; }
        
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${colors.bgSecondary}; }
        ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${colors.textMuted}; }
      `}</style>

      {!isAuthenticated ? (
        <PublicSite
          colors={colors}
          theme={theme}
          toggleTheme={toggleTheme}
          currentPage={currentPage}
          navigateTo={navigateTo}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      ) : (
        <AppDashboard
          colors={colors}
          theme={theme}
          toggleTheme={toggleTheme}
          currentPage={currentPage}
          navigateTo={navigateTo}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
    </div>
  );
}

// ==============================================
// PUBLIC SITE (LANDING PAGE)
// ==============================================
function PublicSite({ colors, theme, toggleTheme, currentPage, navigateTo, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: theme === 'dark' ? 'rgba(11, 16, 32, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${colors.border}`,
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigateTo('landing')}>
            <LumenIQLogo colors={colors} size={32} />
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px' }}>LumenIQ</span>
          </div>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
            <NavLink colors={colors} onClick={() => navigateTo('features')}>Features</NavLink>
            <NavLink colors={colors} onClick={() => navigateTo('pricing')}>Pricing</NavLink>
            <NavLink colors={colors} onClick={() => navigateTo('docs')}>Documentation</NavLink>
            <NavLink colors={colors} onClick={() => navigateTo('blog')}>Blog</NavLink>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: 'none',
                color: colors.textSecondary,
                cursor: 'pointer',
                padding: 8,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.color = colors.textPrimary}
              onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Button colors={colors} variant="ghost" onClick={() => navigateTo('login')}>
              Connexion
            </Button>
            <Button colors={colors} variant="primary" onClick={() => navigateTo('dashboard')}>
              Démarrer gratuitement
            </Button>
          </div>
        </div>
      </nav>

      <main style={{ paddingTop: 80 }}>
        {currentPage === 'landing' && <LandingPage colors={colors} theme={theme} navigateTo={navigateTo} />}
        {currentPage === 'pricing' && <PricingPage colors={colors} navigateTo={navigateTo} />}
        {currentPage === 'features' && <FeaturesPage colors={colors} navigateTo={navigateTo} />}
        {currentPage === 'login' && <LoginPage colors={colors} navigateTo={navigateTo} />}
      </main>

      <Footer colors={colors} />
    </>
  );
}

// ==============================================
// LANDING PAGE
// ==============================================
function LandingPage({ colors, theme, navigateTo }) {
  return (
    <>
      {/* Hero Section */}
      <section style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Effects */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 500,
          height: 500,
          background: `radial-gradient(circle, ${colors.accentMuted} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '-10%',
          width: 400,
          height: 400,
          background: `radial-gradient(circle, rgba(99, 112, 232, 0.1) 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '60px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}>
          {/* Left Content */}
          <div className="animate-fade">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              backgroundColor: colors.accentMuted,
              borderRadius: 100,
              marginBottom: 24,
              fontSize: 14,
              fontWeight: 500,
              color: colors.accent,
            }}>
              <Zap size={16} />
              Beta ouverte — Essai gratuit 3 mois
            </div>

            <h1 style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: '-2px',
            }}>
              Prévisions<br />
              <span className="gradient-text">professionnelles</span><br />
              validées par backtesting
            </h1>

            <p style={{
              fontSize: 20,
              color: colors.textSecondary,
              lineHeight: 1.6,
              marginBottom: 40,
              maxWidth: 500,
            }}>
              Transformez vos historiques de ventes en forecasts fiables.
              21 modèles statistiques/ML, routing ABC/XYZ intelligent, rapports détaillés.
              <strong style={{ color: colors.textPrimary }}> En 5 minutes.</strong>
            </p>

            <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
              <Button colors={colors} variant="primary" size="large" onClick={() => navigateTo('dashboard')}>
                Démarrer gratuitement
                <ArrowRight size={20} style={{ marginLeft: 8 }} />
              </Button>
              <Button colors={colors} variant="secondary" size="large">
                Voir la démo
                <Play size={18} style={{ marginLeft: 8 }} />
              </Button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', gap: 32 }}>
              <TrustBadge colors={colors} icon={<Clock size={20} />} value="5 min" label="Setup" />
              <TrustBadge colors={colors} icon={<Brain size={20} />} value="21" label="Modèles" />
              <TrustBadge colors={colors} icon={<Target size={20} />} value="~60%" label="Réduction compute" />
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="animate-fade stagger-2" style={{ position: 'relative' }}>
            <div className="glow animate-float" style={{
              backgroundColor: colors.bgSecondary,
              borderRadius: 16,
              border: `1px solid ${colors.border}`,
              padding: 24,
              position: 'relative',
              zIndex: 2,
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>Forecast Q1 2025</h3>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: colors.success + '20',
                  color: colors.success,
                  borderRadius: 100,
                  fontSize: 12,
                  fontWeight: 600,
                }}>SMAPE 8.2%</span>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.accent} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={colors.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis dataKey="date" stroke={colors.textMuted} fontSize={11} tickLine={false} />
                  <YAxis stroke={colors.textMuted} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.bgSurface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="upper" stroke="none" fill={colors.accentMuted} />
                  <Area type="monotone" dataKey="lower" stroke="none" fill={colors.bgSecondary} />
                  <Line type="monotone" dataKey="actual" stroke={colors.textSecondary} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="forecast" stroke={colors.accent} strokeWidth={3} dot={false} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                marginTop: 20,
              }}>
                <MetricMini colors={colors} label="Séries" value="47" />
                <MetricMini colors={colors} label="Champion" value="AutoARIMA" />
                <MetricMini colors={colors} label="Horizon" value="12 sem" />
              </div>
            </div>

            {/* Floating Card */}
            <div style={{
              position: 'absolute',
              bottom: -30,
              left: -40,
              backgroundColor: colors.bgSecondary,
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              padding: 16,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              zIndex: 3,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: colors.success + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Check size={20} color={colors.success} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>Backtesting validé</p>
                  <p style={{ fontSize: 12, color: colors.textMuted }}>5-fold cross-validation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section style={{
        padding: '120px 24px',
        backgroundColor: colors.bgSecondary,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16, letterSpacing: '-1px' }}>
              Le forecasting professionnel,<br />enfin accessible aux PME
            </h2>
            <p style={{ fontSize: 18, color: colors.textSecondary, maxWidth: 600, margin: '0 auto' }}>
              Ni Excel approximatif, ni solutions enterprise à €20k/an.
              LumenIQ comble le gap avec une précision pro à prix PME.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            <ComparisonCard
              colors={colors}
              title="Excel / Sheets"
              subtitle="Approximations manuelles"
              items={[
                { text: 'Moyennes mobiles basiques', bad: true },
                { text: 'Pas de validation statistique', bad: true },
                { text: 'Erreur forecast : 30-50%', bad: true },
                { text: 'Pas de saisonnalité détectée', bad: true },
              ]}
              badge="Gratuit mais risqué"
              badgeColor={colors.warning}
            />
            <ComparisonCard
              colors={colors}
              title="LumenIQ"
              subtitle="Le juste équilibre"
              items={[
                { text: '21 modèles statistiques/ML', good: true },
                { text: 'Backtesting multi-fold automatique', good: true },
                { text: 'Routing ABC/XYZ (unique)', good: true },
                { text: '~60% réduction temps calcul', good: true },
              ]}
              badge="€99-249/mois"
              badgeColor={colors.accent}
              highlight={true}
            />
            <ComparisonCard
              colors={colors}
              title="Enterprise"
              subtitle="DataRobot, H2O, SAP..."
              items={[
                { text: 'Modèles sophistiqués', good: true },
                { text: 'Setup complexe, équipe data requise', bad: true },
                { text: 'Coût : €2000+/mois', bad: true },
                { text: 'Overkill pour PME', bad: true },
              ]}
              badge="Surdimensionné"
              badgeColor={colors.textMuted}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '120px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16, letterSpacing: '-1px' }}>
              Technologie de pointe,<br />simplicité absolue
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
            <FeatureCard
              colors={colors}
              icon={<Cpu size={28} />}
              title="Routing ABC/XYZ Intelligent"
              description="Innovation différenciante : allocation dynamique du budget compute selon la valeur business de chaque série. Les produits A (top 20% CA) reçoivent jusqu'à 30 modèles avec 5-fold CV. Résultat : ~60% de réduction temps de calcul."
            >
              <div style={{ marginTop: 24 }}>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={abcDistribution} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke={colors.textMuted} fontSize={12} width={30} />
                    <Tooltip
                      formatter={(value, name, props) => [`${value}%`, props.payload.label]}
                      contentStyle={{
                        backgroundColor: colors.bgSurface,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 8,
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {abcDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </FeatureCard>

            <FeatureCard
              colors={colors}
              icon={<Target size={28} />}
              title="Backtesting Multi-Fold"
              description="Chaque forecast est validé par cross-validation temporelle (jusqu'à 5 folds pour classe A). Vous savez exactement quelle aurait été la précision sur vos données historiques avant de faire confiance au forecast."
            >
              <div style={{
                marginTop: 24,
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 8
              }}>
                {[1, 2, 3, 4, 5].map(fold => (
                  <div key={fold} style={{
                    backgroundColor: colors.bgSurface,
                    borderRadius: 8,
                    padding: 12,
                    textAlign: 'center',
                  }}>
                    <p style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>Fold {fold}</p>
                    <p style={{ fontSize: 16, fontWeight: 600, color: colors.success }}>
                      {(7 + Math.random() * 4).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </FeatureCard>

            <FeatureCard
              colors={colors}
              icon={<Brain size={28} />}
              title="21 Modèles Statistiques/ML"
              description="Du classique ARIMA aux modèles ML avancés et foundation models. L'algorithme sélectionne automatiquement le champion pour chaque série selon sa nature (régulière, saisonnière, intermittente...)."
            >
              <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['AutoARIMA', 'AutoETS', 'Theta', 'Croston', 'TSB', 'ADIDA', 'LightGBM', 'Ridge'].map(model => (
                  <span key={model} style={{
                    padding: '6px 12px',
                    backgroundColor: colors.bgSurface,
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                    color: colors.textSecondary,
                  }}>{model}</span>
                ))}
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: colors.accentMuted,
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  color: colors.accent,
                }}>+13 autres</span>
              </div>
            </FeatureCard>

            <FeatureCard
              colors={colors}
              icon={<FileText size={28} />}
              title="6 Artifacts & Synthèse LLM"
              description="Rapport exécutif généré par Claude API traduit les résultats techniques en insights business. Export complet avec tous les artifacts pour audit et intégration ERP/BI."
            >
              <div style={{
                marginTop: 24,
                backgroundColor: colors.bgSurface,
                borderRadius: 8,
                padding: 16,
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {['forecast.csv', 'metrics.json', 'model_registry.json', 'insights.json', 'run_manifest.json', 'Synthèse LLM'].map(artifact => (
                    <div key={artifact} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: colors.textSecondary }}>
                      <Check size={12} color={colors.success} />
                      {artifact}
                    </div>
                  ))}
                </div>
              </div>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '120px 24px', backgroundColor: colors.bgSecondary }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16, letterSpacing: '-1px' }}>
              De l'upload au forecast :<br />5 minutes chrono
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            <StepCard colors={colors} number={1} title="Upload CSV" description="Glissez votre fichier historique. Détection automatique des colonnes dates et valeurs." />
            <StepCard colors={colors} number={2} title="Configuration auto" description="Fréquence, saisonnalité, classification ABC/XYZ détectées sans intervention." />
            <StepCard colors={colors} number={3} title="Calcul (2-5 min)" description="21 modèles en compétition, backtesting multi-fold, sélection du champion par série." />
            <StepCard colors={colors} number={4} title="Résultats" description="Dashboard interactif, métriques de fiabilité, export ZIP complet." />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section style={{ padding: '120px 24px' }} id="pricing">
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16, letterSpacing: '-1px' }}>
            Tarification simple et transparente
          </h2>
          <p style={{ fontSize: 18, color: colors.textSecondary, marginBottom: 60 }}>
            Pas de coûts cachés. Pas d'engagement. Essai gratuit 3 mois.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            <PricingCard
              colors={colors}
              name="Standard"
              price="99"
              icon={<BarChart3 size={20} />}
              description="Forecasts pro sans expertise data science"
              features={[
                '50 séries / mois',
                '10 modèles statistiques',
                'Routing ABC/XYZ intelligent',
                'Backtesting automatique',
                'Synthèse LLM (Claude)',
                'Historique 30 jours',
                'Support email 48h',
              ]}
              ctaText="Commencer l'essai"
              onClick={() => navigateTo('dashboard')}
            />
            <PricingCard
              colors={colors}
              name="ML"
              price="179"
              icon={<Cpu size={20} />}
              description="Performance ML sans data scientist"
              badge="BEST VALUE"
              features={[
                '150 séries / mois',
                'Tout Standard inclus',
                '+ Ridge (batch vectorisé)',
                '+ LightGBM (tree-based)',
                '+ Hurdle+ (ML-enhanced)',
                'Historique 60 jours',
                'Support email 24h',
              ]}
              popular={true}
              ctaText="Commencer l'essai"
              onClick={() => navigateTo('dashboard')}
            />
            <PricingCard
              colors={colors}
              name="Foundation"
              price="299"
              icon={<Brain size={20} />}
              description="Foundation Models + Support prioritaire"
              badge="PREMIUM"
              features={[
                '300 séries / mois',
                'Tout ML inclus',
                '+ TimeGPT (Nixtla)',
                '+ EnsembleTop2',
                'API REST complète',
                'Support prioritaire 4h',
                'Connecteur Shopify (M9+)',
              ]}
              ctaText="Commencer l'essai"
              onClick={() => navigateTo('dashboard')}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '120px 24px', backgroundColor: colors.bgSecondary }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 60, textAlign: 'center', letterSpacing: '-1px' }}>
            Questions fréquentes
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FAQItem
              colors={colors}
              question="Quel format de données est accepté ?"
              answer="LumenIQ accepte les fichiers CSV et XLSX. Votre fichier doit contenir au minimum une colonne date et une ou plusieurs colonnes de valeurs numériques (ventes, quantités...). Le système effectue des contrôles qualité automatiques (missing, duplicates, outliers) et détecte automatiquement les colonnes."
            />
            <FAQItem
              colors={colors}
              question="Qu'est-ce que le routing ABC/XYZ ?"
              answer="C'est notre innovation différenciante : allocation dynamique du budget compute selon la valeur business. Les produits classe A (top 20% CA) reçoivent jusqu'à 30 modèles avec 5-fold CV, tandis que la classe C utilise 10 modèles avec 2-fold CV. Résultat : ~60% de réduction du temps de calcul vs approche naïve, permettant un pricing compétitif."
            />
            <FAQItem
              colors={colors}
              question="Comment fonctionne le backtesting ?"
              answer="Chaque forecast est validé par cross-validation temporelle (jusqu'à 5 folds pour classe A). De plus, notre mécanisme de Gating détecte si vos données ont significativement changé entre les runs. Si stable, un mini-backtest suffit : 60-70% plus rapide sur les exécutions récurrentes."
            />
            <FAQItem
              colors={colors}
              question="Combien de modèles sont disponibles ?"
              answer="15 modèles organisés en 3 packs progressifs : Standard (10 modèles stats : Naive, SeasonalNaive, Drift, AutoETS, Theta, AutoARIMA, Croston, TSB, ADIDA, Hurdle), ML (+ Ridge, LightGBM, Hurdle+ batch-vectorisés avec 75% win-rate sur séries stables), et Foundation (+ TimeGPT zero-shot, EnsembleTop2). Le champion est sélectionné automatiquement par cross-validation."
            />
            <FAQItem
              colors={colors}
              question="Puis-je intégrer LumenIQ à mon système existant ?"
              answer="Oui, le plan Foundation (€299/mois) inclut un accès API REST complet avec clé personnelle. Vous pouvez automatiser vos forecasts et intégrer les 6 artifacts (forecast.csv, metrics.json, etc.) directement dans votre ERP/BI. Un connecteur Shopify est prévu pour M9+."
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ padding: '120px 24px' }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          textAlign: 'center',
          backgroundColor: colors.bgSecondary,
          borderRadius: 24,
          padding: '80px 60px',
          border: `1px solid ${colors.border}`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 600,
            background: `radial-gradient(circle, ${colors.accentMuted} 0%, transparent 70%)`,
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 44, fontWeight: 700, marginBottom: 20, letterSpacing: '-1.5px' }}>
              Prêt à transformer vos prévisions ?
            </h2>
            <p style={{ fontSize: 18, color: colors.textSecondary, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
              Rejoignez notre bêta et bénéficiez de 3 mois gratuits.<br />
              Aucune carte de crédit requise.
            </p>
            <Button colors={colors} variant="primary" size="large" onClick={() => navigateTo('dashboard')}>
              Démarrer gratuitement
              <ArrowRight size={20} style={{ marginLeft: 8 }} />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

// ==============================================
// PRICING PAGE
// ==============================================
function PricingPage({ colors, navigateTo }) {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16, letterSpacing: '-1.5px' }}>
            Tarification
          </h1>
          <p style={{ fontSize: 18, color: colors.textSecondary }}>
            Essai gratuit 3 mois. Aucun engagement. Annulez à tout moment.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <PricingCard
            colors={colors}
            name="Standard"
            price="99"
            icon={<BarChart3 size={20} />}
            description="Forecasts pro sans expertise data science"
            features={[
              '50 séries / mois',
              '10 modèles statistiques',
              'Naive, SeasonalNaive, Drift, RollingMean',
              'AutoETS, Theta, AutoARIMA',
              'Croston, TSB, ADIDA, Hurdle',
              'Routing ABC/XYZ intelligent',
              'Backtesting multi-fold (CV)',
              'Synthèse LLM (Claude API)',
              '6 artifacts export complet',
              'Historique 30 jours',
              'Support email 48h',
            ]}
            ctaText="Commencer l'essai gratuit"
            onClick={() => navigateTo('dashboard')}
          />
          <PricingCard
            colors={colors}
            name="ML"
            price="179"
            icon={<Cpu size={20} />}
            description="Performance ML sans data scientist"
            badge="BEST VALUE"
            features={[
              '150 séries / mois',
              'Tout Standard inclus +',
              '⚡ Ridge (batch vectorisé MLForecast)',
              '⚡ LightGBM (tree-based puissant)',
              '⚡ Hurdle+ (ML-enhanced)',
              '75% win-rate sur séries stables',
              'Features automatiques (lags, rolling)',
              'Historique 60 jours',
              'Support email 24h',
            ]}
            popular={true}
            ctaText="Commencer l'essai gratuit"
            onClick={() => navigateTo('dashboard')}
          />
          <PricingCard
            colors={colors}
            name="Foundation"
            price="299"
            icon={<Brain size={20} />}
            description="Foundation Models + Support prioritaire"
            badge="PREMIUM"
            features={[
              '300 séries / mois',
              'Tout ML inclus +',
              '🔥 TimeGPT (Nixtla Foundation Model)',
              '🔥 EnsembleTop2 (combinaison champions)',
              '🔥 Priority A-routing (+modèles classe A)',
              'API REST complète + clé dédiée',
              'Historique 90 jours',
              'Support prioritaire <4h',
              'Connecteur Shopify (M9+)',
              'Accès early features',
            ]}
            ctaText="Commencer l'essai gratuit"
            onClick={() => navigateTo('dashboard')}
          />
        </div>

        {/* Comparison Table */}
        <div style={{
          marginTop: 60,
          padding: 32,
          backgroundColor: colors.bgSecondary,
          borderRadius: 16,
          border: `1px solid ${colors.border}`,
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Comparaison détaillée</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: colors.textMuted }}>Feature</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px' }}>Standard</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', color: colors.accent }}>ML ⭐</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', color: '#F59E0B' }}>Foundation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Séries / mois', '50', '150', '300'],
                  ['Modèles disponibles', '10 stats', '13 (+ ML)', '15+ (+ Foundation)'],
                  ['Ridge / LightGBM', '❌', '✅', '✅'],
                  ['TimeGPT', '❌', '❌', '✅'],
                  ['EnsembleTop2', '❌', '❌', '✅'],
                  ['API Access', '❌', '❌', '✅'],
                  ['Historique', '30 jours', '60 jours', '90 jours'],
                  ['Support', 'Email 48h', 'Email 24h', 'Prioritaire 4h'],
                ].map(([feature, std, ml, found], i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <td style={{ padding: '12px 16px', color: colors.textSecondary }}>{feature}</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}>{std}</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}>{ml}</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}>{found}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{
          marginTop: 32,
          padding: 32,
          backgroundColor: colors.bgSecondary,
          borderRadius: 16,
          border: `1px solid ${colors.border}`,
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Besoin d'un volume supérieur ?</h3>
          <p style={{ color: colors.textSecondary, marginBottom: 16 }}>
            Pour les entreprises avec plus de 500 séries/mois ou des besoins spécifiques
            (on-premise, intégrations custom, SLA), contactez-nous pour un devis personnalisé.
          </p>
          <Button colors={colors} variant="secondary">
            <Mail size={18} style={{ marginRight: 8 }} />
            Contacter l'équipe
          </Button>
        </div>
      </div>
    </section>
  );
}

// ==============================================
// FEATURES PAGE
// ==============================================
function FeaturesPage({ colors, navigateTo }) {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16, letterSpacing: '-1.5px' }}>
            Fonctionnalités
          </h1>
          <p style={{ fontSize: 18, color: colors.textSecondary, maxWidth: 600, margin: '0 auto' }}>
            Une suite complète d'outils de prévision professionnels,
            conçue pour les PME e-commerce qui veulent des résultats fiables.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
          <FeatureSection
            colors={colors}
            title="Routing ABC/XYZ Intelligent"
            description="Innovation différenciante : allocation dynamique du budget compute selon la valeur business de chaque série. Classification automatique selon contribution CA (ABC) et volatilité demande (XYZ)."
            benefits={[
              'Classe A (Top 20% CA) : jusqu\'à 30 modèles, 5-fold CV',
              'Classe B (30% suivants) : jusqu\'à 20 modèles, 3-fold CV',
              'Classe C (50% restants) : jusqu\'à 10 modèles, 2-fold CV',
              'Impact : ~60% réduction temps de calcul vs approche naïve',
            ]}
          />

          <FeatureSection
            colors={colors}
            title="15 Modèles en 3 Packs"
            description="Une bibliothèque complète organisée en 3 packs progressifs : Standard (10 modèles stats), ML (+3 modèles batch-vectorisés), Foundation (+TimeGPT). Chaque série est automatiquement associée au modèle champion."
            benefits={[
              'Standard : Naive, SeasonalNaive, Drift, AutoETS, Theta, AutoARIMA, Croston, TSB, ADIDA, Hurdle',
              'ML : Ridge, LightGBM (75% win-rate séries stables), Hurdle+ (ML-enhanced)',
              'Foundation : TimeGPT (zero-shot, court historique), EnsembleTop2',
              'Sélection automatique du champion par cross-validation temporelle',
            ]}
          />

          <FeatureSection
            colors={colors}
            title="Backtesting Multi-Fold"
            description="Chaque forecast est validé par cross-validation temporelle (jusqu'à 5 folds pour classe A). Mécanisme de Gating : évite de recalculer si les données n'ont pas significativement changé."
            benefits={[
              'Métriques : WAPE (principale), SMAPE, MAPE, MASE, Bias, MAE, RMSE',
              'Gating : 60-70% plus rapide sur séries stables (runs récurrents)',
              'Détection de drift automatique entre les runs',
              'Intervalle de confiance 80% calibré sur l\'historique',
            ]}
          />

          <FeatureSection
            colors={colors}
            title="6 Artifacts & Synthèse LLM"
            description="Export complet pour audit et intégration ERP/BI. Rapport exécutif généré par Claude API traduit les résultats techniques en insights business actionnables."
            benefits={[
              'forecast.csv : prévisions point + intervalles de confiance',
              'metrics.json : 10+ métriques par série',
              'model_registry.json : champion + audit trail complet',
              'insights.json + run_manifest.json + synthèse LLM (2-3 paragraphes)',
            ]}
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <Button colors={colors} variant="primary" size="large" onClick={() => navigateTo('dashboard')}>
            Essayer gratuitement
            <ArrowRight size={20} style={{ marginLeft: 8 }} />
          </Button>
        </div>
      </div>
    </section>
  );
}

// ==============================================
// LOGIN PAGE
// ==============================================
function LoginPage({ colors, navigateTo }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        backgroundColor: colors.bgSecondary,
        borderRadius: 16,
        border: `1px solid ${colors.border}`,
        padding: 40,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <LumenIQLogo colors={colors} size={48} />
          <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: 14 }}>
            {isLogin ? 'Accédez à votre dashboard LumenIQ' : 'Commencez votre essai gratuit de 3 mois'}
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); navigateTo('dashboard'); }}>
          {!isLogin && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                Nom complet
              </label>
              <input
                type="text"
                placeholder="Jean Dupont"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: colors.bgSurface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                  color: colors.textPrimary,
                  fontSize: 14,
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
              Email
            </label>
            <input
              type="email"
              placeholder="vous@entreprise.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: colors.bgSurface,
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                color: colors.textPrimary,
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: colors.bgSurface,
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                color: colors.textPrimary,
                fontSize: 14,
              }}
            />
          </div>

          <Button colors={colors} variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
            {isLogin ? 'Se connecter' : 'Créer mon compte'}
          </Button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: colors.accent,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </div>
    </section>
  );
}

// ==============================================
// APP DASHBOARD (SaaS)
// ==============================================
function AppDashboard({ colors, theme, toggleTheme, currentPage, navigateTo, setIsAuthenticated }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarCollapsed ? 72 : 260,
        backgroundColor: colors.bgSecondary,
        borderRight: `1px solid ${colors.border}`,
        padding: '20px 12px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 12px',
          marginBottom: 32,
        }}>
          <LumenIQLogo colors={colors} size={32} />
          {!sidebarCollapsed && (
            <span style={{ fontSize: 18, fontWeight: 700 }}>LumenIQ</span>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          <SidebarLink
            colors={colors}
            icon={<BarChart3 size={20} />}
            label="Dashboard"
            active={currentPage === 'dashboard'}
            collapsed={sidebarCollapsed}
            onClick={() => navigateTo('dashboard')}
          />
          <SidebarLink
            colors={colors}
            icon={<Upload size={20} />}
            label="Nouveau forecast"
            active={currentPage === 'forecast'}
            collapsed={sidebarCollapsed}
            onClick={() => navigateTo('forecast')}
          />
          <SidebarLink
            colors={colors}
            icon={<TrendingUp size={20} />}
            label="Résultats"
            active={currentPage === 'results'}
            collapsed={sidebarCollapsed}
            onClick={() => navigateTo('results')}
          />
          <SidebarLink
            colors={colors}
            icon={<Clock size={20} />}
            label="Historique"
            active={currentPage === 'history'}
            collapsed={sidebarCollapsed}
            onClick={() => navigateTo('history')}
          />
          <SidebarLink
            colors={colors}
            icon={<Settings size={20} />}
            label="Paramètres"
            active={currentPage === 'settings'}
            collapsed={sidebarCollapsed}
            onClick={() => navigateTo('settings')}
          />
        </nav>

        {/* Bottom Actions */}
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 16 }}>
          <SidebarLink
            colors={colors}
            icon={theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            label={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            collapsed={sidebarCollapsed}
            onClick={toggleTheme}
          />
          <SidebarLink
            colors={colors}
            icon={<LogOut size={20} />}
            label="Déconnexion"
            collapsed={sidebarCollapsed}
            onClick={() => setIsAuthenticated(false)}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Top Bar */}
        <header style={{
          padding: '16px 32px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.bgPrimary,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              color: colors.textSecondary,
              cursor: 'pointer',
              padding: 8,
            }}
          >
            <Menu size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              padding: '6px 12px',
              backgroundColor: colors.accentMuted,
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              color: colors.accent,
            }}>
              Plan Standard • 12/50 séries
            </div>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: colors.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 600,
            }}>
              JD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: 32 }}>
          {currentPage === 'dashboard' && <DashboardPage colors={colors} navigateTo={navigateTo} />}
          {currentPage === 'forecast' && <ForecastPage colors={colors} navigateTo={navigateTo} />}
          {currentPage === 'results' && <ResultsPage colors={colors} />}
          {currentPage === 'history' && <HistoryPage colors={colors} navigateTo={navigateTo} />}
          {currentPage === 'settings' && <SettingsPage colors={colors} />}
        </div>
      </main>
    </div>
  );
}

// ==============================================
// DASHBOARD PAGE
// ==============================================
function DashboardPage({ colors, navigateTo }) {
  return (
    <div className="animate-fade">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
        <p style={{ color: colors.textSecondary }}>Vue d'ensemble de votre activité forecast</p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        <StatCard colors={colors} label="Séries ce mois" value="12" subtext="/ 50 disponibles" icon={<BarChart3 size={20} />} />
        <StatCard colors={colors} label="Forecasts" value="4" subtext="ce mois" icon={<TrendingUp size={20} />} />
        <StatCard colors={colors} label="SMAPE moyen" value="8.9%" subtext="excellente précision" icon={<Target size={20} />} positive />
        <StatCard colors={colors} label="Prochain reset" value="16j" subtext="quota mensuel" icon={<Clock size={20} />} />
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Recent Forecasts */}
        <div style={{
          backgroundColor: colors.bgSecondary,
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          padding: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Derniers forecasts</h2>
            <button
              onClick={() => navigateTo('history')}
              style={{
                background: 'none',
                border: 'none',
                color: colors.accent,
                cursor: 'pointer',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Voir tout <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentForecasts.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 16,
                  backgroundColor: colors.bgSurface,
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.bgHover}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.bgSurface}
                onClick={() => navigateTo('results')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: colors.accentMuted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <FileText size={18} color={colors.accent} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</p>
                    <p style={{ color: colors.textMuted, fontSize: 12 }}>{item.date} • {item.series} séries</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: colors.success + '20',
                    color: colors.success,
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    SMAPE {item.smape}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            backgroundColor: colors.bgSecondary,
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            padding: 24,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Actions rapides</h2>
            <Button
              colors={colors}
              variant="primary"
              style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
              onClick={() => navigateTo('forecast')}
            >
              <Upload size={18} style={{ marginRight: 8 }} />
              Nouveau forecast
            </Button>
            <Button colors={colors} variant="secondary" style={{ width: '100%', justifyContent: 'center' }}>
              <FileText size={18} style={{ marginRight: 8 }} />
              Documentation
            </Button>
          </div>

          <div style={{
            backgroundColor: colors.bgSecondary,
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            padding: 24,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Performance modèles</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {modelPerformance.slice(0, 4).map(m => (
                <div key={m.model} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13 }}>{m.model}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: colors.textMuted }}>{m.series} séries</span>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: m.smape < 8 ? colors.success : m.smape < 10 ? colors.warning : colors.textPrimary
                    }}>
                      {m.smape}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// FORECAST PAGE (Mode Express)
// ==============================================
function ForecastPage({ colors, navigateTo }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer?.files[0] || e.target.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setStep(2);
    }
  };

  const startForecast = () => {
    setStep(3);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setStep(4);
        }, 500);
      }
      setProgress(p);
    }, 400);
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Nouveau forecast</h1>
        <p style={{ color: colors.textSecondary }}>Mode Express — Upload, configuration automatique, résultats en 5 min</p>
      </div>

      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 40,
        padding: 20,
        backgroundColor: colors.bgSecondary,
        borderRadius: 12,
        border: `1px solid ${colors.border}`,
      }}>
        {['Upload', 'Configuration', 'Calcul', 'Résultats'].map((s, i) => (
          <React.Fragment key={s}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: step > i ? 1 : 0.4,
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: step > i ? colors.accent : colors.bgSurface,
                border: step === i + 1 ? `2px solid ${colors.accent}` : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 600,
                color: step > i ? 'white' : colors.textMuted,
              }}>
                {step > i + 1 ? <Check size={14} /> : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
            </div>
            {i < 3 && <div style={{ flex: 1, height: 2, backgroundColor: step > i + 1 ? colors.accent : colors.border }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            backgroundColor: isDragging ? colors.accentMuted : colors.bgSecondary,
            borderRadius: 16,
            border: `2px dashed ${isDragging ? colors.accent : colors.border}`,
            padding: 80,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".csv,.xlsx"
            style={{ display: 'none' }}
            onChange={handleDrop}
          />
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: colors.accentMuted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <Upload size={36} color={colors.accent} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
            Glissez votre fichier ici
          </h2>
          <p style={{ color: colors.textSecondary, marginBottom: 16 }}>
            ou cliquez pour parcourir
          </p>
          <p style={{ color: colors.textMuted, fontSize: 13 }}>
            Formats acceptés : CSV, XLSX • Max 50 MB
          </p>
        </div>
      )}

      {step === 2 && (
        <div style={{
          backgroundColor: colors.bgSecondary,
          borderRadius: 16,
          border: `1px solid ${colors.border}`,
          padding: 32,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: colors.success + '20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Check size={24} color={colors.success} />
            </div>
            <div>
              <p style={{ fontWeight: 600 }}>{file?.name || 'fichier.csv'}</p>
              <p style={{ color: colors.textMuted, fontSize: 13 }}>Fichier validé • Configuration automatique détectée</p>
            </div>
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Configuration détectée</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            <ConfigItem colors={colors} label="Fréquence" value="Hebdomadaire" />
            <ConfigItem colors={colors} label="Séries détectées" value="47" />
            <ConfigItem colors={colors} label="Historique" value="104 semaines" />
            <ConfigItem colors={colors} label="Saisonnalité" value="Oui (52 périodes)" />
            <ConfigItem colors={colors} label="Horizon forecast" value="12 semaines" />
            <ConfigItem colors={colors} label="Routing" value="ABC/XYZ auto" />
          </div>

          <div style={{
            padding: 16,
            backgroundColor: colors.bgSurface,
            borderRadius: 8,
            marginBottom: 24,
            borderLeft: `3px solid ${colors.accent}`,
          }}>
            <p style={{ fontSize: 13, color: colors.textSecondary }}>
              <strong style={{ color: colors.textPrimary }}>Mode Express activé :</strong> Configuration
              optimale détectée automatiquement. Jusqu'à 21 modèles seront testés selon la classe ABC, avec backtesting multi-fold.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Button colors={colors} variant="secondary" onClick={() => setStep(1)}>
              Retour
            </Button>
            <Button colors={colors} variant="primary" onClick={startForecast}>
              Lancer le forecast
              <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{
          backgroundColor: colors.bgSecondary,
          borderRadius: 16,
          border: `1px solid ${colors.border}`,
          padding: 60,
          textAlign: 'center',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: colors.accentMuted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <Loader2 size={36} color={colors.accent} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Calcul en cours...</h2>
          <p style={{ color: colors.textSecondary, marginBottom: 32 }}>
            Test de 21 modèles avec backtesting multi-fold et routing ABC/XYZ
          </p>

          <div style={{
            maxWidth: 400,
            margin: '0 auto',
            backgroundColor: colors.bgSurface,
            borderRadius: 100,
            height: 12,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: colors.accent,
              borderRadius: 100,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <p style={{ color: colors.textMuted, fontSize: 13, marginTop: 12 }}>
            {Math.round(progress)}% — Estimation : {Math.max(1, Math.round((100 - progress) / 20))} min restantes
          </p>
        </div>
      )}

      {step === 4 && (
        <div style={{
          backgroundColor: colors.bgSecondary,
          borderRadius: 16,
          border: `1px solid ${colors.border}`,
          padding: 60,
          textAlign: 'center',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: colors.success + '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <Check size={36} color={colors.success} />
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Forecast terminé !</h2>
          <p style={{ color: colors.textSecondary, marginBottom: 32 }}>
            47 séries analysées • SMAPE moyen : 8.2%
          </p>

          <Button colors={colors} variant="primary" size="large" onClick={() => navigateTo('results')}>
            Voir les résultats
            <ArrowRight size={20} style={{ marginLeft: 8 }} />
          </Button>
        </div>
      )}
    </div>
  );
}

// ==============================================
// RESULTS PAGE
// ==============================================
function ResultsPage({ colors }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Résultats forecast</h1>
          <p style={{ color: colors.textSecondary }}>Q1_2025_Products.csv • 47 séries • 15 Jan 2025</p>
        </div>
        <Button colors={colors} variant="primary">
          <Download size={18} style={{ marginRight: 8 }} />
          Télécharger ZIP
        </Button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginBottom: 24,
        backgroundColor: colors.bgSecondary,
        padding: 4,
        borderRadius: 10,
        width: 'fit-content',
      }}>
        {['overview', 'charts', 'classification', 'synthesis'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === tab ? colors.bgSurface : 'transparent',
              border: 'none',
              borderRadius: 8,
              color: activeTab === tab ? colors.textPrimary : colors.textSecondary,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {tab === 'overview' && 'Vue d\'ensemble'}
            {tab === 'charts' && 'Graphiques'}
            {tab === 'classification' && 'Classification'}
            {tab === 'synthesis' && 'Synthèse IA'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
            <MetricCard colors={colors} label="SMAPE" value="8.2%" description="Symmetric Mean Absolute Percentage Error" status="excellent" />
            <MetricCard colors={colors} label="WAPE" value="7.8%" description="Weighted Absolute Percentage Error" status="excellent" />
            <MetricCard colors={colors} label="MAPE" value="12.4%" description="Mean Absolute Percentage Error" status="good" />
            <MetricCard colors={colors} label="Couverture" value="94%" description="Observations dans l'intervalle de confiance" status="excellent" />
          </div>

          {/* Main Chart */}
          <div style={{
            backgroundColor: colors.bgSecondary,
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            padding: 24,
            marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Forecast agrégé (somme toutes séries)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorForecastArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis dataKey="date" stroke={colors.textMuted} fontSize={11} tickLine={false} />
                <YAxis stroke={colors.textMuted} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.bgSurface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="upper" stroke="none" fill={colors.accentMuted} name="IC sup" />
                <Area type="monotone" dataKey="lower" stroke="none" fill={colors.bgSecondary} name="IC inf" />
                <Line type="monotone" dataKey="actual" stroke={colors.textSecondary} strokeWidth={2} dot={false} name="Historique" />
                <Line type="monotone" dataKey="forecast" stroke={colors.accent} strokeWidth={3} dot={false} name="Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Model Champions */}
          <div style={{
            backgroundColor: colors.bgSecondary,
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            padding: 24,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Modèles champions par série</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={modelPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis dataKey="model" stroke={colors.textMuted} fontSize={11} />
                <YAxis stroke={colors.textMuted} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.bgSurface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="series" fill={colors.accent} radius={[4, 4, 0, 0]} name="Nb séries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Classification Tab */}
      {activeTab === 'classification' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{
            backgroundColor: colors.bgSecondary,
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            padding: 24,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Classification ABC</h3>
            <p style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 20 }}>
              Distribution des produits par contribution au chiffre d'affaires
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={abcDistribution} layout="vertical">
                <XAxis type="number" stroke={colors.textMuted} fontSize={11} />
                <YAxis dataKey="name" type="category" stroke={colors.textMuted} fontSize={12} width={30} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.bgSurface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {abcDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16 }}>
              {abcDistribution.map(item => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: item.color }} />
                  <span style={{ fontSize: 13 }}>{item.name} : {item.label} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: colors.bgSecondary,
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            padding: 24,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Matrice ABC/XYZ</h3>
            <p style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 20 }}>
              Croisement valeur × volatilité pour allocation compute
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
              <div />
              {['X', 'Y', 'Z'].map(col => (
                <div key={col} style={{ textAlign: 'center', padding: 8, fontWeight: 600, fontSize: 12 }}>{col}</div>
              ))}
              {['A', 'B', 'C'].map(row => (
                <React.Fragment key={row}>
                  <div style={{ padding: 8, fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center' }}>{row}</div>
                  {['X', 'Y', 'Z'].map(col => {
                    const value = Math.floor(Math.random() * 10) + 1;
                    const intensity = row === 'A' ? (col === 'X' ? 1 : col === 'Y' ? 0.7 : 0.4) :
                      row === 'B' ? (col === 'X' ? 0.6 : col === 'Y' ? 0.4 : 0.2) :
                        (col === 'X' ? 0.3 : col === 'Y' ? 0.2 : 0.1);
                    return (
                      <div
                        key={col}
                        style={{
                          backgroundColor: `rgba(79, 91, 213, ${intensity})`,
                          borderRadius: 6,
                          padding: 16,
                          textAlign: 'center',
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {value}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: 12, backgroundColor: colors.bgSurface, borderRadius: 8 }}>
              <p style={{ fontSize: 12, color: colors.textSecondary }}>
                <strong style={{ color: colors.textPrimary }}>AX/AY :</strong> Modèles sophistiqués (AutoARIMA, ETS) •
                <strong style={{ color: colors.textPrimary }}> CZ :</strong> Modèles rapides (Naive, SMA)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Synthesis Tab */}
      {activeTab === 'synthesis' && (
        <div style={{
          backgroundColor: colors.bgSecondary,
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          padding: 32,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: colors.accentMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Brain size={20} color={colors.accent} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Synthèse IA</h3>
              <p style={{ color: colors.textMuted, fontSize: 12 }}>Générée par Claude AI</p>
            </div>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: colors.bgSurface,
            borderRadius: 12,
            borderLeft: `4px solid ${colors.accent}`,
            lineHeight: 1.8,
          }}>
            <p style={{ marginBottom: 16 }}>
              <strong>Vue d'ensemble :</strong> L'analyse de vos 47 séries de données révèle une précision
              de prévision excellente (SMAPE 8.2%), positionnant vos forecasts dans le top 10% des
              performances industrielles typiques. La couverture de 94% des intervalles de confiance
              indique une calibration statistique fiable.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong>Insights clés :</strong> Une saisonnalité hebdomadaire marquée a été détectée
              sur 12 produits de classe A, représentant 78% de votre chiffre d'affaires. Le modèle
              AutoARIMA s'est imposé comme champion sur ces références stratégiques. Les produits
              de longue traîne (classe C) présentent une volatilité plus élevée mais un impact
              business limité.
            </p>
            <p>
              <strong>Recommandations :</strong> Augmentez vos stocks de 15% sur les références
              SKU-2847 et SKU-3921 pour la période février-mars (pic saisonnier détecté).
              Surveillez particulièrement les 3 séries à coefficient de variation {'>'}50% qui
              pourraient nécessiter une approche forecast distincte.
            </p>
          </div>

          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <Button colors={colors} variant="secondary">
              Copier le texte
            </Button>
            <Button colors={colors} variant="secondary">
              Exporter en PDF
            </Button>
          </div>
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div style={{
          backgroundColor: colors.bgSecondary,
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          padding: 24,
        }}>
          <p style={{ color: colors.textSecondary, textAlign: 'center', padding: 60 }}>
            Sélectionnez une série dans la liste pour afficher son graphique détaillé
          </p>
        </div>
      )}
    </div>
  );
}

// ==============================================
// HISTORY PAGE
// ==============================================
function HistoryPage({ colors, navigateTo }) {
  return (
    <div className="animate-fade">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Historique</h1>
        <p style={{ color: colors.textSecondary }}>Tous vos forecasts passés</p>
      </div>

      <div style={{
        backgroundColor: colors.bgSecondary,
        borderRadius: 12,
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Fichier</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Séries</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>SMAPE</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentForecasts.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.bgSurface}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <FileText size={18} color={colors.textMuted} />
                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', color: colors.textSecondary }}>{item.date}</td>
                <td style={{ padding: '16px 20px' }}>{item.series}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: colors.success + '20',
                    color: colors.success,
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    {item.smape}%
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button colors={colors} variant="ghost" size="small" onClick={() => navigateTo('results')}>
                      Voir
                    </Button>
                    <Button colors={colors} variant="ghost" size="small">
                      <Download size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==============================================
// SETTINGS PAGE
// ==============================================
function SettingsPage({ colors }) {
  return (
    <div className="animate-fade">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Paramètres</h1>
        <p style={{ color: colors.textSecondary }}>Gérez votre compte et vos préférences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Profile */}
        <div style={{
          backgroundColor: colors.bgSecondary,
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          padding: 24,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Profil</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: colors.textSecondary }}>
                Nom complet
              </label>
              <input
                type="text"
                defaultValue="Jean Dupont"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: colors.bgSurface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                  color: colors.textPrimary,
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: colors.textSecondary }}>
                Email
              </label>
              <input
                type="email"
                defaultValue="jean@entreprise.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: colors.bgSurface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                  color: colors.textPrimary,
                  fontSize: 14,
                }}
              />
            </div>
            <Button colors={colors} variant="primary" style={{ alignSelf: 'flex-start' }}>
              Sauvegarder
            </Button>
          </div>
        </div>

        {/* Subscription */}
        <div style={{
          backgroundColor: colors.bgSecondary,
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          padding: 24,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Abonnement</h3>
          <div style={{
            padding: 20,
            backgroundColor: colors.accentMuted,
            borderRadius: 10,
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 600 }}>Plan Standard</span>
              <span style={{ fontSize: 24, fontWeight: 700 }}>€99<span style={{ fontSize: 14, fontWeight: 400 }}>/mois</span></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: colors.textSecondary }}>
              <span>Séries utilisées ce mois</span>
              <span>12 / 50</span>
            </div>
            <div style={{
              marginTop: 12,
              height: 6,
              backgroundColor: colors.bgSurface,
              borderRadius: 100,
              overflow: 'hidden',
            }}>
              <div style={{ width: '24%', height: '100%', backgroundColor: colors.accent, borderRadius: 100 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button colors={colors} variant="secondary">
              Gérer la facturation
            </Button>
            <Button colors={colors} variant="ghost">
              Passer à ML
            </Button>
          </div>
        </div>

        {/* Preferences */}
        <div style={{
          backgroundColor: colors.bgSecondary,
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          padding: 24,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Préférences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: 14 }}>Notifications email</p>
                <p style={{ color: colors.textMuted, fontSize: 12 }}>Recevoir les alertes par email</p>
              </div>
              <ToggleSwitch colors={colors} defaultChecked />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: 14 }}>Rapport hebdomadaire</p>
                <p style={{ color: colors.textMuted, fontSize: 12 }}>Résumé de vos forecasts chaque lundi</p>
              </div>
              <ToggleSwitch colors={colors} />
            </div>
          </div>
        </div>

        {/* API (Foundation) */}
        <div style={{
          backgroundColor: colors.bgSecondary,
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          padding: 24,
          opacity: 0.6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>API</h3>
            <span style={{
              padding: '2px 8px',
              backgroundColor: '#F59E0B20',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 600,
              color: '#F59E0B',
            }}>FOUNDATION</span>
          </div>
          <p style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 16 }}>
            Passez au plan Foundation pour accéder à l'API REST et automatiser vos forecasts.
          </p>
          <Button colors={colors} variant="secondary" disabled>
            Débloquer l'API
          </Button>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// COMPONENTS
// ==============================================

// Logo Component
function LumenIQLogo({ colors, size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <polygon
        points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5"
        fill="none"
        stroke={colors.accent}
        strokeWidth="6"
      />
      <polygon
        points="50,20 78.7,35 78.7,65 50,80 21.3,65 21.3,35"
        fill={colors.accent}
        opacity="0.3"
      />
      <polygon
        points="50,35 64.4,42.5 64.4,57.5 50,65 35.6,57.5 35.6,42.5"
        fill={colors.accent}
      />
    </svg>
  );
}

// Button Component
function Button({ colors, variant = 'primary', size = 'medium', children, onClick, style, disabled }) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: 8,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    opacity: disabled ? 0.5 : 1,
  };

  const variants = {
    primary: {
      backgroundColor: colors.accent,
      color: '#FFFFFF',
      padding: size === 'large' ? '16px 28px' : size === 'small' ? '8px 12px' : '12px 20px',
      fontSize: size === 'large' ? 16 : size === 'small' ? 12 : 14,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: colors.textPrimary,
      border: `1px solid ${colors.border}`,
      padding: size === 'large' ? '16px 28px' : size === 'small' ? '8px 12px' : '12px 20px',
      fontSize: size === 'large' ? 16 : size === 'small' ? 12 : 14,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.textSecondary,
      padding: size === 'large' ? '16px 28px' : size === 'small' ? '6px 10px' : '12px 20px',
      fontSize: size === 'large' ? 16 : size === 'small' ? 12 : 14,
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...baseStyle, ...variants[variant], ...style }}
      onMouseOver={(e) => {
        if (!disabled) {
          if (variant === 'primary') e.currentTarget.style.backgroundColor = colors.accentHover;
          if (variant === 'secondary') e.currentTarget.style.backgroundColor = colors.bgSurface;
          if (variant === 'ghost') e.currentTarget.style.color = colors.textPrimary;
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          if (variant === 'primary') e.currentTarget.style.backgroundColor = colors.accent;
          if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'transparent';
          if (variant === 'ghost') e.currentTarget.style.color = colors.textSecondary;
        }
      }}
    >
      {children}
    </button>
  );
}

// Nav Link
function NavLink({ colors, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        color: colors.textSecondary,
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 500,
        transition: 'color 0.2s',
        fontFamily: 'inherit',
      }}
      onMouseOver={(e) => e.currentTarget.style.color = colors.textPrimary}
      onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
    >
      {children}
    </button>
  );
}

// Trust Badge
function TrustBadge({ colors, icon, value, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ color: colors.accent }}>{icon}</div>
      <div>
        <p style={{ fontSize: 18, fontWeight: 700 }}>{value}</p>
        <p style={{ fontSize: 12, color: colors.textMuted }}>{label}</p>
      </div>
    </div>
  );
}

// Metric Mini
function MetricMini({ colors, label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 600 }}>{value}</p>
    </div>
  );
}

// Comparison Card
function ComparisonCard({ colors, title, subtitle, items, badge, badgeColor, highlight }) {
  return (
    <div style={{
      backgroundColor: highlight ? colors.accentMuted : colors.bgSurface,
      borderRadius: 16,
      border: highlight ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
      padding: 28,
      position: 'relative',
    }}>
      {highlight && (
        <div style={{
          position: 'absolute',
          top: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: colors.accent,
          color: '#FFF',
          padding: '4px 12px',
          borderRadius: 100,
          fontSize: 11,
          fontWeight: 600,
        }}>
          RECOMMANDÉ
        </div>
      )}
      <span style={{
        display: 'inline-block',
        padding: '4px 10px',
        backgroundColor: badgeColor + '20',
        color: badgeColor,
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        marginBottom: 16,
      }}>
        {badge}
      </span>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{title}</h3>
      <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 20 }}>{subtitle}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {item.good ? (
              <Check size={16} color={colors.success} />
            ) : item.bad ? (
              <X size={16} color={colors.danger} />
            ) : null}
            <span style={{ fontSize: 13, color: colors.textSecondary }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Feature Card
function FeatureCard({ colors, icon, title, description, children }) {
  return (
    <div style={{
      backgroundColor: colors.bgSecondary,
      borderRadius: 16,
      border: `1px solid ${colors.border}`,
      padding: 28,
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: colors.accentMuted,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        color: colors.accent,
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
      <p style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 1.6 }}>{description}</p>
      {children}
    </div>
  );
}

// Step Card
function StepCard({ colors, number, title, description }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: colors.accentMuted,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        fontSize: 24,
        fontWeight: 700,
        color: colors.accent,
      }}>
        {number}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}

// Pricing Card
function PricingCard({ colors, name, price, description, features, popular, badge, badgeColor, ctaText, onClick, icon }) {
  const getBadgeStyle = () => {
    if (badge === 'BEST VALUE') return { bg: colors.success, text: '#FFF' };
    if (badge === 'PREMIUM') return { bg: '#F59E0B', text: '#FFF' };
    return { bg: colors.accent, text: '#FFF' };
  };
  const badgeStyle = getBadgeStyle();
  
  return (
    <div style={{
      backgroundColor: colors.bgSecondary,
      borderRadius: 16,
      border: popular ? `2px solid ${colors.accent}` : badge === 'PREMIUM' ? `2px solid #F59E0B` : `1px solid ${colors.border}`,
      padding: 32,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {(popular || badge) && (
        <div style={{
          position: 'absolute',
          top: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: badge ? badgeStyle.bg : colors.accent,
          color: badgeStyle.text,
          padding: '6px 16px',
          borderRadius: 100,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.5px',
          whiteSpace: 'nowrap',
        }}>
          {badge || 'PLUS POPULAIRE'}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        {icon && (
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: colors.accentMuted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: badge === 'PREMIUM' ? '#F59E0B' : colors.accent,
          }}>
            {icon}
          </div>
        )}
        <h3 style={{ fontSize: 24, fontWeight: 700 }}>{name}</h3>
      </div>
      <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 20, minHeight: 42 }}>{description}</p>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 44, fontWeight: 800 }}>€{price}</span>
        <span style={{ color: colors.textMuted, fontSize: 16 }}>/mois</span>
      </div>
      <Button
        colors={colors}
        variant={popular || badge === 'BEST VALUE' ? 'primary' : 'secondary'}
        style={{ width: '100%', justifyContent: 'center', marginBottom: 24 }}
        onClick={onClick}
      >
        {ctaText}
      </Button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Check size={16} color={colors.success} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: colors.textSecondary }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// FAQ Item
function FAQItem({ colors, question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      backgroundColor: colors.bgSecondary,
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: 20,
          background: 'none',
          border: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          color: colors.textPrimary,
          fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, textAlign: 'left' }}>{question}</span>
        <ChevronDown
          size={20}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s',
            color: colors.textMuted,
          }}
        />
      </button>
      {open && (
        <div style={{ padding: '0 20px 20px' }}>
          <p style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 1.7 }}>{answer}</p>
        </div>
      )}
    </div>
  );
}

// Feature Section
function FeatureSection({ colors, title, description, benefits }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
      <div>
        <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>{title}</h3>
        <p style={{ color: colors.textSecondary, fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>{description}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
              <Check size={18} color={colors.success} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: colors.textSecondary }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{
        backgroundColor: colors.bgSecondary,
        borderRadius: 16,
        border: `1px solid ${colors.border}`,
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 120,
          height: 120,
          borderRadius: 20,
          backgroundColor: colors.accentMuted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <BarChart3 size={48} color={colors.accent} />
        </div>
      </div>
    </div>
  );
}

// Footer
function Footer({ colors }) {
  return (
    <footer style={{
      backgroundColor: colors.bgSecondary,
      borderTop: `1px solid ${colors.border}`,
      padding: '60px 24px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 60, marginBottom: 60 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <LumenIQLogo colors={colors} size={32} />
              <span style={{ fontSize: 20, fontWeight: 700 }}>LumenIQ</span>
            </div>
            <p style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              Moteur de prévision professionnel pour PME e-commerce.
              Forecasts validés par backtesting, en 5 minutes.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: 16 }}>Produit</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <FooterLink colors={colors}>Features</FooterLink>
              <FooterLink colors={colors}>Pricing</FooterLink>
              <FooterLink colors={colors}>Documentation</FooterLink>
              <FooterLink colors={colors}>API</FooterLink>
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: 16 }}>Entreprise</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <FooterLink colors={colors}>Blog</FooterLink>
              <FooterLink colors={colors}>Contact</FooterLink>
              <FooterLink colors={colors}>À propos</FooterLink>
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: 16 }}>Légal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <FooterLink colors={colors}>Mentions légales</FooterLink>
              <FooterLink colors={colors}>Confidentialité</FooterLink>
              <FooterLink colors={colors}>CGU</FooterLink>
            </div>
          </div>
        </div>
        <div style={{
          borderTop: `1px solid ${colors.border}`,
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <p style={{ color: colors.textMuted, fontSize: 13 }}>
            © 2026 LumenIQ. Tous droits réservés.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" style={{ color: colors.textMuted }}>
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Footer Link
function FooterLink({ colors, children }) {
  return (
    <a
      href="#"
      style={{
        color: colors.textSecondary,
        textDecoration: 'none',
        fontSize: 14,
        transition: 'color 0.2s',
      }}
      onMouseOver={(e) => e.currentTarget.style.color = colors.textPrimary}
      onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
    >
      {children}
    </a>
  );
}

// Sidebar Link
function SidebarLink({ colors, icon, label, active, collapsed, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: collapsed ? '12px' : '12px 16px',
        backgroundColor: active ? colors.accentMuted : 'transparent',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        color: active ? colors.accent : colors.textSecondary,
        marginBottom: 4,
        transition: 'all 0.2s',
        justifyContent: collapsed ? 'center' : 'flex-start',
        fontFamily: 'inherit',
      }}
      onMouseOver={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = colors.bgSurface;
      }}
      onMouseOut={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {icon}
      {!collapsed && <span style={{ fontSize: 14, fontWeight: active ? 600 : 400 }}>{label}</span>}
    </button>
  );
}

// Stat Card
function StatCard({ colors, label, value, subtext, icon, positive }) {
  return (
    <div style={{
      backgroundColor: colors.bgSecondary,
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      padding: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
        <span style={{ color: colors.textMuted, fontSize: 13 }}>{label}</span>
        <div style={{ color: colors.textMuted }}>{icon}</div>
      </div>
      <p style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, color: positive ? colors.success : colors.textPrimary }}>{value}</p>
      <p style={{ color: colors.textMuted, fontSize: 12 }}>{subtext}</p>
    </div>
  );
}

// Metric Card
function MetricCard({ colors, label, value, description, status }) {
  const statusColors = {
    excellent: colors.success,
    good: colors.warning,
    poor: colors.danger,
  };

  return (
    <div style={{
      backgroundColor: colors.bgSecondary,
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      padding: 20,
    }}>
      <p style={{ color: colors.textMuted, fontSize: 12, marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: statusColors[status] }}>{value}</p>
      <p style={{ color: colors.textMuted, fontSize: 11 }}>{description}</p>
    </div>
  );
}

// Config Item
function ConfigItem({ colors, label, value }) {
  return (
    <div style={{
      padding: 16,
      backgroundColor: colors.bgSurface,
      borderRadius: 8,
    }}>
      <p style={{ color: colors.textMuted, fontSize: 11, marginBottom: 4 }}>{label}</p>
      <p style={{ fontWeight: 600, fontSize: 14 }}>{value}</p>
    </div>
  );
}

// Toggle Switch
function ToggleSwitch({ colors, defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked || false);

  return (
    <button
      onClick={() => setChecked(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: checked ? colors.accent : colors.bgSurface,
        border: `1px solid ${checked ? colors.accent : colors.border}`,
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.2s',
      }}
    >
      <div style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        backgroundColor: '#FFF',
        position: 'absolute',
        top: 2,
        left: checked ? 22 : 2,
        transition: 'left 0.2s',
      }} />
    </button>
  );
}
