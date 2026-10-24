import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import UrlHistory from "./components/UrlHistory";
import "./App.css";

const App = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  const handleClick = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter your URL");
      return;
    }

    setLoading(true);
    setShortUrl("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/shorturl",
        {
          Originalurl: url.trim(),
        },
      );

      setShortUrl(response.data.Shorturl);
      setRefreshToken((current) => current + 1);
      toast.success("Short URL created successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create short URL. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Link copied!");
    } catch {
      toast.error("Unable to copy the link");
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="brand" to="/">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 13.5 14 9.5m-6.5 7H6a4 4 0 0 1 0-8h4m4 0h2a4 4 0 1 1 0 8h-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            TinyURL
          </Link>
          
        </div>
      </header>

      <main className="dashboard">
        <div className="page-heading">
          <p className="eyebrow">Your workspace</p>
          <h1>Make every link count.</h1>
          <p>
            Create, share, and keep track of all your short links in one place.
          </p>
        </div>

        <section className="create-card" aria-labelledby="create-link-title">
          <div className="create-card-heading">
            <span className="create-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14m7-7H5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div>
              <h2 id="create-link-title">Create a short link</h2>
              <p>Paste a long URL and we’ll make it easier to share.</p>
            </div>
          </div>

          <form onSubmit={handleClick} className="create-form">
            <label className="url-input-wrap">
              <svg
                className="url-input-icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 13.5 14 9.5m-6.5 7H6a4 4 0 0 1 0-8h4m4 0h2a4 4 0 1 1 0 8h-4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="url"
                className="url-input"
                placeholder="https://your-very-long-link.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                aria-label="URL to shorten"
                required
              />
            </label>
            <button type="submit" disabled={loading} className="primary-button">
              {loading ? (
                "Creating..."
              ) : (
                <>
                  Shorten URL
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 12h14m-6-6 6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
          <p className="create-hint">Your link is ready to share in seconds.</p>

          {shortUrl && (
            <div className="result-card" role="status">
              <div className="result-copy">
                <span className="result-label">Your new short link</span>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="result-link"
                >
                  {shortUrl}
                </a>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="result-copy-button"
              >
                Copy link
              </button>
            </div>
          )}
        </section>

        <UrlHistory refreshToken={refreshToken} />
      </main>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default App;
