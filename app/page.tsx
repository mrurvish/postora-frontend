export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Welcome to Postora
        </h1>
        <p style={{ color: '#666' }}>
          Your completely fresh slate is ready!
        </p>
      </div>
    </div>
  );
}