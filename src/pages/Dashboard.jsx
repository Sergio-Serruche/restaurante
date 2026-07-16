import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="animate-fade-in">
      {/* Sección Hero */}
      <header style={styles.heroSection}>
        <div style={styles.heroContent}>
          <span style={styles.badge}>🍕 EXPERIENCIA GASTRONÓMICA DIGITAL</span>
          <h1 style={styles.heroTitle}>Disfruta de la comida que amas, sin esperas.</h1>
          <p style={styles.heroSubtitle}>
            Pide en línea desde tu mesa, prográmalo para recoger o recíbelo en la puerta de tu casa.
            Rápido, seguro y con acumulación de puntos estrella.
          </p>
          <div style={styles.heroButtons}>
            <Link to="/menu" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              Ver Carta y Ordenar 🍛
            </Link>
            <Link to="/registro" className="btn btn-outline" style={{ padding: '14px 28px', fontSize: '1.05rem', backgroundColor: 'white' }}>
              Crear una Cuenta
            </Link>
          </div>
        </div>
        <div style={styles.heroImageContainer}>
          <span style={{ fontSize: '10rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))' }}>🍳</span>
        </div>
      </header>

      {/* Características (Features) */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>¿Cómo funciona Restaurate?</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard} className="glass">
            <span style={styles.featureIcon}>📱</span>
            <h3>1. Explora el Menú</h3>
            <p>Accede al menú digital, filtra por categorías y elige platos tradicionales o hamburguesas exclusivas.</p>
          </div>

          <div style={styles.featureCard} className="glass">
            <span style={styles.featureIcon}>💳</span>
            <h3>2. Paga Fácil</h3>
            <p>Realiza tu pago 100% digital y seguro con tarjeta de crédito, débito o efectivo contra entrega.</p>
          </div>

          <div style={styles.featureCard} className="glass">
            <span style={styles.featureIcon}>⭐</span>
            <h3>3. Gana Puntos</h3>
            <p>Cada compra suma puntos de fidelidad estrella que podrás canjear por platos gratis o descuentos.</p>
          </div>
        </div>
      </section>

      {/* Banner de Promociones */}
      <section style={styles.promoSection} className="glass">
        <div style={{ flexGrow: 1 }}>
          <h2 style={{ color: '#FF6B35', fontSize: '2rem' }}>¡Martes de Lomo Saltado!</h2>
          <p style={{ margin: '10px 0 20px', color: '#78716C' }}>
            Usa tus puntos acumulados u obtén un 20% de descuento directo en nuestra especialidad criolla clásica hoy.
          </p>
          <Link to="/menu" className="btn btn-primary">Aprovechar Oferta</Link>
        </div>
        <span style={{ fontSize: '6rem' }}>🍛</span>
      </section>
    </div>
  );
};

const styles = {
  heroSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 20px',
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '40px',
    alignItems: 'center',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  badge: {
    backgroundColor: '#FFEFEA',
    color: '#FF6B35',
    padding: '6px 14px',
    borderRadius: '30px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    letterSpacing: '1px',
  },
  heroTitle: {
    fontSize: '3.6rem',
    lineHeight: 1.15,
    marginBottom: '18px',
  },
  heroSubtitle: {
    fontSize: '1.15rem',
    color: '#78716C',
    marginBottom: '32px',
    maxWidth: '550px',
  },
  heroButtons: {
    display: 'flex',
    gap: '15px',
  },
  heroImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuresSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px 80px',
  },
  sectionTitle: {
    fontSize: '2.2rem',
    textAlign: 'center',
    marginBottom: '40px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
  },
  featureCard: {
    padding: '30px',
    borderRadius: '18px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '2.5rem',
    backgroundColor: '#FAF9F6',
    padding: '12px',
    borderRadius: '16px',
    marginBottom: '18px',
  },
  promoSection: {
    maxWidth: '1200px',
    margin: '0 auto 80px',
    padding: '40px 60px',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '30px',
    boxShadow: '0 10px 15px -3px rgba(255, 107, 53, 0.05)',
  }
};

export default Dashboard;
