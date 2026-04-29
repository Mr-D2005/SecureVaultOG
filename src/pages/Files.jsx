import React from 'react';
import { Download, Cloud, Eye, Trash2, HardDrive, FileKey, Unlock } from 'lucide-react';

const Files = () => {
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch('/api/encrypt/list');
        const data = await res.json();
        if (data.success) {
          setFiles(data.assets.map(a => ({
            id: a.id,
            name: a.target,
            date: new Date(a.createdAt).toLocaleDateString(),
            status: a.action === 'ENCRYPT_FILE' ? 'Encrypted File' : 'Sealed Msg',
            size: a.status, // Using status as a metadata field
            type: a.action,
            ciphertext: a.ciphertext,
            sealedKey: a.sealedKey,
            iv: a.iv
          })));
        }
      } catch (err) {
        console.error('Vault Fetch Failure:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const getStatusStyles = (status) => {
    if (status.includes('Sealed')) return { bg: 'var(--color-success-bg)', color: 'var(--color-primary)', border: 'rgba(57,255,20,0.2)' };
    return { bg: 'rgba(133,150,124,0.1)', color: 'var(--color-text-dim)', border: 'rgba(133,150,124,0.2)' };
  };

  return (
    <div style={{ padding: '2.5rem' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Secured Vault</h1>
          <p className="text-dim">Manage your encrypted assets and keys stored in the AWS RDS Ledger.</p>
        </div>
        <div className="card" style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Cloud size={18} color="var(--color-primary)" />
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>RDS Connected</span>
          <div className="status-orb status-orb--active"></div>
        </div>
      </header>

      {/* Storage Status */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <HardDrive size={20} color="var(--color-primary)" />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)' }}>Storage Status</span>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-text-dim)' }}>6.5GB / 10GB Secure Cloud</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'var(--color-surface-container-lowest)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--color-primary-fixed), var(--color-primary-container))', width: '65%', borderRadius: '2px' }}></div>
          </div>
        </div>
      </div>

      {/* File Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {loading ? (
          <div style={{ color: 'var(--color-primary)', textAlign: 'center', width: '100%' }}>Scanning Records...</div>
        ) : files.map(file => {
          const statusStyle = getStatusStyles(file.status);
          return (
            <div key={file.id} className="card" style={{
              display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0,
            }}>
              <div style={{
                height: '160px',
                background: 'var(--color-surface-container-lowest)',
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileKey size={28} color="var(--color-text-dim)" opacity={0.3} />
                <div style={{
                  position: 'absolute', top: '0.75rem', right: '0.75rem',
                  padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)',
                  fontSize: '0.6875rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  background: statusStyle.bg, color: statusStyle.color,
                  border: `1px solid ${statusStyle.border}`,
                }}>
                  {file.status}
                </div>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h4 style={{ margin: '0 0 0.5rem 0', wordBreak: 'break-all', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>{file.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontFamily: 'monospace' }}>{file.date}</span>
                  <span>RDS_LEAD</span>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8125rem', border: '1px solid var(--color-success)', color: 'var(--color-primary)' }}
                    onClick={() => {
                        localStorage.setItem('sv_pending_decrypt', JSON.stringify({
                            ciphertext: file.ciphertext,
                            sealedKey: file.sealedKey,
                            iv: file.iv,
                            assetId: file.id,
                            assetName: file.name
                        }));
                        window.location.hash = '#/decrypt';
                    }}
                  >
                    <Unlock size={14} /> Unseal Asset
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Files;
