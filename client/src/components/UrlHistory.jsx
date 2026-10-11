import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:4000";

const UrlHistory = () => {
  const [urls, setUrls] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUrls: 0,
    totalClicks: 0,
    averageClicks: 0,
  });

  const totalClicks = urls.reduce((total, item) => total + item.Clickcount, 0);

  const averageClicks = urls.length
    ? (totalClicks / urls.length).toFixed(1)
    : 0;

  const fetchUrls = async () => {
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
  };

  useEffect(() => {
    fetchUrls();
  }, [page]);

  const handleDelete = async (shortId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this URL?",
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/api/shorturl/${shortId}`);

      toast.success("URL deleted successfully");

      // Move back if the current page becomes empty
      if (urls.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        fetchUrls();
      }
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

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/shorturls/stats`);

      setStats(response.data);
    } catch (error) {
      toast.error("Failed to load dashboard statistics");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <section className="mt-12 w-full max-w-5xl mx-auto px-4 pb-12">
      <h2 className="text-2xl font-bold mb-2">URL History</h2>

      <p className="text-gray-500 mb-6">
        Manage your shortened links and track clicks.
      </p>

      {stats.totalUrls}
{stats.totalClicks}
{stats.averageClicks}

      {loading ? (
        <p className="py-8 text-center text-gray-500">Loading URLs...</p>
      ) : urls.length === 0 ? (
        <div className="border rounded-xl p-8 text-center text-gray-500">
          No URLs found. Create your first short link!
        </div>
      ) : (
        <div className="space-y-4">
          {urls.map((item) => (
            <article
              key={item._id}
              className="border rounded-xl p-4 md:p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500 mb-1">Original URL</p>

              <a
                href={item.Originalurl}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all text-gray-800 hover:text-orange-600"
              >
                {item.Originalurl}
              </a>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Short URL</p>

                  <a
                    href={`${API_URL}/${item.ShortId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 underline break-all"
                  >
                    {`${API_URL}/${item.ShortId}`}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-orange-50 text-orange-700 px-3 py-2 text-sm">
                    {item.Clickcount} clicks
                  </span>

                  <button
                    onClick={() => handleCopy(item.ShortId)}
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    Copy
                  </button>

                  <button
                    onClick={() => handleDelete(item.ShortId)}
                    className="rounded-lg bg-red-50 text-red-600 px-3 py-2 text-sm hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-400">
                Created:{" "}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : "Unknown"}
              </p>
            </article>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => p - 1)}
            className="border rounded-lg px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>

          <p className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>

          <button
            disabled={page >= pagination.totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="border rounded-lg px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default UrlHistory;
