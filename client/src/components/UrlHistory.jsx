import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:4000";

const UrlHistory = ({ refreshToken }) => {
  const [urls, setUrls] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUrls: 0,
    totalClicks: 0,
    averageClicks: 0,
  });

  const fetchUrls = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/api/shorturls?page=${page}&limit=5`,
      );

      setUrls(response.data.urls);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load URL history",
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (refreshToken > 0 && page !== 1) {
      setPage(1);
      return;
    }

    fetchUrls();
  }, [fetchUrls, page, refreshToken]);

  const handleDelete = async (shortId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this URL?",
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/api/shorturl/${shortId}`);

      toast.success("URL deleted successfully");

      if (urls.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        fetchUrls();
      }
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete URL");
    }
  };

  const handleCopy = async (shortId) => {
    try {
      await navigator.clipboard.writeText(`${API_URL}/${shortId}`);
      toast.success("Short URL copied!");
    } catch {
      toast.error("Unable to copy URL");
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/shorturls/stats`);

      setStats(response.data);
    } catch {
      toast.error("Failed to load dashboard statistics");
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshToken]);

  const formattedDate = (date) =>
    date
      ? new Date(date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Date unavailable";

  return (
    <section className="history-section" aria-labelledby="history-title">
      <div className="history-heading">
        <div>
          <h2 id="history-title">Your links</h2>
          <p>Manage your short links and see how they’re performing.</p>
        </div>
      </div>

      <div className="stats-grid" aria-label="Link statistics">
        <article className="stat-card">
          <span className="stat-icon purple" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M10 13.5 14 9.5m-6.5 7H6a4 4 0 0 1 0-8h4m4 0h2a4 4 0 1 1 0 8h-4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="stat-label">Total links</p>
            <p className="stat-value">
              {Number(stats.totalUrls || 0).toLocaleString()}
            </p>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon blue" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M3.5 12s3.1-5 8.5-5 8.5 5 8.5 5-3.1 5-8.5 5-8.5-5-8.5-5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="2.2"
                stroke="currentColor"
                strokeWidth="1.7"
              />
            </svg>
          </span>
          <div>
            <p className="stat-label">Total clicks</p>
            <p className="stat-value">
              {Number(stats.totalClicks || 0).toLocaleString()}
            </p>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon green" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 17.5 9 12l3.2 3.2L20 7.5M14.5 7.5H20v5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="stat-label">Avg. clicks per link</p>
            <p className="stat-value">
              {Number(stats.averageClicks || 0).toFixed(1)}
            </p>
          </div>
        </article>
      </div>

      <div className="url-list">
        <div className="url-list-header" aria-hidden="true">
          <span>Destination</span>
          <span>Short link</span>
          <span>Engagement</span>
          <span />
        </div>

        {loading ? (
          <div className="loading-state" role="status">
            Loading your links...
          </div>
        ) : urls.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 13.5 14 9.5m-6.5 7H6a4 4 0 0 1 0-8h4m4 0h2a4 4 0 1 1 0 8h-4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <strong>No links yet</strong>
            <p>Your shortened URLs will show up here once you create one.</p>
          </div>
        ) : (
          urls.map((item) => {
            const shortUrl = `${API_URL}/${item.ShortId}`;

            return (
              <article className="url-row" key={item._id}>
                <div className="url-cell original-cell">
                  <span className="url-cell-label">Destination</span>
                  <a
                    href={item.Originalurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="url-value"
                    title={item.Originalurl}
                  >
                    {item.Originalurl}
                  </a>
                  <span className="url-date">
                    Created {formattedDate(item.createdAt)}
                  </span>
                </div>

                <div className="url-cell short-cell">
                  <span className="url-cell-label">Short link</span>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="url-value short"
                    title={shortUrl}
                  >
                    {shortUrl}
                  </a>
                </div>

                <div className="url-cell click-cell">
                  <span className="url-cell-label">Clicks</span>
                  <span className="click-count">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M3.5 12s3.1-5 8.5-5 8.5 5 8.5 5-3.1 5-8.5 5-8.5-5-8.5-5Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="2.2"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                    </svg>
                    {item.Clickcount}
                  </span>
                </div>

                <div className="url-cell actions-cell">
                  <span className="url-cell-label">Actions</span>
                  <div className="row-actions">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.ShortId)}
                      className="icon-button"
                      aria-label={`Copy ${shortUrl}`}
                      title="Copy short link"
                    >
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect
                          x="8"
                          y="8"
                          width="11"
                          height="12"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <path
                          d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.ShortId)}
                      className="icon-button danger"
                      aria-label={`Delete ${shortUrl}`}
                      title="Delete link"
                    >
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M4.5 7h15m-10-3h5l1 3m-8 0 .7 12h7.6l.7-12m-6.5 3v6m3-6v6"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="pagination">
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <div className="pagination-controls">
              <button
                type="button"
                disabled={page === 1 || loading}
                onClick={() => setPage((currentPage) => currentPage - 1)}
                className="pagination-button"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="m14.5 18-6-6 6-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Previous
              </button>
              <button
                type="button"
                disabled={page >= pagination.totalPages || loading}
                onClick={() => setPage((currentPage) => currentPage + 1)}
                className="pagination-button"
              >
                Next
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="m9.5 18 6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UrlHistory;
