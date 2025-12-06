import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const LeasePhotosForm = ({ leaseId, token, role, showTitle = true }) => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchPhotos = useCallback(async () => {
    if (!leaseId || isNaN(Number(leaseId))) {
      console.warn('⚠️ Skipping photo fetch: invalid leaseId', leaseId);
      return;
    }
    try {
      const res = await axios.get(`/api/lease-photos/${leaseId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setPhotos(res.data);
    } catch (err) {
      console.error('❌ Error fetching photos:', err.response?.data || err.message);
      setPhotos([]);
    }
  }, [leaseId, token]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      await axios.post(`/api/lease-photos/upload/${leaseId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFile(null);
      fetchPhotos();
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photoId) => {
    try {
      await axios.delete(`/api/lease-photos/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPhotos();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggleVisibility = async (photoId) => {
    try {
      await axios.patch(`/api/lease-photos/visibility/${photoId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPhotos();
    } catch (err) {
      console.error('Visibility toggle error:', err);
    }
  };

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  return (
    <div style={styles.card}>
      {showTitle && <h3 style={styles.sectionTitle}>Lease Photos</h3>}
      {role !== 'tenant' && (
        <form onSubmit={handleUpload} style={styles.form}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit" disabled={loading || !file}>
            {loading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      )}

      {photos.length === 0 ? (
        <p style={styles.empty}>📷 No lease photos available.</p>
      ) : (
        <div style={styles.photoGrid}>
          {photos
            .filter(p => role !== 'tenant' || p.is_visible_to_tenant)
            .map((p) => {
const photoUrl = `${backendUrl}${p.url.startsWith('/') ? p.url : '/' + p.url}`;              return (
                <figure key={p.id} style={styles.photoWrapper}>
                  <img
                    src={photoUrl}
                    alt={`Uploaded ${p.uploaded_at ? new Date(p.uploaded_at).toLocaleDateString() : 'N/A'}`}
                    style={styles.photo}
                    onClick={() => setPreviewUrl(photoUrl)}
                  />
                  <figcaption style={styles.caption}>
                    {p.uploaded_at ? `Uploaded ${new Date(p.uploaded_at).toLocaleDateString()}` : 'Upload date unknown'}
                  </figcaption>
                  {role !== 'tenant' && (
                    <div style={styles.controls}>
                      <label>
                        <input
                          type="checkbox"
                          checked={p.is_visible_to_tenant}
                          onChange={() => handleToggleVisibility(p.id)}
                        />
                        Visible to Tenant
                      </label>
                      <button onClick={() => handleDelete(p.id)} style={styles.deleteButton}>
                        Delete
                      </button>
                    </div>
                  )}
                </figure>
              );
            })}
        </div>
      )}

      {previewUrl && (
        <div style={styles.modalOverlay} onClick={() => setPreviewUrl(null)}>
          <img src={previewUrl} alt="Preview" style={styles.modalImage} />
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    marginBottom: '2.5rem',
    border: '1px solid #eee'
  },
  sectionTitle: {
    fontSize: '1.35rem',
    marginBottom: '1.25rem',
    color: '#222',
    borderBottom: '1px solid #ddd',
    paddingBottom: '0.5rem',
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '1.5rem'
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
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1.75rem'
  },
  photoWrapper: {
    textAlign: 'center',
    backgroundColor: '#fafafa',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
    border: '1px solid #eee'
  },
  photo: {
    width: '100%',
    height: 'auto',
    maxHeight: '160px',
    objectFit: 'cover',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s ease',
    cursor: 'pointer'
  },
  caption: {
    fontSize: '0.85rem',
    color: '#555',
    marginTop: '0.75rem'
  },
  controls: {
    marginTop: '0.75rem',
    fontSize: '0.85rem',
    color: '#444',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  deleteButton: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    cursor: 'pointer'
  },
  modalImage: {
    maxWidth: '90%',
    maxHeight: '90%',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  }
};

export default LeasePhotosForm;