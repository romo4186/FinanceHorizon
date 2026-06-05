'use client';

import React, { useState } from 'react';
import { Compass, Plus, Edit2, Trash2, LogOut, CheckCircle, FileText, Calendar, Eye } from 'lucide-react';
import { adminLogin, adminLogout, upsertArticle, deleteArticle } from '@/app/actions/admin';
import { getWordCount } from '@/lib/utils';
import styles from './page.module.css';

interface ArticleData {
  id?: string;
  slug: string;
  category: string;
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  excerpt: string;
  content: string;
  imageUrl?: string | null;
  published: boolean;
  authorSlug: string;
  createdAt?: string;
}

interface PortalClientProps {
  isLoggedIn: boolean;
  initialArticles: any[];
}

const AUTHORS = [
  { slug: 'sarah-jenkins', name: 'Sarah Jenkins, CFP®' },
  { slug: 'david-vance', name: 'David Vance, CFA' },
  { slug: 'amanda-ross', name: 'Amanda Ross, ChFC®' },
  { slug: 'marcus-thorne', name: 'Marcus Thorne, CPCU®' },
];

const CATEGORIES = [
  { slug: 'credit-cards', name: 'Credit Cards' },
  { slug: 'banking', name: 'Banking' },
  { slug: 'investing', name: 'Investing' },
  { slug: 'insurance', name: 'Insurance' },
];

export default function PortalClient({ isLoggedIn: initialIsLoggedIn, initialArticles }: PortalClientProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Articles state
  const [articles, setArticles] = useState<any[]>(initialArticles);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all');

  // Modal / Form state
  const [editingArticle, setEditingArticle] = useState<Partial<ArticleData> | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Auto-generate slug from title helper
  const handleTitleChange = (val: string, currentForm: Partial<ArticleData>) => {
    const updated = { ...currentForm, title: val };
    // Only auto-generate slug if it's a new article
    if (!currentForm.id) {
      updated.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    setEditingArticle(updated);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await adminLogin(password);
      if (res.success) {
        setIsLoggedIn(true);
        // Refresh articles
        window.location.reload();
      } else {
        setError(res.error || 'Authentication failed.');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    await adminLogout();
    setIsLoggedIn(false);
    setArticles([]);
    window.location.reload();
  };

  const handleCreateClick = () => {
    setEditingArticle({
      slug: '',
      category: 'credit-cards',
      title: '',
      metaTitle: '',
      metaDescription: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      published: false,
      authorSlug: 'sarah-jenkins',
      createdAt: new Date().toISOString().substring(0, 16), // datetime-local format
    });
    setFormError(null);
    setSelectedFile(null);
    setImagePreview('');
  };

  const handleEditClick = (article: any) => {
    setEditingArticle({
      id: article.id,
      slug: article.slug,
      category: article.category || 'credit-cards',
      title: article.title,
      metaTitle: article.metaTitle || '',
      metaDescription: article.metaDescription || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      imageUrl: article.imageUrl || '',
      published: article.published,
      authorSlug: article.authorSlug || 'sarah-jenkins',
      createdAt: new Date(article.createdAt).toISOString().substring(0, 16),
    });
    setFormError(null);
    setSelectedFile(null);
    setImagePreview(article.imageUrl || '');
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await deleteArticle(id);
      if (res.success) {
        setArticles(articles.filter((art) => art.id !== id));
      } else {
        alert(res.error || 'Failed to delete article.');
      }
    } catch (err) {
      alert('An error occurred while deleting the article.');
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!editingArticle) return;

    if (!editingArticle.title?.trim()) {
      setFormError('Title is required.');
      return;
    }
    if (!editingArticle.slug?.trim()) {
      setFormError('Slug is required.');
      return;
    }
    if (!editingArticle.excerpt?.trim()) {
      setFormError('Excerpt is required.');
      return;
    }
    if (!editingArticle.content?.trim()) {
      setFormError('Content is required.');
      return;
    }

    setIsLoading(true);
    let finalImageUrl = editingArticle.imageUrl || '';

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error || 'Failed to upload image.');
        }

        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          finalImageUrl = uploadData.url;
        } else {
          throw new Error('Image upload failed.');
        }
      }

      const payload: any = {
        id: editingArticle.id,
        slug: editingArticle.slug,
        category: editingArticle.category,
        title: editingArticle.title,
        metaTitle: editingArticle.metaTitle || undefined,
        metaDescription: editingArticle.metaDescription || undefined,
        excerpt: editingArticle.excerpt,
        content: editingArticle.content,
        imageUrl: finalImageUrl || undefined,
        published: editingArticle.published || false,
        authorSlug: editingArticle.authorSlug,
      };

      if (editingArticle.createdAt) {
        payload.createdAt = new Date(editingArticle.createdAt).toISOString();
      }

      const res = await upsertArticle(payload);
      if (res.success && res.article) {
        const saved = {
          ...res.article,
          createdAt: res.article.createdAt.toISOString
            ? res.article.createdAt.toISOString()
            : new Date(res.article.createdAt).toISOString(),
          updatedAt: res.article.updatedAt.toISOString
            ? res.article.updatedAt.toISOString()
            : new Date(res.article.updatedAt).toISOString(),
        };

        if (editingArticle.id) {
          // Update existing
          setArticles(articles.map((art) => (art.id === saved.id ? saved : art)));
        } else {
          // Create new
          setArticles([saved, ...articles]);
        }
        setEditingArticle(null);
      } else {
        setFormError('Failed to save article.');
      }
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while saving the article.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter articles based on tab selection
  const filteredArticles = articles.filter((art) => {
    if (activeTab === 'published') return art.published;
    if (activeTab === 'draft') return !art.published;
    return true;
  });

  const publishedCount = articles.filter((art) => art.published).length;
  const draftCount = articles.filter((art) => !art.published).length;

  if (!isLoggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.loginWrapper}>
          <div className={styles.loginCard}>
            <div className={styles.loginLogo}>
              <Compass className={styles.logoIcon} size={28} />
              <span>
                Finance<span className={styles.loginLogoAccent}>Horizon</span>
              </span>
            </div>
            <h2>Administrative Portal</h2>

            {error && <div className={styles.errorAlert}>{error}</div>}

            <form onSubmit={handleLoginSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="portalPassword">Portal Access Password</label>
                <input
                  type="password"
                  id="portalPassword"
                  className={styles.input}
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={styles.loginButton} disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Access Portal'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Portal Dashboard Header */}
      <header className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.dashboardTitle}>Administrative Portal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage drafts, publish schedules, and editorial content.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleLogoutClick} className={styles.logoutButton} aria-label="Sign Out">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={16} /> Sign Out
            </span>
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total Articles</span>
          <span className={styles.metricValue}>{articles.length}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Published Articles</span>
          <span className={styles.metricValue}>{publishedCount}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Draft Articles</span>
          <span className={styles.metricValue}>{draftCount}</span>
        </div>
      </div>

      {/* Tabs and Create Button */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Content
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'published' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('published')}
          >
            Published ({publishedCount})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'draft' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('draft')}
          >
            Drafts ({draftCount})
          </button>
        </div>

        <button onClick={handleCreateClick} className={styles.createButton}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> New Article
          </span>
        </button>
      </div>

      {/* Article Table */}
      <div className={styles.tableCard}>
        {filteredArticles.length === 0 ? (
          <div className={styles.emptyState}>No articles found in this category.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title & Slug</th>
                <th>Category</th>
                <th>Word Count</th>
                <th>Author</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((art) => (
                <tr key={art.id}>
                  <td>
                    <div className={styles.articleTitle}>{art.title}</div>
                    <div className={styles.articleSlug}>/{art.category}/{art.slug}</div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeCategory}`}>
                      {art.category?.replace('-', ' ')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={14} style={{ color: 'var(--text-muted)' }} />
                      <span>{getWordCount(art.content)} words</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.9rem' }}>
                      {AUTHORS.find((a) => a.slug === art.authorSlug)?.name || art.authorSlug}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        art.published ? styles.badgePublished : styles.badgeDraft
                      }`}
                    >
                      {art.published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                      <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                      <span>
                        {new Date(art.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <a
                        href={`/${art.category}/${art.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btnIcon} ${styles.btnPreview}`}
                        title="Preview Live Article"
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Eye size={14} />
                      </a>
                      <button
                        onClick={() => handleEditClick(art)}
                        className={`${styles.btnIcon} ${styles.btnEdit}`}
                        title="Edit Article"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(art.id)}
                        className={`${styles.btnIcon} ${styles.btnDelete}`}
                        title="Delete Article"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Editor Modal Overlay */}
      {editingArticle && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <header className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingArticle.id ? 'Edit Financial Guide' : 'Create New Financial Guide'}
              </h2>
              <button onClick={() => setEditingArticle(null)} className={styles.closeButton} aria-label="Close modal">
                &times;
              </button>
            </header>

            <form onSubmit={handleSaveSubmit}>
              <div className={styles.modalBody}>
                {formError && <div className={styles.errorAlert}>{formError}</div>}

                <div className={styles.formGrid}>
                  {/* Title */}
                  <div className={styles.formGroup}>
                    <label htmlFor="title">Article Title</label>
                    <input
                      type="text"
                      id="title"
                      className={styles.input}
                      value={editingArticle.title || ''}
                      onChange={(e) => handleTitleChange(e.target.value, editingArticle)}
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div className={styles.formGroup}>
                    <label htmlFor="slug">URL Slug (kebab-case)</label>
                    <input
                      type="text"
                      id="slug"
                      className={styles.input}
                      value={editingArticle.slug || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className={styles.formGroup}>
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      className={styles.input}
                      value={editingArticle.category || 'credit-cards'}
                      onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Author */}
                  <div className={styles.formGroup}>
                    <label htmlFor="authorSlug">Author Contributor</label>
                    <select
                      id="authorSlug"
                      className={styles.input}
                      value={editingArticle.authorSlug || 'sarah-jenkins'}
                      onChange={(e) => setEditingArticle({ ...editingArticle, authorSlug: e.target.value })}
                    >
                      {AUTHORS.map((a) => (
                        <option key={a.slug} value={a.slug}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Featured Image URL */}
                  <div className={styles.formGroup}>
                    <label htmlFor="imageUrl">Featured Image URL</label>
                    <input
                      type="text"
                      id="imageUrl"
                      className={styles.input}
                      value={editingArticle.imageUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingArticle({ ...editingArticle, imageUrl: val });
                        setImagePreview(val);
                        setSelectedFile(null); // Clear selected file if user overrides manually
                      }}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  {/* Upload Featured Image */}
                  <div className={styles.formGroup}>
                    <label htmlFor="imageFile">Upload Image File</label>
                    <input
                      type="file"
                      id="imageFile"
                      accept="image/*"
                      className={styles.input}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>

                  {/* Image Live Preview */}
                  {imagePreview && (
                    <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                      <label>Image Live Preview</label>
                      <div className={styles.previewContainer}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Live Preview"
                          className={styles.previewImage}
                        />
                      </div>
                    </div>
                  )}

                  {/* Created At / Override Date */}
                  <div className={styles.formGroup}>
                    <label htmlFor="createdAt">Publish / Override Date</label>
                    <input
                      type="datetime-local"
                      id="createdAt"
                      className={styles.input}
                      value={editingArticle.createdAt || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, createdAt: e.target.value })}
                    />
                  </div>

                  {/* SEO Meta Title */}
                  <div className={styles.formGroup}>
                    <label htmlFor="metaTitle">SEO Meta Title (Title Tag)</label>
                    <input
                      type="text"
                      id="metaTitle"
                      className={styles.input}
                      value={editingArticle.metaTitle || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, metaTitle: e.target.value })}
                      placeholder="If blank, uses Article Title"
                    />
                  </div>

                  {/* SEO Meta Description */}
                  <div className={styles.formGroup}>
                    <label htmlFor="metaDescription">SEO Meta Description</label>
                    <input
                      type="text"
                      id="metaDescription"
                      className={styles.input}
                      value={editingArticle.metaDescription || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, metaDescription: e.target.value })}
                      placeholder="Keep under 155 characters"
                    />
                  </div>

                  {/* Excerpt */}
                  <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                    <label htmlFor="excerpt">Excerpt / Summary Block</label>
                    <input
                      type="text"
                      id="excerpt"
                      className={styles.input}
                      value={editingArticle.excerpt || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                      required
                    />
                  </div>

                  {/* HTML Content */}
                  <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                    <label htmlFor="content">Raw HTML Body Content</label>
                    <textarea
                      id="content"
                      className={styles.textarea}
                      value={editingArticle.content || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                      placeholder="<p>Write your article HTML content here...</p>"
                      required
                    />
                  </div>

                  {/* Publish Checkbox */}
                  <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={editingArticle.published || false}
                        onChange={(e) => setEditingArticle({ ...editingArticle, published: e.target.checked })}
                      />
                      <span>Publish live on site instantly</span>
                    </label>
                  </div>
                </div>
              </div>

              <footer className={styles.modalFooter}>
                <button type="button" onClick={() => setEditingArticle(null)} className={styles.btnCancel}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnSave} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
