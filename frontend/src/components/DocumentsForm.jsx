import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentsForm = ({ leaseId, userId, role, showTitle = true }) => {  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [replace, setReplace] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!leaseId) return;
    const fetchDocs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/documents/${leaseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocs(res.data);
      } catch (err) {
        console.error('❌ Fetch error:', err);
      }
    };
    fetchDocs();
  }, [leaseId]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('lease_id', leaseId);
    formData.append('uploaded_by', userId);
    formData.append('replace', replace);
    formData.append('file', file);

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/documents/upload', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFile(null);
      setReplace(false);
      const res = await axios.get(`/api/documents/${leaseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocs(res.data);
    } catch (err) {
      console.error('❌ Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get(`/api/documents/${leaseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocs(res.data);
    } catch (err) {
      console.error('❌ Delete error:', err);
    }
  };

  const handleToggle = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/documents/visibility/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get(`/api/documents/${leaseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocs(res.data);
    } catch (err) {
      console.error('❌ Toggle error:', err);
    }
  };

  const visibleDocs = role === 'tenant'
    ? docs.filter(d => d.is_visible_to_tenant)
    : docs;

  return (
    <div style={styles.section}>
{showTitle && <h3 style={styles.title}>Lease Documents</h3>}
      {role !== 'tenant' && (
        <div style={styles.uploadBox}>
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={replace}
              onChange={e => setReplace(e.target.checked)}
            />
            Replace existing
          </label>
          <button onClick={handleUpload} disabled={loading} style={styles.uploadButton}>
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}

      <div style={styles.subCard}>
        {visibleDocs.length === 0 ? (
          <p style={styles.empty}>No documents uploaded yet.</p>
        ) : (
          <ul style={styles.list}>
            {visibleDocs.map(doc => (
              <li key={doc.document_id} style={styles.listItem}>
                <a
  href={`${process.env.REACT_APP_BACKEND_URL}/files/${doc.file_url.replace(/^files\//, '')}`}
  target="_blank"
  rel="noopener noreferrer"
  style={styles.docLink}
>
  📄 {doc.file_url.split('/').pop()}
</a>
                {role !== 'tenant' && (
                  <div style={styles.actions}>
                    <button onClick={() => handleDelete(doc.document_id)} style={styles.actionButton}>Delete</button>
                    <button onClick={() => handleToggle(doc.document_id)} style={styles.actionButton}>
                      {doc.is_visible_to_tenant ? 'Hide from tenant' : 'Show to tenant'}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  section: {
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid #eee'
  },
  title: {
    fontSize: '1.35rem',
    marginBottom: '1.25rem',
    color: '#222',
    borderBottom: '1px solid #ddd',
    paddingBottom: '0.5rem',
    fontWeight: '600'
  },
  uploadBox: {
    marginBottom: '1.5rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  checkboxLabel: {
    fontSize: '0.9rem',
    color: '#555'
  },
  uploadButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#0078D4',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  subCard: {
    backgroundColor: '#fafafa',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
    border: '1px solid #eee'
  },
  empty: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#fefefe',
    borderRadius: '8px',
    border: '1px dashed #ccc'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  listItem: {
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  docLink: {
    color: '#0078D4',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem'
  },
  actionButton: {
    background: '#eee',
    border: 'none',
    padding: '0.4rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem'
  }
};

export default DocumentsForm;